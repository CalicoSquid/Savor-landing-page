import { applyRecipeImageOverride } from '../data/recipeImageOverrides.js'

const APOLLO_URI = import.meta.env?.VITE_APOLLO_URI || 'https://savor-production.up.railway.app/graphql'

const QUERY = `
  query PublicRecipe($id: ID!) {
    publicRecipe(id: $id) {
      id
      name
      description
      image
      ingredients
      ingredientGroups { label startIndex }
      instructions
      category
      cuisine
      sourceUrl
      imageCredit { photographer photographerUrl }
      times { prep { hours minutes } cook { hours minutes } total { hours minutes } }
      recipeYield
      user { name username theme }
    }
  }
`

// Only in-flight requests and the short-lived initial-navigation result are shared.
const requests = new Map()
export function loadPublicRecipe(id, { early = false } = {}) {
  let entry = requests.get(id)
  if (!entry) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    entry = { consumed: !early }
    requests.set(id, entry)
    entry.promise = fetch(APOLLO_URI, {
      signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { id } }),
    }).then(async response => {
      if (!response.ok) throw new Error('Unable to load recipe')
      const { data, errors } = await response.json()
      if (errors?.length || !data || data.publicRecipe === undefined) throw new Error('Unable to load recipe')
      return applyRecipeImageOverride(data.publicRecipe, id)
    }).catch(error => {
      if (requests.get(id) === entry) requests.delete(id)
      throw error
    }).finally(() => {
      clearTimeout(timeout)
      entry.settled = true
      // Keep a resolved bootstrap result only until React consumes it (max 30s).
      entry.cleanup = setTimeout(() => {
        if (requests.get(id) === entry) requests.delete(id)
      }, entry.consumed ? 0 : 30000)
      entry.cleanup.unref?.()
    })
  } else if (!early) {
    entry.consumed = true
    if (entry.settled) {
      clearTimeout(entry.cleanup)
      entry.cleanup = setTimeout(() => {
        if (requests.get(id) === entry) requests.delete(id)
      }, 0)
      entry.cleanup.unref?.()
    }
  }
  return entry.promise
}
