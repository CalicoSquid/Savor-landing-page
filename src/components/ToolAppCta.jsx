import { TOOL_APP_CTAS, toolAppInstallUrl } from '../data/toolAppCtas'

export default function ToolAppCta({ tool, headline, body }) {
  const copy = TOOL_APP_CTAS[tool]
  const title = headline || copy?.headline || 'Keep your recipes in Savor.'
  const description = body || copy?.body || 'Save recipes, adjust servings and add your cooking notes.'
  return (
    <aside className="tool-shell tool-app-cta" data-nosnippet="" aria-label="Savor recipe app">
      <div className="tool-app-copy">
        <p><strong>{title}</strong></p>
        <p>{description}</p>
      </div>
      <a href={toolAppInstallUrl(tool)} target="_blank" rel="noreferrer" className="tool-app-button" aria-label="Get Savor on Google Play (opens in a new tab)">Get Savor <span aria-hidden="true">→</span></a>
    </aside>
  )
}
