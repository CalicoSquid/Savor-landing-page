import assert from 'node:assert/strict'
import { scaleIngredientList } from '../src/lib/recipeScaler.js'
import { TOOL_PAGES, TOOL_PAGE_BY_ID } from '../src/data/toolPages.js'
import {
  conversionIngredientNames,
  convertMeasurement,
  convertRecipeText,
  detectIngredient,
  formatConvertedValue,
} from '../src/lib/measurementConverter.js'
import { normaliseConversionDataset } from '../src/lib/conversionData.js'
import {
  comparePans,
  convertLength,
  describeMultiplier,
  panResultCopy,
  presetToPan,
} from '../src/lib/panConverter.js'
import {
  buildPortionNotes,
  calculatePortions,
  formatPortionQuantity,
} from '../src/lib/portionPlanner.js'
import {
  SUBSTITUTION_INGREDIENTS,
  getSubstitutionContext,
  getSubstitutionIngredient,
  searchSubstitutions,
} from '../src/lib/substitutionFinder.js'
import {
  buildBrineNotes,
  buildFormula,
  calculateBrine,
  formatSalt,
  formatSaltOunces,
  gramsToInput,
  inputToGrams,
} from '../src/lib/brineCalculator.js'
import {
  calculateDough,
  formatPercent,
  formatWeight,
  gramsToInputWeight,
  inputWeightToGrams,
  scaleDough,
  starterBreakdown,
} from '../src/lib/bakersPercentage.js'


assert.equal(TOOL_PAGES.length, 8)
assert.equal(new Set(TOOL_PAGES.map((tool) => tool.id)).size, TOOL_PAGES.length)
assert.equal(new Set(TOOL_PAGES.map((tool) => tool.href)).size, TOOL_PAGES.length)
for (const tool of TOOL_PAGES) {
  assert.ok((tool.href.startsWith('/tools/') || tool.id === 'potluck') && tool.href.endsWith('/'))
  assert.ok(tool.title)
  assert.ok(tool.description)
  assert.ok(tool.related.length >= 2)
  for (const relatedId of tool.related) {
    assert.ok(TOOL_PAGE_BY_ID[relatedId], `${tool.id} references missing related tool ${relatedId}`)
    assert.notEqual(relatedId, tool.id)
  }
}

const conversionData = normaliseConversionDataset({
  schemaVersion: 1,
  version: 'test-data',
  count: 11,
  cookingCupMl: 240,
  entries: [
    { name: 'flour', cupToGrams: 120 },
    { name: 'plain flour', cupToGrams: 120 },
    { name: 'all-purpose flour', cupToGrams: 120 },
    { name: 'bread flour', cupToGrams: 130 },
    { name: 'dark brown sugar', cupToGrams: 220 },
    { name: 'butter', cupToGrams: 227 },
    { name: 'cream cheese', cupToGrams: 230 },
    { name: 'milk', cupToMl: 240 },
    { name: 'oil', cupToMl: 240 },
    { name: 'vanilla', cupToMl: 240 },
    { name: 'tahini', cupToGrams: 240 },
  ],
})

assert.ok(conversionData)
assert.equal(conversionData.count, 11)
assert.ok(conversionIngredientNames(conversionData, { weightVolumeOnly: true }).includes('tahini'))

const scaled = scaleIngredientList('1 1/2 cups flour\n2 eggs\nsalt to taste', 4, 7)
assert.equal(scaled.output, '2 5/8 cups flour\n3 1/2 eggs\nsalt to taste')
assert.equal(scaled.fractionalEgg, true)

const cupFlour = convertMeasurement('1', 'cup', 'g', 'flour', conversionData)
assert.equal(cupFlour.ok, true)
assert.equal(formatConvertedValue(cupFlour.value, 'g'), '120')
assert.equal(cupFlour.approximate, true)

const cupTahini = convertMeasurement('1', 'cup', 'g', 'tahini', conversionData)
assert.equal(cupTahini.ok, true)
assert.equal(formatConvertedValue(cupTahini.value, 'g'), '240')

const directWeight = convertMeasurement('16', 'oz', 'lb', '', conversionData)
assert.equal(directWeight.ok, true)
assert.ok(Math.abs(directWeight.value - 1) < 0.0001)
assert.equal(directWeight.approximate, false)

const temp = convertMeasurement('350', 'f', 'c', '', conversionData)
assert.equal(temp.ok, true)
assert.ok(Math.abs(temp.value - 176.6666667) < 0.001)

const missingIngredient = convertMeasurement('1', 'cup', 'g', '', conversionData)
assert.equal(missingIngredient.ok, false)
assert.equal(missingIngredient.needsIngredient, true)

const unavailableWeight = convertMeasurement('1', 'cup', 'g', 'milk', conversionData)
assert.equal(unavailableWeight.ok, false)
assert.match(unavailableWeight.reason, /does not have a volume-to-weight value/)

assert.equal(detectIngredient('packed dark brown sugar', conversionData)?.name, 'dark brown sugar')
assert.equal(detectIngredient('strong bread flour', conversionData)?.name, 'bread flour')

const metric = convertRecipeText(`1 1/2 cups all-purpose flour
3/4 cup milk
2 tbsp butter
1/3 cup dark brown sugar
8 oz cream cheese
1 tsp vanilla
Bake at 350°F`, 'metric', conversionData)
assert.equal(metric.output, `180 g all-purpose flour
180 ml milk
28.4 g butter
73.3 g dark brown sugar
227 g cream cheese
5 ml vanilla
Bake at 175°C`)
assert.equal(metric.convertedCount, 6)
assert.equal(metric.approximateCount, 3)

const us = convertRecipeText(`125 g plain flour
120 ml milk
30 g butter
Bake at 180°C`, 'us', conversionData)
assert.equal(us.output, `1 cup plain flour
1/2 cup milk
2 1/8 tbsp butter
Bake at 355°F`)
assert.equal(us.convertedCount, 3)

const ranges = convertRecipeText(`1–2 cups flour
2-3 tbsp oil`, 'metric', conversionData)
assert.equal(ranges.output, `120–240 g flour
30–45 ml oil`)
assert.equal(ranges.convertedCount, 2)


const eightRound = presetToPan('round-8in', 'in')
const nineRound = presetToPan('round-9in', 'in')
const roundComparison = comparePans(eightRound, nineRound, 'in')
assert.equal(roundComparison.ok, true)
assert.ok(Math.abs(roundComparison.multiplier - 1.265625) < 0.000001)
assert.equal(describeMultiplier(roundComparison.multiplier), '1.27×')
assert.equal(Math.round(roundComparison.unscaledDepthRatio * 100), 79)
assert.match(panResultCopy(roundComparison).action, /27% more batter/)
assert.match(panResultCopy(roundComparison).depth, /21% shallower/)

const eightRoundCm = presetToPan('round-8in', 'cm')
const nineRoundCm = presetToPan('round-9in', 'cm')
const metricRoundComparison = comparePans(eightRoundCm, nineRoundCm, 'cm')
assert.ok(Math.abs(metricRoundComparison.multiplier - roundComparison.multiplier) < 0.000001)
assert.ok(Math.abs(convertLength(8, 'in', 'cm') - 20.32) < 0.000001)

const loaf = presetToPan('loaf-9x5in', 'in')
const loafComparison = comparePans(loaf, presetToPan('rect-9x13in', 'in'), 'in')
assert.equal(loafComparison.approximate, true)
assert.match(loafComparison.caveat, /Loaf tins/)

const panScaled = scaleIngredientList('2 eggs\n1 cup flour', 1, roundComparison.multiplier)
assert.equal(panScaled.output, '2.53 eggs\n1 1/4 cup flour')
assert.equal(panScaled.fractionalEgg, true)



const pastaForTen = calculatePortions({ foodId: 'pasta-dry', adults: 10, children: 0, role: 'main', appetite: 'normal', leftovers: 'none' })
assert.equal(pastaForTen.ok, true)
assert.equal(pastaForTen.total, 1000)
assert.equal(formatPortionQuantity(pastaForTen.total, pastaForTen.unit, 'metric'), '1 kg')
assert.equal(formatPortionQuantity(pastaForTen.total, pastaForTen.unit, 'us'), '2.2 lb')

const familyRoast = calculatePortions({ foodId: 'potatoes', adults: 6, children: 4, role: 'side', appetite: 'normal', leftovers: 'little' })
assert.ok(Math.abs(familyRoast.effectiveDiners - 8.4) < 0.000001)
assert.equal(familyRoast.total, 1850)
assert.ok(buildPortionNotes(familyRoast).some((note) => /60%/.test(note)))
assert.ok(buildPortionNotes(familyRoast).some((note) => /10% buffer/.test(note)))

const buffet = calculatePortions({ foodId: 'boneless-meat', adults: 20, children: 0, role: 'buffet', appetite: 'hungry', leftovers: 'none' })
assert.equal(buffet.total, 2900)
assert.ok(buildPortionNotes(buffet).some((note) => /several other dishes/.test(note)))

const nobody = calculatePortions({ foodId: 'rice-dry', adults: 0, children: 0 })
assert.equal(nobody.ok, false)
assert.match(nobody.reason, /at least one/)


const buttermilk = getSubstitutionIngredient('buttermilk')
assert.ok(buttermilk)
assert.ok(SUBSTITUTION_INGREDIENTS.length >= 20)
assert.equal(searchSubstitutions('bicarb')[0]?.id, 'baking-soda')
assert.equal(searchSubstitutions('double cream')[0]?.id, 'heavy-cream')
const buttermilkBaking = getSubstitutionContext('buttermilk', 'baking')
assert.equal(buttermilkBaking.id, 'baking')
assert.match(buttermilkBaking.options[0].swap, /1 tbsp acid/i)
const eggBaking = getSubstitutionContext('egg', 'baking')
assert.ok(eggBaking.options.some((item) => /meringue|souffl/i.test(item.avoid)))
const creamSauce = getSubstitutionContext('heavy-cream', 'savoury')
assert.ok(creamSauce.options.some((item) => /will not whip/i.test(item.avoid)))


const dryBrine = calculateBrine({ method: 'total', produce: 1000, water: 0, percent: 2.5, system: 'metric' })
assert.equal(dryBrine.ok, true)
assert.ok(Math.abs(dryBrine.saltG - 25) < 0.000001)
assert.equal(formatSalt(dryBrine), '25 g')
assert.match(buildFormula(dryBrine), /1000 g × 2.5% = 25 g salt/)
assert.ok(buildBrineNotes(dryBrine).some((note) => /dry-salting/i.test(note)))

const totalWeightBrine = calculateBrine({ method: 'total', produce: 750, water: 500, percent: 2.5, system: 'metric' })
assert.ok(Math.abs(totalWeightBrine.saltG - 31.25) < 0.000001)
assert.equal(formatSalt(totalWeightBrine), '31.3 g')

const waterOnlyBrine = calculateBrine({ method: 'water', produce: 1000, water: 500, percent: 3, system: 'metric' })
assert.ok(Math.abs(waterOnlyBrine.saltG - 15) < 0.000001)
assert.ok(buildBrineNotes(waterOnlyBrine).some((note) => /ignores the vegetable weight/i.test(note)))

const usProduce = gramsToInput(1000, 'produce', 'us')
const usWater = gramsToInput(500, 'water', 'us')
const usEquivalent = calculateBrine({ method: 'total', produce: usProduce, water: usWater, percent: 3, system: 'us' })
assert.ok(Math.abs(usEquivalent.saltG - 45) < 0.00001)
assert.ok(Math.abs(inputToGrams(usProduce, 'produce', 'us') - 1000) < 0.00001)
assert.match(formatSaltOunces(usEquivalent), /1.59 oz/)

const missingWater = calculateBrine({ method: 'water', produce: 1000, water: 0, percent: 3, system: 'metric' })
assert.equal(missingWater.ok, false)
assert.match(missingWater.reason, /some water/i)

const starterParts = starterBreakdown(200, 100)
assert.ok(Math.abs(starterParts.flourG - 100) < 0.000001)
assert.ok(Math.abs(starterParts.waterG - 100) < 0.000001)

const sourdough = calculateDough({ flour: 900, water: 650, starter: 200, starterHydration: 100, salt: 20, other: 0, system: 'metric' })
assert.equal(sourdough.ok, true)
assert.ok(Math.abs(sourdough.totalFlourG - 1000) < 0.000001)
assert.ok(Math.abs(sourdough.totalWaterG - 750) < 0.000001)
assert.ok(Math.abs(sourdough.hydration - 75) < 0.000001)
assert.ok(Math.abs(sourdough.saltPercent - 2) < 0.000001)
assert.ok(Math.abs(sourdough.prefermentedFlourPercent - 10) < 0.000001)
assert.equal(formatPercent(sourdough.hydration), '75%')
assert.equal(formatWeight(sourdough.totalDoughG, 'metric', { compact: true }), '1.77 kg')

const scaledDough = scaleDough(sourdough, { pieces: 2, pieceWeight: 900, system: 'metric' })
assert.equal(scaledDough.ok, true)
assert.ok(Math.abs(scaledDough.targetTotalG - 1800) < 0.000001)
assert.ok(Math.abs(scaledDough.factor - (1800 / 1770)) < 0.000001)

const usWeight = gramsToInputWeight(500, 'us')
assert.ok(Math.abs(inputWeightToGrams(usWeight, 'us') - 500) < 0.00001)
const sourdoughUs = calculateDough({
  flour: gramsToInputWeight(900, 'us'),
  water: gramsToInputWeight(650, 'us'),
  starter: gramsToInputWeight(200, 'us'),
  starterHydration: 100,
  salt: gramsToInputWeight(20, 'us'),
  system: 'us',
})
assert.ok(Math.abs(sourdoughUs.hydration - 75) < 0.000001)

console.log('✓ Kitchen tool validation passed (recipe scaling + shared conversions + ranges + temperatures + pan conversion + portion planning + ingredient substitutions + fermentation brine maths + baker’s percentages + dough scaling)')
