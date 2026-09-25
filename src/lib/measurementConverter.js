import { parseQuantity } from './recipeScaler.js'

const ML_PER_US_CUP = 236.5882365

const UNIT_DEFS = {
  g: { dimension: 'weight', factor: 1, label: 'grams', short: 'g', system: 'metric' },
  kg: { dimension: 'weight', factor: 1000, label: 'kilograms', short: 'kg', system: 'metric' },
  oz: { dimension: 'weight', factor: 28.349523125, label: 'ounces', short: 'oz', system: 'us' },
  lb: { dimension: 'weight', factor: 453.59237, label: 'pounds', short: 'lb', system: 'us' },
  ml: { dimension: 'volume', factor: 1, label: 'millilitres', short: 'ml', system: 'metric' },
  l: { dimension: 'volume', factor: 1000, label: 'litres', short: 'L', system: 'metric' },
  tsp: { dimension: 'volume', factor: 4.92892159375, label: 'teaspoons', short: 'tsp', system: 'us' },
  tbsp: { dimension: 'volume', factor: 14.78676478125, label: 'tablespoons', short: 'tbsp', system: 'us' },
  cup: { dimension: 'volume', factor: ML_PER_US_CUP, label: 'US cups', short: 'cup', system: 'us' },
  floz: { dimension: 'volume', factor: 29.5735295625, label: 'US fluid ounces', short: 'fl oz', system: 'us' },
  pint: { dimension: 'volume', factor: 473.176473, label: 'US pints', short: 'pt', system: 'us' },
  quart: { dimension: 'volume', factor: 946.352946, label: 'US quarts', short: 'qt', system: 'us' },
  c: { dimension: 'temperature', label: 'Celsius', short: '°C', system: 'metric' },
  f: { dimension: 'temperature', label: 'Fahrenheit', short: '°F', system: 'us' },
}

export const CONVERTER_UNITS = [
  { value: 'g', group: 'Weight', label: 'Grams (g)' },
  { value: 'kg', group: 'Weight', label: 'Kilograms (kg)' },
  { value: 'oz', group: 'Weight', label: 'Ounces (oz)' },
  { value: 'lb', group: 'Weight', label: 'Pounds (lb)' },
  { value: 'ml', group: 'Volume', label: 'Millilitres (ml)' },
  { value: 'l', group: 'Volume', label: 'Litres (L)' },
  { value: 'tsp', group: 'Volume', label: 'Teaspoons (tsp)' },
  { value: 'tbsp', group: 'Volume', label: 'Tablespoons (tbsp)' },
  { value: 'cup', group: 'Volume', label: 'US cups' },
  { value: 'floz', group: 'Volume', label: 'US fluid ounces (fl oz)' },
  { value: 'pint', group: 'Volume', label: 'US pints (pt)' },
  { value: 'quart', group: 'Volume', label: 'US quarts (qt)' },
  { value: 'c', group: 'Temperature', label: 'Celsius (°C)' },
  { value: 'f', group: 'Temperature', label: 'Fahrenheit (°F)' },
]

const UNIT_ALIASES = [
  ['tablespoons', 'tbsp'], ['tablespoon', 'tbsp'], ['tbsps', 'tbsp'], ['tbsp', 'tbsp'], ['tbs', 'tbsp'],
  ['teaspoons', 'tsp'], ['teaspoon', 'tsp'], ['tsps', 'tsp'], ['tsp', 'tsp'],
  ['fluid ounces', 'floz'], ['fluid ounce', 'floz'], ['fl. oz.', 'floz'], ['fl oz', 'floz'], ['floz', 'floz'],
  ['kilograms', 'kg'], ['kilogram', 'kg'], ['kilos', 'kg'], ['kilo', 'kg'], ['kg', 'kg'],
  ['millilitres', 'ml'], ['milliliters', 'ml'], ['millilitre', 'ml'], ['milliliter', 'ml'], ['ml', 'ml'],
  ['litres', 'l'], ['liters', 'l'], ['litre', 'l'], ['liter', 'l'], ['l', 'l'],
  ['pounds', 'lb'], ['pound', 'lb'], ['lbs', 'lb'], ['lb', 'lb'],
  ['ounces', 'oz'], ['ounce', 'oz'], ['oz', 'oz'],
  ['grams', 'g'], ['gram', 'g'], ['g', 'g'],
  ['quarts', 'quart'], ['quart', 'quart'], ['qts', 'quart'], ['qt', 'quart'],
  ['pints', 'pint'], ['pint', 'pint'], ['pts', 'pint'], ['pt', 'pint'],
  ['cups', 'cup'], ['cup', 'cup'], ['c.', 'cup'], ['c', 'cup'],
  ['celsius', 'c'], ['fahrenheit', 'f'],
  ['°c', 'c'], ['°f', 'f'],
]

const UNICODE_FRACTION_CHARS = '¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞'
const QUANTITY_PATTERN = `(?:\\d+\\s+\\d+\\/\\d+|\\d+\\s+[${UNICODE_FRACTION_CHARS}]|\\d+\\/\\d+|\\d+(?:\\.\\d+)?[${UNICODE_FRACTION_CHARS}]?|[${UNICODE_FRACTION_CHARS}]|\\d+(?:\\.\\d+)?)`
const UNIT_PATTERN = UNIT_ALIASES
  .map(([alias]) => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .sort((a, b) => b.length - a.length)
  .join('|')
const LEADING_MEASUREMENT_RE = new RegExp(`^(${QUANTITY_PATTERN})\\s*(${UNIT_PATTERN})(?=\\s|$|[,.;:)])\\s*(.*)$`, 'i')
const LEADING_RANGE_MEASUREMENT_RE = new RegExp(`^(${QUANTITY_PATTERN})\\s*(?:-|–|—|to)\\s*(${QUANTITY_PATTERN})\\s*(${UNIT_PATTERN})(?=\\s|$|[,.;:)])\\s*(.*)$`, 'i')

function canonicalUnit(raw) {
  const normalised = raw.toLowerCase().trim().replace(/\s+/g, ' ')
  const entry = UNIT_ALIASES.find(([alias]) => alias === normalised)
  return entry?.[1] || null
}

function ambiguousCupShorthand(rawUnit, remainder) {
  // "180 C" and "180 C fan" may be temperatures. Only read a bare c
  // as cups when it has an ingredient description, and leave ambiguity intact.
  return /^c\.?$/i.test(rawUnit)
    && (!remainder.trim() || /^[\s,;]*(?:fan|convection|oven|for|until)\b/i.test(remainder))
}

function entriesFor(dataset) {
  return Array.isArray(dataset?.entries) ? dataset.entries : []
}

function isBoundaryCharacter(char) {
  return !char || !/[a-z0-9]/i.test(char)
}

function textContainsIngredient(haystack, needle) {
  let fromIndex = 0
  while (fromIndex <= haystack.length - needle.length) {
    const index = haystack.indexOf(needle, fromIndex)
    if (index === -1) return false
    const before = index === 0 ? '' : haystack[index - 1]
    const afterIndex = index + needle.length
    const after = afterIndex >= haystack.length ? '' : haystack[afterIndex]
    if (isBoundaryCharacter(before) && isBoundaryCharacter(after)) return true
    fromIndex = index + 1
  }
  return false
}

export function findConversionEntry(dataset, ingredientText) {
  const query = String(ingredientText || '').trim().toLowerCase()
  if (!query) return null

  const entries = entriesFor(dataset)
  const exact = entries.find((entry) => entry.name === query)
  if (exact) return exact

  let best = null
  for (const entry of entries) {
    if (entry.name.startsWith('default')) continue
    if (!textContainsIngredient(query, entry.name)) continue
    if (!best || entry.name.length > best.name.length) best = entry
  }
  return best
}

export function detectIngredient(text, dataset) {
  return findConversionEntry(dataset, text)
}

export function conversionIngredientNames(dataset, { weightVolumeOnly = false } = {}) {
  return entriesFor(dataset)
    .filter((entry) => !entry.name.startsWith('default'))
    .filter((entry) => !weightVolumeOnly || entry.cupToGrams)
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
}

function cupsFromVolume(amount, unit) {
  const def = UNIT_DEFS[unit]
  if (!def || def.dimension !== 'volume') return null
  return (amount * def.factor) / ML_PER_US_CUP
}

function volumeFromCups(cups, unit) {
  const def = UNIT_DEFS[unit]
  if (!def || def.dimension !== 'volume') return null
  return (cups * ML_PER_US_CUP) / def.factor
}

export function convertMeasurement(amountInput, fromUnit, toUnit, ingredientText = '', dataset = null) {
  const amount = typeof amountInput === 'number' ? amountInput : parseQuantity(String(amountInput))
  const from = UNIT_DEFS[fromUnit]
  const to = UNIT_DEFS[toUnit]

  if (amount == null || !Number.isFinite(amount)) return { ok: false, reason: 'Enter a valid amount.' }
  if (!from || !to) return { ok: false, reason: 'Choose both units.' }

  if (from.dimension === 'temperature' || to.dimension === 'temperature') {
    if (from.dimension !== 'temperature' || to.dimension !== 'temperature') {
      return { ok: false, reason: 'Temperature can only be converted to another temperature unit.' }
    }
    const value = fromUnit === toUnit ? amount : fromUnit === 'f' ? (amount - 32) * 5 / 9 : amount * 9 / 5 + 32
    return { ok: true, value, approximate: false, ingredient: null }
  }

  if (from.dimension === to.dimension) {
    const base = amount * from.factor
    return { ok: true, value: base / to.factor, approximate: false, ingredient: null }
  }

  const crossesWeightVolume = new Set([from.dimension, to.dimension]).size === 2
    && [from.dimension, to.dimension].every((dimension) => ['weight', 'volume'].includes(dimension))
  if (!crossesWeightVolume) return { ok: false, reason: 'Those units measure different things.' }
  if (!dataset) return { ok: false, reason: 'Loading Savor’s ingredient conversion library…', needsIngredientData: true }

  const ingredient = findConversionEntry(dataset, ingredientText)
  if (!ingredient) return { ok: false, reason: 'Choose an ingredient to convert between volume and weight.', needsIngredient: true }
  if (!ingredient.cupToGrams) {
    return {
      ok: false,
      reason: `Savor does not have a volume-to-weight value for ${ingredient.name} yet.`,
      needsIngredient: true,
      ingredient,
    }
  }

  let value
  if (from.dimension === 'volume') {
    const cups = cupsFromVolume(amount, fromUnit)
    const grams = cups * ingredient.cupToGrams
    value = grams / to.factor
  } else {
    const grams = amount * from.factor
    const cups = grams / ingredient.cupToGrams
    value = volumeFromCups(cups, toUnit)
  }

  return { ok: true, value, approximate: true, ingredient }
}

const KITCHEN_FRACTIONS = [
  [1 / 8, '1/8'],
  [1 / 4, '1/4'],
  [1 / 3, '1/3'],
  [1 / 2, '1/2'],
  [2 / 3, '2/3'],
  [3 / 4, '3/4'],
  [7 / 8, '7/8'],
]

function formatKitchenMeasure(value) {
  const sign = value < 0 ? '-' : ''
  const absolute = Math.abs(value)
  const whole = Math.floor(absolute)
  const fraction = absolute - whole
  if (fraction < 0.06) return `${sign}${whole}`
  if (fraction > 0.94) return `${sign}${whole + 1}`

  let best = KITCHEN_FRACTIONS[0]
  let bestDiff = Infinity
  for (const candidate of KITCHEN_FRACTIONS) {
    const diff = Math.abs(candidate[0] - fraction)
    if (diff < bestDiff) {
      best = candidate
      bestDiff = diff
    }
  }
  return `${sign}${whole ? `${whole} ` : ''}${best[1]}`
}

export function formatConvertedValue(value, unit) {
  if (!Number.isFinite(value)) return ''
  if (['cup', 'tsp', 'tbsp'].includes(unit) && Math.abs(value) < 12) return formatKitchenMeasure(value)
  if (['c', 'f'].includes(unit)) return String(Number(value.toFixed(1)))
  if (Math.abs(value) >= 100) return String(Number(value.toFixed(0)))
  if (Math.abs(value) >= 10) return String(Number(value.toFixed(1)))
  return String(Number(value.toFixed(2)))
}

export function unitShortLabel(unit) {
  return UNIT_DEFS[unit]?.short || unit
}

function toMetric(amount, unit, ingredient) {
  const def = UNIT_DEFS[unit]
  if (!def) return null

  if (def.dimension === 'weight') {
    const grams = amount * def.factor
    if (Math.abs(grams) >= 1000) return { value: grams / 1000, unit: 'kg', approximate: false }
    return { value: grams, unit: 'g', approximate: false }
  }

  if (def.dimension === 'volume') {
    const cups = cupsFromVolume(amount, unit)
    if (ingredient?.cupToMl) {
      const ml = cups * ingredient.cupToMl
      if (Math.abs(ml) >= 1000) return { value: ml / 1000, unit: 'l', approximate: false }
      return { value: ml, unit: 'ml', approximate: false }
    }
    if (ingredient?.cupToGrams) {
      return { value: cups * ingredient.cupToGrams, unit: 'g', approximate: true }
    }
    const ml = amount * def.factor
    if (Math.abs(ml) >= 1000) return { value: ml / 1000, unit: 'l', approximate: false }
    return { value: ml, unit: 'ml', approximate: false }
  }

  return null
}

function chooseUsVolumeFromCups(cups) {
  if (Math.abs(cups) >= 0.25) return { value: cups, unit: 'cup' }
  const tbsp = cups * 16
  if (Math.abs(tbsp) >= 1) return { value: tbsp, unit: 'tbsp' }
  return { value: cups * 48, unit: 'tsp' }
}

function chooseUsVolumeFromMl(ml) {
  return chooseUsVolumeFromCups(ml / ML_PER_US_CUP)
}

function toUs(amount, unit, ingredient) {
  const def = UNIT_DEFS[unit]
  if (!def) return null

  if (def.dimension === 'volume') {
    const ml = amount * def.factor
    if (ingredient?.cupToMl) {
      return { ...chooseUsVolumeFromCups(ml / ingredient.cupToMl), approximate: false }
    }
    return { ...chooseUsVolumeFromMl(ml), approximate: false }
  }

  if (def.dimension === 'weight') {
    const grams = amount * def.factor
    if (ingredient?.cupToGrams) {
      return { ...chooseUsVolumeFromCups(grams / ingredient.cupToGrams), approximate: true }
    }
    const ounces = grams / UNIT_DEFS.oz.factor
    if (Math.abs(ounces) >= 16) return { value: ounces / 16, unit: 'lb', approximate: false }
    return { value: ounces, unit: 'oz', approximate: false }
  }

  return null
}

function roundCookingTemperature(value) {
  return Math.round(value / 5) * 5
}

function convertTemperaturesInText(text, targetSystem) {
  let output = text
  if (targetSystem === 'metric') {
    output = output.replace(/(-?\d+(?:\.\d+)?)\s*°?\s*f(?:ahrenheit)?\b/gi, (_, raw) => {
      const c = (Number(raw) - 32) * 5 / 9
      return `${roundCookingTemperature(c)}°C`
    })
  } else {
    // A bare "c" is also a common cup abbreviation. Require an explicit
    // temperature marker, or an instruction such as "bake at 180 C".
    output = output.replace(/(-?\d+(?:\.\d+)?)\s*(?:°\s*c\b|celsius\b|degrees?\s*c(?:elsius)?\b)/gi, (_, raw) => {
      const f = Number(raw) * 9 / 5 + 32
      return `${roundCookingTemperature(f)}°F`
    })
    output = output.replace(/(\b(?:at|to)\s+)(-?\d+(?:\.\d+)?)\s*c\b/gi, (_, prefix, raw) => {
      const f = Number(raw) * 9 / 5 + 32
      return `${prefix}${roundCookingTemperature(f)}°F`
    })
  }
  return output
}

function convertRecipeLine(line, targetSystem, dataset) {
  const prefixMatch = line.match(/^(\s*(?:[-*•]\s+)?)?/)
  const prefix = prefixMatch?.[0] || ''
  const content = line.slice(prefix.length)

  const rangeMatch = content.match(LEADING_RANGE_MEASUREMENT_RE)
  if (rangeMatch) {
    const low = parseQuantity(rangeMatch[1])
    const high = parseQuantity(rangeMatch[2])
    const unit = canonicalUnit(rangeMatch[3])
    const remainder = rangeMatch[4] || ''
    if (low != null && high != null && unit && !ambiguousCupShorthand(rangeMatch[3], remainder) && UNIT_DEFS[unit]?.dimension !== 'temperature') {
      const sourceDef = UNIT_DEFS[unit]
      if (sourceDef.system !== targetSystem) {
        const ingredient = detectIngredient(remainder, dataset)
        const convert = targetSystem === 'metric' ? toMetric : toUs
        const lowResult = convert(low, unit, ingredient)
        const highResult = convert(high, unit, ingredient)
        if (lowResult && highResult && lowResult.unit === highResult.unit) {
          const output = `${prefix}${formatConvertedValue(lowResult.value, lowResult.unit)}–${formatConvertedValue(highResult.value, highResult.unit)} ${unitShortLabel(lowResult.unit)}${remainder ? ` ${remainder}` : ''}`.trimEnd()
          return {
            output: convertTemperaturesInText(output, targetSystem),
            converted: true,
            approximate: lowResult.approximate || highResult.approximate,
          }
        }
      }
    }
  }

  const match = content.match(LEADING_MEASUREMENT_RE)
  if (!match) return { output: convertTemperaturesInText(line, targetSystem), converted: false, approximate: false }

  const amount = parseQuantity(match[1])
  const unit = canonicalUnit(match[2])
  const remainder = match[3] || ''
  if (amount == null || !unit || ambiguousCupShorthand(match[2], remainder) || UNIT_DEFS[unit]?.dimension === 'temperature') {
    return { output: convertTemperaturesInText(line, targetSystem), converted: false, approximate: false }
  }

  const sourceDef = UNIT_DEFS[unit]
  if (sourceDef.system === targetSystem) return { output: convertTemperaturesInText(line, targetSystem), converted: false, approximate: false }

  const ingredient = detectIngredient(remainder, dataset)
  const result = targetSystem === 'metric' ? toMetric(amount, unit, ingredient) : toUs(amount, unit, ingredient)
  if (!result) return { output: convertTemperaturesInText(line, targetSystem), converted: false, approximate: false }

  const formatted = formatConvertedValue(result.value, result.unit)
  const separator = remainder ? ' ' : ''
  const output = `${prefix}${formatted} ${unitShortLabel(result.unit)}${separator}${remainder}`.trimEnd()
  return { output: convertTemperaturesInText(output, targetSystem), converted: true, approximate: result.approximate }
}

export function convertRecipeText(text, targetSystem = 'metric', dataset = null) {
  let convertedCount = 0
  let approximateCount = 0
  const lines = String(text || '').split('\n').map((line) => {
    const result = convertRecipeLine(line, targetSystem, dataset)
    if (result.converted) convertedCount += 1
    if (result.approximate) approximateCount += 1
    return result.output
  })

  return {
    output: lines.join('\n'),
    convertedCount,
    approximateCount,
  }
}
