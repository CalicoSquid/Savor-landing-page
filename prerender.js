// prerender.js — static prerender of every fixed public route.
// Runs after the client and SSR Vite builds. Route metadata comes from one
// source (src/data/seoPages.js), shared with the sitemap and client SEO sync.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from './.ssr/entry-server.js'
import { demoRecipeSchema } from './src/data/demoRecipe.js'
import { DEFAULT_SOCIAL_IMAGE, SEO_PAGES } from './src/data/seoPages.js'
import { structuredDataForPage } from './src/data/structuredData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8')

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => esc(s).replace(/"/g, '&quot;')

function replaceMeta(html, attribute, name, content) {
  const re = new RegExp(`<meta\\s+${attribute}="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*\\/?>`, 'i')
  const tag = `<meta ${attribute}="${name}" content="${escAttr(content)}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace('</head>', `  ${tag}\n  </head>`)
}

function replaceCanonical(html, canonical) {
  const tag = `<link rel="canonical" href="${escAttr(canonical)}" />`
  if (/<link\s+rel="canonical"[^>]*\/?\s*>/i.test(html)) {
    return html.replace(/<link\s+rel="canonical"[^>]*\/?\s*>/i, tag)
  }
  return html.replace('</head>', `  ${tag}\n  </head>`)
}

function routeStructuredData(seo) {
  const blocks = []
  const pageSchema = structuredDataForPage(seo)
  if (pageSchema) blocks.push(`<script id="route-jsonld" type="application/ld+json">${JSON.stringify(pageSchema)}</script>`)
  if (seo.path === '/demo') blocks.push(`<script id="demo-recipe-jsonld" type="application/ld+json">${JSON.stringify(demoRecipeSchema)}</script>`)
  return blocks.join('\n    ')
}

function applySeo(templateHtml, seo) {
  let html = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(seo.title)}</title>`)

  html = replaceMeta(html, 'name', 'description', seo.description)
  html = replaceMeta(html, 'name', 'robots', seo.robots)
  html = replaceCanonical(html, seo.canonical)

  html = replaceMeta(html, 'property', 'og:type', seo.ogType)
  html = replaceMeta(html, 'property', 'og:title', seo.title)
  html = replaceMeta(html, 'property', 'og:description', seo.description)
  html = replaceMeta(html, 'property', 'og:url', seo.canonical)
  html = replaceMeta(html, 'property', 'og:image', seo.ogImage)
  html = replaceMeta(html, 'property', 'og:image:secure_url', seo.ogImage)
  html = replaceMeta(html, 'property', 'og:image:type', 'image/jpeg')
  html = replaceMeta(html, 'property', 'og:image:width', String(seo.ogImageWidth))
  html = replaceMeta(html, 'property', 'og:image:height', String(seo.ogImageHeight))
  html = replaceMeta(html, 'property', 'og:image:alt', seo.ogImageAlt)

  html = replaceMeta(html, 'name', 'twitter:card', 'summary_large_image')
  html = replaceMeta(html, 'name', 'twitter:title', seo.title)
  html = replaceMeta(html, 'name', 'twitter:description', seo.description)
  html = replaceMeta(html, 'name', 'twitter:image', seo.ogImage)
  html = replaceMeta(html, 'name', 'twitter:image:alt', seo.ogImageAlt)

  // Article-only properties are deliberately absent from normal pages.
  if (seo.ogType === 'article' && seo.publishedTime) {
    html = replaceMeta(html, 'property', 'article:published_time', seo.publishedTime)
    html = replaceMeta(html, 'property', 'article:modified_time', seo.modifiedTime)
    if (seo.author) html = replaceMeta(html, 'name', 'author', seo.author)
  }

  const structured = routeStructuredData(seo)
  html = html.replace('<!-- ROUTE_STRUCTURED_DATA -->', structured)
  return html
}

let count = 0
for (const seo of SEO_PAGES) {
  const appHtml = render(seo.path)
  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  html = applySeo(html, seo)

  const out = path.join(dist, seo.file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
  count++
  console.log(`  prerendered ${seo.path}  ->  dist/${seo.file}`)
}
console.log(`✓ prerendered ${count} route(s)`)

// Dynamic shared-recipe pages are handled by the Netlify edge function for
// search/social crawlers and by React for real visitors. If the edge fetch
// fails, the fallback shell is intentionally noindex instead of advertising
// the homepage metadata at a /r/:id URL.
let shell = template.replace('<!-- ROUTE_STRUCTURED_DATA -->', '')
shell = shell.replace(/<link\s+rel="canonical"[^>]*\/?\s*>\s*/i, '')
shell = shell.replace(/<meta\s+property="og:url"[^>]*\/?\s*>\s*/i, '')
shell = shell.replace(/<title>[\s\S]*?<\/title>/i, '<title>Shared recipe · Savor</title>')
shell = replaceMeta(shell, 'name', 'description', 'A recipe shared from Savor.')
shell = replaceMeta(shell, 'name', 'robots', 'noindex, follow')
shell = replaceMeta(shell, 'property', 'og:type', 'website')
shell = replaceMeta(shell, 'property', 'og:title', 'Shared recipe · Savor')
shell = replaceMeta(shell, 'property', 'og:description', 'A recipe shared from Savor.')
shell = replaceMeta(shell, 'property', 'og:image', DEFAULT_SOCIAL_IMAGE)
shell = replaceMeta(shell, 'property', 'og:image:secure_url', DEFAULT_SOCIAL_IMAGE)
shell = replaceMeta(shell, 'property', 'og:image:alt', 'Savor — a recipe organiser for saving and scanning real recipes')
shell = replaceMeta(shell, 'name', 'twitter:card', 'summary_large_image')
shell = replaceMeta(shell, 'name', 'twitter:title', 'Shared recipe · Savor')
shell = replaceMeta(shell, 'name', 'twitter:description', 'A recipe shared from Savor.')
shell = replaceMeta(shell, 'name', 'twitter:image', DEFAULT_SOCIAL_IMAGE)
fs.writeFileSync(path.join(dist, 'app.html'), shell)
console.log('  wrote dynamic recipe SPA shell -> dist/app.html')

// Netlify serves dist/404.html with an actual 404 status for unknown paths as
// long as there is no catch-all SPA rewrite. This prevents junk URLs becoming
// soft-404 200 pages.
const notFoundHtml = render('/__savor-not-found__')
let notFound = template.replace('<div id="root"></div>', `<div id="root">${notFoundHtml}</div>`)
notFound = notFound.replace('<!-- ROUTE_STRUCTURED_DATA -->', '')
notFound = notFound.replace(/<title>[\s\S]*?<\/title>/i, '<title>Page not found — Savor</title>')
notFound = replaceMeta(notFound, 'name', 'description', 'This page does not exist on Savor.')
notFound = replaceMeta(notFound, 'name', 'robots', 'noindex, follow')
notFound = notFound.replace(/<link\s+rel="canonical"[^>]*\/?\s*>\s*/i, '')
fs.writeFileSync(path.join(dist, '404.html'), notFound)
console.log('  wrote static 404 page -> dist/404.html')
