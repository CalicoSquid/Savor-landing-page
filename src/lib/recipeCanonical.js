import { fingerprint } from '../../scripts/lib/deduplicate-recipes.mjs'
import { RECIPE_CANONICALS } from '../data/recipeCanonicals.generated.js'

// Match the actual recipe, never just a title, photo, author or database lineage.
export async function resolveRecipeCanonical(id, recipe, load, known = RECIPE_CANONICALS) {
  if (recipe.sourceUrl) return id
  const key = fingerprint(recipe)
  if (!key) return id
  if (known[key]) return known[key]
  let current = recipe
  let canonical = id
  const visited = new Set([String(id)])
  for (let depth = 0; depth < 8; depth++) {
    const next = current.sourceRecipeId || current.sharedVersionId
    if (!next) break
    if (visited.has(String(next))) return id
    visited.add(String(next))
    let target
    try { target = await load(String(next)) } catch { break }
    if (!target || target.sourceUrl || fingerprint(target) !== key) break
    canonical = String(next)
    current = target
    if (known[key]) return known[key]
  }
  return canonical
}
