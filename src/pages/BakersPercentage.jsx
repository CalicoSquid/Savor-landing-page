import { useMemo, useState } from 'react'
import '@fontsource/jetbrains-mono/600.css'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import { PLAY_URL } from '../data/seoPages'
import {
  buildDoughNotes,
  calculateDough,
  formatPercent,
  formatWeight,
  gramsToInputWeight,
  inputWeightToGrams,
  scaleDough,
  scaledFormulaText,
} from '../lib/bakersPercentage'
import './pages.css'
import './tools.css'

const EXAMPLES = [
  { label: 'Sourdough loaf', flour: 900, water: 650, starter: 200, starterHydration: 100, salt: 20, other: 0, pieces: 2, pieceWeight: 885 },
  { label: 'Pizza dough', flour: 1000, water: 620, starter: 100, starterHydration: 100, salt: 25, other: 20, pieces: 6, pieceWeight: 295 },
  { label: 'No starter', flour: 1000, water: 700, starter: 0, starterHydration: 100, salt: 20, other: 0, pieces: 2, pieceWeight: 860 },
]

function tidy(value, digits = 2) {
  return String(Number(Number(value).toFixed(digits)))
}

function Field({ label, unit, value, onChange, step = '1', min = '0' }) {
  return (
    <label className="converter-field">
      <span>{label} ({unit})</span>
      <input type="number" min={min} step={step} inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export default function BakersPercentage() {
  const [system, setSystem] = useState('metric')
  const [flour, setFlour] = useState('900')
  const [water, setWater] = useState('650')
  const [starter, setStarter] = useState('200')
  const [starterHydration, setStarterHydration] = useState('100')
  const [salt, setSalt] = useState('20')
  const [other, setOther] = useState('0')
  const [pieces, setPieces] = useState('2')
  const [pieceWeight, setPieceWeight] = useState('885')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => calculateDough({ flour, water, starter, starterHydration, salt, other, system }), [flour, water, starter, starterHydration, salt, other, system])
  const scaled = useMemo(() => scaleDough(result, { pieces, pieceWeight, system }), [result, pieces, pieceWeight, system])
  const notes = useMemo(() => buildDoughNotes(result), [result])
  const unit = system === 'metric' ? 'g' : 'oz'

  function changeSystem(next) {
    if (next === system) return
    const convert = (value) => tidy(gramsToInputWeight(inputWeightToGrams(value, system), next))
    setFlour(convert(flour))
    setWater(convert(water))
    setStarter(convert(starter))
    setSalt(convert(salt))
    setOther(convert(other))
    setPieceWeight(convert(pieceWeight))
    setSystem(next)
  }

  function applyExample(example) {
    const display = (grams) => tidy(gramsToInputWeight(grams, system))
    setFlour(display(example.flour))
    setWater(display(example.water))
    setStarter(display(example.starter))
    setStarterHydration(String(example.starterHydration))
    setSalt(display(example.salt))
    setOther(display(example.other))
    setPieces(String(example.pieces))
    setPieceWeight(display(example.pieceWeight))
  }

  async function copyFormula() {
    if (!scaled.ok) return
    const text = scaledFormulaText(scaled, system)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <main className="page tool-page">
        <section className="tool-hero">
          <div className="tool-shell">
            <a href="/tools/" className="tool-back-link">← Free kitchen tools</a>
            <span className="doc-eyebrow">Free baker’s percentage calculator</span>
            <h1>Calculate baker’s percentage and true dough hydration.</h1>
            <p className="tool-lead">Calculate true hydration, baker’s percentages and the flour/water hidden inside your starter — then scale the same formula to however many loaves or pizza balls you need.</p>
          </div>
        </section>

        <section className="tool-shell baker-calculator-section" aria-label="Baker's percentage and dough hydration calculator">
          <div className="brine-example-row" aria-label="Dough formula examples">
            <span>Try:</span>
            {EXAMPLES.map((example) => <button type="button" key={example.label} onClick={() => applyExample(example)}>{example.label}</button>)}
          </div>

          <div className="baker-workspace">
            <div className="baker-controls-card">
              <div className="converter-section-heading">
                <span className="scaler-step">1</span>
                <div><span className="tool-card-eyebrow">Your formula</span><h2>Enter everything by weight.</h2></div>
              </div>

              <div className="brine-unit-toolbar">
                <span>Weights in</span>
                <div className="system-toggle" role="group" aria-label="Dough calculator units">
                  <button type="button" className={system === 'metric' ? 'is-active' : ''} onClick={() => changeSystem('metric')} aria-pressed={system === 'metric'}>Grams</button>
                  <button type="button" className={system === 'us' ? 'is-active' : ''} onClick={() => changeSystem('us')} aria-pressed={system === 'us'}>Ounces</button>
                </div>
              </div>

              <div className="baker-input-grid">
                <Field label="Flour added to the mix" unit={unit} value={flour} onChange={setFlour} step={system === 'metric' ? '1' : '0.1'} />
                <Field label="Water added to the mix" unit={unit} value={water} onChange={setWater} step={system === 'metric' ? '1' : '0.1'} />
                <Field label="Starter / preferment" unit={unit} value={starter} onChange={setStarter} step={system === 'metric' ? '1' : '0.1'} />
                <label className="converter-field">
                  <span>Starter hydration (%)</span>
                  <input type="number" min="0" step="1" inputMode="decimal" value={starterHydration} onChange={(event) => setStarterHydration(event.target.value)} />
                </label>
                <Field label="Salt" unit={unit} value={salt} onChange={setSalt} step={system === 'metric' ? '1' : '0.1'} />
                <Field label="Other ingredients" unit={unit} value={other} onChange={setOther} step={system === 'metric' ? '1' : '0.1'} />
              </div>
              <p className="scaler-hint">“Other ingredients” is for things like oil, sugar or malt. It affects total dough weight, but it does not count as water when hydration is calculated.</p>
            </div>

            <div className="baker-result-column">
              <span className="tool-card-eyebrow">True formula</span>
              <div className={`baker-result-card${result.ok ? '' : ' is-empty'}`} aria-live="polite">
                {result.ok ? (
                  <>
                    <span className="baker-big-number">{formatPercent(result.hydration)}</span>
                    <h2>hydration</h2>
                    <p>{result.starterG > 0 ? `Includes ${formatWeight(result.starterWaterG, system)} water and ${formatWeight(result.starterFlourG, system)} flour from the starter.` : 'Water weight ÷ flour weight.'}</p>
                    <div className="baker-stat-grid">
                      <div><span>Total flour</span><strong>{formatWeight(result.totalFlourG, system, { compact: true })}</strong><small>100%</small></div>
                      <div><span>Total water</span><strong>{formatWeight(result.totalWaterG, system, { compact: true })}</strong><small>{formatPercent(result.hydration)}</small></div>
                      <div><span>Salt</span><strong>{formatPercent(result.saltPercent)}</strong><small>of total flour</small></div>
                      {result.starterG > 0 && <div><span>Starter / preferment</span><strong>{formatPercent(result.starterPercent)}</strong><small>of total flour</small></div>}
                      {result.starterG > 0 && <div><span>Prefermented flour</span><strong>{formatPercent(result.prefermentedFlourPercent)}</strong><small>of total flour</small></div>}
                      {result.otherG > 0 && <div><span>Other ingredients</span><strong>{formatPercent(result.otherPercent)}</strong><small>of total flour</small></div>}
                    </div>
                    <div className="baker-total-dough"><span>Total dough</span><strong>{formatWeight(result.totalDoughG, system, { compact: true })}</strong></div>
                  </>
                ) : <p>{result.reason}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="tool-shell baker-scale-section">
          <div className="baker-scale-card">
            <div className="converter-section-heading">
              <span className="scaler-step">2</span>
              <div><span className="tool-card-eyebrow">Scale the batch</span><h2>How much dough do you actually need?</h2></div>
            </div>
            <div className="baker-target-grid">
              <label className="converter-field"><span>Loaves / dough balls</span><input type="number" min="1" step="1" inputMode="numeric" value={pieces} onChange={(event) => setPieces(event.target.value)} /></label>
              <Field label="Target weight each" unit={unit} value={pieceWeight} onChange={setPieceWeight} step={system === 'metric' ? '1' : '0.1'} />
            </div>

            {scaled.ok ? (
              <div className="baker-scale-result">
                <div className="baker-scale-summary"><span>Target batch</span><strong>{formatWeight(scaled.targetTotalG, system, { compact: true })}</strong><small>{scaled.pieces} × {formatWeight(scaled.pieceWeightG, system)}</small></div>
                <div className="baker-scaled-grid">
                  <div><span>Flour</span><strong>{formatWeight(scaled.flourG, system)}</strong></div>
                  <div><span>Water</span><strong>{formatWeight(scaled.waterG, system)}</strong></div>
                  <div><span>Starter</span><strong>{formatWeight(scaled.starterG, system)}</strong></div>
                  <div><span>Salt</span><strong>{formatWeight(scaled.saltG, system)}</strong></div>
                  {scaled.otherG > 0.01 && <div><span>Other</span><strong>{formatWeight(scaled.otherG, system)}</strong></div>}
                </div>
                <button type="button" className="btn btn-secondary baker-copy-button" onClick={copyFormula}>{copied ? 'Copied ✓' : 'Copy scaled formula'}</button>
              </div>
            ) : <p className="scaler-hint">{scaled.reason}</p>}
          </div>
        </section>

        <section className="tool-shell scaler-notes-section">
          <div className="chef-note-card">
            <span className="chef-note-kicker">Dough reality check</span>
            <h2>Baker’s percentages are ratios. Flour still has opinions.</h2>
            <ul>{notes.map((note) => <li key={note}>{note}</li>)}</ul>
          </div>
        </section>

        <section className="tool-shell tool-explainer baker-explainer">
          <div>
            <span className="doc-eyebrow">How baker’s percentage works</span>
            <h2>Flour is always the 100% reference point.</h2>
            <p>A 70% hydration dough has 70 parts water for every 100 parts flour by weight. Salt at 2% means 2 parts salt for every 100 parts flour. That makes formulas easy to compare and scale.</p>
            <p>If you use starter, the calculator splits it into its flour and water first. A 200 g starter at 100% hydration contains 100 g flour and 100 g water, so both belong in the true totals.</p>
          </div>
          <div className="formula-card brine-formula-card" aria-label="Baker's percentage formulas">
            <div><span>Hydration</span><strong>total water ÷ total flour × 100</strong></div>
            <div><span>Ingredient %</span><strong>ingredient weight ÷ total flour × 100</strong></div>
          </div>
        </section>

        <RelatedTools current="bakers-percentage" />

        <section className="tool-shell tool-app-cta" data-nosnippet="">
          <img src="/icons/icon-Tangerine.webp" alt="" width="72" height="72" loading="lazy" decoding="async" />
          <div>
            <span className="tool-card-eyebrow">Once the formula is right</span>
            <h2>Keep the recipe in Savor.</h2>
            <p>Save the version you actually bake, scale it when the batch changes and keep your kitchen notes with the recipe instead of on another scrap of paper.</p>
          </div>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="btn btn-fruit tool-app-button">Get Savor</a>
        </section>
      </main>
      <Footer />
    </>
  )
}
