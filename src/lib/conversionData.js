const DEFAULT_API_BASE = 'https://savor-app-server-gql-production.up.railway.app'
const CACHE_KEY = 'savor:kitchen-conversions:v1'

function apiBase() {
  const configured = import.meta.env?.VITE_SAVOR_API_BASE || import.meta.env?.VITE_APOLLO_URI || DEFAULT_API_BASE
  return String(configured).replace(/\/graphql\/?$/i, '').replace(/\/+$/, '')
}

export const KITCHEN_CONVERSIONS_URL = `${apiBase()}/kitchen-conversions`

export function normaliseConversionDataset(raw) {
  if (!raw || raw.schemaVersion !== 1 || !Array.isArray(raw.entries)) return null

  const entries = raw.entries
    .filter((entry) => entry && typeof entry.name === 'string' && entry.name.trim())
    .map((entry) => {
      const clean = { name: entry.name.trim().toLowerCase() }
      for (const field of ['cupToGrams', 'cupToMl', 'gramToPounds', 'gramToOunces', 'quartsToLiters', 'poundToGrams', 'ozToGrams', 'stickToGrams']) {
        const value = Number(entry[field])
        if (Number.isFinite(value) && value > 0) clean[field] = value
      }
      return clean
    })
    .filter((entry) => Object.keys(entry).length > 1)

  if (!entries.length) return null

  return {
    schemaVersion: 1,
    version: typeof raw.version === 'string' ? raw.version : '',
    count: entries.length,
    cookingCupMl: Number(raw.cookingCupMl) > 0 ? Number(raw.cookingCupMl) : 240,
    entries,
  }
}

export function readCachedConversionDataset() {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return normaliseConversionDataset(JSON.parse(raw))
  } catch {
    return null
  }
}

function cacheConversionDataset(dataset) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(dataset))
  } catch {
    // Cache is an optimisation only. Private browsing/storage limits should not
    // make the converter itself fail.
  }
}

export async function loadConversionDataset({ fetchImpl = fetch } = {}) {
  const cached = readCachedConversionDataset()

  try {
    const response = await fetchImpl(KITCHEN_CONVERSIONS_URL, {
      headers: { Accept: 'application/json' },
      cache: 'default',
    })
    if (!response.ok) throw new Error(`Conversion data request failed (${response.status})`)
    const dataset = normaliseConversionDataset(await response.json())
    if (!dataset) throw new Error('Conversion data response was invalid')
    cacheConversionDataset(dataset)
    return { dataset, source: 'live' }
  } catch (error) {
    if (cached) return { dataset: cached, source: 'cache', error }
    throw error
  }
}
