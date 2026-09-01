// netlify/edge-functions/recipe-og.js
//
// /r/:id is client-rendered for humans. Crawlers need server HTML, so this
// edge function is the source of truth for recipe indexability:
//   - original Savor recipes: full indexable Recipe HTML
//   - imported recipes: noindex + canonical back to the original publisher
//   - social preview bots: thin noindex OG card

const SEARCH_CRAWLERS = [
  'googlebot', 'bingbot', 'applebot', 'duckduckbot', 'yandexbot',
  'oai-searchbot', 'perplexitybot', 'claudebot',
  // SEO audit crawlers must see the same indexability Google sees. Without
  // these, Ahrefs receives app.html (intentionally noindex) and reports every
  // sitemap recipe as a false "noindex page in sitemap" error.
  'ahrefsbot', 'ahrefssiteaudit', 'semrushbot', 'mj12bot', 'dotbot', 'seobilitybot',
  'screaming frog seo spider', 'sitebulb',
]
const SOCIAL_CRAWLERS = [
  'whatsapp', 'facebookexternalhit', 'twitterbot', 'slackbot',
  'telegrambot', 'linkedinbot', 'discordbot', 'pinterest', 'iframely',
]

const APOLLO_URI = 'https://savor-app-server-gql-production.up.railway.app/graphql'
const SITE_URL = 'https://getsavor.recipes'
const DEFAULT_IMAGE = `${SITE_URL}/images/savor-og.jpg`

const QUERY = `
  query PublicRecipe($id: ID!) {
    publicRecipe(id: $id) {
      name
      description
      image
      ingredients
      ingredientGroups { label startIndex }
      instructions
      category
      cuisine
      sourceUrl
      times { prep { hours minutes } cook { hours minutes } total { hours minutes } }
      recipeYield
      user { name username }
    }
  }
`

function matchesAny(ua, list) {
  return list.some((bot) => ua.includes(bot))
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function decodeEntities(str = '') {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
}

function cleanText(str = '') {
  return decodeEntities(str).replace(/\s+/g, ' ').trim()
}

function truncateText(str, max) {
  if (str.length <= max) return str
  return `${str.slice(0, Math.max(1, max - 1)).trimEnd()}…`
}

function ingredientText(ing) {
  if (typeof ing === 'string') return decodeEntities(ing)
  return decodeEntities(`${ing.amount ?? ''} ${ing.unit ?? ''} ${ing.name ?? ''}`.trim())
}

function stepText(step) {
  if (typeof step === 'string') return decodeEntities(step)
  return decodeEntities(step.text || step.instruction || '')
}

function isoDuration(t) {
  if (!t) return undefined
  return `PT${t.hours || 0}H${t.minutes || 0}M`
}

function buildJsonLd(recipe, pageUrl) {
  const author = recipe.user?.name || recipe.user?.username
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: decodeEntities(recipe.name),
    description: recipe.description ? decodeEntities(recipe.description) : undefined,
    image: recipe.image || undefined,
    author: author ? { '@type': 'Person', name: author } : undefined,
    recipeCategory: recipe.category || undefined,
    recipeCuisine: recipe.cuisine || undefined,
    recipeYield: recipe.recipeYield || undefined,
    recipeIngredient: recipe.ingredients?.map(ingredientText),
    recipeInstructions: recipe.instructions?.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: stepText(step),
    })),
    url: pageUrl,
    mainEntityOfPage: pageUrl,
  }
  if (recipe.times?.prep) ld.prepTime = isoDuration(recipe.times.prep)
  if (recipe.times?.cook) ld.cookTime = isoDuration(recipe.times.cook)
  if (recipe.times?.total) ld.totalTime = isoDuration(recipe.times.total)
  return JSON.stringify(ld).replace(/</g, '\\u003c')
}

function baseHead({ metaTitle, displayTitle, desc, image, pageUrl }) {
  return `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${metaTitle}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${displayTitle}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:image:alt" content="${displayTitle}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="Savor" />
  <meta property="og:locale" content="en_GB" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${displayTitle}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:alt" content="${displayTitle}" />`
}

function thinStub({ metaTitle, displayTitle, desc, image, pageUrl, canonicalUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>${baseHead({ metaTitle, displayTitle, desc, image, pageUrl })}
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="noindex, follow" />
</head>
<body>
  <p>Shared with Savor.</p>
  <p><a href="${SITE_URL}/">Visit Savor</a></p>
</body>
</html>`
}

function fullPage({ recipe, metaTitle, displayTitle, desc, image, pageUrl }) {
  const ingredientsHtml = (recipe.ingredients || [])
    .map((ing) => `<li>${escapeHtml(ingredientText(ing))}</li>`)
    .join('\n      ')
  const instructionsHtml = (recipe.instructions || [])
    .map((step) => `<li>${escapeHtml(stepText(step))}</li>`)
    .join('\n      ')
  const author = recipe.user?.name || recipe.user?.username
  const jsonLd = buildJsonLd(recipe, pageUrl)

  return `<!DOCTYPE html>
<html lang="en">
<head>${baseHead({ metaTitle, displayTitle, desc, image, pageUrl })}
  <link rel="canonical" href="${pageUrl}" />
  <meta name="robots" content="index, follow" />
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <main>
    <nav aria-label="Savor"><a href="${SITE_URL}/">Savor</a> · <a href="${SITE_URL}/recipes/">Community recipes</a></nav>
    <h1>${displayTitle}</h1>
    ${desc ? `<p>${desc}</p>` : ''}
    ${author ? `<p>Saved by ${escapeHtml(author)} on Savor</p>` : ''}
    ${image ? `<img src="${image}" alt="${displayTitle}" />` : ''}
    ${ingredientsHtml ? `<h2>Ingredients</h2>\n    <ul>\n      ${ingredientsHtml}\n    </ul>` : ''}
    ${instructionsHtml ? `<h2>Instructions</h2>\n    <ol>\n      ${instructionsHtml}\n    </ol>` : ''}
    <p><a href="https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes">Save recipes from anywhere with Savor →</a></p>
  </main>
</body>
</html>`
}

function crawlerStatusPage(status, title, message) {
  return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>${escapeHtml(title)}</title><meta name="robots" content="noindex, follow" /></head><body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><p><a href="${SITE_URL}/recipes/">Browse Savor recipes</a></p></main></body></html>`, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': status === 404 ? 'public, max-age=60, s-maxage=600' : 'no-store',
      ...(status === 503 ? { 'retry-after': '300' } : {}),
    },
  })
}

export default async function handler(request, context) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()
  const isSearchBot = matchesAny(userAgent, SEARCH_CRAWLERS)
  const isSocialBot = matchesAny(userAgent, SOCIAL_CRAWLERS)

  if (!isSearchBot && !isSocialBot) return context.next()

  const url = new URL(request.url)
  const id = url.pathname.replace(/^\/r\//, '').split('/')[0]
  if (!id) return context.next()

  try {
    const res = await fetch(APOLLO_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-crawler-fetch': '1',
      },
      body: JSON.stringify({ query: QUERY, variables: { id } }),
    })
    if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`)

    const payload = await res.json()
    if (payload.errors?.length) throw new Error(payload.errors[0].message)
    const recipe = payload.data?.publicRecipe
    if (!recipe) {
      return isSearchBot
        ? crawlerStatusPage(404, 'Recipe not found — Savor', 'This shared recipe is no longer available.')
        : context.next()
    }

    const rawTitle = cleanText(recipe.name || 'Shared recipe')
    const displayTitle = escapeHtml(rawTitle)
    const metaTitle = escapeHtml(`${truncateText(rawTitle, 50)} · Savor`)
    const rawDesc = cleanText(
      recipe.description || `${recipe.cuisine || recipe.category || 'A'} recipe shared on Savor`,
    )
    const desc = escapeHtml(truncateText(rawDesc, 155))
    let image = DEFAULT_IMAGE
    try { image = new URL(recipe.image || DEFAULT_IMAGE, SITE_URL).href } catch { image = DEFAULT_IMAGE }
    image = escapeHtml(image)
    const pageUrl = escapeHtml(`${SITE_URL}/r/${encodeURIComponent(id)}`)
    const isOriginal = !recipe.sourceUrl

    let html
    if (isSearchBot && isOriginal) {
      html = fullPage({ recipe, metaTitle, displayTitle, desc, image, pageUrl })
    } else if (isSearchBot) {
      html = thinStub({
        metaTitle,
        displayTitle,
        desc,
        image,
        pageUrl,
        canonicalUrl: escapeHtml(recipe.sourceUrl),
      })
    } else {
      html = thinStub({ metaTitle, displayTitle, desc, image, pageUrl, canonicalUrl: pageUrl })
    }

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    if (isSearchBot) {
      return crawlerStatusPage(503, 'Recipe temporarily unavailable — Savor', 'Please try this recipe again shortly.')
    }
    return context.next()
  }
}

export const config = { path: '/r/*' }
