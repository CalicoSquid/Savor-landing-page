import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { SEO_PAGES, SITE_URL } from '../src/data/seoPages.js'
import { PUBLIC_RECIPE_INDEX } from '../src/data/publicRecipeIndex.generated.js'
import { ORIGIN, KEY, MANIFEST_PATH } from './lib/indexnow.js'
import { buildManifestEntries } from './lib/indexnow-fingerprints.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
try {
  if (SITE_URL !== ORIGIN) throw new Error('Site origin mismatch')
  if (fs.readFileSync(path.join(dist, `${KEY}.txt`), 'utf8').trim() !== KEY) throw new Error('Verification file missing or mismatched')
  const revisions = JSON.parse(fs.readFileSync(path.join(root, 'indexnow-revisions.json'), 'utf8'))
  const recipeSnapshot = JSON.parse(fs.readFileSync(path.join(root, '.indexnow-recipes.json'), 'utf8'))
  const sitemap = new Set([...fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]))
  const entries = buildManifestEntries({ pages: SEO_PAGES, recipes: PUBLIC_RECIPE_INDEX, recipeSnapshot, sitemap, revisions, readPage: file => fs.readFileSync(path.join(dist, file), 'utf8') })
  const manifest = { version: 1, origin: ORIGIN, context: process.env.CONTEXT || 'local', deployId: process.env.DEPLOY_ID || null, entries }
  fs.writeFileSync(path.join(dist, MANIFEST_PATH.slice(1)), JSON.stringify(manifest))
  console.log(`[IndexNow] prepared ${Object.keys(entries).length} eligible content fingerprints; no submissions during build`)
} catch (error) {
  // This additive subsystem must never break a build or publish a partial
  // snapshot that could misclassify existing URLs as removed.
  fs.rmSync(path.join(dist, MANIFEST_PATH.slice(1)), { force: true })
  console.warn(`[IndexNow] notifications disabled for this build: ${error.message}`)
}
