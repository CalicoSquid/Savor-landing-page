// netlify/edge-functions/recipe-og.js
//
// Recipe pages are client-rendered and NOT prerendered (see prerender.js),
// so this edge function is the only thing that ever serves real HTML to
// crawlers at /r/:id. Two crawler classes, two jobs:
//
//   SEARCH bots (Googlebot etc.) — need actual indexable content.
//     - Original recipes (no sourceUrl: scans/OCR/handwritten) get full
//       server-rendered content + Recipe JSON-LD + index,follow + a
//       self-canonical. This is the only content Google will ever see for
//       these, since the real SPA route isn't prerendered.
//     - Scraped recipes (has sourceUrl) get a thin stub, noindex, and a
//       canonical pointing at the original source — we don't try to
//       duplicate-rank against the site we scraped from.
//
//   SOCIAL bots (WhatsApp, Slack, etc.) — only need OG/Twitter tags for a
//     link preview card. Always thin, always noindex, always redirect real
//     humans on through to the SPA.

const SEARCH_CRAWLERS = [
  'googlebot', 'bingbot', 'applebot', 'duckduckbot',
  'oai-searchbot', 'perplexitybot', 'claudebot',
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
  return list.some(bot => ua.includes(bot))
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Server-side data can contain HTML entities from scraping/OCR; there's no
// DOM here (Deno edge runtime), so decode the common ones by hand.
function decodeEntities(str = '') {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
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
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: decodeEntities(recipe.name),
    description: recipe.description ? decodeEntities(recipe.description) : undefined,
    image: recipe.image || undefined,
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
  }
  if (recipe.times?.prep) ld.prepTime = isoDuration(recipe.times.prep)
  if (recipe.times?.cook) ld.cookTime = isoDuration(recipe.times.cook)
  if (recipe.times?.total) ld.totalTime = isoDuration(recipe.times.total)
  return JSON.stringify(ld).replace(/</g, '\\u003c')
}

function baseHead({ title, desc, image, pageUrl }) {
  return `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · Savor</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type"        content="article" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image"       content="${image}" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:image:alt"   content="${title}" />
  <meta property="og:url"         content="${pageUrl}" />
  <meta property="og:site_name"   content="Savor" />
  <meta property="og:locale"      content="en_GB" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image"       content="${image}" />
  <meta name="twitter:image:alt"   content="${title}" />`
}

// Thin stub: used for scraped recipes (search bots) and always for social
// bots. Redirects real humans on through if they ever hit this directly.
function thinStub({ title, desc, image, pageUrl, canonicalUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>${baseHead({ title, desc, image, pageUrl })}
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="noindex, follow" />
  <meta http-equiv="refresh" content="0; url=${pageUrl}" />
</head>
<body>
  <p>Loading recipe…</p>
</body>
</html>`
}

// Full page: used for original (non-scraped) recipes served to search bots.
// This is the only HTML Google will ever see for these URLs, so it needs to
// actually contain the recipe — no meta-refresh, since we want this exact
// URL indexed and crawled, not bounced onward.
function fullPage({ recipe, title, desc, image, pageUrl }) {
  const ingredientsHtml = (recipe.ingredients || [])
    .map(ing => `<li>${escapeHtml(ingredientText(ing))}</li>`)
    .join('\n      ')
  const instructionsHtml = (recipe.instructions || [])
    .map(step => `<li>${escapeHtml(stepText(step))}</li>`)
    .join('\n      ')
  const author = recipe.user?.name || recipe.user?.username
  const jsonLd = buildJsonLd(recipe, pageUrl)

  return `<!DOCTYPE html>
<html lang="en">
<head>${baseHead({ title, desc, image, pageUrl })}
  <link rel="canonical" href="${pageUrl}" />
  <meta name="robots" content="index, follow" />
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <main>
    <h1>${title}</h1>
    ${desc ? `<p>${desc}</p>` : ''}
    ${author ? `<p>Saved by ${escapeHtml(author)} on Savor</p>` : ''}
    ${image ? `<img src="${image}" alt="${title}" />` : ''}
    ${ingredientsHtml ? `<h2>Ingredients</h2>\n    <ul>\n      ${ingredientsHtml}\n    </ul>` : ''}
    ${instructionsHtml ? `<h2>Instructions</h2>\n    <ol>\n      ${instructionsHtml}\n    </ol>` : ''}
    <p><a href="https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes">Save recipes from anywhere with Savor →</a></p>
  </main>
</body>
</html>`
}

export default async function handler(request, context) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()
  const isSearchBot = matchesAny(userAgent, SEARCH_CRAWLERS)
  const isSocialBot = matchesAny(userAgent, SOCIAL_CRAWLERS)

  // Real users pass straight through to the React SPA.
  if (!isSearchBot && !isSocialBot) {
    return context.next()
  }

  const url = new URL(request.url)
  const id = url.pathname.replace(/^\/r\//, '').split('/')[0]
  if (!id) return context.next()

  try {
    const res = await fetch(APOLLO_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Tells the server this fetch is us rendering for a bot, not a
        // real visitor — see publicRecipe's RecipeLinkAccess logging.
        'x-internal-crawler-fetch': '1',
      },
      body: JSON.stringify({ query: QUERY, variables: { id } }),
    })

    const { data } = await res.json()
    const recipe = data?.publicRecipe
    if (!recipe) return context.next()

    const title = escapeHtml(decodeEntities(recipe.name))
    const rawDesc = decodeEntities(
      recipe.description ||
      `${recipe.cuisine || recipe.category || 'A'} recipe saved on Savor`.trim()
    ).replace(/\s+/g, ' ').trim()
    const desc = escapeHtml(rawDesc.length > 180 ? `${rawDesc.slice(0, 177).trimEnd()}…` : rawDesc)
    let image = DEFAULT_IMAGE
    try { image = new URL(recipe.image || DEFAULT_IMAGE, SITE_URL).href } catch { image = DEFAULT_IMAGE }
    image = escapeHtml(image)
    const pageUrl = escapeHtml(`${SITE_URL}/r/${encodeURIComponent(id)}`)
    const isOriginal = !recipe.sourceUrl

    let html
    if (isSearchBot && isOriginal) {
      html = fullPage({ recipe, title, desc, image, pageUrl })
    } else if (isSearchBot) {
      // Scraped — don't index, point at the real source instead.
      html = thinStub({ title, desc, image, pageUrl, canonicalUrl: escapeHtml(recipe.sourceUrl) })
    } else {
      // Social preview bot — just needs the card, always noindex.
      html = thinStub({ title, desc, image, pageUrl, canonicalUrl: pageUrl })
    }

    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  } catch {
    // On any error just fall through to the React app.
    return context.next()
  }
}

export const config = { path: '/r/*' }