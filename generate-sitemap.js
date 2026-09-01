// generate-sitemap.js — runs after prerender.js as part of `npm run build`.
// Static URLs and dynamic recipe URLs come from the same build-time SEO data
// used to render their crawlable parent pages, so sitemap/indexability cannot drift.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEO_PAGES, SITE_URL } from './src/data/seoPages.js'
import { PUBLIC_RECIPE_INDEX } from './src/data/publicRecipeIndex.generated.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlEntry({ loc, lastmod }) {
  const lastmodLine = lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : ''
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmodLine}\n  </url>`
}

const staticPages = SEO_PAGES.filter((item) => item.sitemap)
const recipes = PUBLIC_RECIPE_INDEX

const entries = [
  ...staticPages.map((item) => urlEntry({ loc: item.canonical, lastmod: item.lastmod })),
  ...recipes.map((recipe) => urlEntry({
    loc: `${SITE_URL}/r/${encodeURIComponent(recipe.id)}`,
    lastmod: recipe.updatedAt ? String(recipe.updatedAt).slice(0, 10) : undefined,
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

fs.mkdirSync(dist, { recursive: true })
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml)
console.log(`✓ sitemap.xml written with ${staticPages.length} static routes + ${recipes.length} original recipe page(s)`)
