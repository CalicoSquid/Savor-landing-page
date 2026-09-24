import Footer from '../components/Footer'
import { TOOL_PAGES } from '../data/toolPages'
import './pages.css'
import './tools.css'

export default function Tools() {
  return (
    <>
      <main className="page doc-page tools-page">
        <div className="doc-inner tools-inner">
          <span className="doc-eyebrow">Free kitchen tools</span>
          <h1 className="doc-title">Free kitchen tools for real cooking problems.</h1>
          <p className="doc-lead">
            Scale a recipe, convert cups to grams, resize a baking recipe for another pan, work out food for a crowd, find a sensible ingredient substitute, calculate fermentation salt, untangle dough hydration — or let Potluck decide what to cook tonight. No account, no ads — just useful cooking tools made by a chef.
          </p>

          <nav className="tool-problem-nav" aria-labelledby="tool-problem-title">
            <span className="tool-card-eyebrow">Start with the problem</span>
            <h2 id="tool-problem-title">What are you trying to fix?</h2>
            <div className="tool-problem-links">
              {TOOL_PAGES.map((tool) => (
                <a href={tool.href} key={tool.id}>
                  <span>{tool.problem}</span>
                  <strong>{tool.title} →</strong>
                </a>
              ))}
            </div>
          </nav>

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

          <section className="tools-trust" aria-labelledby="tools-trust-title">
            <div>
              <span className="tool-card-eyebrow">Why Savor tools?</span>
              <h2 id="tools-trust-title">Kitchen judgement first. Tool second.</h2>
            </div>
            <div>
              <p>
                These are small utilities built around the awkward bits that actually come up while cooking — from kitchen maths to the surprisingly hard question of what to make for dinner. Where a number is only an estimate, the tool says so instead of pretending the kitchen is a spreadsheet.
              </p>
              <p>
                The measurement converter also uses the same growing ingredient-conversion library as the Savor app, so improvements to Savor’s cooking data improve the free web tool too.
              </p>
              <a href="/blog/how-to-scale-a-recipe/" className="tool-inline-link">Read the chef’s guide to scaling recipes →</a>
            </div>
          </section>

          <section className="tools-coming" aria-labelledby="tools-coming-title">
            <span className="tool-card-eyebrow">Eight tools and counting</span>
            <h2 id="tools-coming-title">The kitchen problem-solving drawer is getting suspiciously useful.</h2>
            <p>We’ll keep adding tools when they solve a real cooking problem — not just to manufacture another calculator page.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
