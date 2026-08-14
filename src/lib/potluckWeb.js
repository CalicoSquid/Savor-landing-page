const DEFAULT_API = 'https://savor-app-server-gql-production.up.railway.app'

export const POTLUCK_API = import.meta.env.VITE_APOLLO_URI || DEFAULT_API

const RANDOM_RECIPE_QUERY = `
  query RandomRecipe(
    $excludeIds: [ID]
    $daypart: String
    $source: String
    $visitorId: String
  ) {
    randomRecipe(
      excludeIds: $excludeIds
      daypart: $daypart
      source: $source
      visitorId: $visitorId
    ) {
      id
      name
      description
      image
      ingredients
      instructions
      recipeYield
      category
      cuisine
      sourceUrl
      times {
        cook { hours minutes }
        prep { hours minutes }
        total { hours minutes }
      }
    }
  }
`

export const REEL_SYMBOLS = [
  '🍳', '🥗', '🍝', '🍕', '🍔', '🍜', '🥘', '🍱', '🌮',
  '🥐', '🍣', '🍲', '🥩', '🍰', '🦞', '🌯', '🍛', '🫕',
]

export function daypartNow() {
  const hour = new Date().getHours()
  return hour >= 5 && hour < 11 ? 'breakfast' : 'dinner'
}

export function decodeRecipe(recipe) {
  if (!recipe || typeof document === 'undefined') return recipe
  const decode = (value) => {
    if (typeof value !== 'string') return value
    const node = document.createElement('textarea')
    node.innerHTML = value
    return node.value
  }
  return {
    ...recipe,
    name: decode(recipe.name),
    description: decode(recipe.description),
    category: decode(recipe.category),
    cuisine: decode(recipe.cuisine),
    recipeYield: decode(recipe.recipeYield),
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.map(decode) : recipe.ingredients,
    instructions: Array.isArray(recipe.instructions) ? recipe.instructions.map(decode) : recipe.instructions,
  }
}

export function trackPotluckEvent(event) {
  if (typeof window === 'undefined' || !event) return
  const visitorId = getPotluckVisitorId()
  const endpoint = `${String(POTLUCK_API).replace(/\/+$/, '')}/potluck-event`
  const body = JSON.stringify({ event, visitorId })

  try {
    // sendBeacon is ideal for outbound CTA clicks because navigation can start
    // immediately without waiting for analytics. It deliberately carries no
    // account, IP-derived identifier, or fingerprint — only the random local
    // Potluck token already used for unique spinner counting.
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      if (navigator.sendBeacon(endpoint, blob)) return
    }
  } catch {
    // Fall through to fetch. Tracking must never block the actual product.
  }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
    cache: 'no-store',
  }).catch(() => {})
}

export function getPotluckVisitorId() {
  if (typeof window === 'undefined') return null
  const key = 'potluck:web-visitor-id:v1'
  try {
    const existing = window.localStorage.getItem(key)
    if (existing) return existing
    const created = window.crypto?.randomUUID?.()
      || `pl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
    window.localStorage.setItem(key, created)
    return created
  } catch {
    return null
  }
}

export async function fetchRandomRecipe({ excludeIds = [], visitorId } = {}) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(POTLUCK_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        query: RANDOM_RECIPE_QUERY,
        variables: { excludeIds, daypart: daypartNow(), source: 'web', visitorId },
      }),
    })

    if (!response.ok) throw new Error(`Potluck server ${response.status}`)
    const payload = await response.json()
    if (payload.errors?.length) throw new Error(payload.errors[0]?.message || 'Potluck query failed')
    const recipe = decodeRecipe(payload.data?.randomRecipe)
    if (!recipe?.id) throw new Error('The universe drew a blank')
    return recipe
  } finally {
    window.clearTimeout(timeout)
  }
}

const cleanUnit = (value) => Number.isFinite(value) && value > 0 && value < 10000 ? Math.floor(value) : 0
const sumTime = (time) => time ? cleanUnit(time.hours) * 60 + cleanUnit(time.minutes) : 0

export function totalMins(recipe) {
  const explicit = sumTime(recipe?.times?.total)
  const total = explicit || sumTime(recipe?.times?.prep) + sumTime(recipe?.times?.cook)
  return total > 2880 ? 0 : total
}

export function fmtMins(minutes) {
  if (!minutes) return null
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins ? `${hours}h ${mins}m` : `${hours}h`
}
