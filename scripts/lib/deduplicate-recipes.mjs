// Content matching is deliberately conservative: a shared title alone is not a duplicate.
// Preserve case in measurements: "T" and "t" can mean tablespoon and teaspoon.
const text = value => String(value ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim()

function fingerprint(recipe) {
  const ingredients = recipe.ingredients?.map(text)
  const instructions = recipe.instructions?.map(text)
  if (!text(recipe.name) || !ingredients?.length || !instructions?.length ||
      ingredients.some(value => !value) || instructions.some(value => !value)) return null
  return JSON.stringify({
    name: text(recipe.name).toLowerCase(), ingredients, instructions,
    yield: text(recipe.recipeYield),
    groups: (recipe.ingredientGroups || []).map(group => [text(group.label), group.startIndex]),
    times: ['prep', 'cook', 'total'].map(key =>
      Number(recipe.times?.[key]?.hours || 0) * 60 + Number(recipe.times?.[key]?.minutes || 0)),
  })
}

function preference(a, b) {
  // Prefer the published snapshot over Kitchen/saved copies; use the oldest ID
  // as a stable tie-breaker so API ordering cannot change the selected URL.
  return Number(Boolean(b.recipe.isShared)) - Number(Boolean(a.recipe.isShared)) ||
    Number(Boolean(a.recipe.sourceRecipeId)) - Number(Boolean(b.recipe.sourceRecipeId)) ||
    a.id.localeCompare(b.id)
}

export function deduplicateRecipes(candidates) {
  const groups = new Map()
  for (const candidate of candidates) {
    const key = fingerprint(candidate.recipe) ?? `id:${candidate.id}`
    const group = groups.get(key) || []
    group.push(candidate)
    groups.set(key, group)
  }
  return [...groups.values()].map(group => [...group].sort(preference)[0])
}
