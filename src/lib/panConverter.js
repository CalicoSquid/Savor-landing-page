const CM_PER_INCH = 2.54

export const PAN_PRESETS = [
  { value: 'round-8in', label: '8-inch round', shape: 'round', diameterCm: 8 * CM_PER_INCH },
  { value: 'round-9in', label: '9-inch round', shape: 'round', diameterCm: 9 * CM_PER_INCH },
  { value: 'round-10in', label: '10-inch round', shape: 'round', diameterCm: 10 * CM_PER_INCH },
  { value: 'round-20cm', label: '20 cm round', shape: 'round', diameterCm: 20 },
  { value: 'round-23cm', label: '23 cm round', shape: 'round', diameterCm: 23 },
  { value: 'round-25cm', label: '25 cm round', shape: 'round', diameterCm: 25 },
  { value: 'square-8in', label: '8-inch square', shape: 'square', widthCm: 8 * CM_PER_INCH },
  { value: 'square-9in', label: '9-inch square', shape: 'square', widthCm: 9 * CM_PER_INCH },
  { value: 'square-20cm', label: '20 cm square', shape: 'square', widthCm: 20 },
  { value: 'square-23cm', label: '23 cm square', shape: 'square', widthCm: 23 },
  { value: 'rect-9x13in', label: '9 × 13-inch rectangle', shape: 'rectangle', widthCm: 9 * CM_PER_INCH, lengthCm: 13 * CM_PER_INCH },
  { value: 'rect-23x33cm', label: '23 × 33 cm rectangle', shape: 'rectangle', widthCm: 23, lengthCm: 33 },
  { value: 'loaf-8.5x4.5in', label: '8½ × 4½-inch loaf tin', shape: 'rectangle', kind: 'loaf', widthCm: 4.5 * CM_PER_INCH, lengthCm: 8.5 * CM_PER_INCH, approximate: true },
  { value: 'loaf-9x5in', label: '9 × 5-inch loaf tin', shape: 'rectangle', kind: 'loaf', widthCm: 5 * CM_PER_INCH, lengthCm: 9 * CM_PER_INCH, approximate: true },
  { value: 'loaf-22x12cm', label: '22 × 12 cm loaf tin', shape: 'rectangle', kind: 'loaf', widthCm: 12, lengthCm: 22, approximate: true },
  { value: 'quarter-sheet', label: 'Quarter sheet — 9 × 13 in', shape: 'rectangle', kind: 'sheet', widthCm: 9 * CM_PER_INCH, lengthCm: 13 * CM_PER_INCH, approximate: true },
  { value: 'half-sheet', label: 'Half sheet — 13 × 18 in', shape: 'rectangle', kind: 'sheet', widthCm: 13 * CM_PER_INCH, lengthCm: 18 * CM_PER_INCH, approximate: true },
]

export function convertLength(value, fromUnit = 'in', toUnit = 'cm') {
  const number = Number(value)
  if (!Number.isFinite(number)) return null
  if (fromUnit === toUnit) return number
  if (fromUnit === 'in' && toUnit === 'cm') return number * CM_PER_INCH
  if (fromUnit === 'cm' && toUnit === 'in') return number / CM_PER_INCH
  return null
}

export function formatDimension(value) {
  if (!Number.isFinite(value)) return ''
  if (Math.abs(value - Math.round(value)) < 0.001) return String(Math.round(value))
  return String(Number(value.toFixed(2)))
}

export function presetToPan(presetValue, unit = 'in') {
  const preset = PAN_PRESETS.find((item) => item.value === presetValue)
  if (!preset) return null
  const convert = (cm) => formatDimension(convertLength(cm, 'cm', unit))
  return {
    preset: preset.value,
    shape: preset.shape,
    kind: preset.kind || preset.shape,
    approximate: Boolean(preset.approximate),
    diameter: preset.diameterCm ? convert(preset.diameterCm) : '',
    width: preset.widthCm ? convert(preset.widthCm) : '',
    length: preset.lengthCm ? convert(preset.lengthCm) : '',
  }
}

export function panArea(pan, unit = 'in') {
  if (!pan) return null
  const toCm = (value) => convertLength(value, unit, 'cm')

  if (pan.shape === 'round') {
    const diameter = toCm(pan.diameter)
    if (!(diameter > 0)) return null
    const radius = diameter / 2
    return Math.PI * radius * radius
  }

  if (pan.shape === 'square') {
    const width = toCm(pan.width)
    if (!(width > 0)) return null
    return width * width
  }

  if (pan.shape === 'rectangle') {
    const width = toCm(pan.width)
    const length = toCm(pan.length)
    if (!(width > 0) || !(length > 0)) return null
    return width * length
  }

  return null
}

export function comparePans(sourcePan, targetPan, unit = 'in') {
  const sourceArea = panArea(sourcePan, unit)
  const targetArea = panArea(targetPan, unit)
  if (!(sourceArea > 0) || !(targetArea > 0)) {
    return { ok: false, reason: 'Enter valid dimensions for both pans.' }
  }

  const multiplier = targetArea / sourceArea
  const unscaledDepthRatio = sourceArea / targetArea
  const batterChangePercent = (multiplier - 1) * 100
  const unscaledDepthChangePercent = (unscaledDepthRatio - 1) * 100
  const panKinds = new Set([sourcePan.kind, targetPan.kind])
  const approximate = Boolean(sourcePan.approximate || targetPan.approximate || panKinds.has('loaf') || panKinds.has('sheet'))
  let caveat = ''
  if (panKinds.has('loaf')) caveat = 'Loaf tins vary in side slope and depth, so footprint area is only a practical estimate. Compare actual capacity when you need precision.'
  if (panKinds.has('sheet')) caveat = `${caveat ? `${caveat} ` : ''}Sheet pans and baking dishes can share the same footprint while having very different depths, so check that the new pan can safely hold the batter.`

  return {
    ok: true,
    sourceArea,
    targetArea,
    multiplier,
    unscaledDepthRatio,
    batterChangePercent,
    unscaledDepthChangePercent,
    approximate,
    caveat,
  }
}

export function formatArea(areaCm2, unit = 'in') {
  if (!Number.isFinite(areaCm2)) return ''
  if (unit === 'cm') return `${Math.round(areaCm2)} cm²`
  const inches2 = areaCm2 / (CM_PER_INCH * CM_PER_INCH)
  return `${Number(inches2.toFixed(1))} in²`
}

export function panResultCopy(result) {
  if (!result?.ok) return null
  const difference = Math.abs(result.batterChangePercent)
  let action = 'Use essentially the same amount of batter.'
  if (difference >= 2) {
    action = result.multiplier > 1
      ? `Make about ${Math.round(difference)}% more batter.`
      : `Make about ${Math.round(difference)}% less batter.`
  }

  const depthDifference = Math.abs(result.unscaledDepthChangePercent)
  let depth = 'Using the original recipe would give almost the same batter depth.'
  let timing = 'Bake time should be in roughly the same territory, but check doneness rather than scaling the clock.'

  if (depthDifference >= 3) {
    if (result.unscaledDepthChangePercent < 0) {
      depth = `Without scaling, the batter would sit about ${Math.round(depthDifference)}% shallower in the new pan.`
      timing = 'A shallower layer can bake faster. Start checking before the original recipe time rather than trying to calculate a new bake time.'
    } else {
      depth = `Without scaling, the batter would sit about ${Math.round(depthDifference)}% deeper in the new pan.`
      timing = 'A deeper layer can take longer and may overflow if the pan is too full. Scale the batter down or use another pan.'
    }
  }

  return { action, depth, timing }
}

export function describeMultiplier(multiplier) {
  if (!Number.isFinite(multiplier)) return ''
  if (Math.abs(multiplier - 1) < 0.005) return '1×'
  return `${Number(multiplier.toFixed(2))}×`
}
