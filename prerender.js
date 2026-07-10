// prerender.js — static prerender of the high-value, low-risk routes.
// Runs after `vite build` (client) and `vite build --ssr` (server bundle).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from './.ssr/entry-server.js'
import { faqSchema } from './src/data/faqs.js'
import { demoRecipeSchema } from './src/data/demoRecipe.js'

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
    title: 'Savor — Save Any Recipe | Recipe Scanner & Keeper App',
    desc: 'Savor is a recipe app made by a chef. Scan cookbook pages and handwritten cards, import recipes from any website in one tap, and keep them all ad-free and beautifully organized.',
    canonical: 'https://getsavor.recipes/',
  },
  {
    url: '/about',
    file: 'about.html',
    title: 'About Savor — A Recipe App Made by a Chef',
    desc: 'The story behind Savor: a recipe app built by a former chef, for saving, scanning and keeping every recipe that matters — ad-free, with no life stories and no scroll.',
    canonical: 'https://getsavor.recipes/about',
  },
  {
    url: '/potluck',
    file: 'potluck.html',
    title: 'Potluck — Spin for Your Supper | A Savor App',
    desc: 'Can’t decide what to cook? Potluck spins the wheel and picks tonight’s dinner for you — one tap, one recipe, no scrolling. Save what you love straight to Savor. Free on Android.',
    canonical: 'https://getsavor.recipes/potluck',
    ogImage: 'https://getsavor.recipes/potluck/potluck-splash.png',
  },
  {
    url: '/forage',
    file: 'forage.html',
    title: 'Forage — Find Dinner in the Wild | Wild Food Foraging App',
    desc: 'Forage is a wild-food companion app made by a chef. Identify 893 wild edibles with safety ratings, see what’s in season near you, cook what you find, and keep every find in your logbook. One payment, no subscription.',
    canonical: 'https://getsavor.recipes/forage',
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
// (Potluck, Studio, legal, /r/:id). Empty #root means the client does a
// clean createRoot render — no hydration mismatch against home's markup.
// Canonical is stripped so SPA routes don't all claim the homepage URL.
const shell = template.replace(/<link\s+rel="canonical"[^>]*\/>\s*/, '')
fs.writeFileSync(path.join(dist, 'app.html'), shell)
console.log('  wrote SPA fallback shell -> dist/app.html')