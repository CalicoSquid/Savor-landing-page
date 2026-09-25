const UNICODE_FRACTIONS = {
  '¼': 1 / 4,
  '½': 1 / 2,
  '¾': 3 / 4,
  '⅐': 1 / 7,
  '⅑': 1 / 9,
  '⅒': 1 / 10,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅕': 1 / 5,
  '⅖': 2 / 5,
  '⅗': 3 / 5,
  '⅘': 4 / 5,
  '⅙': 1 / 6,
  '⅚': 5 / 6,
  '⅛': 1 / 8,
  '⅜': 3 / 8,
  '⅝': 5 / 8,
  '⅞': 7 / 8,
}

const UNICODE_FRACTION_CHARS = Object.keys(UNICODE_FRACTIONS).join('')
const QUANTITY_PATTERN = `(?:\\d+\\s+\\d+\\/\\d+|\\d+\\s+[${UNICODE_FRACTION_CHARS}]|\\d+\\/\\d+|\\d+(?:\\.\\d+)?[${UNICODE_FRACTION_CHARS}]?|[${UNICODE_FRACTION_CHARS}]|\\d+(?:\\.\\d+)?)`
const RANGE_RE = new RegExp(`^(${QUANTITY_PATTERN})\\s*(?:-|–|—|to)\\s*(${QUANTITY_PATTERN})(.*)$`, 'i')
const SINGLE_RE = new RegExp(`^(${QUANTITY_PATTERN})(.*)$`)
const MEASURE_UNIT_PATTERN = '(?:cups?|c|tablespoons?|tbsp|teaspoons?|tsp|kilograms?|kg|grams?|g|pounds?|lbs?|ounces?|oz|millilit(?:re|er)s?|ml|lit(?:re|er)s?|l|fl\\.?\\s*oz\\.?)'
const MEASURE_UNIT_RE = new RegExp(`^\\s*${MEASURE_UNIT_PATTERN}(?=\\s|[.(]|$)\\.?`, 'i')
const EQUIVALENT_RE = new RegExp(`^(\\s*[([]\\s*)(${QUANTITY_PATTERN})(\\s*${MEASURE_UNIT_PATTERN}\\s*[)\\]])`, 'i')
const EXTRA_QUANTITY_RE = new RegExp(`[0-9${UNICODE_FRACTION_CHARS}]`)

const FRIENDLY_DENOMINATORS = [2, 3, 4, 8, 16]

function gcd(a, b) {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const next = x % y
    x = y
    y = next
  }
  return x || 1
}

export function parseQuantity(token) {
  const value = token.trim()
  if (!value) return null

  const unicode = value.match(new RegExp(`^(\\d+(?:\\.\\d+)?)?\\s*([${UNICODE_FRACTION_CHARS}])$`))
  if (unicode) {
    const whole = unicode[1] ? Number(unicode[1]) : 0
    return whole + UNICODE_FRACTIONS[unicode[2]]
  }

  const mixed = value.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (mixed) {
    const denominator = Number(mixed[3])
    if (!denominator) return null
    return Number(mixed[1]) + Number(mixed[2]) / denominator
  }

  const fraction = value.match(/^(\d+)\/(\d+)$/)
  if (fraction) {
    const denominator = Number(fraction[2])
    if (!denominator) return null
    return Number(fraction[1]) / denominator
  }

  const decimal = Number(value)
  return Number.isFinite(decimal) ? decimal : null
}

function formatDecimal(value) {
  if (Math.abs(value - Math.round(value)) < 0.0001) return String(Math.round(value))
  return String(Number(value.toFixed(2)))
}

export function formatQuantity(value) {
  if (!Number.isFinite(value)) return ''
  if (value === 0) return '0'

  const sign = value < 0 ? '-' : ''
  const absolute = Math.abs(value)

  // Large gram/ml-style values read better as ordinary decimals than kitchen fractions.
  if (absolute >= 10) return `${sign}${formatDecimal(absolute)}`

  const whole = Math.floor(absolute + 1e-9)
  const fraction = absolute - whole
  if (fraction < 0.015) return `${sign}${whole}`
  if (1 - fraction < 0.015) return `${sign}${whole + 1}`

  let best = null
  for (const denominator of FRIENDLY_DENOMINATORS) {
    const numerator = Math.round(fraction * denominator)
    if (numerator <= 0 || numerator >= denominator) continue
    const error = Math.abs(fraction - numerator / denominator)
    if (!best || error < best.error) best = { numerator, denominator, error }
  }

  // Only show a fraction when it is genuinely close; otherwise retain a useful decimal.
  if (!best || best.error > 0.018) return `${sign}${formatDecimal(absolute)}`

  const divisor = gcd(best.numerator, best.denominator)
  const numerator = best.numerator / divisor
  const denominator = best.denominator / divisor
  const fractionText = `${numerator}/${denominator}`
  return `${sign}${whole ? `${whole} ` : ''}${fractionText}`
}

function scaleRemainder(remainder, factor) {
  // Scale a bracketed equivalent only after a measured amount, e.g.
  // "1 cup (125 g)". In "2 (400 g) tins", 400 g is the package size.
  const unit = remainder.match(MEASURE_UNIT_RE)
  const equivalent = unit && remainder.slice(unit[0].length).match(EQUIVALENT_RE)
  if (equivalent) {
    const amount = parseQuantity(equivalent[2])
    if (amount != null) {
      const tail = remainder.slice(unit[0].length + equivalent[0].length)
      return {
        output: `${unit[0]}${equivalent[1]}${formatQuantity(amount * factor)}${equivalent[3]}${tail}`,
        needsReview: EXTRA_QUANTITY_RE.test(tail),
      }
    }
  }
  return { output: remainder, needsReview: EXTRA_QUANTITY_RE.test(remainder) }
}

function scaleLine(line, factor) {
  const prefixMatch = line.match(/^(\s*(?:[-*•]\s+)?)?/)
  const prefix = prefixMatch?.[0] || ''
  const content = line.slice(prefix.length)
  if (!content) return { output: line, scaled: false, sourceAmount: null, scaledAmount: null }

  const range = content.match(RANGE_RE)
  if (range) {
    const low = parseQuantity(range[1])
    const high = parseQuantity(range[2])
    if (low == null || high == null) return { output: line, scaled: false, sourceAmount: null, scaledAmount: null }
    const scaledLow = low * factor
    const scaledHigh = high * factor
    const remainder = scaleRemainder(range[3], factor)
    return {
      output: `${prefix}${formatQuantity(scaledLow)}–${formatQuantity(scaledHigh)}${remainder.output}`,
      scaled: true,
      needsReview: remainder.needsReview,
      sourceAmount: [low, high],
      scaledAmount: [scaledLow, scaledHigh],
    }
  }

  const single = content.match(SINGLE_RE)
  if (!single) return { output: line, scaled: false, sourceAmount: null, scaledAmount: null }

  const amount = parseQuantity(single[1])
  if (amount == null) return { output: line, scaled: false, sourceAmount: null, scaledAmount: null }

  const scaledAmount = amount * factor
  const remainder = scaleRemainder(single[2], factor)
  return {
    output: `${prefix}${formatQuantity(scaledAmount)}${remainder.output}`,
    scaled: true,
    needsReview: remainder.needsReview,
    sourceAmount: amount,
    scaledAmount,
  }
}

export function scaleIngredientList(text, originalServings, targetServings) {
  const original = Number(originalServings)
  const target = Number(targetServings)
  const factor = original > 0 && target > 0 ? target / original : 1
  const lines = String(text || '').split('\n')
  let scaledCount = 0
  let unchangedCount = 0
  let fractionalEgg = false
  const reviewLines = []

  const results = lines.map((line, index) => {
    const result = scaleLine(line, factor)
    if (result.needsReview && factor !== 1) reviewLines.push(index + 1)
    if (line.trim()) {
      if (result.scaled) scaledCount += 1
      else unchangedCount += 1
    }

    if (result.scaled && /\beggs?\b/i.test(line)) {
      const amounts = Array.isArray(result.scaledAmount) ? result.scaledAmount : [result.scaledAmount]
      if (amounts.some((amount) => Math.abs(amount - Math.round(amount)) > 0.02)) fractionalEgg = true
    }

    return result.output
  })

  return {
    factor,
    output: results.join('\n'),
    scaledCount,
    unchangedCount,
    fractionalEgg,
    reviewLines,
  }
}

export function buildScalingNotes(text, factor, fractionalEgg) {
  const notes = []
  const ingredients = String(text || '').toLowerCase()

  if (factor > 1.05 && /\b(salt|pepper|chilli|chili|cayenne|vinegar|lemon|lime|soy sauce|fish sauce)\b/.test(ingredients)) {
    notes.push('Add seasoning, chilli and acidic ingredients in stages, tasting as you go.')
  }

  if (fractionalEgg) {
    notes.push('For a partial egg, beat it first, then measure the amount you need by weight or volume.')
  }

  if (/\b(flour|baking powder|baking soda|bicarbonate|cake|brownies?|bread|dough|batter)\b/.test(ingredients)) {
    notes.push('When baking, check pan area and batter depth as well as ingredient amounts.')
  }

  if (Math.abs(factor - 1) > 0.01) {
    notes.push('Cooking time does not scale with the multiplier. Use the original time as a first checkpoint, then cook to colour, texture or temperature.')
  }

  return notes
}
