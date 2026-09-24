import { useMemo, useState } from 'react'
import '@fontsource/jetbrains-mono/600.css'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import { PLAY_URL } from '../data/seoPages'
import {
  APPETITE_LEVELS,
  LEFTOVER_LEVELS,
  PORTION_FOODS,
  PORTION_ROLES,
  buildPortionNotes,
  calculatePortions,
  formatPortionQuantity,
} from '../lib/portionPlanner'
import './pages.css'
import './tools.css'

const EXAMPLES = [
  { label: 'Pasta for 12', foodId: 'pasta-dry', adults: 12, children: 0, role: 'main' },
  { label: 'Rice for 20', foodId: 'rice-dry', adults: 20, children: 0, role: 'side' },
  { label: 'BBQ meat for 10', foodId: 'boneless-meat', adults: 10, children: 0, role: 'main' },
  { label: 'Family roast', foodId: 'potatoes', adults: 6, children: 4, role: 'side' },
]

function NumberField({ label, value, onChange, min = 0 }) {
  return (
    <label className="converter-field portion-number-field">
      <span>{label}</span>
      <input type="number" min={min} step="1" inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export default function PortionPlanner() {
  const [foodId, setFoodId] = useState('pasta-dry')
  const [adults, setAdults] = useState('8')
  const [children, setChildren] = useState('2')
  const [role, setRole] = useState('main')
  const [appetite, setAppetite] = useState('normal')
  const [leftovers, setLeftovers] = useState('little')
  const [system, setSystem] = useState('metric')

  const result = useMemo(() => calculatePortions({ foodId, adults, children, role, appetite, leftovers }), [foodId, adults, children, role, appetite, leftovers])
  const notes = useMemo(() => buildPortionNotes(result), [result])

  function applyExample(example) {
    setFoodId(example.foodId)
    setAdults(String(example.adults))
    setChildren(String(example.children))
    setRole(example.role)
    setAppetite('normal')
    setLeftovers('none')
  }

  return (
    <>
      <main className="page tool-page">
        <section className="tool-hero">
          <div className="tool-shell">
            <a href="/tools/" className="tool-back-link">← Free kitchen tools</a>
            <span className="doc-eyebrow">Free portion planner</span>
            <h1>Calculate how much food you need — without cooking for an army.</h1>
            <p className="tool-lead">
              Tell Savor who is eating, what you are serving and how hungry everyone is. Get a practical shopping quantity with room for kids, buffets and leftovers.
            </p>
          </div>
        </section>

        <section className="tool-shell portion-planner-section" aria-label="Food portion planner">
          <div className="portion-example-row" aria-label="Quick portion examples">
            <span>Try:</span>
            {EXAMPLES.map((example) => (
              <button type="button" key={example.label} onClick={() => applyExample(example)}>{example.label}</button>
            ))}
          </div>

          <div className="portion-workspace">
            <div className="portion-controls-card">
              <div className="converter-section-heading portion-heading">
                <span className="scaler-step">1</span>
                <div>
                  <span className="tool-card-eyebrow">The crowd</span>
                  <h2>What are you feeding them?</h2>
                </div>
              </div>

              <label className="converter-field portion-food-field">
                <span>Food</span>
                <select value={foodId} onChange={(event) => setFoodId(event.target.value)}>
                  {PORTION_FOODS.map((food) => (
                    <option value={food.id} key={food.id}>{food.name} — {food.detail}</option>
                  ))}
                </select>
              </label>

              <div className="portion-count-grid">
                <NumberField label="Adults" value={adults} onChange={setAdults} />
                <NumberField label="Children" value={children} onChange={setChildren} />
              </div>
              <p className="scaler-hint">Children are estimated at about 60% of an adult portion. Count teenagers with adult appetites as adults.</p>

              <div className="portion-control-group">
                <span className="portion-control-label">How is it being served?</span>
                <div className="portion-choice-grid is-three">
                  {Object.entries(PORTION_ROLES).map(([key, item]) => (
                    <button type="button" key={key} className={role === key ? 'is-active' : ''} onClick={() => setRole(key)} aria-pressed={role === key}>
                      <strong>{item.shortLabel}</strong>
                      <span>{item.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="portion-control-group">
                <span className="portion-control-label">Appetite</span>
                <div className="portion-choice-grid is-three is-compact">
                  {Object.entries(APPETITE_LEVELS).map(([key, item]) => (
                    <button type="button" key={key} className={appetite === key ? 'is-active' : ''} onClick={() => setAppetite(key)} aria-pressed={appetite === key}>
                      <strong>{item.label}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div className="portion-control-group">
                <span className="portion-control-label">Leftovers</span>
                <div className="portion-choice-grid is-three is-compact">
                  {Object.entries(LEFTOVER_LEVELS).map(([key, item]) => (
                    <button type="button" key={key} className={leftovers === key ? 'is-active' : ''} onClick={() => setLeftovers(key)} aria-pressed={leftovers === key}>
                      <strong>{item.label}</strong>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="portion-result-column">
              <div className="portion-result-toolbar">
                <span className="tool-card-eyebrow">Shopping target</span>
                <div className="system-toggle" role="group" aria-label="Quantity units">
                  <button type="button" className={system === 'metric' ? 'is-active' : ''} onClick={() => setSystem('metric')} aria-pressed={system === 'metric'}>Metric</button>
                  <button type="button" className={system === 'us' ? 'is-active' : ''} onClick={() => setSystem('us')} aria-pressed={system === 'us'}>US</button>
                </div>
              </div>

              <div className={`portion-result-card${result.ok ? '' : ' is-empty'}`} aria-live="polite">
                {result.ok ? (
                  <>
                    <span className="converter-answer-label">Plan on about</span>
                    <strong className="portion-big-number">{formatPortionQuantity(result.total, result.unit, system)}</strong>
                    <h2>{result.food.name}</h2>
                    <p className="portion-result-detail">{result.food.detail} · {PORTION_ROLES[result.role].label.toLowerCase()}</p>

                    <div className="portion-result-stats">
                      <div>
                        <span>Adult-equivalent diners</span>
                        <strong>{Number(result.effectiveDiners.toFixed(1))}</strong>
                      </div>
                      <div>
                        <span>Base adult portion</span>
                        <strong>{formatPortionQuantity(result.basePerAdult, result.unit, system)}</strong>
                      </div>
                      <div>
                        <span>After appetite</span>
                        <strong>{formatPortionQuantity(result.adjustedPerAdult, result.unit, system)}</strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>{result.reason}</p>
                )}
              </div>

              <div className="portion-mini-note">
                <strong>Chef maths, not catering law.</strong>
                <span>Portion sizes are a planning baseline. Your menu, guests and serving style still win.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="tool-shell scaler-notes-section">
          <div className="chef-note-card">
            <span className="chef-note-kicker">Chef reality check</span>
            <h2>The number is the starting point. The menu decides the rest.</h2>
            <ul>{notes.map((note) => <li key={note}>{note}</li>)}</ul>
          </div>
        </section>

        <section className="tool-shell tool-explainer portion-explainer">
          <div>
            <span className="doc-eyebrow">How the planner thinks</span>
            <h2>People are not identical serving spoons.</h2>
            <p>
              The calculator starts with a practical adult portion for the selected food, counts children as a fraction of an adult portion, then adjusts for appetite, serving style and whatever leftover buffer you choose.
            </p>
            <p>
              Buffet portions are deliberately smaller because people are choosing from several dishes. A hungry crowd gets a larger allowance. Leftovers are added last, so “plenty” really means extra food rather than oversized plates.
            </p>
          </div>
          <div className="formula-card" aria-label="Food portion planning formula">
            <span>adult-equivalent diners</span>
            <strong>×</strong>
            <span>portion for this food</span>
            <strong>×</strong>
            <span>appetite + leftover buffer</span>
            <strong>=</strong>
            <span>shopping target</span>
          </div>
        </section>

        <section className="tool-shell portion-search-section">
          <span className="doc-eyebrow">Useful for real questions</span>
          <h2>How much food do I need for a crowd?</h2>
          <div className="portion-search-grid">
            <div><strong>Pasta for 12 people</strong><span>Use dry weight and choose whether it is the main event or a side.</span></div>
            <div><strong>Rice for 20 people</strong><span>Plan uncooked rice before it expands in the pot.</span></div>
            <div><strong>Meat for a BBQ</strong><span>Choose boneless or bone-in and account for hungry guests.</span></div>
            <div><strong>Potatoes for a roast</strong><span>Build in peeling loss, children and leftovers before you shop.</span></div>
          </div>
        </section>

        <RelatedTools current="portion-planner" />

        <section className="tool-shell tool-app-cta" data-nosnippet="">
          <img src="/icons/icon-Tangerine.webp" alt="" width="72" height="72" loading="lazy" decoding="async" />
          <div>
            <span className="tool-card-eyebrow">Once you know how much</span>
            <h2>Scale the actual recipe in Savor.</h2>
            <p>Save recipes from websites, screenshots, cookbooks and handwritten cards, then adjust servings whenever the guest list changes.</p>
          </div>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="btn btn-fruit tool-app-button">Get Savor</a>
        </section>
      </main>
      <Footer />
    </>
  )
}
