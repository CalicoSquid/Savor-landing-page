// netlify/edge-functions/recipe-og.js
// Intercepts /r/:id requests from social crawlers and injects OG meta tags.
// Real users pass through to the normal React SPA.

const CRAWLERS = [
  'whatsapp', 'facebookexternalhit', 'twitterbot', 'slackbot',
  'telegrambot', 'linkedinbot', 'discordbot', 'pinterest',
  'googlebot', 'bingbot', 'applebot', 'iframely',
]

const APOLLO_URI = 'https://savor-app-server-gql-production.up.railway.app/graphql'

const QUERY = `
  query PublicRecipe($id: ID!) {
    publicRecipe(id: $id) {
      name
      description
      image
      cuisine
      category
    }
  }
`

function isCrawler(userAgent = '') {
  const ua = userAgent.toLowerCase()
  return CRAWLERS.some(bot => ua.includes(bot))
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default async function handler(request, context) {
  const userAgent = request.headers.get('user-agent') || ''

  // Pass real users straight through to the React app
  if (!isCrawler(userAgent)) {
    return context.next()
  }

  // Extract recipe ID from URL path /r/:id
  const url = new URL(request.url)
  const id = url.pathname.replace(/^\/r\//, '').split('/')[0]

  if (!id) return context.next()

  try {
    const res = await fetch(APOLLO_URI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { id } }),
    })

    const { data } = await res.json()
    const recipe = data?.publicRecipe

    if (!recipe) return context.next()

    const title = escapeHtml(recipe.name)
    const desc = escapeHtml(
      recipe.description ||
      `${recipe.cuisine || recipe.category || 'A'} recipe saved on Savor`.trim()
    )
    const image = recipe.image || 'https://getsavor.recipes/images/savor-final.png'
    const pageUrl = escapeHtml(request.url)

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title} · Savor</title>
  <meta name="description" content="${desc}" />

  <!-- Open Graph -->
  <meta property="og:type"        content="article" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image"       content="${image}" />
  <meta property="og:url"         content="${pageUrl}" />
  <meta property="og:site_name"   content="Savor" />

  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image"       content="${image}" />

  <!-- No indexing for private recipe pages -->
  <meta name="robots" content="noindex, nofollow" />

  <!-- Redirect real users to the actual React app -->
  <meta http-equiv="refresh" content="0; url=${pageUrl}" />
</head>
<body>
  <p>Loading recipe…</p>
</body>
</html>`

    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  } catch {
    // On any error just fall through to the React app
    return context.next()
  }
}

export const config = { path: '/r/*' }