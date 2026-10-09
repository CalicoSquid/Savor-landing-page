export function isSavorVisit(search = '') {
  return new URLSearchParams(search).get('from') === 'savor'
}

export function savorRecipeLink(id, android = false) {
  const recipeUrl = `https://getsavor.recipes/r/${encodeURIComponent(id)}`
  const route = `create?url=${encodeURIComponent(recipeUrl)}`
  return android
    ? `intent://${route}#Intent;scheme=savor;package=com.calicosquid.savorrecipes;S.browser_fallback_url=${encodeURIComponent(recipeUrl)};end`
    : `savor://${route}`
}
