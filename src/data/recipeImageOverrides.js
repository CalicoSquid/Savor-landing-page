// Website-only photo choices, keyed by the exact ID in /r/:id.
// Use a path under public (e.g. /images/recipes/pasta.webp) or an HTTPS URL.
// Leave imageCredit null for your own photos; otherwise include the credit.
export const RECIPE_IMAGE_OVERRIDES = {
  '6ac549861e142fac7ac5f84f': {
    image: '/images/recipes/apple-cinnamon-roll-v1.webp',
    imageCredit: null,
    ingredients: [
      '240 ml warm milk', '7 g instant yeast', '50 g sugar', '1 egg',
      '1 egg yolk', '60 g melted butter', '420–450 g plain flour', '1/2 tsp salt',
      '2 apples, diced', '30 g butter', '40 g brown sugar', '1 tsp cinnamon',
      'Pinch of salt', '1 tsp lemon juice',
      '60 g softened butter', '100 g brown sugar', '2 tsp cinnamon',
      '100 g icing sugar', '1–2 tbsp milk', '1/2 tsp vanilla extract',
      '100 g sugar', '30 g butter', '60 ml cream', 'Pinch of salt',
    ],
    instructions: [
      'Mix the warm milk, instant yeast, 50 g sugar, egg, egg yolk and melted butter.',
      'Add the flour and salt, then knead until smooth. Cover and let rise for 60–75 minutes.',
      'Cook the diced apples with 30 g butter, 40 g brown sugar, 1 tsp cinnamon, a pinch of salt and lemon juice until tender. Let cool.',
      'Roll the dough into a rectangle. Spread with 60 g softened butter, then sprinkle with 100 g brown sugar and 2 tsp cinnamon.',
      'Spread the cooled apple filling over the dough, roll up and slice into 9 rolls. Arrange in a prepared baking dish.',
      'Let rise for 30–40 minutes, then bake at 180°C for 25–30 minutes.',
      'For the glaze, mix the icing sugar with 1–2 tbsp milk and the vanilla until smooth.',
      'For the caramel, melt the 100 g sugar in a saucepan over medium heat until amber. Carefully stir in the 30 g butter, then slowly add the 60 ml cream; it will bubble vigorously. Stir until smooth, add a pinch of salt and let cool slightly.',
      'Drizzle the glaze and caramel over the warm rolls.',
    ],
    ingredientGroups: [
      { label: 'Dough', startIndex: 0 },
      { label: 'Apple filling', startIndex: 8 },
      { label: 'Cinnamon filling', startIndex: 14 },
      { label: 'Vanilla glaze', startIndex: 17 },
      { label: 'Caramel sauce', startIndex: 20 },
    ],
  },
  '6ac54e6d1e142fac7ac5f88e': {
    image: '/images/recipes/pecan-pie-brownies-v1.webp',
    imageCredit: null,
  },
  '6abdf816388d4deccfa77023': {
    image: '/images/recipes/cinnamon-sugar-donuts-v1.webp',
    imageCredit: null,
  },
  '6a7f7a14617ae028323946ba': {
    image: '/images/recipes/caramel-apple-cheesecake-bars-v3.webp',
    imageCredit: null,
    ingredientGroups: [
      { label: 'Graham cracker crust', startIndex: 0 },
      { label: 'Cheesecake layer', startIndex: 3 },
      { label: 'Apple filling', startIndex: 7 },
      { label: 'Streusel topping', startIndex: 11 },
    ],
  },
}

export function applyRecipeImageOverride(recipe, id) {
  if (!recipe || !Object.hasOwn(RECIPE_IMAGE_OVERRIDES, id)) return recipe
  const override = RECIPE_IMAGE_OVERRIDES[id]
  if (!override?.image || !/^(https:\/\/|\/(?!\/))/.test(override.image)) {
    throw new Error(`Invalid website photo override for recipe ${id}`)
  }
  const image = new URL(override.image, 'https://getsavor.recipes').href
  return {
    ...recipe, image, imageCredit: override.imageCredit ?? null,
    ...(override.ingredientGroups ? { ingredientGroups: override.ingredientGroups } : {}),
    ...(override.ingredients ? { ingredients: override.ingredients } : {}),
    ...(override.instructions ? { instructions: override.instructions } : {}),
  }
}
