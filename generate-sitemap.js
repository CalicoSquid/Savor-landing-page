// generate-sitemap.js — runs after prerender.js as part of `npm run build`.
// Static URLs come from the same SEO route registry used by prerendering, so
// adding a public page cannot silently drift out of the sitemap.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { SEO_PAGES, SITE_URL } from './src/data/seoPages.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')

const APOLLO_URI = process.env.VITE_APOLLO_URI || 'https://savor-app-server-gql-production.up.railway.app/graphql'

const QUERY = `
  query SitemapRecipes {
    sitemapRecipes {
      id
      updatedAt
    }
  }
`

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function fetchIndexableRecipes() {
  try {
    const res = await fetch(APOLLO_URI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY }),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) {
      console.warn(`  ⚠ sitemapRecipes HTTP ${res.status}; shipping static routes only`)
      return []
    }
    const { data, errors } = await res.json()
    if (errors?.length) {
      console.warn('  ⚠ sitemapRecipes query failed; shipping static routes only:', errors[0].message)
      return []
    }
    return data?.sitemapRecipes || []
  } catch (error) {
    console.warn('  ⚠ Could not reach GraphQL for sitemap recipes; shipping static routes only:', error.message)
    return []
  }
}

function urlEntry({ loc, lastmod }) {
  const lastmodLine = lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : ''
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmodLine}\n  </url>`
}

const staticPages = SEO_PAGES.filter((item) => item.sitemap)
const recipes = await fetchIndexableRecipes()

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
console.log(`✓ sitemap.xml written with ${staticPages.length} static routes + ${recipes.length} recipe pages`)
