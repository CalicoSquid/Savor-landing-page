import { loadPublicRecipe } from './lib/publicRecipe.js'

const match = window.location.pathname.match(/^\/r\/([^/]+)\/?$/)
if (match) {
  const id = decodeURIComponent(match[1])
  loadPublicRecipe(id, { early: true }).then(recipe => {
    if (window.location.pathname !== `/r/${match[1]}` && window.location.pathname !== `/r/${match[1]}/`) return
    if (!recipe?.image) return
    const url = new URL(recipe.image, window.location.origin)
    if (!['https:', 'http:'].includes(url.protocol)) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url.href
    link.fetchPriority = 'high'
    link.referrerPolicy = 'no-referrer'
    document.head.appendChild(link)
    // The rendered image takes over; do not keep hints across route changes.
    setTimeout(() => link.remove(), 15000)
  }).catch(() => { /* React retains its normal error and retry flow. */ })
}
