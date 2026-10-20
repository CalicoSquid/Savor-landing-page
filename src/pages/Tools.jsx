import Footer from '../components/Footer'
import { TOOL_PAGES } from '../data/toolPages'
import './pages.css'
import './tools.css'

export default function Tools() {
  return (
    <>
      <main className="page doc-page tools-page">
        <div className="doc-inner tools-inner">
          <span className="doc-eyebrow">From Savor</span>
          <h1 className="doc-title">Free kitchen tools</h1>
          <p className="doc-lead">
            Scale recipes, convert measurements and plan what to cook. Pick a tool below; no account needed.
          </p>

          <div className="tools-grid" aria-label="All free Savor kitchen tools">
            {TOOL_PAGES.map((tool) => (
              <a className="tool-card" href={tool.href} key={tool.id}>
                <span className="tool-card-eyebrow">{tool.category}</span>
                <h2>{tool.title}</h2>
                <p>{tool.description}</p>
                <span className="tool-card-action">{tool.action} →</span>
              </a>
            ))}
          </div>
          <div className="doc-cta">
            <h2>Finish with a kitchen close-down</h2>
            <p>Free printable checklist, leftover labels and fridge reference. Download in A4 or US Letter.</p>
            <a href="/food-safety-printables/">Get the free food-safety printables →</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
