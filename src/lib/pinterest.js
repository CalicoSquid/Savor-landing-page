import { PINTEREST_RECIPES } from '../data/pinterest.js'

const SITE_URL = 'https://getsavor.recipes'
const text = value => String(value || '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
const limit = (value, length) => value.length <= length ? value : `${value.slice(0, length - 1).trimEnd()}…`
function webUrl(value) {
  if (!value) return ''
  try { const url = new URL(value, SITE_URL); return ['https:', 'http:'].includes(url.protocol) ? url.href : '' } catch { return '' }
}

export function createPinterestDetails({ title, description, altText, image, url }) {
  return {
    title: limit(text(title), 100),
    description: limit(text(description || title), 500),
    altText: limit(text(altText || `Photo of ${text(title)}`), 500),
    image: webUrl(image), url: webUrl(url) || SITE_URL,
  }
}
export function originalPinterestDetails(post) {
  return createPinterestDetails({
    title: post.title, description: post.dek, altText: post.ogImageAlt,
    ...PINTEREST_RECIPES[post.slug], image: post.ogImage,
    url: `${SITE_URL}/blog/${post.slug}/`,
  })
}
export function recipePinterestDetails(recipe, url) {
  const total = recipe.times?.total
  const mins = Number(total?.hours || 0) * 60 + Number(total?.minutes || 0)
  const context = [recipe.description, Number.isFinite(mins) && mins > 0 ? `Total time: ${mins} minutes.` : '', recipe.recipeYield ? `Makes ${text(recipe.recipeYield)}.` : ''].filter(Boolean).join(' ')
  let attribution = ''
  if (recipe.sourceUrl) { try { const source = new URL(recipe.sourceUrl); if (['https:', 'http:'].includes(source.protocol)) attribution += ` Original recipe: ${source.hostname.replace(/^www\./, '')}.` } catch { /* No unverified publisher attribution. */ } }
  if (recipe.imageCredit?.photographer) attribution += ` Photo: ${limit(text(recipe.imageCredit.photographer), 100)}.`
  attribution = limit(attribution, 200)
  const description = `${limit(text(context || `Find the ingredients and method for ${text(recipe.name)} on Savor.`), 500 - attribution.length)}${attribution}`
  return createPinterestDetails({ title: recipe.name, description, altText: recipe.imageAlt || `Photo of ${text(recipe.name)}`, image: recipe.image, url })
}
// Share-only variants: never fetch larger images during an ordinary page visit.
export function pinterestMediaUrl(image) {
  const original = webUrl(image)
  if (!original) return ''
  const url = new URL(original)
  const supported = url.protocol === 'https:' && (
    (url.hostname === 'images.unsplash.com' && url.pathname.startsWith('/photo-')) ||
    (url.hostname === 'images.pexels.com' && url.pathname.startsWith('/photos/'))
  )
  if (!supported) return original
  const width = Number(url.searchParams.get('w'))
  const height = Number(url.searchParams.get('h'))
  if (width >= 1200 || (!width && height)) return original
  if (width > 0 && height > 0) url.searchParams.set('h', String(Math.round(height * 1200 / width)))
  url.searchParams.set('w', '1200')
  return url.href
}

export function pinterestSaveUrl(details) {
  const params = new URLSearchParams({ url: details.url, description: details.description })
  if (details.image) params.set('media', pinterestMediaUrl(details.image))
  // The Save endpoint documents url/media/description, not title or alt_text.
  return `https://www.pinterest.com/pin/create/button/?${params}`
}
export function pinterestImageAttributes(details) {
  return { 'data-pin-description': details.description, 'data-pin-url': details.url, ...(details.image ? { 'data-pin-media': pinterestMediaUrl(details.image) } : {}) }
}
