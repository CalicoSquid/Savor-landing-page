const GRAMS_PER_OUNCE = 28.349523125
const ML_PER_US_FL_OZ = 29.5735295625

export const BRINE_METHODS = {
  total: {
    id: 'total',
    label: 'Total weight',
    shortLabel: 'Vegetables + water',
    description: 'Salt is a percentage of the vegetables plus any added water. Useful for weight-based vegetable ferments and dry-salted ferments.',
  },
  water: {
    id: 'water',
    label: 'Water-only brine',
    shortLabel: 'Water only',
    description: 'Salt is a percentage of the water weight only. Use this when a recipe specifically tells you to make a brine at a stated percentage.',
  },
}

export const BRINE_PERCENT_PRESETS = [2, 2.5, 3, 5]

function finiteNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function clampNonNegative(value) {
  return Math.max(0, finiteNumber(value))
}

export function inputToGrams(value, kind, system = 'metric') {
  const amount = clampNonNegative(value)
  if (system === 'us') {
    return kind === 'water' ? amount * ML_PER_US_FL_OZ : amount * GRAMS_PER_OUNCE
  }
  return amount
}

export function gramsToInput(value, kind, system = 'metric') {
  const grams = clampNonNegative(value)
  if (system === 'us') {
    return kind === 'water' ? grams / ML_PER_US_FL_OZ : grams / GRAMS_PER_OUNCE
  }
  return grams
}

export function calculateBrine({
  method = 'total',
  produce = 1000,
  water = 0,
  percent = 2.5,
  system = 'metric',
} = {}) {
  const produceG = inputToGrams(produce, 'produce', system)
  const waterG = inputToGrams(water, 'water', system)
  const saltPercent = finiteNumber(percent)
  const selectedMethod = BRINE_METHODS[method] ? method : 'total'

  if (!(saltPercent > 0)) {
    return { ok: false, reason: 'Enter a salt percentage greater than 0.' }
  }

  const baseWeightG = selectedMethod === 'water' ? waterG : produceG + waterG
  if (!(baseWeightG > 0)) {
    return {
      ok: false,
      reason: selectedMethod === 'water'
        ? 'Enter some water to calculate a water-only brine.'
        : 'Enter some vegetables or water to calculate the salt amount.',
    }
  }

  const saltG = baseWeightG * (saltPercent / 100)
  const totalBatchG = produceG + waterG + saltG

  return {
    ok: true,
    method: selectedMethod,
    percent: saltPercent,
    produceG,
    waterG,
    baseWeightG,
    saltG,
    saltOz: saltG / GRAMS_PER_OUNCE,
    totalBatchG,
  }
}

function smartNumber(value, digits = 1) {
  if (!Number.isFinite(value)) return '0'
  const rounded = Number(value.toFixed(digits))
  return String(rounded)
}

export function formatSalt(result) {
  if (!result?.ok) return ''
  const gramsDigits = result.saltG < 10 ? 2 : result.saltG < 100 ? 1 : 0
  return `${smartNumber(result.saltG, gramsDigits)} g`
}

export function formatSaltOunces(result) {
  if (!result?.ok) return ''
  return `${smartNumber(result.saltOz, 2)} oz`
}

export function formatBaseWeight(result) {
  if (!result?.ok) return ''
  if (result.baseWeightG >= 1000) return `${smartNumber(result.baseWeightG / 1000, 2)} kg`
  return `${smartNumber(result.baseWeightG, 1)} g`
}

export function buildFormula(result) {
  if (!result?.ok) return ''
  const base = smartNumber(result.baseWeightG, 1)
  const percent = smartNumber(result.percent, 2)
  const salt = smartNumber(result.saltG, result.saltG < 100 ? 1 : 0)
  return `${base} g × ${percent}% = ${salt} g salt`
}

export function buildBrineNotes(result) {
  if (!result?.ok) return []
  const notes = []

  if (result.method === 'water') {
    notes.push('Water-only mode deliberately ignores the vegetable weight. That is correct only when your recipe defines its brine percentage from the water alone.')
  } else if (result.waterG === 0) {
    notes.push('With no added water, this is dry-salting maths: the salt percentage is based on the vegetable weight.')
  } else {
    notes.push('Total-weight mode includes both the vegetables and the added water before calculating the salt.')
  }
  notes.push('Weigh salt rather than measuring it by spoon: crystal size and salt type make volume measurements inconsistent.')
  return notes
}
