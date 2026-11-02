import { BLOG_POSTS } from './blogPosts.js'

// One collection entry per authored recipe; articles retain their existing URLs.
export const SAVOR_ORIGINALS = [
  {
  "slug": "lemon-brownies-strawberry-tree-jam",
  "series": "Signature Recipes",
  "number": 2,
  "name": "Lemon brownies",
  "description": "Bright, buttery squares with a sharp lemon glaze. A Montenegro kitchen memory, with strawberry tree jam as an optional little adventure.",
  "effort": "15 minutes prep · 22–28 minutes baking, plus cooling · Makes 9 large or 16 small",
  "mood": "For sunshine, butter and a thoroughly underwhelming fruit."
},
  {
  "slug": "hot-smoked-salmon-fennel-dill-vodka",
  "series": "Signature Recipes",
  "number": 1,
  "name": "Oven-smoked salmon with fennel, dill & vodka",
  "description": "A short aromatic cure, a glossy glaze and a roasting tray standing in for a smoker. Golden hot-smoked salmon to serve warm or cold.",
  "effort": "15 minutes prep · 5–6 hours curing · 30–40 minutes cooking · Serves 6–8",
  "mood": "For making the roasting tray look considerably more accomplished."
},
  {
    slug: 'bacon-leek-cheddar-bread-butter-pudding',
    series: 'Back of the Cupboard',
    number: 3,
    name: 'Bacon, leek & cheddar bread and butter pudding',
    description: 'Stale bread baked in savoury mustard-and-thyme custard with crisp smoked bacon, buttery leeks and cheddar. Made for Sunday roast chicken.',
    effort: '25 minutes prep · 20 minutes soaking · 30–45 minutes baking · Serves 6 as a side',
    mood: 'For yesterday’s bread and Sunday’s roast.',
  },
  {
    slug: 'smash-burgers-pickle-mustard-sauce',
    series: 'Dinner on Autopilot',
    number: 3,
    name: 'Smash burgers with quick pickle–mustard sauce',
    description: 'A Savor × Iron Kitchen take on burger night: crisp beef, melting cheese and a tangy sauce from the pickle jar.',
    effort: '25–30 minutes · Makes 4 double burgers',
  },
  {
    slug: 'paprika-chicken-crispy-potatoes',
    series: 'Dinner on Autopilot',
    number: 2,
    name: 'Paprika chicken & crispy potatoes',
    description: 'Golden chicken, crispy-edged potatoes and sweet roasted garlic. One tray, ten minutes of prep, then hand dinner over to the oven.',
    effort: '50–55 minutes, plus resting · Serves 4',
    mood: 'For the evening when the oven can do the work.',
  },
  {
    slug: 'sticky-soy-braised-pork-neck-shiitake',
    series: 'Back of the Cupboard',
    number: 2,
    name: 'Sticky soy-braised pork neck with shiitake mushrooms',
    description: 'Forgotten dried mushrooms and bargain pork neck, slow-braised in soy, ginger and garlic until glossy and fork-tender.',
    effort: '45 minutes prep · 2½–3 hours cooking · Serves 2–4',
    mood: 'For the bag at the back that finally gets its moment.',
  },
  {
    slug: 'one-pan-smoky-tomato-rice',
    series: 'Dinner on Autopilot',
    name: 'Smoky tomato rice with chickpeas & crispy eggs',
    description: 'Two tins, a handful of rice and a fried egg. A proper cupboard dinner, with just one pan to wash.',
    effort: 'About 50 minutes · Serves 4',
    mood: 'For the evening when choosing dinner is enough work.',
  },
  {
    slug: 'salt-pork-blaff',
    series: 'Back of the Cupboard',
    name: 'Salt pork blaff with green plantain & lime',
    description: 'Crisp pork, green plantain and a generous pot of vegetables. The cookbook-roulette dinner that inspired Potluck.',
    effort: '2–3 hours · Plus salting or soaking · Serves 4',
    mood: 'For the day you fancy cooking something different.',
  },
].map(recipe => ({
  ...recipe,
  href: `/blog/${recipe.slug}/`,
  post: BLOG_POSTS.find(post => post.slug === recipe.slug),
}))
