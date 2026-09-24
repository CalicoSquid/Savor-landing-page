import { useMemo, useState } from 'react'
import '@fontsource/jetbrains-mono/600.css'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import { PLAY_URL } from '../data/seoPages'
import {
  BRINE_METHODS,
  BRINE_PERCENT_PRESETS,
  buildBrineNotes,
  buildFormula,
  calculateBrine,
  formatBaseWeight,
  formatSalt,
  formatSaltOunces,
  gramsToInput,
  inputToGrams,
} from '../lib/brineCalculator'
import './pages.css'
import './tools.css'

const EXAMPLES = [
  { label: 'Dry-salt maths', method: 'total', produce: 1000, water: 0, percent: 2.5 },
  { label: 'Mixed jar', method: 'total', produce: 750, water: 500, percent: 2.5 },
  { label: '3% water brine', method: 'water', produce: 0, water: 1000, percent: 3 },
]

function tidyInput(value, digits = 2) {
  return String(Number(Number(value).toFixed(digits)))
}

export default function BrineCalculator() {
  const [system, setSystem] = useState('metric')
  const [method, setMethod] = useState('total')
  const [produce, setProduce] = useState('1000')
  const [water, setWater] = useState('0')
  const [percent, setPercent] = useState('2.5')

  const result = useMemo(() => calculateBrine({ method, produce, water, percent, system }), [method, produce, water, percent, system])
  const notes = useMemo(() => buildBrineNotes(result), [result])

  function changeSystem(nextSystem) {
    if (nextSystem === system) return
    const produceG = inputToGrams(produce, 'produce', system)
    const waterG = inputToGrams(water, 'water', system)
    setProduce(tidyInput(gramsToInput(produceG, 'produce', nextSystem)))
    setWater(tidyInput(gramsToInput(waterG, 'water', nextSystem)))
    setSystem(nextSystem)
  }

  function applyExample(example) {
    setMethod(example.method)
    setPercent(String(example.percent))
    setProduce(tidyInput(gramsToInput(example.produce, 'produce', system)))
    setWater(tidyInput(gramsToInput(example.water, 'water', system)))
  }

  const produceUnit = system === 'metric' ? 'g' : 'oz'
  const waterUnit = system === 'metric' ? 'ml' : 'fl oz'

  return (
    <>
      <main className="page tool-page">
        <section className="tool-hero">
          <div className="tool-shell">
            <a href="/tools/" className="tool-back-link">← Free kitchen tools</a>
            <span className="doc-eyebrow">Free fermentation brine calculator</span>
            <h1>Calculate fermentation brine salt by weight — without percentage guessing.</h1>
            <p className="tool-lead">
              Choose how your recipe defines its percentage, enter the vegetables and water, and get the exact salt weight. Total-weight ferment and water-only brine maths are kept deliberately separate.
            </p>
          </div>
        </section>

        <section className="tool-shell brine-calculator-section" aria-label="Fermentation brine calculator">
          <div className="brine-example-row" aria-label="Brine calculator examples">
            <span>Try:</span>
            {EXAMPLES.map((example) => (
              <button type="button" key={example.label} onClick={() => applyExample(example)}>{example.label}</button>
            ))}
          </div>

          <div className="brine-workspace">
            <div className="brine-controls-card">
              <div className="converter-section-heading">
                <span className="scaler-step">1</span>
                <div>
                  <span className="tool-card-eyebrow">Choose the maths</span>
                  <h2>What does the percentage mean?</h2>
                </div>
              </div>

              <div className="brine-method-grid" role="group" aria-label="Brine percentage method">
                {Object.values(BRINE_METHODS).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={method === item.id ? 'is-active' : ''}
                    onClick={() => setMethod(item.id)}
                    aria-pressed={method === item.id}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.shortLabel}</span>
                    <small>{item.description}</small>
                  </button>
                ))}
              </div>

              <div className="brine-unit-toolbar">
                <span>Enter weights in</span>
                <div className="system-toggle" role="group" aria-label="Brine calculator units">
                  <button type="button" className={system === 'metric' ? 'is-active' : ''} onClick={() => changeSystem('metric')} aria-pressed={system === 'metric'}>Metric</button>
                  <button type="button" className={system === 'us' ? 'is-active' : ''} onClick={() => changeSystem('us')} aria-pressed={system === 'us'}>US</button>
                </div>
              </div>

              <div className="brine-input-grid">
                <label className="converter-field">
                  <span>Vegetables / produce ({produceUnit})</span>
                  <input type="number" min="0" step={system === 'metric' ? '1' : '0.1'} inputMode="decimal" value={produce} onChange={(event) => setProduce(event.target.value)} />
                </label>
                <label className="converter-field">
                  <span>Added water ({waterUnit})</span>
                  <input type="number" min="0" step={system === 'metric' ? '1' : '0.1'} inputMode="decimal" value={water} onChange={(event) => setWater(event.target.value)} />
                </label>
              </div>
              <p className="scaler-hint">
                {system === 'metric'
                  ? 'For kitchen brine maths, 1 ml water is treated as approximately 1 g.'
                  : 'Fluid ounces here mean US fluid ounces of water; the calculator converts them to water weight.'}
              </p>

              <label className="converter-field brine-percent-field">
                <span>Salt percentage</span>
                <div className="brine-percent-input">
                  <input type="number" min="0.1" max="20" step="0.1" inputMode="decimal" value={percent} onChange={(event) => setPercent(event.target.value)} />
                  <strong>%</strong>
                </div>
              </label>

              <div className="brine-percent-presets" aria-label="Common percentage shortcuts">
                <span>Quick percentage:</span>
                {BRINE_PERCENT_PRESETS.map((value) => (
                  <button type="button" key={value} className={Number(percent) === value ? 'is-active' : ''} onClick={() => setPercent(String(value))}>{value}%</button>
                ))}
              </div>
              <p className="scaler-hint">These are maths shortcuts, not a claim that one percentage is right or safe for every ferment. Follow the process or tested recipe you are using.</p>
            </div>

            <div className="brine-result-column">
              <span className="tool-card-eyebrow">Salt to add</span>
              <div className={`brine-result-card${result.ok ? '' : ' is-empty'}`} aria-live="polite">
                {result.ok ? (
                  <>
                    <span className="converter-answer-label">Weigh out</span>
                    <strong className="brine-big-number">{formatSalt(result)}</strong>
                    <span className="brine-secondary-number">{formatSaltOunces(result)}</span>
                    <p>{BRINE_METHODS[result.method].label} · {result.percent}% of {formatBaseWeight(result)}</p>
                    <div className="brine-formula-line">{buildFormula(result)}</div>
                  </>
                ) : (
                  <p>{result.reason}</p>
                )}
              </div>

              <div className="brine-definition-card">
                <strong>{BRINE_METHODS[method].label}</strong>
                <p>{BRINE_METHODS[method].description}</p>
                {method === 'water' && Number(produce) > 0 && <span>Your produce weight is shown in the form but intentionally does not change the salt calculation in this mode.</span>}
              </div>
            </div>
          </div>
        </section>

        <section className="tool-shell scaler-notes-section">
          <div className="chef-note-card brine-chef-note">
            <span className="chef-note-kicker">Fermentation reality check</span>
            <h2>The calculator can check your arithmetic. It cannot validate your preservation process.</h2>
            <ul>
              {notes.map((note) => <li key={note}>{note}</li>)}
              <li><strong>Do not arbitrarily reduce the salt in a tested fermented-pickle or sauerkraut recipe.</strong> Salt affects both the fermentation and the finished texture.</li>
              <li><strong>Keep fermenting vegetables submerged as your recipe directs.</strong> For shelf-stable or canned pickles, use a tested preservation recipe rather than inventing the acid/salt proportions here.</li>
            </ul>
            <a href="https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/general-information-on-fermenting/" target="_blank" rel="noreferrer" className="tool-inline-link">NCHFP fermentation guidance ↗</a>
            <span className="tool-link-separator" aria-hidden="true"> · </span>
            <a href="https://extension.umn.edu/es/node/172346" target="_blank" rel="noreferrer" className="tool-inline-link">University of Minnesota fermentation guide ↗</a>
          </div>
        </section>

        <section className="tool-shell tool-explainer brine-explainer">
          <div>
            <span className="doc-eyebrow">Why two percentage modes?</span>
            <h2>Because 3% can mean two very different amounts of salt.</h2>
            <p>
              If you have 1 kg of vegetables and 500 g of water, a 3% <strong>total-weight</strong> calculation uses 1.5 kg as its base and gives 45 g salt. A 3% <strong>water-only</strong> brine uses just the 500 g water and gives 15 g salt.
            </p>
            <p>
              Neither convention is automatically “the right one.” The important thing is knowing which convention your recipe or fermentation method is using before you calculate.
            </p>
          </div>
          <div className="formula-card brine-formula-card" aria-label="Brine percentage formulas">
            <div><span>Total weight</span><strong>(veg + water) × %</strong></div>
            <div><span>Water-only brine</span><strong>water × %</strong></div>
          </div>
        </section>

        <section className="tool-shell portion-search-section brine-search-intents">
          <span className="doc-eyebrow">Common brine maths</span>
          <h2>Use the percentage your recipe calls for.</h2>
          <div className="portion-search-grid">
            <button type="button" onClick={() => applyExample(EXAMPLES[0])}><strong>Dry-salted vegetables</strong><span>No added water? Total-weight mode becomes simple produce weight × salt percentage.</span></button>
            <button type="button" onClick={() => applyExample(EXAMPLES[1])}><strong>Vegetables + added water</strong><span>Count both when your fermentation method defines salt as a percentage of total weight.</span></button>
            <button type="button" onClick={() => applyExample(EXAMPLES[2])}><strong>Recipe specifies “3% brine”</strong><span>If that recipe defines brine percentage from water alone, use water-only mode.</span></button>
            <a href="/tools/measurement-converter/"><strong>Working from cups or ounces?</strong><span>Convert the recipe measurements first, then weigh the salt accurately.</span></a>
          </div>
        </section>

        <RelatedTools current="brine-calculator" />

        <section className="tool-shell tool-app-cta" data-nosnippet="">
          <img src="/icons/icon-Tangerine.webp" alt="" width="72" height="72" loading="lazy" decoding="async" />
          <div>
            <span className="tool-card-eyebrow">Keep the recipe, not just the calculation</span>
            <h2>Save it in Savor.</h2>
            <p>Import recipes from websites, screenshots, cookbooks and handwritten cards, then keep the version you actually cook in one ad-free kitchen.</p>
          </div>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="btn btn-fruit tool-app-button">Get Savor</a>
        </section>
      </main>
      <Footer />
    </>
  )
}
