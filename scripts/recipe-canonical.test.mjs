import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveRecipeCanonical } from '../src/lib/recipeCanonical.js'
import { fingerprint } from './lib/deduplicate-recipes.mjs'

const recipe = { name: 'Bean stew', ingredients: ['400 g beans'], instructions: ['Simmer the beans.'] }
const resolve = (id, value, records = {}, known = {}) => resolveRecipeCanonical(id, value, async target => records[target], known)

test('new saved copies use their matching published source without a new build', async () => {
  assert.equal(await resolve('copy', { ...recipe, sourceRecipeId: 'published' }, { published: recipe }), 'published')
})
test('personal copies and saved-copy chains resolve to the matching published page', async () => {
  assert.equal(await resolve('personal', { ...recipe, sharedVersionId: 'published' }, { published: recipe }), 'published')
  assert.equal(await resolve('copy', { ...recipe, sourceRecipeId: 'other' }, { other: { ...recipe, sourceRecipeId: 'published' }, published: recipe }), 'published')
})
test('edits, imported recipes, missing sources and failed lookups retain their own identity', async () => {
  assert.equal(await resolve('copy', { ...recipe, ingredients: ['800 g beans'], sourceRecipeId: 'published' }, { published: recipe }), 'copy')
  assert.equal(await resolve('copy', { ...recipe, sourceRecipeId: 'published' }, { published: { ...recipe, sourceUrl: 'https://example.com/recipe' } }), 'copy')
  assert.equal(await resolve('copy', { ...recipe, sourceRecipeId: 'missing' }), 'copy')
  assert.equal(await resolveRecipeCanonical('copy', { ...recipe, sourceRecipeId: 'missing' }, async () => { throw Error('Offline') }, {}), 'copy')
  assert.equal(await resolve('copy', { name: recipe.name, sourceRecipeId: 'published' }, { published: recipe }), 'copy')
})
test('content-matched registry also covers legacy duplicates and new unlinked copies', async () => {
  const known = { [fingerprint(recipe)]: 'preferred' }
  assert.equal(await resolve('legacy', { ...recipe, image: 'different.jpg' }, {}, known), 'preferred')
  assert.equal(await resolve('edited', { ...recipe, instructions: ['Bake.'] }, {}, known), 'edited')
  assert.equal(await resolve('import', { ...recipe, sourceUrl: 'https://example.com' }, {}, known), 'import')
})

test('malformed cyclic lineage cannot produce conflicting canonical targets', async () => {
  const first = { ...recipe, sourceRecipeId: 'second' }
  const second = { ...recipe, sourceRecipeId: 'first' }
  assert.equal(await resolve('first', first, { first, second }), 'first')
})
