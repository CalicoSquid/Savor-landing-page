import test from 'node:test'
import assert from 'node:assert/strict'
import { deduplicateRecipes } from './lib/deduplicate-recipes.mjs'

const recipe = { name: 'Bean stew', ingredients: ['400 g beans', '1 onion'], instructions: ['Soften the onion.', 'Add beans and simmer.'], recipeYield: '2 servings' }
const entry = (id, changes = {}) => ({ id, recipe: { ...recipe, ...changes } })
const ids = entries => deduplicateRecipes(entries).map(item => item.id)

test('collapses matching copies across accounts and different photos, preferring the published snapshot', () => {
  const candidates = [entry('001', { user: 'one', image: 'a.jpg' }), entry('003', { sourceRecipeId: '002', user: 'two' }), entry('002', { isShared: true, image: 'b.jpg' })]
  assert.deepEqual(ids(candidates), ['002'])
  assert.deepEqual(ids([...candidates].reverse()), ['002'])
})
test('normalizes whitespace and title casing without ignoring quantities or step order', () => {
  assert.deepEqual(ids([entry('001'), entry('002', { name: ' BEAN  STEW ', ingredients: ['400  g beans ', '1 onion'] })]), ['001'])
  assert.equal(ids([entry('001'), entry('002', { ingredients: ['800 g beans', '1 onion'] })]).length, 2)
  assert.equal(ids([entry('001'), entry('002', { instructions: [...recipe.instructions].reverse() })]).length, 2)
  assert.equal(ids([entry('001', { ingredients: ['1 T oil'] }), entry('002', { ingredients: ['1 t oil'] })]).length, 2)
})
test('keeps same-title variations with different portions, cooking times or ingredient groups', () => {
  for (const change of [{ recipeYield: '4 servings' }, { times: { cook: { minutes: 45 } } }, { ingredientGroups: [{ label: 'Sauce', startIndex: 1 }] }]) {
    assert.equal(ids([entry('001'), entry('002', change)]).length, 2)
  }
})
test('does not collapse incomplete recipes by title', () => {
  for (const change of [{ instructions: [] }, { ingredients: [] }, { ingredients: [''] }]) {
    assert.equal(ids([entry('001', change), entry('002', change)]).length, 2)
  }
})
test('selection is deterministic and does not mutate input or prefer a saved copy', () => {
  const candidates = [entry('003'), entry('002'), entry('001', { sourceRecipeId: 'missing' })]
  assert.deepEqual(ids(candidates), ['002'])
  assert.deepEqual(candidates.map(item => item.id), ['003', '002', '001'])
  assert.deepEqual(ids([...candidates].reverse()), ['002'])
})
