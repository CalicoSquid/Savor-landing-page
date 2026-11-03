import { SUBSTITUTION_ADDITIONS } from '../data/substitutionAdditions.js'

const COMMON_CONTEXTS = {
  general: { id: 'general', label: 'General cooking', description: 'A practical everyday swap.' },
  baking: { id: 'baking', label: 'Baking', description: 'Cakes, muffins, quick breads and similar batters.' },
  savoury: { id: 'savoury', label: 'Savory cooking', description: 'Sauces, soups, marinades and stove-top cooking.' },
}

function option(name, fit, swap, changes, avoid = '') {
  return { name, fit, swap, changes, avoid }
}

function context(id, options, overrides = {}) {
  return { ...(COMMON_CONTEXTS[id] || { id, label: id, description: '' }), ...overrides, options }
}

const BASE_SUBSTITUTION_INGREDIENTS = [
  {
    id: 'buttermilk', name: 'Buttermilk', aliases: ['cultured buttermilk'],
    summary: 'Acid + dairy matters more than the name. In baking, preserve the acidity that reacts with baking soda.',
    contexts: [
      context('baking', [
        option('Milk + lemon juice or white vinegar', 'Best all-round', 'For 1 cup buttermilk: put 1 tbsp acid in the cup, then add milk to make 1 cup. Rest 5–10 minutes.', 'Close acidity and moisture; less cultured flavour.', 'Not ideal when the fresh cultured flavour is the main point.'),
        option('Plain yogurt + milk', 'Excellent', 'Use 3/4 cup plain yogurt + 1/4 cup milk for 1 cup buttermilk.', 'Slightly thicker, pleasantly tangy.', 'Avoid strongly sweetened or flavoured yogurt.'),
        option('Kefir', 'Easy 1:1', 'Replace buttermilk 1:1 with plain kefir.', 'Very similar tang and acidity; often the closest simple swap.', 'Flavoured kefir will change the recipe.'),
      ]),
      context('savoury', [
        option('Plain yogurt + water or milk', 'Best for dressings', 'Thin plain yogurt until it pours like buttermilk; start around 3 parts yogurt to 1 part liquid.', 'Creamier and slightly thicker.', 'For delicate marinades, very thick Greek yogurt may cling more than intended.'),
        option('Kefir', 'Easy 1:1', 'Replace 1:1.', 'Similar acidity with a slightly different cultured flavour.', ''),
      ], { label: 'Dressings & marinades', description: 'When buttermilk is there for tang, tenderness or pourable creaminess.' }),
    ],
  },
  {
    id: 'egg', name: 'Egg', aliases: ['eggs', 'whole egg'],
    summary: 'Eggs can bind, add moisture, emulsify or trap air. The right substitute depends on which job the egg is doing.',
    contexts: [
      context('baking', [
        option('Ground flax + water', 'Good binder', 'For 1 egg: mix 1 tbsp ground flaxseed with 3 tbsp water; rest until gelled.', 'Adds a little nuttiness and density.', 'Poor choice for meringue, soufflé or very airy sponge cakes.'),
        option('Plain yogurt', 'Good for moist bakes', 'Use 1/4 cup (60 ml) plain yogurt per egg.', 'Adds moisture and tenderness; less lift.', 'Not a direct replacement where eggs provide most of the structure.'),
        option('Unsweetened applesauce', 'Good in muffins & cakes', 'Use 1/4 cup (60 ml) per egg.', 'Moister, softer crumb and a little sweetness.', 'Can make crisp cookies or structured cakes too soft.'),
      ]),
      context('savoury', [
        option('Flax egg', 'For binding', 'Use 1 tbsp ground flax + 3 tbsp water per egg.', 'Works well in patties, fritters and veggie burgers.', 'Does not scramble, fry or emulsify like a real egg.'),
        option('Aquafaba', 'Useful binder', 'Use about 3 tbsp chickpea liquid per egg.', 'Neutral once cooked; useful in batters and binding.', 'Not a satisfying substitute for a fried or poached egg.'),
      ]),
    ],
  },
  {
    id: 'butter', name: 'Butter', aliases: ['unsalted butter', 'salted butter'],
    summary: 'Butter contributes fat, water, flavour and sometimes structure. Oil works beautifully in some cakes and badly in laminated pastry.',
    contexts: [
      context('baking', [
        option('Neutral oil', 'Best for cakes & muffins', 'Use about 3/4 cup oil for every 1 cup butter.', 'Moister crumb, less buttery flavour; no creaming structure.', 'Avoid for pastry, shortbread or recipes relying on creamed butter for aeration.'),
        option('Baking margarine', 'Usually 1:1', 'Replace butter 1:1 by weight.', 'Similar handling, milder flavour; water content varies by brand.', 'Very soft tub spreads can contain too much water for pastry.'),
      ]),
      context('savoury', [
        option('Olive oil', 'Easy 1:1', 'Use roughly the same volume for sautéing, roasting and finishing.', 'Different flavour and no milk solids for butter-style browning.', 'Not a like-for-like substitute in beurre blanc or butter-emulsified sauces.'),
        option('Neutral oil', 'Neutral 1:1', 'Use the same volume for frying or roasting.', 'Clean flavour, higher heat tolerance depending on oil.', 'You lose butter flavour and milk-solid browning.'),
      ]),
    ],
  },
  {
    id: 'heavy-cream', name: 'Heavy cream', aliases: ['double cream', 'whipping cream', 'heavy whipping cream'],
    summary: 'Cream brings both fat and liquid. A sauce substitute does not automatically become a whipping substitute.',
    contexts: [
      context('savoury', [
        option('Evaporated milk', 'Good for sauces', 'Replace cream 1:1.', 'Lighter body and less richness, but stable in soups and sauces.', 'It will not whip like heavy cream.'),
        option('Milk + butter', 'Good emergency swap', 'For 1 cup cream: combine 3/4 cup milk with 1/4 cup melted butter.', 'Adds richness close to cream in cooking.', 'Not suitable for whipping and can split in very acidic sauces.'),
        option('Crème fraîche', 'Rich & tangy', 'Use 1:1, thinning with a splash of milk if needed.', 'Tangier and thicker; very stable in hot sauces.', ''),
      ]),
      context('baking', [
        option('Full-fat coconut cream', 'Good dairy-free option', 'Use 1:1.', 'Adds coconut flavour and similar richness.', 'Not neutral in delicate vanilla or dairy-forward desserts.'),
        option('Evaporated milk', 'Fine in batters', 'Use 1:1 where cream is mixed into the batter or custard.', 'Less fat and richness.', 'Not for recipes that require whipped cream volume.'),
      ], { label: 'Baking & desserts', description: 'When cream is mixed in, rather than whipped as the structure.' }),
    ],
  },
  {
    id: 'sour-cream', name: 'Sour cream', aliases: ['soured cream'],
    summary: 'The easiest swaps preserve tang, fat and thickness.',
    contexts: [
      context('baking', [
        option('Full-fat plain yogurt', 'Best all-round', 'Replace 1:1.', 'Slightly lighter and tangier; usually excellent in cakes and quick breads.', 'Very thin yogurt can loosen a batter.'),
        option('Crème fraîche', 'Rich 1:1', 'Replace 1:1.', 'Richer and usually less sharp.', ''),
      ]),
      context('savoury', [
        option('Greek yogurt', 'Excellent', 'Replace 1:1; thin with a little water if needed.', 'Tangy and thick, with less fat.', 'Add gently to very hot sauces to reduce the chance of splitting.'),
        option('Crème fraîche', 'Best for hot sauces', 'Replace 1:1.', 'Richer, less sour and especially heat-stable.', ''),
      ]),
    ],
  },
  {
    id: 'milk', name: 'Milk', aliases: ['whole milk', 'full fat milk'],
    summary: 'For most batters and sauces, another unsweetened milk works 1:1. Fat level matters more in custards and rich sauces.',
    contexts: [
      context('baking', [
        option('Unsweetened soy milk', 'Very reliable 1:1', 'Replace milk 1:1.', 'Similar protein makes it one of the strongest non-dairy baking swaps.', 'Use unflavoured, unsweetened milk.'),
        option('Oat milk', 'Easy 1:1', 'Replace milk 1:1.', 'Slightly sweeter and sometimes thinner.', 'May brown or taste sweeter in very delicate recipes.'),
      ]),
      context('savoury', [
        option('Unsweetened oat or soy milk', 'Usually 1:1', 'Replace 1:1 in soups, béchamel-style sauces and mashed potatoes.', 'Flavour and thickness vary by brand.', 'Avoid sweetened or vanilla versions.'),
        option('Half-and-half / light cream + water', 'Dairy fallback', 'Use about 1 part half-and-half with 2 parts water, then adjust richness to suit the dish.', 'Keeps dairy flavour while bringing the fat level closer to milk.', ''),
      ]),
    ],
  },
  {
    id: 'brown-sugar', name: 'Brown sugar', aliases: ['light brown sugar', 'dark brown sugar'],
    summary: 'Brown sugar is white sugar plus molasses. Rebuilding that combination gives the closest result.',
    contexts: [
      context('baking', [
        option('White sugar + molasses', 'Closest match', 'For 1 cup light brown sugar: mix 1 cup white sugar + 1 tbsp molasses. Use 2 tbsp molasses for dark brown sugar.', 'Very close flavour, moisture and colour.', ''),
        option('White sugar', 'Works in a pinch', 'Replace 1:1 by volume.', 'Less moisture and caramel flavour; cookies may spread or crisp differently.', 'Not ideal when brown sugar is central to chewiness or caramel flavour.'),
      ]),
      context('general', [
        option('White sugar + molasses', 'Closest match', 'Use the same formula: 1 tbsp molasses per cup for light, 2 tbsp for dark.', 'Nearly identical sweetness with restored molasses flavour.', ''),
      ]),
    ],
  },
  {
    id: 'baking-powder', name: 'Baking powder', aliases: ['baking powder'],
    summary: 'Leavening substitutions are chemistry, not just flavour. Keep the acid/base balance in mind.',
    contexts: [
      context('baking', [
        option('Baking soda + cream of tartar', 'Best homemade swap', 'For 1 tsp baking powder: mix 1/4 tsp baking soda + 1/2 tsp cream of tartar. Add 1/4 tsp cornstarch only if storing the mix.', 'Gives the acid and alkali needed for lift.', 'Mix close to baking time; homemade versions are not always double-acting.'),
      ]),
    ],
  },
  {
    id: 'baking-soda', name: 'Baking soda', aliases: ['bicarbonate of soda', 'bicarb', 'sodium bicarbonate'],
    summary: 'Baking soda is much stronger than baking powder and usually needs acid already present in the recipe.',
    contexts: [
      context('baking', [
        option('Baking powder', 'Emergency only', 'Use about 3 tsp baking powder for every 1 tsp baking soda.', 'Adds extra acid and considerably more powder, so flavour and texture can shift.', 'Do not use this casually in recipes where soda controls browning, spread or acidity.'),
      ]),
    ],
  },
  {
    id: 'self-raising-flour', name: 'Self-raising flour', aliases: ['self rising flour', 'self-rising flour'],
    summary: 'Self-raising flour contains raising agents. US self-rising blends also usually include salt; regional recipes differ.',
    contexts: [
      context('baking', [
        option('Plain / all-purpose flour + baking powder', 'Easy homemade mix', 'For a US-style self-rising mix: combine 1 cup plain flour, 1 1/2 tsp baking powder and 1/4 tsp fine salt.', 'Functionally very close for cakes, scones and quick breads.', 'This is a US-style mix. For a UK self-raising recipe, follow its flour specification and do not automatically add the US salt allowance. Check existing raising agents before doubling up.'),
      ]),
    ],
  },
  {
    id: 'cake-flour', name: 'Cake flour', aliases: ['soft flour'],
    summary: 'Cake flour is lower-protein flour. Cornstarch dilution is a useful home approximation, not a chemically identical flour.',
    contexts: [
      context('baking', [
        option('All-purpose flour + cornstarch', 'Good home approximation', 'For 1 cup cake flour: measure 1 cup all-purpose flour, remove 2 tbsp, replace with 2 tbsp cornstarch, then sift well.', 'Produces a softer result than straight all-purpose flour.', 'Very delicate professional sponge formulas may still behave differently.'),
      ]),
    ],
  },
  {
    id: 'cornstarch', name: 'Cornstarch', aliases: ['cornflour', 'corn starch', 'corn flour starch'],
    summary: 'Different starches thicken at different temperatures and give different clarity and texture.',
    contexts: [
      context('savoury', [
        option('Arrowroot starch', 'Clean 1:1', 'Replace cornstarch 1:1.', 'Glossy, clear thickening and good acid tolerance.', 'Long boiling can weaken arrowroot; dairy sauces can turn slightly odd in texture.'),
        option('Potato starch', 'Strong 1:1', 'Replace roughly 1:1.', 'Very effective thickener with a clean finish.', 'Avoid prolonged hard boiling after thickening.'),
        option('Plain flour', 'Common fallback', 'Use about 2 tbsp flour for each 1 tbsp cornstarch.', 'More opaque and floury; needs longer cooking.', 'Not ideal when you want a clear glossy sauce.'),
      ], { label: 'Thickening', description: 'Sauces, gravies, fillings and soups.' }),
    ],
  },
  {
    id: 'soy-sauce', name: 'Soy sauce', aliases: ['light soy sauce'],
    summary: 'The important jobs are salt, umami and fermented depth. Taste before adding extra salt.',
    contexts: [
      context('savoury', [
        option('Tamari', 'Closest 1:1', 'Replace soy sauce 1:1.', 'Usually deeper and slightly less sharp; many versions are gluten-free, but check the label.', ''),
        option('Coconut aminos', 'Milder 1:1', 'Start 1:1, then adjust salt.', 'Sweeter and usually less salty.', 'You may need extra salt or acid in savoury dishes.'),
        option('Worcestershire sauce', 'Different but useful', 'Start with about half the amount, then taste.', 'Adds strong fermented umami, acidity and spice.', 'Not vegetarian, not soy-like in flavour, and not appropriate for every Asian-style dish.'),
      ]),
    ],
  },
  {
    id: 'rice-vinegar', name: 'Rice vinegar', aliases: ['rice wine vinegar'],
    summary: 'Rice vinegar is relatively mild. Stronger vinegars work best when softened rather than swapped blindly.',
    contexts: [
      context('savoury', [
        option('Apple cider vinegar', 'Good 1:1', 'Replace 1:1.', 'Fruitier and a touch more assertive.', ''),
        option('White wine vinegar', 'Good 1:1', 'Replace 1:1.', 'Slightly sharper, still fairly gentle.', ''),
        option('Distilled white vinegar + water', 'Emergency option', 'Use roughly 3 parts white vinegar to 1 part water.', 'Sharper, cleaner acidity with less nuance.', 'Taste before using in delicate sushi rice or dipping sauces.'),
      ]),
    ],
  },
  {
    id: 'lemon-juice', name: 'Lemon juice', aliases: ['fresh lemon juice'],
    summary: 'If lemon is there mainly for acidity, other acids work. If lemon flavour matters, they do not.',
    contexts: [
      context('savoury', [
        option('Lime juice', 'Closest 1:1', 'Replace 1:1.', 'Similar acidity with a distinct lime aroma.', ''),
        option('White wine vinegar', 'Good for acidity', 'Start with about 3/4 of the lemon juice amount and adjust to taste.', 'Sharp acidity without citrus aroma.', 'Not a good replacement when lemon flavour is central.'),
      ]),
      context('baking', [
        option('Lime juice', 'Best 1:1', 'Replace 1:1.', 'Keeps citrus acidity but changes the aroma.', 'The flavour difference will be obvious in lemon bars, curd or lemon cake.'),
        option('White vinegar', 'For chemistry only', 'Replace 1:1 when the juice is present mainly to react with baking soda.', 'Provides acidity, not lemon flavour.', 'Do not use as a flavour replacement in citrus desserts.'),
      ]),
    ],
  },
  {
    id: 'garlic', name: 'Fresh garlic', aliases: ['garlic', 'garlic clove', 'garlic cloves'],
    summary: 'Dried garlic is stronger by volume but lacks the fresh bite and texture of a clove.',
    contexts: [
      context('savoury', [
        option('Garlic powder', 'Easy pantry swap', 'Use about 1/8 tsp garlic powder per medium clove.', 'Smoother, more even garlic flavour with no fresh texture.', 'Not ideal for garlic bread, toum, pesto or dishes built around fresh garlic.'),
        option('Jarred minced garlic', 'Convenient', 'Use about 1/2 tsp jarred minced garlic per clove.', 'Softer, less sharp flavour.', ''),
      ]),
    ],
  },
  {
    id: 'fresh-herbs', name: 'Fresh herbs', aliases: ['fresh basil', 'fresh thyme', 'fresh oregano', 'fresh rosemary', 'fresh parsley'],
    summary: 'Dried herbs are concentrated. A useful starting rule is one part dried to three parts fresh.',
    contexts: [
      context('savoury', [
        option('Dried herbs', 'Use the 1:3 rule', 'For 1 tbsp chopped fresh herbs, start with 1 tsp dried.', 'More concentrated, earthier flavour and no fresh texture.', 'Parsley, basil and delicate garnishing herbs lose much of their fresh character when dried.'),
      ]),
    ],
  },
  {
    id: 'dijon-mustard', name: 'Dijon mustard', aliases: ['dijon'],
    summary: 'Prepared mustards differ in heat, sweetness and acidity, but most can stand in for Dijon when the mustard is not the star.',
    contexts: [
      context('savoury', [
        option('Wholegrain mustard', 'Great 1:1', 'Replace 1:1.', 'Similar acidity with visible seeds and a coarser texture.', ''),
        option('Yellow mustard', 'Easy 1:1', 'Replace 1:1.', 'Milder, brighter and less wine-like.', 'Noticeably different in Dijon-forward vinaigrettes and sauces.'),
        option('Dry mustard powder', 'For flavour, not texture', 'Start with 1/4 tsp powder + 3/4 tsp water for each 1 tsp prepared Dijon.', 'Sharper mustard flavour with less complexity.', ''),
      ]),
    ],
  },
  {
    id: 'wine', name: 'Wine for cooking', aliases: ['white wine', 'red wine', 'cooking wine'],
    summary: 'Wine contributes acidity, aroma and liquid. Stock alone replaces the liquid, not the brightness.',
    contexts: [
      context('savoury', [
        option('Stock + a little acid', 'Best alcohol-free approach', 'Replace wine with stock, then add lemon juice or wine vinegar a teaspoon at a time until the dish tastes bright.', 'Keeps savoury body and restores some acidity without wine aroma.', 'For wine-heavy reductions, coq au vin or risotto where wine flavour is prominent, the result will be different.'),
        option('Unsweetened grape or apple juice + a little vinegar', 'Useful in braises', 'Replace the wine with juice, then add mild vinegar 1 tsp at a time per cup until the acidity tastes balanced.', 'Adds fruit and acidity; sweeter than wine.', 'Reduce other sugar and avoid in dishes where fruitiness would be distracting.'),
      ]),
    ],
  },
  {
    id: 'shallot', name: 'Shallot', aliases: ['shallots'],
    summary: 'Shallots sit between onion and garlic: mild, sweet and aromatic.',
    contexts: [
      context('savoury', [
        option('Red or yellow onion', 'Best everyday swap', 'Use roughly the same chopped volume, or slightly less if the onion is strong.', 'More assertive and less delicate.', 'For raw vinaigrettes, rinse or soak strong onion briefly to soften the bite.'),
        option('Onion + tiny pinch of garlic', 'Closer flavour profile', 'Use mostly onion with just a little garlic.', 'Adds back some of shallot’s allium complexity.', 'Do not overdo the garlic; shallot should not taste overtly garlicky.'),
      ]),
    ],
  },
  {
    id: 'honey', name: 'Honey', aliases: ['runny honey'],
    summary: 'Liquid sweeteners are easiest to swap in sauces and dressings. Baking is more sensitive because water and browning change too.',
    contexts: [
      context('savoury', [
        option('Maple syrup', 'Easy 1:1', 'Replace honey 1:1.', 'Thinner with a distinct maple flavour.', ''),
        option('Golden syrup', 'Easy 1:1', 'Replace 1:1.', 'Milder flavour, similar sticky sweetness.', ''),
      ]),
      context('baking', [
        option('Maple syrup', 'Usually 1:1', 'Replace honey 1:1, then watch batter consistency; reduce another liquid slightly if the batter becomes loose.', 'Different flavour and slightly different browning.', 'Not ideal where honey flavour is central.'),
      ]),
    ],
  },
]

const CATEGORY_BY_ID = {
  'buttermilk': 'Dairy & eggs', egg: 'Dairy & eggs', butter: 'Dairy & eggs', 'heavy-cream': 'Dairy & eggs', 'sour-cream': 'Dairy & eggs', milk: 'Dairy & eggs',
  'brown-sugar': 'Sweeteners', honey: 'Sweeteners',
  'baking-powder': 'Baking', 'baking-soda': 'Baking', 'self-raising-flour': 'Baking', 'cake-flour': 'Baking', cornstarch: 'Baking',
  'soy-sauce': 'Sauces & liquids', 'rice-vinegar': 'Sauces & liquids', 'lemon-juice': 'Sauces & liquids', wine: 'Sauces & liquids',
  garlic: 'Seasonings', 'fresh-herbs': 'Seasonings', 'dijon-mustard': 'Seasonings', shallot: 'Seasonings',
}

const MEASURED_OPTIONS = {
  buttermilk: {
    'Milk + lemon juice or white vinegar': { amount: 1, unit: 'cup', parts: [{ amount: 1, unit: 'tbsp', name: 'Lemon juice or white vinegar' }, { amount: 1, unit: 'cup', name: 'Milk', fillTo: true }] },
    'Plain yogurt + milk': { amount: 1, unit: 'cup', parts: [{ amount: 0.75, unit: 'cup', name: 'Plain yogurt' }, { amount: 0.25, unit: 'cup', name: 'Milk' }] },
  },
  egg: {
    'Ground flax + water': { amount: 1, unit: 'egg', parts: [{ amount: 1, unit: 'tbsp', name: 'Ground flaxseed' }, { amount: 3, unit: 'tbsp', name: 'Water' }] },
  },
  cornstarch: {
    'Plain flour': { amount: 1, unit: 'tbsp', parts: [{ amount: 2, unit: 'tbsp', name: 'Plain flour' }] },
  },
  garlic: {
    'Garlic powder': { amount: 1, unit: 'clove', parts: [{ amount: 0.125, unit: 'tsp', name: 'Garlic powder' }] },
  },
}

export const SUBSTITUTION_INGREDIENTS = [...BASE_SUBSTITUTION_INGREDIENTS, ...SUBSTITUTION_ADDITIONS].map((item) => ({
  ...item,
  category: item.category || CATEGORY_BY_ID[item.id] || 'Pantry',
  contexts: item.contexts.map((usage) => ({
    ...usage,
    options: usage.options.map((swap) => ({ ...swap, ...(MEASURED_OPTIONS[item.id]?.[swap.name] ? { measure: MEASURED_OPTIONS[item.id][swap.name] } : {}) })),
  })),
}))

export const SUBSTITUTION_CATEGORIES = [...new Set(SUBSTITUTION_INGREDIENTS.map((item) => item.category))].sort()

export function normaliseSubstitutionQuery(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
    .replace(/^(?:what can i use instead of|substitutes? for|replacement for)\s+/, '')
    .replace(/\s+(?:substitutes?|replacement)$/, '').trim()
}

export function getSubstitutionIngredient(id) {
  return SUBSTITUTION_INGREDIENTS.find((item) => item.id === id) || null
}

export function getSubstitutionContext(ingredientId, contextId) {
  const ingredient = getSubstitutionIngredient(ingredientId)
  if (!ingredient) return null
  return ingredient.contexts.find((item) => item.id === contextId) || ingredient.contexts[0] || null
}

export function exactSubstitution(query) {
  const needle = normaliseSubstitutionQuery(query)
  if (!needle) return null
  return SUBSTITUTION_INGREDIENTS.find((item) => [item.name, ...item.aliases].some((name) => normaliseSubstitutionQuery(name) === needle)) || null
}

export function searchSubstitutions(query, limit = 8) {
  const needle = normaliseSubstitutionQuery(query)
  if (!needle) return SUBSTITUTION_INGREDIENTS.slice(0, limit)
  return SUBSTITUTION_INGREDIENTS.map((item) => {
    const names = [item.name, ...item.aliases].map(normaliseSubstitutionQuery)
    let score = 0
    if (names.includes(needle)) score = 100
    else if (names.some((name) => name.startsWith(needle))) score = 75
    else if (names.some((name) => name.includes(needle))) score = 50
    else if (normaliseSubstitutionQuery(item.summary).includes(needle)) score = 15
    return { item, score }
  }).filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit).map(({ item }) => item)
}

function editDistance(left, right) {
  let row = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let i = 0; i < left.length; i++) {
    const next = [i + 1]
    for (let j = 0; j < right.length; j++) next.push(Math.min(next[j] + 1, row[j + 1] + 1, row[j] + (left[i] === right[j] ? 0 : 1)))
    row = next
  }
  return row[right.length]
}

export function suggestSubstitutions(query) {
  const needle = normaliseSubstitutionQuery(query)
  if (needle.length < 4 || needle.length > 60 || searchSubstitutions(query).length) return []
  return SUBSTITUTION_INGREDIENTS.map((item) => ({ item, distance: Math.min(...[item.name, ...item.aliases].map((name) => editDistance(needle, normaliseSubstitutionQuery(name)))) }))
    .filter(({ distance }) => distance <= (needle.length > 6 ? 2 : 1))
    .sort((a, b) => a.distance - b.distance || a.item.name.localeCompare(b.item.name))
    .slice(0, 3).map(({ item }) => item)
}

export function scaleSubstitution(swap, amountInput) {
  const amount = Number(amountInput)
  if (!swap.measure || String(amountInput).trim() === '' || !Number.isFinite(amount) || amount <= 0 || amount > 1000) {
    return { ok: false, reason: 'Enter an amount greater than zero, up to 1000, in the unit shown.' }
  }
  const factor = amount / swap.measure.amount
  const format = (number) => String(Number(number.toPrecision(4)))
  return { ok: true, lines: swap.measure.parts.map((part) => `${part.name}: ${part.fillTo ? 'add enough to bring the total mixture to ' : ''}${format(part.amount * factor)} ${part.unit}`) }
}

export function substitutionCopyText(ingredient, usage, swap, amountInput) {
  const scaled = swap.measure ? scaleSubstitution(swap, amountInput) : null
  if (scaled && !scaled.ok) return ''
  return [`Substitute for: ${ingredient.name}`, `Use: ${usage.label}`, `Swap: ${swap.name}`, swap.swap,
    ...(scaled ? [`For ${amountInput} ${swap.measure.unit}:`, ...scaled.lines] : []),
    `Expect: ${swap.changes}`, ...(swap.avoid ? [`Watch out: ${swap.avoid}`] : []),
  ].join('\n')
}

export function popularSubstitutionIds() {
  return ['buttermilk', 'egg', 'butter', 'heavy-cream', 'baking-powder', 'cornstarch', 'soy-sauce', 'tomato-paste']
}
