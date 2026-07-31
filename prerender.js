// prerender.js — static prerender of the high-value, low-risk routes.
// Runs after `vite build` (client) and `vite build --ssr` (server bundle).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from './.ssr/entry-server.js'
import { faqSchema } from './src/data/faqs.js'
import { demoRecipeSchema } from './src/data/demoRecipe.js'
import { BLOG_POSTS, blogPostSchema } from './src/data/blogPosts.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8')

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => esc(s).replace(/"/g, '&quot;')

const ROUTES = [
  {
    url: '/',
    file: 'index.html',
    // Brand-first is deliberate: "Savor" is a common English word with known
    // app-name collisions, so the brand token earns its place at the front.
    // Keyword-first alternative, if this is ever A/B'd:
    //   'Recipe Scanner App — Scan, Save & Cook | Savor'
    title: 'Savor — Recipe Scanner App | Scan, Save & Cook',
    desc: 'Scan handwritten recipe cards or cookbook pages, and import any recipe from the web in one tap. Ad-free, algorithm-free, and made by a chef. Free to start.',
    canonical: 'https://getsavor.recipes/',
  },
  {
    url: '/about',
    file: 'about.html',
    title: 'About Savor — A Recipe App Made by a Chef',
    desc: 'The story behind Savor: a recipe app built by a former chef, for saving, scanning and keeping every recipe that matters — ad-free, with no life stories.',
    canonical: 'https://getsavor.recipes/about',
  },
  {
    url: '/potluck',
    file: 'potluck.html',
    title: 'Potluck — Spin for Your Supper | A Savor App',
    desc: 'Can’t decide what to cook? Potluck spins the wheel and picks tonight’s dinner — one tap, one recipe, no scrolling. Save what you love to Savor. Free.',
    canonical: 'https://getsavor.recipes/potluck',
    ogImage: 'https://getsavor.recipes/potluck/potluck-splash.png',
  },
  {
    url: '/caper',
    file: 'caper.html',
    title: 'Caper — Find Dinner in the Wild | Wild Food Foraging App',
    desc: 'Caper is a wild-food companion made by a chef. Identify 893 wild edibles with safety ratings, see what’s in season nearby, and log every find. One payment.',
    canonical: 'https://getsavor.recipes/caper',
    ogImage: 'https://getsavor.recipes/caper/caper-feature-graphic.png',
  },
  {
    url: '/forage',
    file: 'forage.html',
    title: 'Forage Wild Food Safely with Caper | Seasonal Field Guide',
    desc: 'Caper helps new and curious foragers find wild edibles in season nearby, check safety ratings and habitats, log discoveries, and cook what they find.',
    canonical: 'https://getsavor.recipes/forage',
    ogImage: 'https://getsavor.recipes/caper/caper-feature-graphic.png',
  },
  {
    // Legal. Previously fell through to the SPA shell (app.html), so /privacy
    // served the homepage's title, description and OG tags while still being
    // listed in sitemap.xml. Its own entry here gives it page-specific
    // metadata in the initial HTML; the shared index.html default is untouched.
    url: '/privacy',
    file: 'privacy.html',
    title: 'Privacy Policy — Savor & Potluck Recipe Apps',
    desc: 'How the Savor and Potluck by Savor apps handle your data: what we collect, how it’s used, the third-party services involved, and how to delete your account.',
    canonical: 'https://getsavor.recipes/privacy',
  },
  {
    // Legal + studio. These three are listed in generate-sitemap.js but had
    // no ROUTES entry, so they fell through to the SPA shell (app.html) and
    // served the homepage's title, description and OG tags with no canonical
    // — submitted to Google in that state. Same defect /privacy had.
    url: '/terms',
    file: 'terms.html',
    title: 'Terms of Service — Savor & Potluck Recipe Apps',
    desc: 'Terms of service for the Savor and Potluck by Savor apps: your account, acceptable use, subscriptions, shared recipes, and how the terms may change.',
    canonical: 'https://getsavor.recipes/terms',
  },
  {
    url: '/caper/privacy',
    file: 'caper/privacy.html',
    title: 'Privacy Policy — Caper Wild Food & Foraging App',
    desc: 'How the Caper wild-food app handles your data: what we collect, location and logbook privacy, third-party services, and how to delete your account.',
    canonical: 'https://getsavor.recipes/caper/privacy',
    ogImage: 'https://getsavor.recipes/caper/caper-feature-graphic.png',
  },
  {
    url: '/studio',
    file: 'studio.html',
    title: 'CalicoSquid Code — The Studio Behind Savor',
    desc: 'CalicoSquid Code — the one-person studio behind Savor, Potluck and Caper. Android apps built by a chef on a farm in Montenegro.',
    canonical: 'https://getsavor.recipes/studio',
  },
  {
    url: '/faq',
    file: 'faq.html',
    title: 'Savor FAQ — Questions About the Recipe App',
    desc: 'Answers to common questions about Savor: how to save and scan recipes, whether it is free, what makes it different, and which devices it runs on.',
    canonical: 'https://getsavor.recipes/faq',
    headExtra: `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`,
  },
  {
    // Demo/parody page. Prerendered specifically so the Recipe JSON-LD is in
    // the initial HTML — present before React mounts, which is what lets
    // Savor's in-app browser detect it on load (an SPA-only render injects it
    // too late, after onLoadEnd). noindex ships statically here too, since
    // crawlers hitting this file won't run the page's JS. Kept out of the
    // sitemap (generate-sitemap.js) regardless.
    url: '/demo',
    file: 'demo.html',
    title: "The Only Lasagne Recipe You'll Ever Need (An Odyssey) | The Hearth & Hollow",
    desc: 'A demo of how Savor pulls a clean recipe out of even the fluffiest recipe blog.',
    canonical: 'https://getsavor.recipes/demo',
    ogImage: 'https://getsavor.recipes/images/lasagne.webp',
    headExtra:
      `<meta name="robots" content="noindex, nofollow" />\n` +
      `  <script type="application/ld+json">${JSON.stringify(demoRecipeSchema)}</script>`,
  },
  {
    url: '/blog',
    file: 'blog.html',
    title: 'Savor Blog — Notes on Cooking, Paper, and Screens',
    desc: 'Writing from the kitchen where Savor gets made — recipes worth keeping, and the tools, paper or otherwise, that actually keep them.',
    canonical: 'https://getsavor.recipes/blog',
  },
  // Blog posts — one ROUTES entry per BLOG_POSTS entry. Add a new post to
  // blogPosts.js and it's automatically prerendered with its own title,
  // description, og:image, and BlogPosting schema — nothing to duplicate here.
  ...BLOG_POSTS.map((post) => ({
    url: `/blog/${post.slug}`,
    file: `blog/${post.slug}.html`,
    title: post.metaTitle || `${post.title} | Savor Blog`,
    // dek is on-page copy and runs long; metaDesc is the <=160-char SERP
    // version when a post needs one. Falls back to dek where absent.
    desc: post.metaDesc || post.dek,
    canonical: `https://getsavor.recipes/blog/${post.slug}`,
    ogImage: post.ogImage,
    headExtra: `<script type="application/ld+json">${JSON.stringify(blogPostSchema(post))}</script>`,
  })),
]

let count = 0
for (const r of ROUTES) {
  const appHtml = render(r.url)
  const ogImage = r.ogImage || 'https://getsavor.recipes/images/savor-final.png'

  let html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escAttr(r.desc)}" />`,
    )
    .replace(
      /<link\s+rel="canonical"[^>]*\/>/,
      `<link rel="canonical" href="${escAttr(r.canonical)}" />`,
    )
    // Social preview tags — every route previously inherited the homepage's
    // og:title/description/image untouched, so a share of /demo or /potluck
    // showed generic "Savor — Cook in Color" branding instead of that page's
    // own content. Each route's own title/desc (and ogImage, where set) now
    // drive these too.
    .replace(
      /<meta\s+property="og:title"[^>]*\/>/,
      `<meta property="og:title" content="${escAttr(r.title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${escAttr(r.desc)}" />`,
    )
    .replace(
      /<meta\s+property="og:url"[^>]*\/>/,
      `<meta property="og:url" content="${escAttr(r.canonical)}" />`,
    )
    .replace(
      /<meta\s+property="og:image"[^>]*\/>/,
      `<meta property="og:image" content="${escAttr(ogImage)}" />`,
    )
    .replace(
      /<meta\s+property="og:image:alt"[^>]*\/>/,
      `<meta property="og:image:alt" content="${escAttr(r.title)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"[^>]*\/>/,
      `<meta name="twitter:title" content="${escAttr(r.title)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${escAttr(r.desc)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:image"[^>]*\/>/,
      `<meta name="twitter:image" content="${escAttr(ogImage)}" />`,
    )

  if (r.headExtra) {
    html = html.replace('</head>', `  ${r.headExtra}\n  </head>`)
  }

  const out = path.join(dist, r.file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
  count++
  console.log(`  prerendered ${r.url}  ->  dist/${r.file}`)
}
console.log(`✓ prerendered ${count} route(s)`)

// SPA fallback shell for routes we deliberately don't prerender
// (/delete-account, /caper/delete-account, /r/:id). Empty #root
// means the client does a
// clean createRoot render — no hydration mismatch against home's markup.
// Canonical is stripped so SPA routes don't all claim the homepage URL.
const shell = template.replace(/<link\s+rel="canonical"[^>]*\/>\s*/, '')
fs.writeFileSync(path.join(dist, 'app.html'), shell)
console.log('  wrote SPA fallback shell -> dist/app.html')