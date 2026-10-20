import { BLOG_POSTS } from './blogPosts.js'

// One collection entry per authored recipe; articles retain their existing URLs.
export const SAVOR_ORIGINALS = [
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
