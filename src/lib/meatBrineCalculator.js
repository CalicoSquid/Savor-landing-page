// Calculation foundation for the future meat workflow. No preset percentages:
// callers must supply the percentage required by their recipe.
export const MEAT_BRINE_METHODS = {
  wet: {
    label: 'Wet brine',
    basis: 'water',
    description: 'Salt percentage is based on added water weight, excluding meat and salt.',
  },
  dry: {
    label: 'Dry brine',
    basis: 'meat',
    description: 'Salt percentage is based on meat weight, with no added water.',
  },
}

export function calculateMeatBrine({ method, meatG = 0, waterG = 0, percent } = {}) {
  if (!Object.hasOwn(MEAT_BRINE_METHODS, method)) {
    return { ok: false, reason: 'Choose wet or dry brining.' }
  }
  const meat = Number(meatG)
  const water = Number(waterG)
  const percentage = Number(percent)
  if (!Number.isFinite(meat) || meat < 0 || (method === 'dry' && meat <= 0) || !Number.isFinite(water) || water < 0) {
    return { ok: false, reason: 'Enter a positive meat weight for dry brining and non-negative water and meat weights.' }
  }
  // This is an input guard, not a recommended or safe range for a recipe.
  if (!Number.isFinite(percentage) || percentage < 0.1 || percentage > 20) {
    return { ok: false, reason: 'Enter your recipe’s salt percentage, from 0.1 to 20.' }
  }
  if (method === 'wet' && water <= 0) {
    return { ok: false, reason: 'Enter the added water weight for a wet brine.' }
  }
  if (method === 'dry' && water !== 0) {
    return { ok: false, reason: 'Dry brining uses no added water. Remove the water or choose wet brining.' }
  }
  const baseWeightG = method === 'wet' ? water : meat
  const saltG = baseWeightG * percentage / 100
  const totalBatchG = meat + water + saltG
  if (![saltG, totalBatchG].every(Number.isFinite)) {
    return { ok: false, reason: 'The batch is too large to calculate. Enter smaller weights.' }
  }
  return { ok: true, method, basis: MEAT_BRINE_METHODS[method].basis, meatG: meat, waterG: water, percent: percentage, baseWeightG, saltG, totalBatchG }
}
