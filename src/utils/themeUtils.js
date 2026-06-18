// Shared icon helpers — used by Nav and Savor page
const ICON_EXCEPTIONS = { Feijoa: 'icon-Feijoah.webp' }

export function getIcon(name) {
  return `/icons/${ICON_EXCEPTIONS[name] || `icon-${name}.webp`}`
}