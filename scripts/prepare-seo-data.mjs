// Build-time recipe SEO manifest.
//
// sitemapRecipes tells us which shared recipes are public, but indexability is
// decided by source provenance: original Savor recipes may rank here; imported
// recipes canonicalise back to the publisher. Resolve that once before the
// site build, then use this exact manifest for both /recipes/ and sitemap.xml.
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'src', 'data', 'publicRecipeIndex.generated.js')
const APOLLO_URI = process.env.VITE_APOLLO_URI || 'https://savor-app-server-gql-production.up.railway.app/graphql'

const INDEX_QUERY = `
  query SitemapRecipes {
    sitemapRecipes {
      id
      updatedAt
    }
  }
`

const RECIPE_QUERY = `
  query PublicRecipeForSeo($id: ID!) {
    publicRecipe(id: $id) {
      name
      description
      image
      sourceUrl
    }
  }
`

async function graphql(query, variables) {
  const res = await fetch(APOLLO_URI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-crawler-fetch': '1',
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`)
  const payload = await res.json()
  if (payload.errors?.length) throw new Error(payload.errors[0].message)
  return payload.data
}

async function mapWithConcurrency(items, limit, worker) {
  const out = new Array(items.length)
  let cursor = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      out[index] = await worker(items[index], index)
    }
  })
  await Promise.all(runners)
  return out
}

try {
  const data = await graphql(INDEX_QUERY)
  const candidates = data?.sitemapRecipes || []

  const resolved = await mapWithConcurrency(candidates, 6, async (candidate) => {
    const detail = await graphql(RECIPE_QUERY, { id: candidate.id })
    const recipe = detail?.publicRecipe

    // A candidate can disappear between the index query and the detail query.
    if (!recipe?.name) return null

    // Imported recipes deliberately canonicalise to their original publisher,
    // so advertising them in our sitemap would create a noindex/sitemap clash.
    if (recipe.sourceUrl) return null

    return {
      id: String(candidate.id),
      name: String(recipe.name).replace(/\s+/g, ' ').trim(),
      description: String(recipe.description || '').replace(/\s+/g, ' ').trim(),
      image: recipe.image || null,
      updatedAt: candidate.updatedAt || null,
    }
  })

  const recipes = resolved.filter(Boolean)
  const seen = new Set()
  for (const recipe of recipes) {
    if (seen.has(recipe.id)) throw new Error(`Duplicate sitemap recipe id: ${recipe.id}`)
    seen.add(recipe.id)
  }

  const safeJson = JSON.stringify(recipes, null, 2).replace(/</g, '\\u003c')
  fs.writeFileSync(
    output,
    `// Generated at build time by scripts/prepare-seo-data.mjs.\nexport const PUBLIC_RECIPE_INDEX = ${safeJson}\n`,
  )
  console.log(`✓ SEO recipe data: ${recipes.length} indexable original recipe(s) from ${candidates.length} public candidate(s)`)
} catch (error) {
  // Publishing a fresh build with an empty/partial recipe manifest would remove
  // valid URLs from both the sitemap and their parent hub. Safer to keep the
  // current live deployment and retry the build after the API recovers.
  console.error(`✗ Could not prepare recipe SEO data: ${error.message}`)
  process.exit(1)
}
