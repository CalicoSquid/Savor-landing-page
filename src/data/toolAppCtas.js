import { PLAY_URL } from './seoPages.js'

export const TOOL_APP_CTAS = {
  'portion-planner': {
    headline: 'Keep this portion calculator in your pocket',
    body: 'Plan portions in Savor alongside your saved recipes and other kitchen tools.',
  },
  'measurement-converter': {
    headline: 'Convert measurements while you cook',
    body: 'Convert cooking measurements, including ingredient-specific cups to grams, alongside your recipes in Savor.',
  },
  'pan-converter': {
    headline: 'Resize the pan — and the recipe',
    body: 'Compare pan sizes in Savor and apply the multiplier to your recipe’s ingredients for this cook. Your saved recipe stays unchanged.',
  },
  'brine-calculator': {
    headline: 'Keep your brine calculator in Savor',
    body: 'Calculate salt by water weight or food and water weight, alongside your recipes and other kitchen tools.',
  },
  'bakers-percentage': {
    headline: 'Check dough hydration in Savor',
    body: 'Calculate dough hydration, including the flour and water in your starter, alongside your saved recipes.',
  },
  'recipe-scaler': {
    headline: 'Scale the recipe where you saved it',
    body: 'Save a recipe in Savor and scale its ingredients whenever you cook it — no copying values into a separate calculator.',
  },
}

export function toolAppInstallUrl(tool) {
  if (!TOOL_APP_CTAS[tool]) return PLAY_URL
  const url = new URL(PLAY_URL)
  url.searchParams.set('referrer', new URLSearchParams({
    utm_source: 'savor_web',
    utm_medium: 'tool_cta',
    utm_campaign: 'kitchen_tools',
    utm_content: tool.replaceAll('-', '_'),
  }).toString())
  return url.toString()
}
