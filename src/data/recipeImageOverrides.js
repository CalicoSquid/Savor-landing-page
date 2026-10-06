// Website-only photo choices, keyed by the exact ID in /r/:id.
// Use a path under public (e.g. /images/recipes/pasta.webp) or an HTTPS URL.
// Leave imageCredit null for your own photos; otherwise include the credit.
export const RECIPE_IMAGE_OVERRIDES = {
  '6abdf816388d4deccfa77023': {
    image: '/images/recipes/cinnamon-sugar-donuts-v1.png',
    imageCredit: null,
  },
  '6a7f7a14617ae028323946ba': {
    image: '/images/recipes/caramel-apple-cheesecake-v1.png',
    imageCredit: null,
  },
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
