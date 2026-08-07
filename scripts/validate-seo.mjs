import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEO_PAGES, SITE_URL } from '../src/data/seoPages.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const errors = []

const fail = (message) => errors.push(message)
const read = (file) => fs.readFileSync(path.join(dist, file), 'utf8')
const countMatches = (text, re) => [...text.matchAll(re)].length
const decodeHtml = (value) => value == null ? value : value
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&')
const attr = (html, attribute, name) => {
  const safe = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`<meta\\s+${attribute}="${safe}"\\s+content="([^"]*)"\\s*/?>`, 'i')
  return decodeHtml(html.match(re)?.[1] ?? null)
}
const canonical = (html) => decodeHtml(html.match(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>/i)?.[1] ?? null)
const title = (html) => decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? null)

if (!fs.existsSync(dist)) fail('dist/ does not exist; run the production build first.')

if (fs.existsSync(dist)) {
  for (const seo of SEO_PAGES) {
    const filename = path.join(dist, seo.file)
    if (!fs.existsSync(filename)) {
      fail(`${seo.path}: missing dist/${seo.file}`)
      continue
    }

    const html = read(seo.file)
    const checks = [
      ['title', title(html), seo.title],
      ['description', attr(html, 'name', 'description'), seo.description],
      ['robots', attr(html, 'name', 'robots'), seo.robots],
      ['canonical', canonical(html), seo.canonical],
      ['og:title', attr(html, 'property', 'og:title'), seo.title],
      ['og:description', attr(html, 'property', 'og:description'), seo.description],
      ['og:url', attr(html, 'property', 'og:url'), seo.canonical],
      ['og:image', attr(html, 'property', 'og:image'), seo.ogImage],
      ['twitter:card', attr(html, 'name', 'twitter:card'), 'summary_large_image'],
      ['twitter:title', attr(html, 'name', 'twitter:title'), seo.title],
      ['twitter:description', attr(html, 'name', 'twitter:description'), seo.description],
      ['twitter:image', attr(html, 'name', 'twitter:image'), seo.ogImage],
    ]

    for (const [label, actual, expected] of checks) {
      if (actual !== expected) fail(`${seo.path}: ${label} mismatch (${actual ?? 'missing'})`)
    }

    for (const [label, value] of [['canonical', seo.canonical], ['og:image', seo.ogImage]]) {
      if (!value.startsWith('https://')) fail(`${seo.path}: ${label} is not an absolute HTTPS URL`)
    }

    if (countMatches(html, /<title>/gi) !== 1) fail(`${seo.path}: expected exactly one <title>`)
    if (countMatches(html, /<link\s+rel="canonical"/gi) !== 1) fail(`${seo.path}: expected exactly one canonical link`)

    const jsonLdBlocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    if (seo.robots.startsWith('index') && jsonLdBlocks.length === 0) fail(`${seo.path}: no JSON-LD found`)
    if (seo.robots.startsWith('noindex') && seo.path !== '/demo' && jsonLdBlocks.length !== 0) {
      fail(`${seo.path}: noindex utility route should not emit SEO JSON-LD`)
    }
    for (const [, json] of jsonLdBlocks) {
      try {
        JSON.parse(json)
      } catch (error) {
        fail(`${seo.path}: invalid JSON-LD (${error.message})`)
      }
    }
  }

  for (const special of ['app.html', '404.html']) {
    const filename = path.join(dist, special)
    if (!fs.existsSync(filename)) {
      fail(`missing dist/${special}`)
      continue
    }
    const html = read(special)
    const robots = attr(html, 'name', 'robots') || ''
    if (!robots.includes('noindex')) fail(`${special}: must be noindex`)
    if (canonical(html)) fail(`${special}: must not contain a canonical URL`)
  }

  const sitemapPath = path.join(dist, 'sitemap.xml')
  if (!fs.existsSync(sitemapPath)) {
    fail('missing dist/sitemap.xml')
  } else {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8')
    if (!sitemap.startsWith('<?xml')) fail('sitemap.xml: XML declaration missing')
    const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
    if (new Set(locs).size !== locs.length) fail('sitemap.xml: duplicate URLs found')
    if (locs.some((url) => !url.startsWith(`${SITE_URL}/`) && url !== SITE_URL)) {
      fail('sitemap.xml: contains a URL outside the canonical getsavor.recipes host')
    }
    for (const seo of SEO_PAGES.filter((page) => page.sitemap)) {
      if (!locs.includes(seo.canonical)) fail(`sitemap.xml: missing ${seo.canonical}`)
    }
    for (const seo of SEO_PAGES.filter((page) => !page.sitemap)) {
      if (locs.includes(seo.canonical)) fail(`sitemap.xml: noindex/utility route included: ${seo.canonical}`)
    }
    if (locs.some((url) => url === `${SITE_URL}/forage` || url.startsWith(`${SITE_URL}/forage/`))) {
      fail('sitemap.xml: legacy /forage URL included')
    }
  }

  const robotsPath = path.join(dist, 'robots.txt')
  if (!fs.existsSync(robotsPath)) {
    fail('missing dist/robots.txt')
  } else {
    const robots = fs.readFileSync(robotsPath, 'utf8')
    if (!robots.includes('User-agent: *')) fail('robots.txt: universal user-agent rule missing')
    if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail('robots.txt: canonical sitemap reference missing')
  }
}

if (errors.length) {
  console.error(`SEO validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`✓ SEO validation passed for ${SEO_PAGES.length} fixed route(s), sitemap, robots, 404 and recipe shell`)
