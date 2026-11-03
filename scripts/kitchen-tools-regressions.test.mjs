import test from 'node:test'
import assert from 'node:assert/strict'
import { scaleIngredientList } from '../src/lib/recipeScaler.js'
import { convertRecipeText, formatConvertedValue } from '../src/lib/measurementConverter.js'
import { calculateBrine, formatSalt, buildFormula, inputToGrams, gramsToInput } from '../src/lib/brineCalculator.js'
import { calculateDough, scaleDough } from '../src/lib/bakersPercentage.js'
import { calculateMeatBrine } from '../src/lib/meatBrineCalculator.js'
import { brineQuantity, displayBrineQuantity, initialBrineBatches, calculateBrineWorkflow, brineResultText, formatBrineSalt } from '../src/lib/brineWorkflow.js'
import { SEO_PAGES } from '../src/data/seoPages.js'
import { structuredDataForPage } from '../src/data/structuredData.js'
import { SUBSTITUTION_INGREDIENTS, exactSubstitution, suggestSubstitutions, getSubstitutionContext, scaleSubstitution, substitutionCopyText } from '../src/lib/substitutionFinder.js'

test('recipe temperatures retain precision instead of oven-style rounding', () => {
  assert.equal(convertRecipeText('Cook ground beef to 160°F', 'metric').output, 'Cook ground beef to 71.1°C')
  assert.equal(convertRecipeText('Cook to 74°C', 'us').output, 'Cook to 165.2°F')
  assert.equal(convertRecipeText('Bake at 350°F', 'metric').temperatureCount, 1)
})

test('scaling handles grouped thousands, numbered lists and small weights', () => {
  assert.equal(scaleIngredientList('1,000 g flour', 1, 1.5).output, '1500 g flour')
  assert.equal(scaleIngredientList('1. 200 g flour', 1, 2).output, '1. 400 g flour')
  assert.equal(scaleIngredientList('0.1 g yeast', 1, 2).output, '0.2 g yeast')
  assert.equal(scaleIngredientList('1,5 g yeast', 1, 2).output, '1,5 g yeast')
  assert.deepEqual(scaleIngredientList('1,5 g yeast', 1, 2).reviewLines, [1])
})

test('small positive conversions never display as zero', () => {
  for (const unit of ['tsp', 'tbsp', 'g', 'ml']) {
    assert.notEqual(formatConvertedValue(0.001, unit), '0')
  }
})

test('partially converted lists expose review lines', () => {
  const converted = convertRecipeText('1 cup plus 2 tbsp milk', 'metric')
  assert.deepEqual(converted.reviewLines, [1])
})

test('brine rejects invalid weights, methods and out-of-range percentages', () => {
  for (const input of [{ produce: -100, water: 500 }, { percent: 200 }, { produce: 'invalid' }, { method: 'unknown' }]) {
    assert.equal(calculateBrine(input).ok, false)
  }
  const tiny = calculateBrine({ produce: 1, water: 0, percent: 0.1 })
  assert.equal(formatSalt(tiny), '0.001 g')
  assert.match(buildFormula(tiny), /= 0.001 g salt/)
  assert.ok(Math.abs(inputToGrams(gramsToInput(1, 'produce', 'us'), 'produce', 'us') - 1) < 1e-12)
})

test('dough rejects fractional counts and invalid ingredient weights', () => {
  assert.equal(scaleDough(calculateDough({ flour: 500, water: 350 }), { pieces: 1.5, pieceWeight: 500 }).ok, false)
  assert.equal(calculateDough({ flour: 500, water: -100 }).ok, false)
})

test('meat brining uses an explicit method and recipe percentage', () => {
  assert.equal(calculateMeatBrine({ method: 'wet', meatG: 2000, waterG: 1000, percent: 3 }).saltG, 30)
  assert.equal(calculateMeatBrine({ method: 'dry', meatG: 2000, percent: 1 }).saltG, 20)
  for (const input of [
    {}, { method: 'equilibrium', meatG: 2000, percent: 2 },
    { method: 'wet', meatG: 2000, waterG: 0, percent: 3 },
    { method: 'dry', meatG: 2000, waterG: 1000, percent: 1 },
    { method: 'dry', meatG: 2000 }, { method: 'dry', meatG: -1, percent: 1 },
    { method: 'dry', meatG: 2000, percent: Infinity },
  ]) assert.equal(calculateMeatBrine(input).ok, false)
})

test('all brine workflows use the stated percentage denominator', () => {
  const batch = { food: brineQuantity('750', 'g'), water: brineQuantity('500', 'ml'), percent: '3' }
  for (const [method, expected] of Object.entries({ wet: 15, dry: 22.5, total: 37.5, water: 15, ratio: 15, solution: 500 * 3 / 97 })) {
    const result = calculateBrineWorkflow(method, batch)
    assert.equal(result.ok, true, method)
    assert.ok(Math.abs(result.saltG - expected) < 1e-10, method)
    assert.match(brineResultText(result), new RegExp(`Salt to add: ${formatBrineSalt(result).replace('.', '\\.')}`))
  }
  assert.equal(calculateBrineWorkflow('wet', { ...batch, food: brineQuantity('', 'g') }).ok, true)
  assert.equal(calculateBrineWorkflow('total', { ...batch, water: brineQuantity('0', 'ml') }).saltG, 22.5)
})

test('unit display never modifies the canonical weight, including repeated toggles', () => {
  const tiny = brineQuantity('1', 'g')
  for (let i = 0; i < 100; i++) {
    displayBrineQuantity(tiny, 'oz')
    assert.equal(displayBrineQuantity(tiny, 'g'), '1')
    assert.equal(tiny.grams, 1)
  }
  assert.equal(brineQuantity('1', 'lb').grams, 453.59237)
  assert.equal(brineQuantity('1', 'cup').grams, 236.5882365)
  const original = initialBrineBatches()
  original.wet.percent = '5'
  assert.equal(original.dry.percent, '')
})

test('empty, negative, out-of-range and overflowing brine inputs cannot yield a valid result', () => {
  const batch = { food: brineQuantity('1000', 'g'), water: brineQuantity('1000', 'ml'), percent: '5' }
  for (const text of ['', '-1', 'invalid', 'Infinity']) {
    assert.equal(calculateBrineWorkflow('wet', { ...batch, water: brineQuantity(text, 'ml') }).ok, false)
  }
  for (const percent of ['', '0', '-1', '100', 'Infinity']) {
    assert.equal(calculateBrineWorkflow('solution', { ...batch, percent }).ok, false)
  }
  assert.equal(calculateBrineWorkflow('total', { ...batch, food: brineQuantity('1e308', 'g'), water: brineQuantity('1e308', 'ml') }).ok, false)
  assert.equal(formatBrineSalt(calculateBrineWorkflow('dry', { ...batch, food: brineQuantity('1', 'g'), percent: '0.1' })), '0.001 g')
})

test('brine search metadata preserves the ranked URL and describes all supported uses', () => {
  const seo = SEO_PAGES.find((page) => page.path === '/tools/brine-calculator')
  assert.equal(seo.canonical, 'https://getsavor.recipes/tools/brine-calculator/')
  assert.equal(seo.robots, 'index, follow')
  assert.equal(seo.sitemap, true)
  assert.match(seo.title, /^Brine Calculator/)
  assert.match(seo.description, /wet or dry brining/)
  assert.match(seo.description, /brine concentration/)
  const data = JSON.stringify(structuredDataForPage(seo))
  assert.match(data, /Savor Brine Calculator/)
  assert.match(data, /final solution salt concentration/)
  assert.doesNotMatch(data, /Savor Fermentation Brine Calculator/)
})

test('substitution search handles accents, regional terms and explicit spelling suggestions', () => {
  for (const [query, id] of Object.entries({ 'creme fraiche': 'creme-fraiche', 'crème fraîche': 'creme-fraiche', 'cornflour': 'cornstarch', 'bicarb': 'baking-soda', 'What can I use instead of vanilla extract?': 'vanilla-extract', 'tomato concentrate substitute': 'tomato-paste' })) {
    assert.equal(exactSubstitution(query)?.id, id, query)
  }
  assert.equal(exactSubstitution('butermilk'), null)
  assert.equal(suggestSubstitutions('butermilk')[0]?.id, 'buttermilk')
  assert.deepEqual(suggestSubstitutions('zzzzzzzzzz'), [])
})

test('measured substitutions scale components, not preparation instructions', () => {
  const ingredient = exactSubstitution('buttermilk')
  const context = getSubstitutionContext(ingredient.id, 'baking')
  const swap = context.options[0]
  assert.deepEqual(scaleSubstitution(swap, '2').lines, [
    'Lemon juice or white vinegar: 2 tbsp',
    'Milk: add enough to bring the total mixture to 2 cup',
  ])
  assert.match(substitutionCopyText(ingredient, context, swap, '2'), /Rest 5–10 minutes/)
  assert.match(substitutionCopyText(ingredient, context, swap, '2'), /Watch out:/)
  for (const value of ['', '0', '-1', 'Infinity', '1001']) {
    assert.equal(scaleSubstitution(swap, value).ok, false)
    assert.equal(substitutionCopyText(ingredient, context, swap, value), '')
  }
  const garlic = getSubstitutionContext('garlic', 'savoury').options[0]
  assert.deepEqual(scaleSubstitution(garlic, 0.5).lines, ['Garlic powder: 0.0625 tsp'])
})

test('expanded substitution entries have unique IDs and complete usage guidance', () => {
  assert.equal(SUBSTITUTION_INGREDIENTS.length, 40)
  assert.equal(new Set(SUBSTITUTION_INGREDIENTS.map((item) => item.id)).size, 40)
  for (const ingredient of SUBSTITUTION_INGREDIENTS) {
    assert.ok(ingredient.category)
    assert.ok(ingredient.contexts.length)
    assert.equal(new Set(ingredient.contexts.map((item) => item.id)).size, ingredient.contexts.length)
    for (const context of ingredient.contexts) {
      assert.ok(context.options.length)
      for (const swap of context.options) {
        assert.ok(swap.name && swap.swap && swap.changes)
        if (swap.measure) assert.equal(scaleSubstitution(swap, swap.measure.amount).ok, true)
      }
    }
  }
})
