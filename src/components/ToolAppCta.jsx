import { PLAY_URL } from '../data/seoPages'

export default function ToolAppCta() {
  return (
    <aside className="tool-shell tool-app-cta" data-nosnippet="" aria-label="Savor recipe app">
      <p><strong>Keep your recipes in Savor.</strong> Save recipes, adjust servings and add your cooking notes.</p>
      <a href={PLAY_URL} target="_blank" rel="noreferrer" className="tool-app-button">Get Savor <span aria-hidden="true">→</span></a>
    </aside>
  )
}
