import assert from 'node:assert/strict'
import handler from '../netlify/edge-functions/recipe-og.js'

const originalFetch = globalThis.fetch
const context = { next: () => new Response('NEXT', { status: 599 }) }

function gqlResponse(recipe, { status = 200, errors } = {}) {
  return new Response(JSON.stringify(errors ? { errors } : { data: { publicRecipe: recipe } }), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

async function call({ recipe, userAgent = 'AhrefsSiteAudit/6.1', fetchImpl, id = 'test-original' }) {
  globalThis.fetch = fetchImpl || (async () => gqlResponse(recipe))
  const request = new Request(`https://getsavor.recipes/r/${id}`, {
    headers: { 'user-agent': userAgent },
  })
  return handler(request, context)
}

try {
  const original = {
    name: 'Roast Tomato Pasta',
    description: 'A simple original pasta recipe with roasted tomatoes, garlic and herbs.',
    image: 'https://example.com/pasta.jpg',
    ingredients: ['400 g tomatoes', '250 g pasta'],
    instructions: ['Roast the tomatoes.', 'Toss with pasta.'],
    sourceUrl: null,
    category: 'Dinner',
    cuisine: 'Italian',
    recipeYield: '2 servings',
    user: { name: 'Test Cook', username: 'test' },
  }

  const indexed = await call({ recipe: original })
  const indexedHtml = await indexed.text()
  assert.equal(indexed.status, 200)
  assert.match(indexedHtml, /<meta name="robots" content="index, follow"/)
  assert.match(indexedHtml, /<link rel="canonical" href="https:\/\/getsavor\.recipes\/r\/test-original"/)
  assert.match(indexedHtml, /<script type="application\/ld\+json">/)
  assert.match(indexedHtml, /href="https:\/\/getsavor\.recipes\/recipes\/"/)
  assert.match(indexedHtml, /<h1>Roast Tomato Pasta<\/h1>/)

  const imported = await call({ recipe: { ...original, sourceUrl: 'https://example.org/original-pasta' }, id: 'imported' })
  const importedHtml = await imported.text()
  assert.equal(imported.status, 200)
  assert.match(importedHtml, /<meta name="robots" content="noindex, follow"/)
  assert.match(importedHtml, /<link rel="canonical" href="https:\/\/example\.org\/original-pasta"/)

  const missing = await call({ recipe: null, id: 'gone' })
  const missingHtml = await missing.text()
  assert.equal(missing.status, 404)
  assert.match(missingHtml, /noindex, follow/)

  const unavailable = await call({
    id: 'temporary',
    fetchImpl: async () => { throw new Error('temporary API outage') },
  })
  assert.equal(unavailable.status, 503)
  assert.equal(unavailable.headers.get('retry-after'), '300')

  const human = await call({ recipe: original, userAgent: 'Mozilla/5.0' })
  assert.equal(human.status, 599)
  assert.equal(await human.text(), 'NEXT')

  console.log('✓ recipe edge validation passed: Ahrefs index/noindex parity, internal links, 404, 503 and human passthrough')
} finally {
  globalThis.fetch = originalFetch
}
