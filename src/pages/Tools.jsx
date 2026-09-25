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
        </div>
      </main>
      <Footer />
    </>
  )
}
