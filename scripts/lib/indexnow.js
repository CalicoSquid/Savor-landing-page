// IndexNow transport is independent of rendering, routing and indexing policy.
export const ORIGIN = 'https://getsavor.recipes'
export const HOST = 'getsavor.recipes'
export const ENDPOINT = 'https://api.indexnow.org/indexnow'
export const KEY = '83438594cc1a4361a467018f4214fb5c'
export const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`
export const MANIFEST_PATH = '/indexnow-manifest.json'

export function canonicalUrl(input) {
  if (typeof input !== 'string' || input.includes('\\')) throw new Error('Invalid URL')
  const url = new URL(input, ORIGIN)
  if (!['https:', 'http:'].includes(url.protocol) || url.hostname !== HOST || url.port || url.username || url.password) throw new Error('URL must belong to getsavor.recipes')
  const path = url.pathname.replace(/\/+$/, '') || '/'
  return `${ORIGIN}${path === '/' || /^\/r\/[^/]+$/.test(path) ? path : `${path}/`}`
}

export function planChanges(previous, current) {
  if (!previous) return [] // Establish a baseline, never submit historical URLs.
  const changes = []
  for (const [url, fingerprint] of Object.entries(current)) {
    if (canonicalUrl(url) !== url || !/^[a-f0-9]{64}$/.test(fingerprint)) throw new Error('Invalid fingerprint entry')
    if (previous[url] !== fingerprint) changes.push({ url, kind: previous[url] ? 'updated' : 'added', fingerprint })
  }
  for (const url of Object.keys(previous)) {
    if (canonicalUrl(url) !== url) throw new Error('Invalid previous URL')
    if (!(url in current)) changes.push({ url, kind: 'removed' })
  }
  return changes.sort((a, b) => a.url.localeCompare(b.url))
}

const responseNames = { 200: 'received', 202: 'received-key-validation-pending', 400: 'invalid-request', 403: 'invalid-key', 422: 'host-or-schema-mismatch', 429: 'rate-limited' }
export async function submitIndexNow(urls, { fetchImpl = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), logger = console, batchSize = 100, timeoutMs = 4000, maxRetries = 2, dryRun = true, beforeBatch = async () => true } = {}) {
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 10000) throw new Error('Invalid batch size')
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 2) throw new Error('Invalid retry limit')
  const unique = [...new Set(urls.map(canonicalUrl))]
  const accepted = [], failed = []
  for (let offset = 0; offset < unique.length; offset += batchSize) {
    const batch = unique.slice(offset, offset + batchSize)
    const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }
    if (dryRun) { logger.info(`[IndexNow] dry-run ${JSON.stringify({ urlList: batch })}`); continue }
    if (!await beforeBatch()) { failed.push(...unique.slice(offset)); break }
    let success = false
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let status = 0, retryAfter = null
      try {
        const response = await fetchImpl(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs), redirect: 'error' })
        status = response.status
        retryAfter = response.headers.get('retry-after')
        await response.body?.cancel()
      } catch { /* Do not log request bodies, credentials or arbitrary remote error text. */ }
      logger.info(`[IndexNow] batch=${batch.length} attempt=${attempt + 1} status=${status} result=${responseNames[status] || (status === 0 ? 'network-error' : 'server-error')}`)
      if (status === 200 || status === 202) { success = true; break }
      if (!(status === 0 || status === 429 || status >= 500) || attempt === maxRetries) break
      const requestedDelay = retryAfter === null ? 0 : /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - Date.now()
      // Respect a long Retry-After by stopping, rather than retrying too soon.
      if (requestedDelay > 2000) break
      await sleep(Math.max(250 * 2 ** attempt, Number.isFinite(requestedDelay) ? requestedDelay : 0))
    }
    ;(success ? accepted : failed).push(...batch)
  }
  return { accepted, failed, dryRun, urls: unique }
}

export async function fetchLiveManifest(fetchImpl = fetch) {
  const response = await fetchImpl(`${ORIGIN}${MANIFEST_PATH}`, { signal: AbortSignal.timeout(5000), cache: 'no-store', redirect: 'error' })
  if (response.status !== 200) throw new Error('Live IndexNow manifest unavailable')
  const manifest = await response.json()
  if (manifest.version !== 1 || manifest.origin !== ORIGIN || manifest.context !== 'production' || !/^[a-f0-9]{24}$/.test(manifest.deployId || '') || !manifest.entries || typeof manifest.entries !== 'object' || Array.isArray(manifest.entries)) throw new Error('Invalid production manifest')
  planChanges({}, manifest.entries)
  return manifest
}

export async function verifyLiveChange(change, fetchImpl = fetch) {
  if (canonicalUrl(change.url) !== change.url) return false
  const response = await fetchImpl(change.url, { headers: { 'User-Agent': 'Savor-IndexNow/1.0 (publication verification; Googlebot-compatible)' }, signal: AbortSignal.timeout(4000), redirect: 'manual', cache: 'no-store' })
  if (change.kind === 'removed') {
    await response.body?.cancel()
    if ([404, 410].includes(response.status)) return true
    if (![301, 308].includes(response.status)) return false
    const target = response.headers.get('location')
    if (!target) return false
    let url
    try { url = canonicalUrl(new URL(target, change.url).href) } catch { return false }
    if (url === change.url) return false
    return verifyLiveChange({ url, kind: 'added' }, fetchImpl)
  }
  if (response.status !== 200 || /noindex/i.test(response.headers.get('x-robots-tag') || '')) { await response.body?.cancel(); return false }
  const html = await response.text()
  const robot = html.match(/<meta\s+name="robots"[^>]*content="([^"]*)"/i)?.[1] || ''
  const canonical = html.match(/<link\s+rel="canonical"[^>]*href="([^"]*)"/i)?.[1]
  return !/noindex/i.test(robot) && canonical === change.url
}
