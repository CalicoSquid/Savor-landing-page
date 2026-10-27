import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ORIGIN, HOST, KEY, KEY_LOCATION, ENDPOINT, canonicalUrl, planChanges, submitIndexNow, verifyLiveChange } from './lib/indexnow.js'
import { pageFingerprint, recipeFingerprints, buildManifestEntries } from './lib/indexnow-fingerprints.mjs'
import { runDeployment } from './lib/indexnow-deploy.mjs'

// Every test uses injected HTTP/storage. No live website or IndexNow requests.
const logger = { info() {}, warn() {} }
const url = `${ORIGIN}/potluck/`
const hash = 'a'.repeat(64), changedHash = 'b'.repeat(64)
const deployId = 'a'.repeat(24)
const manifest = { version: 1, origin: ORIGIN, context: 'production', deployId, entries: { [url]: changedHash } }
const event = { site: { id: 'site', url: ORIGIN }, deploy: { id: deployId, siteId: 'site', state: 'ready', context: 'production', publishedAt: '2026-10-27T20:00:00Z' } }
const env = { INDEXNOW_ENABLED: 'true', SITE_ID: 'site', URL: ORIGIN }
const html = canonical => `<html><head><meta name="robots" content="index, follow"><link rel="canonical" href="${canonical}"></head><body><main><h1>Dinner</h1></main></body></html>`
function memoryStore(initial) {
  const records = new Map(initial ? [['baseline', { data: initial, etag: '0' }]] : [])
  let revision = 0
  return {
    records,
    async get(key) { return records.get(key)?.data || null },
    async getWithMetadata(key) { return records.get(key) || null },
    async setJSON(key, data, options = {}) {
      const old = records.get(key)
      if ((options.onlyIfNew && old) || (options.onlyIfMatch && old?.etag !== options.onlyIfMatch)) return { modified: false }
      const etag = String(++revision)
      records.set(key, { data: structuredClone(data), etag })
      return { modified: true, etag }
    },
  }
}
function fixtureFetch(next = manifest) {
  return async input => {
    if (input === `${ORIGIN}/indexnow-manifest.json`) return Response.json(next)
    if (input === KEY_LOCATION) return new Response(KEY, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
    if (input === url) return new Response(html(url))
    throw new Error(`Unexpected HTTP call: ${input}`)
  }
}

test('verification key is valid, committed and matches its root filename', () => {
  assert.match(KEY, /^[a-zA-Z0-9-]{8,128}$/)
  assert.equal(fs.readFileSync(new URL(`../public/${KEY}.txt`, import.meta.url), 'utf8'), KEY)
})

test('normalizes only the production host and canonical slash policy', () => {
  assert.equal(canonicalUrl('http://GETSAVOR.RECIPES/potluck?utm_source=test#top'), url)
  assert.equal(canonicalUrl('/r/abc/'), `${ORIGIN}/r/abc`)
  assert.equal(canonicalUrl('/'), ORIGIN + '/')
  for (const input of ['https://evil.example/potluck/', 'https://www.getsavor.recipes/', 'https://getsavor.recipes:444/', 'https://user@getsavor.recipes/', 'file:///potluck', 'https://getsavor.recipes.evil.example/', 'https://preview--getsavor.netlify.app/', 'https:\\evil.example']) assert.throws(() => canonicalUrl(input))
})

test('POST uses the official single endpoint, dedupes URLs and batches safely', async () => {
  const calls = []
  const result = await submitIndexNow([url, `${ORIGIN}/potluck?x=1`, `${ORIGIN}/about/`], { dryRun: false, batchSize: 1, logger, fetchImpl: async (endpoint, request) => { calls.push({ endpoint, request, body: JSON.parse(request.body) }); return new Response(null, { status: 200 }) } })
  assert.deepEqual(result.accepted, [url, `${ORIGIN}/about/`])
  assert.equal(calls.length, 2)
  for (const call of calls) {
    assert.equal(call.endpoint, ENDPOINT)
    assert.equal(call.request.method, 'POST')
    assert.deepEqual(Object.keys(call.body).sort(), ['host', 'key', 'keyLocation', 'urlList'])
    assert.equal(call.body.host, HOST)
    assert.equal(call.body.key, KEY)
    assert.equal(call.body.keyLocation, KEY_LOCATION)
  }
  await assert.rejects(submitIndexNow([url], { batchSize: 10001 }))
})

test('dry run never calls HTTP and shows the exact canonical URL list', async () => {
  const result = await submitIndexNow([url, url], { logger, fetchImpl: () => { throw new Error('Network forbidden') } })
  assert.deepEqual(result.urls, [url])
  assert.equal(result.dryRun, true)
  assert.deepEqual(result.accepted, [])
})

for (const status of [200, 202, 400, 403, 422, 429, 500]) {
  test(`HTTP ${status} is classified and retried appropriately`, async () => {
    let calls = 0
    const result = await submitIndexNow([url], { dryRun: false, logger, sleep: async () => {}, fetchImpl: async () => { calls++; return new Response(null, { status }) } })
    assert.equal(calls, status === 429 || status >= 500 ? 3 : 1)
    assert.deepEqual(result.accepted, [200, 202].includes(status) ? [url] : [])
    assert.deepEqual(result.failed, [200, 202].includes(status) ? [] : [url])
  })
}

test('network failures are bounded; long Retry-After does not cause an early retry', async () => {
  let calls = 0
  const result = await submitIndexNow([url], { dryRun: false, logger, sleep: async () => {}, fetchImpl: async () => { calls++; throw new Error('timeout') } })
  assert.equal(calls, 3)
  assert.deepEqual(result.failed, [url])
  calls = 0
  await submitIndexNow([url], { dryRun: false, logger, fetchImpl: async () => { calls++; return new Response(null, { status: 429, headers: { 'retry-after': '60' } }) } })
  assert.equal(calls, 1)
})

test('no initial sitemap flood; detects additions, meaningful updates and removals', () => {
  const before = { [url]: hash, [`${ORIGIN}/gone/`]: hash }
  const after = { [url]: changedHash, [`${ORIGIN}/new/`]: hash }
  assert.deepEqual(planChanges(null, after), [])
  assert.deepEqual(planChanges(after, after), [])
  assert.deepEqual(planChanges(before, after).map(c => c.kind).sort(), ['added', 'removed', 'updated'])
})

test('navigation, CSS, comments and dates do not notify; real copy and revisions do', () => {
  const seo = { path: '/potluck', title: 'Dinner', description: 'Choose dinner', lastmod: 'old' }
  const original = '<main class="old"><nav>Old nav</nav><h1>Dinner</h1><p>Choose dinner</p><footer>Old footer</footer></main>'
  const cosmetic = '<main class="new"><nav>New nav</nav><h1>Dinner</h1><p>Choose dinner</p><footer>New footer</footer><!-- comment --></main>'
  assert.equal(pageFingerprint(original, seo), pageFingerprint(cosmetic, { ...seo, lastmod: 'new' }))
  assert.notEqual(pageFingerprint(original, seo), pageFingerprint(original.replace('Choose dinner</p>', 'Spin for dinner</p>'), seo))
  assert.notEqual(pageFingerprint(original, seo), pageFingerprint(original, seo, 'meaningful-functional-update'))
})

test('recipe fingerprints exclude private/imported recipes and timestamps, but include instructions', () => {
  const original = { id: 'one', updatedAt: 'old', recipe: { name: 'Soup', ingredients: ['water'], instructions: ['Boil'], isShared: true } }
  const before = recipeFingerprints([original, { id: 'private', recipe: { name: 'Private', isShared: false } }, { id: 'imported', recipe: { name: 'Imported', sourceUrl: 'https://publisher.example/recipe' } }])
  assert.deepEqual(Object.keys(before), ['one'])
  assert.deepEqual(before, recipeFingerprints([{ ...original, updatedAt: 'new' }]))
  assert.notDeepEqual(before, recipeFingerprints([{ ...original, recipe: { ...original.recipe, instructions: ['Simmer'] } }]))
})

test('eligibility reuses canonical sitemap policy, excluding noindex and experimental demo', () => {
  const page = { path: '/potluck', canonical: url, sitemap: true, robots: 'index, follow', file: 'potluck/index.html' }
  const args = { pages: [page, { ...page, path: '/privacy', canonical: `${ORIGIN}/privacy/`, robots: 'noindex, follow' }, { ...page, path: '/demo', canonical: `${ORIGIN}/demo/` }, { ...page, path: '/admin', sitemap: false }], recipes: [], recipeSnapshot: { version: 1, completeIds: ['personal', 'shared'], fingerprints: { shared: hash } }, sitemap: new Set([url, `${ORIGIN}/r/personal`, `${ORIGIN}/r/shared`]), readPage: () => '<main>Dinner</main>' }
  assert.deepEqual(Object.keys(buildManifestEntries(args)), [url])
  assert.throws(() => buildManifestEntries({ ...args, recipes: [{ id: 'unknown' }] }), /Incomplete/)
  assert.deepEqual(Object.keys(buildManifestEntries({ ...args, recipes: [{ id: 'personal' }, { id: 'shared' }] })), [url, `${ORIGIN}/r/shared`])
})

test('live verification rejects noindex/noncanonical content and accepts genuine deletions/redirects', async () => {
  for (const response of [new Response(html(url).replace('index, follow', 'noindex, follow')), new Response(html(`${ORIGIN}/other/`)), new Response('oops', { status: 503 })]) assert.equal(await verifyLiveChange({ url, kind: 'added' }, async () => response), false)
  for (const status of [404, 410]) assert.equal(await verifyLiveChange({ url, kind: 'removed' }, async () => new Response(null, { status })), true)
  assert.equal(await verifyLiveChange({ url, kind: 'removed' }, async () => new Response(html(url))), false)
  assert.equal(await verifyLiveChange({ url, kind: 'removed' }, async () => new Response(null, { status: 301, headers: { location: 'https://elsewhere.example/' } })), false)
  assert.equal(await verifyLiveChange({ url, kind: 'removed' }, async input => input === url ? new Response(null, { status: 301, headers: { location: '/about/' } }) : new Response(html(`${ORIGIN}/about/`))), true)
})

test('local, disabled, preview, wrong-site and unpublished events cannot read storage or submit', async () => {
  for (const [candidate, environment] of [[event, {}], [event, { ...env, INDEXNOW_ENABLED: 'false' }], [{ ...event, deploy: { ...event.deploy, context: 'deploy-preview' } }, env], [{ ...event, deploy: { ...event.deploy, publishedAt: null } }, env], [{ ...event, site: { ...event.site, id: 'wrong' } }, env]]) {
    const result = await runDeployment(candidate, { env: environment, logger, storeFactory: () => { throw new Error('Forbidden') }, fetchImpl: () => { throw new Error('Forbidden') } })
    assert.equal(result.status, 'skipped')
  }
})

test('first published deployment bootstraps without submitting historical content', async () => {
  const store = memoryStore()
  const result = await runDeployment(event, { env, logger, storeFactory: () => store, fetchImpl: fixtureFetch(), submit: () => { throw new Error('Must not submit') } })
  assert.equal(result.status, 'baseline')
  assert.deepEqual((await store.get('baseline')).entries, manifest.entries)
})

test('superseded events do not submit and unchanged redeploys do not resubmit', async () => {
  const store = memoryStore({ version: 1, entries: manifest.entries })
  for (const [candidate, status] of [[{ ...event, deploy: { ...event.deploy, id: 'b'.repeat(24) } }, 'superseded-or-not-live'], [event, 'unchanged']]) {
    const result = await runDeployment(candidate, { env, logger, storeFactory: () => store, fetchImpl: fixtureFetch(), submit: () => { throw new Error('Must not submit') } })
    assert.equal(result.status, status)
  }
})

test('overlapping hooks submit once; failed submissions stay pending for a later event', async () => {
  const store = memoryStore({ version: 1, entries: { [url]: hash } })
  let calls = 0
  const options = { env, logger, storeFactory: () => store, fetchImpl: fixtureFetch(), submit: async urls => { calls++; return { accepted: urls, failed: [] } } }
  await Promise.all([runDeployment(event, options), runDeployment(event, options)])
  assert.equal(calls, 1)
  await runDeployment(event, options)
  assert.equal(calls, 1)
  const failedStore = memoryStore({ version: 1, entries: { [url]: hash } })
  await runDeployment(event, { ...options, storeFactory: () => failedStore, submit: async urls => ({ accepted: [], failed: urls }) })
  assert.equal((await failedStore.get('baseline')).entries[url], hash)
})

test('a stale lock can be reclaimed; storage/network failures never escape the handler', async () => {
  const store = memoryStore({ version: 1, entries: manifest.entries })
  await store.setJSON('lock', { expiresAt: 0 })
  assert.equal((await runDeployment(event, { env, logger, storeFactory: () => store, fetchImpl: fixtureFetch() })).status, 'unchanged')
  assert.equal((await runDeployment(event, { env, logger, storeFactory: () => { throw new Error('storage down') }, fetchImpl: fixtureFetch() })).status, 'failed')
  assert.equal((await runDeployment(event, { env, logger, fetchImpl: async () => { throw new Error('network down') } })).status, 'failed')
})
