// src/data/demoRecipe.js
// Shared by the demo page (rendering + runtime JSON-LD) and the prerender
// build (static JSON-LD in <head>, so it's present before React mounts —
// which is what Savor's in-app browser needs to detect the recipe on load).
// Mirrors the faqSchema pattern in faqs.js.

export const demoRecipeSchema = {
  '@context': 'https://schema.org/',
  '@type': 'Recipe',
  name: "The Only Lasagne Recipe You'll Ever Need (An Odyssey)",
  image: ['https://getsavor.recipes/images/lasagne.webp'],
  author: { '@type': 'Person', name: 'Marguerite Hollow' },
  datePublished: '2016-03-11',
  dateModified: '2026-07-02',
  description: 'A classic layered lasagne with ragù and béchamel, arrived at after considerable detour.',
  prepTime: 'PT30M',
  cookTime: 'PT2H30M',
  totalTime: 'PT3H',
  recipeYield: '8 servings',
  recipeCategory: 'Main Course',
  recipeCuisine: 'Italian',
  keywords: 'lasagne, ragù, béchamel, baked pasta, comfort food',
  recipeIngredient: [
    '2 tbsp olive oil',
    '1 small yellow onion, finely diced',
    '1 medium carrot, finely diced',
    '1 celery stalk, finely diced',
    '3 garlic cloves, minced',
    '1 lb ground beef',
    '1/2 lb ground pork',
    '1/2 cup dry white wine',
    '2 tbsp tomato paste',
    '28 oz canned crushed tomatoes',
    '1 cup whole milk, divided',
    '2 bay leaves',
    '4 tbsp unsalted butter',
    '4 tbsp all-purpose flour',
    '4 cups whole milk, warmed',
    '1/4 tsp freshly grated nutmeg',
    '1 lb fresh lasagne sheets',
    '1 1/2 cups grated Parmigiano-Reggiano',
    '12 oz fresh mozzarella, torn',
    'Salt and black pepper, to taste',
  ],
  recipeInstructions: [
    {
      '@type': 'HowToSection',
      name: 'Ragù',
      itemListElement: [
        { '@type': 'HowToStep', text: 'Heat olive oil in a heavy pot over medium heat. Add onion, carrot, and celery; cook 8 minutes until soft.' },
        { '@type': 'HowToStep', text: 'Add garlic and cook 1 minute until fragrant.' },
        { '@type': 'HowToStep', text: 'Add beef and pork. Break apart and brown, 8-10 minutes.' },
        { '@type': 'HowToStep', text: 'Pour in wine and simmer until mostly evaporated, about 3 minutes.' },
        { '@type': 'HowToStep', text: 'Stir in tomato paste and cook 2 minutes.' },
        { '@type': 'HowToStep', text: 'Add crushed tomatoes and bay leaves. Season with salt and pepper. Simmer uncovered on low, stirring occasionally, 1.5-2 hours.' },
        { '@type': 'HowToStep', text: 'Stir in 1/2 cup milk during the final 15 minutes. Discard bay leaves.' },
      ],
    },
    {
      '@type': 'HowToSection',
      name: 'Béchamel',
      itemListElement: [
        { '@type': 'HowToStep', text: 'Melt butter in a saucepan over medium heat. Whisk in flour and cook 2 minutes, stirring constantly, without browning.' },
        { '@type': 'HowToStep', text: 'Gradually whisk in warm milk. Simmer, whisking often, until thickened, 8-10 minutes.' },
        { '@type': 'HowToStep', text: 'Season with nutmeg, salt, and pepper. Remove from heat.' },
      ],
    },
    {
      '@type': 'HowToSection',
      name: 'Assembly',
      itemListElement: [
        { '@type': 'HowToStep', text: 'Preheat oven to 190°C (375°F).' },
        { '@type': 'HowToStep', text: 'Spread a thin layer of ragù in a 9x13-inch baking dish. Add a layer of pasta sheets.' },
        { '@type': 'HowToStep', text: 'Layer ragù, béchamel, and a scattering of Parmigiano. Repeat to build 4 layers, ending with béchamel.' },
        { '@type': 'HowToStep', text: 'Top with mozzarella and remaining Parmigiano.' },
        { '@type': 'HowToStep', text: 'Cover with foil and bake 25 minutes. Uncover and bake 15-20 minutes more, until golden and bubbling.' },
        { '@type': 'HowToStep', text: 'Rest 15 minutes before slicing.' },
      ],
    },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.98', ratingCount: '1247' },
}

// Grouped for the Savor-style reveal display (src/pages/DemoBlog.jsx). The
// schema's recipeIngredient above is deliberately flat — that's correct for
// JSON-LD — but the reveal needs the same Ragù/Béchamel/Assembly grouping
// already used in the blog's own plain recipe card, so both presentations
// of the recipe stay consistent with each other.
export const demoRecipeGroups = [
  {
    label: 'Ragù',
    items: [
      '2 tbsp olive oil',
      '1 small onion, finely diced',
      '1 carrot, finely diced',
      '1 celery stalk, finely diced',
      '3 garlic cloves, minced',
      '1 lb ground beef, \u00bd lb ground pork',
      '\u00bd cup dry white wine',
      '2 tbsp tomato paste',
      '28 oz canned crushed tomatoes',
      '1 cup whole milk, divided',
      '2 bay leaves \u00b7 salt \u00b7 pepper',
    ],
  },
  {
    label: 'B\u00e9chamel',
    items: [
      '4 tbsp butter',
      '4 tbsp flour',
      '4 cups whole milk, warmed',
      '\u00bc tsp nutmeg \u00b7 salt \u00b7 pepper',
    ],
  },
  {
    label: 'Assembly',
    items: [
      '1 lb fresh lasagne sheets',
      '1\u00bd cups grated Parmigiano-Reggiano',
      '12 oz fresh mozzarella, torn',
    ],
  },
]