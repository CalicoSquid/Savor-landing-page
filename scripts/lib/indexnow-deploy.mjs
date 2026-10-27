import { ORIGIN, KEY, KEY_LOCATION, fetchLiveManifest, planChanges, submitIndexNow, verifyLiveChange } from './indexnow.js'

export async function runDeployment(event, { env, storeFactory, fetchImpl = fetch, logger = console, now = Date.now, submit = submitIndexNow } = {}) {
  let store, lockEtag
  try {
    const deploy = event?.deploy, site = event?.site
    if (env?.INDEXNOW_ENABLED !== 'true' || env.URL !== ORIGIN || !env.SITE_ID || site?.id !== env.SITE_ID || site?.url !== ORIGIN || deploy?.siteId !== site.id || deploy?.context !== 'production' || deploy?.state !== 'ready' || !deploy?.publishedAt) {
      logger.info('[IndexNow] skipped: not an enabled, published production deployment')
      return { status: 'skipped' }
    }
    const manifest = await fetchLiveManifest(fetchImpl)
    if (manifest.deployId !== deploy.id) return { status: 'superseded-or-not-live' }
    const keyResponse = await fetchImpl(KEY_LOCATION, { signal: AbortSignal.timeout(4000), redirect: 'error' })
    if (keyResponse.status !== 200 || !(keyResponse.headers.get('content-type') || '').startsWith('text/plain') || (await keyResponse.text()).trim() !== KEY) throw new Error('Public verification file is not ready')
    store = storeFactory()
    const oldLock = await store.getWithMetadata('lock', { type: 'json' })
    if (oldLock?.data.expiresAt > now()) return { status: 'already-running' }
    const lock = await store.setJSON('lock', { owner: deploy.id, expiresAt: now() + 90000 }, oldLock ? { onlyIfMatch: oldLock.etag } : { onlyIfNew: true })
    if (!lock.modified) return { status: 'already-running' }
    lockEtag = lock.etag
    const baseline = await store.get('baseline', { type: 'json' })
    if (!baseline) {
      await store.setJSON('baseline', { version: 1, entries: manifest.entries })
      logger.info(`[IndexNow] baseline established: ${Object.keys(manifest.entries).length} URLs; submitted=0`)
      return { status: 'baseline', submitted: 0 }
    }
    if (baseline.version !== 1 || !baseline.entries || typeof baseline.entries !== 'object' || Array.isArray(baseline.entries)) throw new Error('Invalid notification baseline')
    const changes = planChanges(baseline.entries, manifest.entries)
    if (!changes.length) { logger.info('[IndexNow] unchanged content; submitted=0'); return { status: 'unchanged', submitted: 0 } }
    const deadline = now() + 20000
    const verified = []
    for (const change of changes.slice(0, 100)) {
      if (now() >= deadline) break
      try { if (await verifyLiveChange(change, fetchImpl)) verified.push(change) } catch { /* Fail closed; never infer deletion from a network failure. */ }
    }
    logger.info(`[IndexNow] changed=${changes.length} verified=${verified.length}`)
    if (!verified.length) return { status: 'nothing-verified', submitted: 0 }
    const beforeBatch = async () => (await fetchLiveManifest(fetchImpl)).deployId === deploy.id
    const result = await submit(verified.map(c => c.url), { fetchImpl, logger, dryRun: false, beforeBatch })
    const accepted = new Set(result.accepted)
    const entries = { ...baseline.entries }
    for (const change of verified.filter(c => accepted.has(c.url))) {
      if (change.kind === 'removed') delete entries[change.url]
      else entries[change.url] = change.fingerprint
    }
    if (accepted.size) await store.setJSON('baseline', { version: 1, entries })
    logger.info(`[IndexNow] completed received=${accepted.size} pending=${changes.length - accepted.size}`)
    return { status: 'processed', submitted: accepted.size, pending: changes.length - accepted.size }
  } catch {
    logger.warn('[IndexNow] notification skipped/failed; website deployment is unaffected; check configuration or retry on a later production deployment')
    return { status: 'failed' }
  } finally {
    if (store && lockEtag) {
      try { await store.setJSON('lock', { expiresAt: 0 }, { onlyIfMatch: lockEtag }) } catch { /* Lease expires automatically; do not affect deployment. */ }
    }
  }
}
