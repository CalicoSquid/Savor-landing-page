import { createHash } from 'node:crypto'
import { canonicalUrl } from './indexnow.js'

export const fingerprint = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')

export function recipeFingerprints(recipes) {
  return Object.fromEntries(recipes.filter(({ recipe }) => !recipe.sourceUrl && recipe.isShared === true).map(({ id, recipe }) => [String(id), fingerprint({
    name: recipe.name, description: recipe.description, image: recipe.image,
    ingredients: recipe.ingredients, ingredientGroups: recipe.ingredientGroups,
    instructions: recipe.instructions, recipeYield: recipe.recipeYield, times: recipe.times,
  })]))
}

// Project content into text and content-bearing links/images. Build IDs,
// timestamps, CSS, hydration IDs, global navigation and footers are excluded.
export function pageFingerprint(html, seo, revision = '') {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]
  if (!main) throw new Error(`Missing main content: ${seo.path}`)
  const content = main.replace(/<(footer|nav|script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  const media = [...content.matchAll(/<(?:a|img)\b[^>]*>/gi)].map(m => [...m[0].matchAll(/\b(href|src|alt)="([^"]*)"/g)].map(a => [a[1], a[2]]))
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return fingerprint({ text, media, revision, title: seo.title, description: seo.description, ogTitle: seo.ogTitle, ogDescription: seo.ogDescription, ogImage: seo.ogImage, ogImageAlt: seo.ogImageAlt })
}

export function buildManifestEntries({ pages, recipes, recipeSnapshot, sitemap, readPage, revisions = {} }) {
  const entries = {}
  for (const seo of pages.filter(s => s.sitemap && !/noindex/i.test(s.robots) && s.path !== '/demo')) {
    const url = canonicalUrl(seo.canonical)
    if (url !== seo.canonical || !sitemap.has(url)) throw new Error('Canonical/sitemap mismatch')
    entries[url] = pageFingerprint(readPage(seo.file), seo, revisions[url]?.revision || '')
  }
  for (const recipe of recipes) {
    const url = canonicalUrl(`/r/${encodeURIComponent(recipe.id)}`)
    if (!sitemap.has(url) || recipeSnapshot?.version !== 1 || !recipeSnapshot.completeIds?.includes(recipe.id)) throw new Error('Incomplete original-recipe fingerprint snapshot')
    // Existing sitemap policy also includes bearer-link originals. Preserve
    // that policy, but never notify those personal/non-community recipe URLs.
    const hash = recipeSnapshot.fingerprints[recipe.id]
    if (hash) entries[url] = fingerprint([hash, revisions[url]?.revision || ''])
  }
  return entries
}
