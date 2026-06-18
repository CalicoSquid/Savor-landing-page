// prerender.js — static prerender of the high-value, low-risk routes.
// Runs after `vite build` (client) and `vite build --ssr` (server bundle).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from './.ssr/entry-server.js'
import { faqSchema } from './src/data/faqs.js'

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
    url: '/faq',
    file: 'faq.html',
    title: 'Savor FAQ — Questions About the Recipe App',
    desc: 'Answers to common questions about Savor: how to save and scan recipes, whether it is free, what makes it different, and which devices it runs on.',
    canonical: 'https://getsavor.recipes/faq',
    headExtra: `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`,
  },
]

let count = 0
for (const r of ROUTES) {
  const appHtml = render(r.url)

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

