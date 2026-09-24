const GRAMS_PER_OUNCE = 28.349523125
const GRAMS_PER_POUND = 453.59237
const ML_PER_FL_OZ = 29.5735295625
const ML_PER_QUART = 946.352946

export const PORTION_FOODS = [
  {
    id: 'pasta-dry',
    name: 'Pasta',
    detail: 'dry weight',
    category: 'Carbs',
    unit: 'g',
    portions: { main: 100, side: 60, buffet: 65 },
    note: 'Use dry pasta weight. Fresh or filled pasta needs a little more by weight.',
  },
  {
    id: 'rice-dry',
    name: 'Rice',
    detail: 'dry weight',
    category: 'Carbs',
    unit: 'g',
    portions: { main: 90, side: 60, buffet: 60 },
    note: 'Use uncooked rice weight. Long-grain, basmati and jasmine all land in roughly this territory.',
  },
  {
    id: 'potatoes',
    name: 'Potatoes',
    detail: 'raw weight',
    category: 'Carbs',
    unit: 'g',
    portions: { main: 300, side: 200, buffet: 180 },
    note: 'Use raw weight before peeling. Add a little extra if you expect heavy trimming or peeling loss.',
  },
  {
    id: 'boneless-meat',
    name: 'Boneless meat',
    detail: 'raw trimmed weight',
    category: 'Protein',
    unit: 'g',
    portions: { main: 200, side: 130, buffet: 120 },
    note: 'Think boneless chicken, pork, beef or lamb. This is raw trimmed weight before cooking loss.',
  },
  {
    id: 'bone-in-meat',
    name: 'Bone-in meat',
    detail: 'raw weight',
    category: 'Protein',
    unit: 'g',
    portions: { main: 300, side: 200, buffet: 180 },
    note: 'The bone is included in the weight, so this allowance is deliberately higher than boneless meat.',
  },
  {
    id: 'fish',
    name: 'Fish fillets',
    detail: 'raw weight',
    category: 'Protein',
    unit: 'g',
    portions: { main: 180, side: 120, buffet: 110 },
    note: 'For boneless fillets. Whole fish needs extra allowance for bones, head and trimming.',
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    detail: 'prepared/raw weight',
    category: 'Sides',
    unit: 'g',
    portions: { main: 275, side: 150, buffet: 110 },
    note: 'A mixed vegetable side varies a lot by density. This is a practical planning number, not a nutrition target.',
  },
  {
    id: 'salad',
    name: 'Leafy salad',
    detail: 'prepared weight',
    category: 'Sides',
    unit: 'g',
    portions: { main: 180, side: 90, buffet: 70 },
    note: 'Prepared salad weight, including the bulk ingredients but not a large amount of dressing.',
  },
  {
    id: 'bread',
    name: 'Bread',
    detail: 'ready-to-serve weight',
    category: 'Sides',
    unit: 'g',
    portions: { main: 110, side: 60, buffet: 55 },
    note: 'Roughly two modest slices or a small roll per adult at the side-dish setting.',
  },
  {
    id: 'soup',
    name: 'Soup',
    detail: 'finished volume',
    category: 'Other',
    unit: 'ml',
    portions: { main: 450, side: 250, buffet: 220 },
    note: 'Finished soup volume. Thick soups can feel more substantial than broths at the same volume.',
  },
  {
    id: 'sauce-gravy',
    name: 'Sauce or gravy',
    detail: 'finished volume',
    category: 'Other',
    unit: 'ml',
    portions: { main: 100, side: 75, buffet: 60 },
    note: 'For pourable sauces or gravy served at the table. Very rich sauces usually need less.',
  },
  {
    id: 'cheese-board',
    name: 'Cheese board',
    detail: 'cheese weight',
    category: 'Other',
    unit: 'g',
    portions: { main: 150, side: 80, buffet: 70 },
    note: 'Cheese only. If it is part of a large grazing table with meat, dips and snacks, use the buffet setting.',
  },
]

export const PORTION_ROLES = {
  main: {
    label: 'Main part of the meal',
    shortLabel: 'Main',
    description: 'This food is doing most of the work on the plate.',
  },
  side: {
    label: 'Side dish',
    shortLabel: 'Side',
    description: 'One normal side alongside a main dish.',
  },
  buffet: {
    label: 'Buffet / several dishes',
    shortLabel: 'Buffet',
    description: 'People are choosing from several different foods.',
  },
}

export const APPETITE_LEVELS = {
  light: { label: 'Light', factor: 0.85, description: 'Smaller portions, light lunch or lots of other food.' },
  normal: { label: 'Normal', factor: 1, description: 'A solid everyday serving.' },
  hungry: { label: 'Hungry', factor: 1.2, description: 'Big appetites, active crowd or this meal matters.' },
}

export const LEFTOVER_LEVELS = {
  none: { label: 'No planned leftovers', factor: 1, bufferPercent: 0 },
  little: { label: 'A little extra', factor: 1.1, bufferPercent: 10 },
  plenty: { label: 'Plenty for leftovers', factor: 1.25, bufferPercent: 25 },
}

export const CHILD_PORTION_FACTOR = 0.6

export function getPortionFood(foodId) {
  return PORTION_FOODS.find((food) => food.id === foodId) || PORTION_FOODS[0]
}

export function practicalRound(value, unit) {
  if (!Number.isFinite(value) || value <= 0) return 0
  if (unit === 'ml') {
    const step = value < 500 ? 25 : value < 2000 ? 50 : 100
    return Math.ceil(value / step) * step
  }
  if (unit === 'g') {
    const step = value < 500 ? 25 : value < 2000 ? 50 : 100
    return Math.ceil(value / step) * step
  }
  return Math.ceil(value)
}

function cleanNumber(value, digits = 1) {
  return Number(Number(value).toFixed(digits)).toLocaleString('en-GB', { maximumFractionDigits: digits })
}

export function formatPortionQuantity(value, unit, system = 'metric') {
  if (!Number.isFinite(value) || value <= 0) return '—'

  if (unit === 'g') {
    if (system === 'us') {
      if (value >= GRAMS_PER_POUND * 1.5) return `${cleanNumber(value / GRAMS_PER_POUND, 2)} lb`
      return `${cleanNumber(value / GRAMS_PER_OUNCE, 1)} oz`
    }
    if (value >= 1000) return `${cleanNumber(value / 1000, 2)} kg`
    return `${cleanNumber(value, 0)} g`
  }

  if (unit === 'ml') {
    if (system === 'us') {
      if (value >= ML_PER_QUART * 0.75) return `${cleanNumber(value / ML_PER_QUART, 2)} qt`
      return `${cleanNumber(value / ML_PER_FL_OZ, 1)} fl oz`
    }
    if (value >= 1000) return `${cleanNumber(value / 1000, 2)} L`
    return `${cleanNumber(value, 0)} ml`
  }

  return `${cleanNumber(value, 0)} pieces`
}

export function calculatePortions({
  foodId = 'pasta-dry',
  adults = 4,
  children = 0,
  role = 'main',
  appetite = 'normal',
  leftovers = 'none',
} = {}) {
  const food = getPortionFood(foodId)
  const adultCount = Math.max(0, Number(adults) || 0)
  const childCount = Math.max(0, Number(children) || 0)
  const effectiveDiners = adultCount + childCount * CHILD_PORTION_FACTOR
  const basePerAdult = food.portions[role] ?? food.portions.main
  const appetiteFactor = APPETITE_LEVELS[appetite]?.factor ?? 1
  const leftoverFactor = LEFTOVER_LEVELS[leftovers]?.factor ?? 1
  const adjustedPerAdult = basePerAdult * appetiteFactor
  const rawTotal = effectiveDiners * adjustedPerAdult * leftoverFactor
  const total = practicalRound(rawTotal, food.unit)

  return {
    ok: effectiveDiners > 0,
    food,
    adults: adultCount,
    children: childCount,
    role,
    appetite,
    leftovers,
    effectiveDiners,
    basePerAdult,
    adjustedPerAdult,
    leftoverFactor,
    rawTotal,
    total,
    unit: food.unit,
    reason: effectiveDiners > 0 ? '' : 'Add at least one adult or child to calculate a quantity.',
  }
}

export function buildPortionNotes(result) {
  if (!result?.ok) return []
  const notes = [result.food.note]

  if (result.children > 0) {
    notes.push('Children are counted at about 60% of an adult portion. Count hungry teenagers as adults.')
  }

  if (result.role === 'buffet') {
    notes.push('Buffet portions assume there are several other dishes to choose from. If this is one of only two options, use the side or main setting instead.')
  }

  if (result.appetite === 'hungry') {
    notes.push('The hungry setting adds 20% before any leftover buffer.')
  } else if (result.appetite === 'light') {
    notes.push('The light setting trims the standard portion by 15%.')
  }

  const buffer = LEFTOVER_LEVELS[result.leftovers]?.bufferPercent || 0
  if (buffer > 0) notes.push(`The total includes a ${buffer}% buffer for leftovers.`)

  return notes
}
