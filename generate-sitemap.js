// generate-sitemap.js — runs after prerender.js as part of `npm run build`.
// Writes dist/sitemap.xml: the static marketing routes plus every recipe
// the server deems indexable via the sitemapRecipes query.
//
// A recipe is indexable when it's (a) original — no sourceUrl, so no
// duplicate-content problem — AND (b) has actually been opened by a real
// visitor in a browser at least once (tracked server-side in the
// RecipeLinkAccess collection, written by publicRecipe). Tapping Share in
// the app alone doesn't qualify; the link has to have genuinely been
// opened. That filter lives entirely in the sitemapRecipes resolver — this
// script just consumes whatever it returns.
//
// If the server hasn't deployed sitemapRecipes yet, or no links have been
// opened, this falls back gracefully to static-routes-only (see below).

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { BLOG_POSTS } from './src/data/blogPosts.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')

const APOLLO_URI = process.env.VITE_APOLLO_URI || 'https://savor-app-server-gql-production.up.railway.app/graphql'
const SITE = 'https://getsavor.recipes'

const STATIC_ROUTES = [
  { loc: '/',        changefreq: 'weekly',  priority: '1.0' },
  { loc: '/potluck',  changefreq: 'monthly', priority: '0.8' },
  { loc: '/caper',   changefreq: 'monthly', priority: '0.8' },
  { loc: '/about',    changefreq: 'monthly', priority: '0.7' },
  { loc: '/faq',      changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog',     changefreq: 'weekly',  priority: '0.7' },
  { loc: '/studio',   changefreq: 'monthly', priority: '0.4' },
  { loc: '/privacy',  changefreq: 'yearly',  priority: '0.2' },
  { loc: '/terms',    changefreq: 'yearly',  priority: '0.2' },
  { loc: '/caper/privacy', changefreq: 'yearly', priority: '0.2' },
  // Blog posts — one entry per BLOG_POSTS entry, so a new post only needs
  // adding to src/data/blogPosts.js, not here as well.
  ...BLOG_POSTS.map((post) => ({
    loc: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: post.date,
  })),
]

const QUERY = `
  query SitemapRecipes {
    sitemapRecipes {
      id
      updatedAt
    }
  }
`

async function fetchIndexableRecipes() {
  try {
    const res = await fetch(APOLLO_URI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY }),
    })
    const { data, errors } = await res.json()
    if (errors?.length) {
      console.warn('  ⚠ sitemapRecipes query failed, shipping static routes only:', errors[0].message)
      return []
    }
    return data?.sitemapRecipes || []
  } catch (e) {
    console.warn('  ⚠ Could not reach GraphQL for sitemap recipes, shipping static routes only:', e.message)
    return []
  }
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
    ${priority ? `<priority>${priority}</priority>` : ''}
  </url>`
}

const today = new Date().toISOString().slice(0, 10)

const recipes = await fetchIndexableRecipes()

const entries = [
  ...STATIC_ROUTES.map(r => urlEntry({ ...r, loc: `${SITE}${r.loc}`, lastmod: r.lastmod || today })),
  ...recipes.map(r => urlEntry({
    loc: `${SITE}/r/${r.id}`,
    lastmod: (r.updatedAt || today).slice(0, 10),
    changefreq: 'monthly',
    priority: '0.6',
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

fs.mkdirSync(dist, { recursive: true })
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml)
console.log(`✓ sitemap.xml written with ${STATIC_ROUTES.length} static routes + ${recipes.length} recipe pages`)