// Website-only photo choices, keyed by the exact ID in /r/:id.
// Use a path under public (e.g. /images/recipes/pasta.webp) or an HTTPS URL.
// Leave imageCredit null for your own photos; otherwise include the credit.
export const RECIPE_IMAGE_OVERRIDES = {
  // 'recipe-id': { image: '/images/recipes/pasta.webp', imageCredit: null },
}

export function applyRecipeImageOverride(recipe, id) {
  if (!recipe || !Object.hasOwn(RECIPE_IMAGE_OVERRIDES, id)) return recipe
  const override = RECIPE_IMAGE_OVERRIDES[id]
  if (!override?.image || !/^(https:\/\/|\/(?!\/))/.test(override.image)) {
    throw new Error(`Invalid website photo override for recipe ${id}`)
  }
  const image = new URL(override.image, 'https://getsavor.recipes').href
  return { ...recipe, image, imageCredit: override.imageCredit ?? null }
}
