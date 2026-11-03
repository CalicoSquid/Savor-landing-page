import { useState } from 'react'
import '@fontsource/jetbrains-mono/600.css'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import ToolAppCta from '../components/ToolAppCta'
import { formatSaltOunces } from '../lib/brineCalculator'
import {
  BRINE_UNITS, BRINE_WORKFLOWS, BRINE_MODE_DETAILS, brineQuantity,
  displayBrineQuantity, initialBrineBatches, calculateBrineWorkflow, brineResultText, formatBrineSalt,
} from '../lib/brineWorkflow'
import './pages.css'
import './tools.css'

function QuantityField({ kind, label, quantity, unit, onChange, onUnitChange }) {
  return (
    <div className="converter-field">
      <label htmlFor={`brine-${kind}`}>{label}</label>
      <div className="brine-quantity-row">
        <input id={`brine-${kind}`} type="number" min="0" step="any" inputMode="decimal"
          value={displayBrineQuantity(quantity, unit)} onChange={(event) => onChange(brineQuantity(event.target.value, unit))} />
        <select aria-label={`${label} unit`} value={unit} onChange={(event) => onUnitChange(event.target.value)}>
          {Object.entries(BRINE_UNITS).filter(([, item]) => item.kind === kind).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
        </select>
      </div>
    </div>
  )
}

export default function BrineCalculator() {
  const [workflow, setWorkflow] = useState('meat')
  const [methods, setMethods] = useState({ meat: 'wet', vegetables: 'total', concentration: 'ratio' })
  const [batches, setBatches] = useState(initialBrineBatches)
  const [units, setUnits] = useState({ food: 'g', water: 'ml' })
  const [copyStatus, setCopyStatus] = useState('')
  const method = methods[workflow]
  const detail = BRINE_MODE_DETAILS[method]
  const batch = batches[method]
  const result = calculateBrineWorkflow(method, batch)
  const foodLabel = workflow === 'meat' ? 'Meat weight' : 'Vegetable weight'

  function updateBatch(patch) {
    setBatches((current) => ({ ...current, [method]: { ...current[method], ...patch } }))
    setCopyStatus('')
  }

  function applyExample() {
    const example = detail.example
    updateBatch({ food: brineQuantity(String(example.food ?? 0), 'g'), water: brineQuantity(String(example.water ?? 0), 'ml'), percent: String(example.percent) })
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(brineResultText(result))
      setCopyStatus('Copied salt amount, inputs and method.')
    } catch {
      setCopyStatus('Copy unavailable. Select the result text to copy it manually.')
    }
  }

  return (
    <>
      <main className="page tool-page">
        <section className="tool-hero">
          <div className="tool-shell">
            <a href="/tools/" className="tool-back-link">← Free kitchen tools</a>
            <span className="doc-eyebrow">Meat brining · Vegetable fermentation · Salt concentration</span>
            <h1>Brine calculator</h1>
            <p className="tool-lead">Calculate how much salt to add for chicken, turkey, pork or vegetable fermentation. Choose wet brining, dry brining or a salt concentration, and get the salt weight in grams and ounces. Free, no signup.</p>
          </div>
        </section>

        <section className="tool-shell brine-calculator-section" aria-label="Brine calculator">
          <h2 className="brine-section-title">What are you making?</h2>
          <div className="brine-workflow-grid" role="group" aria-label="Brine use">
            {Object.entries(BRINE_WORKFLOWS).map(([id, item]) => (
              <button type="button" key={id} className={workflow === id ? 'is-active' : ''} aria-pressed={workflow === id}
                onClick={() => { setWorkflow(id); setCopyStatus('') }}>{item.label}</button>
            ))}
          </div>
          <div className="brine-workspace">
            <div className="brine-controls-card">
              <h2>Choose your method</h2>
              <div className="brine-method-grid" role="group" aria-label="Brine method">
                {BRINE_WORKFLOWS[workflow].methods.map((id) => {
                  const item = BRINE_MODE_DETAILS[id]
                  return <button type="button" key={id} className={method === id ? 'is-active' : ''} aria-pressed={method === id}
                    onClick={() => { setMethods((current) => ({ ...current, [workflow]: id })); setCopyStatus('') }}>
                    <strong>{item.label}</strong><span>{item.basis}</span><small>{item.description}</small>
                  </button>
                })}
              </div>
              <div className="brine-unit-toolbar">
                <span>Enter your recipe amounts</span>
                <button type="button" className="tool-text-button" onClick={applyExample}>Try an example</button>
              </div>
              <div className="brine-input-grid">
                {detail.food && <QuantityField kind="food" label={foodLabel} quantity={batch.food} unit={units.food}
                  onChange={(food) => updateBatch({ food })} onUnitChange={(food) => setUnits((current) => ({ ...current, food }))} />}
                {detail.water && <QuantityField kind="water" label="Added water" quantity={batch.water} unit={units.water}
                  onChange={(water) => updateBatch({ water })} onUnitChange={(water) => setUnits((current) => ({ ...current, water }))} />}
              </div>
              {detail.water && <p className="scaler-hint">Water is treated as 1 g per ml. Cups and fluid ounces are US measures. Include any ice in the total water amount.</p>}
              <label className="converter-field brine-percent-field" htmlFor="brine-percent">
                <span>Salt percentage from your recipe</span>
                <div className="brine-percent-input">
                  <input id="brine-percent" type="number" min="0.1" max="20" step="any" inputMode="decimal" placeholder="Enter recipe %"
                    aria-describedby="brine-percent-help" value={batch.percent} onChange={(event) => updateBatch({ percent: event.target.value })} /><strong>%</strong>
                </div>
              </label>
              <p className="scaler-hint" id="brine-percent-help">Use your recipe’s percentage and the basis shown above. Examples demonstrate the maths; they are not recommended recipes. The input range is 0.1–20%.</p>
            </div>

            <div className="brine-result-column">
              <span className="tool-card-eyebrow">Salt to add</span>
              <div className={`brine-result-card${result.ok ? '' : ' is-empty'}`} role="status" aria-live="polite" aria-atomic="true">
                {result.ok ? <>
                  <span className="converter-answer-label">Weigh out</span>
                  <strong className="brine-big-number">{formatBrineSalt(result)}</strong>
                  <span className="brine-secondary-number">{formatSaltOunces(result)}</span>
                  <p>{detail.label} · {result.percent}%<br />Based on: {detail.basis.toLowerCase()}</p>
                  <div className="brine-formula-line">{detail.formula}</div>
                  {result.saltG < 1 && <p>Less than 1 g: use a scale with sufficient precision.</p>}
                </> : <p>{result.reason}</p>}
              </div>
              <div className="brine-definition-card"><strong>Percentage basis: {detail.basis}</strong><p>{detail.description}</p>
                <p>Salt percentages are by weight. Use ordinary food salt, not nitrite/nitrate curing salt. This does not calculate equilibrium brining, curing or preservation.</p>
              </div>
              {result.ok && <button type="button" className="btn btn-fruit brine-copy" onClick={copyResult}>Copy calculation</button>}
              <p className="scaler-hint" role="status">{copyStatus}</p>
            </div>
          </div>
        </section>

        <section className="tool-shell scaler-notes-section" aria-label="Brining guidance">
          {workflow === 'meat' ? <div className="chef-note-card brine-chef-note">
            <span className="chef-note-kicker">Meat & poultry</span><h2>Brine in the fridge, then cook as directed</h2>
            <ul>
              <li>Keep the meat and brine refrigerated at 4°C / 40°F or below. Cool a heated brine before adding raw meat and use a food-safe container.</li>
              <li>Follow a suitable recipe for the cut, brine strength and time. Salt weight alone cannot determine how long to brine or make raw meat safe to eat.</li>
              <li>Check the label: kosher, enhanced, self-basting and pre-brined meat may already contain added salt. Do not automatically add another full brine.</li>
              <li>Discard brine after contact with raw meat. Keep raw meat separate from ready-to-eat food, and use a food thermometer when cooking.</li>
            </ul>
            <a className="tool-inline-link" href="https://ask.fsis.usda.gov/article/How-do-you-brine-poultry" target="_blank" rel="noreferrer">USDA poultry brining guidance ↗</a>{' · '}
            <a className="tool-inline-link" href="https://uwyoextension.org/uwnutrition/newsletters/brining-and-marinating-turkey/" target="_blank" rel="noreferrer">Extension: pre-brined poultry ↗</a>
          </div> : workflow === 'vegetables' ? <div className="chef-note-card brine-chef-note">
            <span className="chef-note-kicker">Vegetable fermentation</span><h2>Follow a tested fermentation recipe</h2>
            <ul>
              <li>Match the recipe’s percentage basis: water only or vegetables plus water. These methods are not interchangeable.</li>
              <li>Do not arbitrarily reduce the salt in tested fermented-pickle or sauerkraut recipes. Salt affects fermentation, safety and texture.</li>
              <li>Keep vegetables submerged as the recipe directs. This calculation does not establish fermentation time, temperature, acidity or shelf stability.</li>
              <li>For canned or shelf-stable pickles, follow a tested preservation recipe and its acid, food and water proportions.</li>
            </ul>
            <a className="tool-inline-link" href="https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/general-information-on-fermenting/" target="_blank" rel="noreferrer">NCHFP fermentation guidance ↗</a>
          </div> : <div className="chef-note-card"><span className="chef-note-kicker">Salt concentration</span><h2>Check what the percentage includes</h2>
            <p>This mode calculates salt and water only. It does not account for salt already in stock, sugar, other dissolved ingredients, food absorption or solubility. It does not establish a safe meat brine or fermentation recipe.</p>
          </div>}
        </section>

        <section className="tool-shell tool-explainer brine-explainer" id="brine-concentration">
          <div><span className="doc-eyebrow">Brine concentration calculator</span><h2>What does a 5% brine mean?</h2>
            <p>For a salt-to-water ratio, 1 litre of water at 5% needs 50 g salt. For a final solution that is 5% salt by weight, the same water needs about 52.63 g salt. Choose “Salt concentration” above to calculate either convention.</p>
            <p>The calculator uses percentage by weight, not grams per 100 ml of finished solution. Check your recipe’s definition before choosing a method.</p>
          </div>
          <div className="formula-card brine-formula-card" aria-label="Brine percentage formulas">
            <div><span>Wet brine / water-only</span><strong>water × % ÷ 100</strong></div>
            <div><span>Dry meat brine</span><strong>meat × % ÷ 100</strong></div>
            <div><span>Total-weight ferment</span><strong>(veg + water) × % ÷ 100</strong></div>
            <div><span>Final solution</span><strong>water × % ÷ (100 − %)</strong></div>
          </div>
        </section>
        <section className="tool-shell brine-faq" aria-labelledby="brine-help-title">
          <h2 id="brine-help-title">Using the brine calculator</h2>
          <h3>Can I use this for chicken, turkey or pork?</h3>
          <p>Yes. Select Meat & poultry, then wet brine for a water-based calculation or dry brine for a meat-weight calculation. Use a suitable recipe for its salt percentage and brining time.</p>
          <h3>How do I calculate salt for vegetable fermentation?</h3>
          <p>Select Vegetable fermentation. For 1 kg vegetables and 500 g water, a 3% total-weight calculation gives 45 g salt; a 3% water-only calculation gives 15 g. For dry-salted vegetables, choose total weight and enter zero added water.</p>
          <h3>Does the type of salt change the answer?</h3>
          <p>Weigh ordinary food salt in grams or ounces. Crystal size changes how much fits in a spoon or cup, so this calculator does not convert salt into volume measures. Follow your recipe’s salt specification.</p>
          <h3>Will this tell me how long to brine?</h3>
          <p>No. Time depends on the food, thickness, method and recipe. These calculations give the salt amount only; they do not calculate curing salts, equilibrium brining times or preservation safety.</p>
        </section>
        <RelatedTools current="brine-calculator" />
        <ToolAppCta tool="brine-calculator" />
      </main>
      <Footer />
    </>
  )
}
