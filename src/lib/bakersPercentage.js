const OUNCE_G = 28.349523125

function numberOrZero(value) {
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : 0
}

export function inputWeightToGrams(value, system = 'metric') {
  const number = numberOrZero(value)
  return system === 'us' ? number * OUNCE_G : number
}

export function gramsToInputWeight(value, system = 'metric') {
  const grams = numberOrZero(value)
  return system === 'us' ? grams / OUNCE_G : grams
}

export function starterBreakdown(starterG, starterHydration = 100) {
  const weight = numberOrZero(starterG)
  const hydration = Math.max(0, numberOrZero(starterHydration)) / 100
  if (weight === 0) return { flourG: 0, waterG: 0 }
  const flourG = weight / (1 + hydration)
  return { flourG, waterG: weight - flourG }
}

export function calculateDough({
  flour = 0,
  water = 0,
  starter = 0,
  starterHydration = 100,
  salt = 0,
  other = 0,
  system = 'metric',
} = {}) {
  const flourG = inputWeightToGrams(flour, system)
  const waterG = inputWeightToGrams(water, system)
  const starterG = inputWeightToGrams(starter, system)
  const saltG = inputWeightToGrams(salt, system)
  const otherG = inputWeightToGrams(other, system)
  const hydrationInput = numberOrZero(starterHydration)
  const starterParts = starterBreakdown(starterG, hydrationInput)
  const totalFlourG = flourG + starterParts.flourG
  const totalWaterG = waterG + starterParts.waterG
  const totalDoughG = flourG + waterG + starterG + saltG + otherG

  if (totalFlourG <= 0) {
    return { ok: false, reason: 'Add some flour to calculate the dough formula.' }
  }

  const percent = (value) => (value / totalFlourG) * 100

  return {
    ok: true,
    system,
    flourG,
    waterG,
    starterG,
    starterHydration: hydrationInput,
    starterFlourG: starterParts.flourG,
    starterWaterG: starterParts.waterG,
    saltG,
    otherG,
    totalFlourG,
    totalWaterG,
    totalDoughG,
    hydration: percent(totalWaterG),
    saltPercent: percent(saltG),
    starterPercent: percent(starterG),
    prefermentedFlourPercent: percent(starterParts.flourG),
    otherPercent: percent(otherG),
  }
}

export function scaleDough(result, { pieces = 1, pieceWeight = 0, system = 'metric' } = {}) {
  if (!result?.ok || result.totalDoughG <= 0) {
    return { ok: false, reason: 'Enter a valid dough formula before scaling it.' }
  }

  const pieceCount = Math.max(0, Math.floor(Number(pieces) || 0))
  const pieceWeightG = inputWeightToGrams(pieceWeight, system)
  if (pieceCount <= 0 || pieceWeightG <= 0) {
    return { ok: false, reason: 'Enter at least one loaf or dough ball and a target weight.' }
  }

  const targetTotalG = pieceCount * pieceWeightG
  const factor = targetTotalG / result.totalDoughG
  const scale = (value) => value * factor

  return {
    ok: true,
    pieces: pieceCount,
    pieceWeightG,
    targetTotalG,
    factor,
    flourG: scale(result.flourG),
    waterG: scale(result.waterG),
    starterG: scale(result.starterG),
    saltG: scale(result.saltG),
    otherG: scale(result.otherG),
  }
}

export function formatWeight(grams, system = 'metric', { compact = false } = {}) {
  const value = numberOrZero(grams)
  if (system === 'us') {
    const ounces = value / OUNCE_G
    return `${Number(ounces.toFixed(2))} oz`
  }
  if (compact && value >= 1000) return `${Number((value / 1000).toFixed(2))} kg`
  return `${Number(value.toFixed(value < 100 ? 1 : 0))} g`
}

export function formatPercent(value, digits = 1) {
  return `${Number(numberOrZero(value).toFixed(digits))}%`
}

export function buildDoughNotes(result) {
  if (!result?.ok) return []
  const notes = []
  if (result.starterG > 0) {
    notes.push(`True hydration includes the flour and water inside your ${formatPercent(result.starterHydration, 0)} hydration starter.`)
  } else {
    notes.push('With no starter or preferment entered, hydration is simply water weight ÷ flour weight.')
  }
  notes.push('Hydration is a useful ratio, not a guarantee of dough feel. Different flours absorb water differently.')
  if (result.otherG > 0) notes.push('“Other ingredients” count toward total dough weight but are not treated as water for hydration.')
  return notes
}

export function scaledFormulaText(scaled, system = 'metric') {
  if (!scaled?.ok) return ''
  const rows = [
    ['Flour', scaled.flourG],
    ['Water', scaled.waterG],
    ['Starter / preferment', scaled.starterG],
    ['Salt', scaled.saltG],
  ]
  if (scaled.otherG > 0.01) rows.push(['Other ingredients', scaled.otherG])
  return rows.map(([label, grams]) => `${label}: ${formatWeight(grams, system)}`).join('\n')
}
