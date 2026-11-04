import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loadPublicRecipe } from '../src/lib/publicRecipe.js'
import { RECIPE_IMAGE_OVERRIDES } from '../src/data/recipeImageOverrides.js'

test('early recipe loading shares requests, isolates IDs, applies overrides and permits retries', async () => {
  const originalFetch = globalThis.fetch
  const calls = []
  const release = new Map()
  globalThis.fetch = (_url, options) => {
    const id = JSON.parse(options.body).variables.id
    calls.push(id)
    return new Promise(resolve => release.set(id, resolve))
  }
  const respond = (id, recipe) => release.get(id)(new Response(JSON.stringify({ data: { publicRecipe: recipe } })))
  try {
    RECIPE_IMAGE_OVERRIDES['early-a'] = { image: '/replacement.webp' }
    const early = loadPublicRecipe('early-a', { early: true })
    const consumer = loadPublicRecipe('early-a')
    assert.equal(early, consumer)
    const other = loadPublicRecipe('early-b')
    respond('early-b', { name: 'B', image: 'https://example.com/b.jpg' })
    respond('early-a', { name: 'A', image: 'https://example.com/a.jpg' })
    assert.equal((await consumer).image, 'https://getsavor.recipes/replacement.webp')
    assert.equal((await other).name, 'B')
    assert.deepEqual(calls, ['early-a', 'early-b'])

    const ready = loadPublicRecipe('early-ready', { early: true })
    respond('early-ready', { name: 'Ready' })
    await ready
    await new Promise(resolve => setTimeout(resolve, 5))
    assert.equal(loadPublicRecipe('early-ready'), ready, 'React reuses a completed bootstrap request')

    const missing = loadPublicRecipe('early-missing')
    respond('early-missing', null)
    assert.equal(await missing, null)

    const failed = loadPublicRecipe('early-failure', { early: true })
    release.get('early-failure')(new Response('{}', { status: 503 }))
    await assert.rejects(failed)
    const retry = loadPublicRecipe('early-failure')
    respond('early-failure', { name: 'Recovered' })
    assert.equal((await retry).name, 'Recovered')
    assert.equal(calls.filter(id => id === 'early-failure').length, 2)
  } finally {
    globalThis.fetch = originalFetch
    delete RECIPE_IMAGE_OVERRIDES['early-a']
  }
})
