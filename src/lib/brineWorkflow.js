import { calculateBrine } from './brineCalculator.js'
import { calculateMeatBrine } from './meatBrineCalculator.js'

export const BRINE_UNITS = {
  g: { label: 'Grams (g)', factor: 1, kind: 'food' },
  kg: { label: 'Kilograms (kg)', factor: 1000, kind: 'food' },
  oz: { label: 'Ounces (oz)', factor: 28.349523125, kind: 'food' },
  lb: { label: 'Pounds (lb)', factor: 453.59237, kind: 'food' },
  ml: { label: 'Millilitres (ml)', factor: 1, kind: 'water' },
  l: { label: 'Litres (L)', factor: 1000, kind: 'water' },
  floz: { label: 'US fluid ounces (fl oz)', factor: 29.5735295625, kind: 'water' },
  cup: { label: 'US cups', factor: 236.5882365, kind: 'water' },
}

export const BRINE_WORKFLOWS = {
  meat: { label: 'Meat & poultry', methods: ['wet', 'dry'] },
  vegetables: { label: 'Vegetable fermentation', methods: ['total', 'water'] },
  concentration: { label: 'Salt concentration', methods: ['ratio', 'solution'] },
}

export const BRINE_MODE_DETAILS = {
  wet: { label: 'Wet brine', basis: 'Water weight', description: 'Salt is a percentage of the water weight only. Meat weight is not part of this calculation.', water: true, formula: 'water × percentage ÷ 100', example: { water: 1000, percent: 5 } },
  dry: { label: 'Dry brine', basis: 'Meat weight', description: 'Salt is a percentage of the meat weight. No water is added.', food: true, formula: 'meat × percentage ÷ 100', example: { food: 1000, percent: 1 } },
  total: { label: 'Total weight', basis: 'Vegetables + water', description: 'Salt is a percentage of the vegetables plus added water, before adding salt. With no added water, use the vegetable weight alone.', food: true, water: true, formula: '(vegetables + water) × percentage ÷ 100', example: { food: 750, water: 500, percent: 2.5 } },
  water: { label: 'Water-only brine', basis: 'Water weight', description: 'Use this when your fermentation recipe bases its percentage on water alone. Vegetable weight is excluded.', water: true, formula: 'water × percentage ÷ 100', example: { water: 1000, percent: 3 } },
  ratio: { label: 'Salt-to-water ratio', basis: 'Water, excluding salt', description: '5% means 5 g salt for every 100 g water. The finished solution is about 4.76% salt by weight.', water: true, formula: 'water × percentage ÷ 100', example: { water: 1000, percent: 5 } },
  solution: { label: 'Final solution concentration', basis: 'Water + salt', description: '5% means salt is 5% of the finished water-and-salt solution. This needs more salt than a 5% salt-to-water ratio.', water: true, formula: 'water × percentage ÷ (100 − percentage)', example: { water: 1000, percent: 5 } },
}

// Preserve the original editable text and canonical grams. Unit changes only
// affect display; switching repeatedly never feeds rounded values into the maths.
export function brineQuantity(text, unit) {
  const value = Number(text)
  const factor = BRINE_UNITS[unit]?.factor
  const grams = String(text).trim() !== '' && Number.isFinite(value) && value >= 0 && factor ? value * factor : null
  return { text: String(text), unit, grams: Number.isFinite(grams) ? grams : null }
}

export function displayBrineQuantity(quantity, unit) {
  if (quantity.unit === unit || quantity.grams === null) return quantity.text
  return String(Number((quantity.grams / BRINE_UNITS[unit].factor).toPrecision(10)))
}

export function initialBrineBatches() {
  return Object.fromEntries(Object.keys(BRINE_MODE_DETAILS).map((method) => [method, {
    food: brineQuantity('1000', 'g'), water: brineQuantity(method === 'total' ? '0' : '1000', 'ml'), percent: '',
  }]))
}

export function calculateBrineWorkflow(method, batch) {
  const detail = BRINE_MODE_DETAILS[method]
  if (!detail) return { ok: false, reason: 'Choose a calculation method.' }
  const food = detail.food ? batch.food.grams : 0
  const water = detail.water ? batch.water.grams : 0
  if (food === null || water === null) return { ok: false, reason: 'Enter valid, non-negative amounts in the fields above.' }
  const percent = Number(batch.percent)
  if (!Number.isFinite(percent) || percent < 0.1 || percent > 20) {
    return { ok: false, reason: 'Enter the salt percentage from your recipe (0.1–20%).' }
  }
  let result
  if (method === 'wet' || method === 'dry') {
    result = calculateMeatBrine({ method, meatG: food, waterG: water, percent })
  } else if (method === 'total' || method === 'water') {
    result = calculateBrine({ method, produce: food, water, percent })
  } else {
    if (!(water > 0)) return { ok: false, reason: 'Enter a water amount greater than zero.' }
    const saltG = method === 'solution' ? water * percent / (100 - percent) : water * percent / 100
    result = { ok: true, saltG, percent, baseWeightG: method === 'solution' ? water + saltG : water }
  }
  if (!result.ok) return result
  if (![result.saltG, result.baseWeightG, food + water + result.saltG].every(Number.isFinite)) {
    return { ok: false, reason: 'These amounts are too large. Enter smaller weights.' }
  }
  if (!(result.saltG > 0)) return { ok: false, reason: 'These amounts are too small to calculate. Enter a larger batch.' }
  return { ...result, method, foodG: food, waterG: water, saltOz: result.saltG / BRINE_UNITS.oz.factor }
}

export function brineResultText(result) {
  if (!result.ok) return ''
  const detail = BRINE_MODE_DETAILS[result.method]
  const weight = (value) => `${Number(value.toPrecision(8))} g`
  return [detail.label, `Salt to add: ${formatBrineSalt(result)}`, `Salt percentage: ${result.percent}%`, `Percentage basis: ${detail.basis}`, ...(detail.food ? [`Food weight: ${weight(result.foodG)}`] : []), ...(detail.water ? [`Water weight: ${weight(result.waterG)}`] : []), `Formula: ${detail.formula}`].join('\n')
}

export function formatBrineSalt(result) {
  if (!result.ok) return ''
  const salt = result.saltG < 0.01 ? Number(result.saltG.toPrecision(3)) : Number(result.saltG.toFixed(2))
  return `${salt} g`
}
