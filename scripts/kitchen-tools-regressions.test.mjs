import test from 'node:test'
import assert from 'node:assert/strict'
import { scaleIngredientList } from '../src/lib/recipeScaler.js'
import { convertRecipeText, formatConvertedValue } from '../src/lib/measurementConverter.js'
import { calculateBrine, formatSalt, buildFormula, inputToGrams, gramsToInput } from '../src/lib/brineCalculator.js'
import { calculateDough, scaleDough } from '../src/lib/bakersPercentage.js'
import { calculateMeatBrine } from '../src/lib/meatBrineCalculator.js'

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
