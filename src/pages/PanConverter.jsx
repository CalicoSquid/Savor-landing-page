import { useMemo, useState } from 'react'
import '@fontsource/jetbrains-mono/600.css'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import { PLAY_URL } from '../data/seoPages'
import { buildScalingNotes, scaleIngredientList } from '../lib/recipeScaler'
import {
  PAN_PRESETS,
  comparePans,
  convertLength,
  describeMultiplier,
  formatArea,
  formatDimension,
  panResultCopy,
  presetToPan,
} from '../lib/panConverter'
import './pages.css'
import './tools.css'

const SAMPLE_INGREDIENTS = `1 1/2 cups flour
3/4 cup sugar
2 eggs
1/2 cup butter
1 tsp baking powder`

function makePan(preset, unit) {
  return presetToPan(preset, unit) || {
    preset: 'custom',
    shape: 'round',
    kind: 'round',
    approximate: false,
    diameter: '',
    width: '',
    length: '',
  }
}

function switchPanUnit(pan, fromUnit, toUnit) {
  const convert = (value) => {
    if (value === '') return ''
    const converted = convertLength(value, fromUnit, toUnit)
    return converted == null ? '' : formatDimension(converted)
  }
  return {
    ...pan,
    diameter: convert(pan.diameter),
    width: convert(pan.width),
    length: convert(pan.length),
  }
}

function customKind(shape) {
  return shape === 'rectangle' ? 'rectangle' : shape
}

function PanEditor({ title, pan, unit, onChange }) {
  function applyPreset(value) {
    if (value === 'custom') {
      onChange({ ...pan, preset: 'custom', kind: customKind(pan.shape), approximate: false })
      return
    }
    onChange(makePan(value, unit))
  }

  function changeShape(shape) {
    onChange({
      ...pan,
      preset: 'custom',
      shape,
      kind: customKind(shape),
      approximate: false,
      diameter: shape === 'round' ? (pan.diameter || pan.width || '') : '',
      width: shape !== 'round' ? (pan.width || pan.diameter || '') : '',
      length: shape === 'rectangle' ? (pan.length || pan.width || pan.diameter || '') : '',
    })
  }

  function changeDimension(key, value) {
    const keepsCapacityCaveat = pan.kind === 'loaf' || pan.kind === 'sheet'
    onChange({
      ...pan,
      preset: 'custom',
      kind: keepsCapacityCaveat ? pan.kind : customKind(pan.shape),
      approximate: keepsCapacityCaveat ? true : false,
      [key]: value,
    })
  }

  return (
    <div className="pan-editor-card">
      <div className="pan-editor-heading">
        <div className={`pan-shape-preview is-${pan.shape}`} aria-hidden="true"><span /></div>
        <div>
          <span className="tool-card-eyebrow">{title}</span>
          <h2>{title === 'Recipe pan' ? 'The pan in the recipe' : 'The pan you have'}</h2>
        </div>
      </div>

      <label className="converter-field pan-preset-field">
        <span>Common pan</span>
        <select value={pan.preset} onChange={(event) => applyPreset(event.target.value)}>
          <option value="custom">Custom dimensions</option>
          {PAN_PRESETS.map((preset) => <option value={preset.value} key={preset.value}>{preset.label}</option>)}
        </select>
      </label>

      <label className="converter-field">
        <span>Shape</span>
        <select value={pan.shape} onChange={(event) => changeShape(event.target.value)}>
          <option value="round">Round</option>
          <option value="square">Square</option>
          <option value="rectangle">Rectangle / loaf</option>
        </select>
      </label>

      <div className="pan-dimensions">
        {pan.shape === 'round' ? (
          <label className="converter-field">
            <span>Diameter ({unit})</span>
            <input type="number" min="0" step="0.1" inputMode="decimal" value={pan.diameter} onChange={(event) => changeDimension('diameter', event.target.value)} />
          </label>
        ) : pan.shape === 'square' ? (
          <label className="converter-field">
            <span>Side ({unit})</span>
            <input type="number" min="0" step="0.1" inputMode="decimal" value={pan.width} onChange={(event) => changeDimension('width', event.target.value)} />
          </label>
        ) : (
          <>
            <label className="converter-field">
              <span>Width ({unit})</span>
              <input type="number" min="0" step="0.1" inputMode="decimal" value={pan.width} onChange={(event) => changeDimension('width', event.target.value)} />
            </label>
            <label className="converter-field">
              <span>Length ({unit})</span>
              <input type="number" min="0" step="0.1" inputMode="decimal" value={pan.length} onChange={(event) => changeDimension('length', event.target.value)} />
            </label>
          </>
        )}
      </div>

      {pan.kind === 'loaf' && (
        <p className="pan-inline-note">Loaf tins vary in slope and depth, so this footprint-based result is a practical estimate.</p>
      )}
      {pan.kind === 'sheet' && (
        <p className="pan-inline-note">Sheet pans can be much shallower than baking dishes with the same footprint. Check capacity before adding the batter.</p>
      )}
    </div>
  )
}

export default function PanConverter() {
  const [unit, setUnit] = useState('in')
  const [sourcePan, setSourcePan] = useState(() => makePan('round-8in', 'in'))
  const [targetPan, setTargetPan] = useState(() => makePan('round-9in', 'in'))
  const [ingredients, setIngredients] = useState(SAMPLE_INGREDIENTS)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => comparePans(sourcePan, targetPan, unit), [sourcePan, targetPan, unit])
  const copy = useMemo(() => panResultCopy(result), [result])
  const scaled = useMemo(
    () => result.ok ? scaleIngredientList(ingredients, 1, result.multiplier) : { output: '', scaledCount: 0, unchangedCount: 0, fractionalEgg: false },
    [ingredients, result],
  )
  const scalingNotes = useMemo(
    () => result.ok ? buildScalingNotes(ingredients, result.multiplier, scaled.fractionalEgg) : [],
    [ingredients, result, scaled.fractionalEgg],
  )

  function changeUnit(nextUnit) {
    if (nextUnit === unit) return
    setSourcePan((pan) => switchPanUnit(pan, unit, nextUnit))
    setTargetPan((pan) => switchPanUnit(pan, unit, nextUnit))
    setUnit(nextUnit)
  }

  function swapPans() {
    setSourcePan(targetPan)
    setTargetPan(sourcePan)
    setCopied(false)
  }

  async function copyIngredients() {
    if (!scaled.output.trim()) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(scaled.output)
      } else {
        const fallback = document.createElement('textarea')
        fallback.value = scaled.output
        fallback.setAttribute('readonly', '')
        fallback.style.position = 'fixed'
        fallback.style.opacity = '0'
        document.body.appendChild(fallback)
        fallback.select()
        document.execCommand('copy')
        fallback.remove()
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
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
            <span className="doc-eyebrow">Free baking pan converter</span>
            <h1>Convert a baking recipe to the pan you actually own.</h1>
            <p className="tool-lead">
              Tell us which pan the recipe expects and which pan is in your cupboard. Savor works out the batter multiplier, shows how the depth changes and can scale the ingredient list for you.
            </p>
          </div>
        </section>

        <section className="tool-shell pan-converter-section" aria-label="Baking pan size converter">
          <div className="pan-toolbar">
            <div>
              <span className="tool-card-eyebrow">Pan dimensions</span>
              <p>Area-based scaling works best when the pans are a similar depth.</p>
            </div>
            <div className="system-toggle" role="group" aria-label="Pan dimension units">
              <button type="button" className={unit === 'in' ? 'is-active' : ''} onClick={() => changeUnit('in')} aria-pressed={unit === 'in'}>Inches</button>
              <button type="button" className={unit === 'cm' ? 'is-active' : ''} onClick={() => changeUnit('cm')} aria-pressed={unit === 'cm'}>Centimetres</button>
            </div>
          </div>

          <div className="pan-workspace">
            <PanEditor title="Recipe pan" pan={sourcePan} unit={unit} onChange={setSourcePan} />
            <button type="button" className="pan-swap" onClick={swapPans} aria-label="Swap recipe pan and your pan">⇄</button>
            <PanEditor title="Your pan" pan={targetPan} unit={unit} onChange={setTargetPan} />
          </div>

          <div className={`pan-result-card${result.ok ? '' : ' is-empty'}`} aria-live="polite">
            {result.ok ? (
              <>
                <div className="pan-result-main">
                  <span className="converter-answer-label">Recipe multiplier</span>
                  <strong>{describeMultiplier(result.multiplier)}</strong>
                  <p>{copy.action}</p>
                </div>
                <div className="pan-result-details">
                  <div><span>Recipe pan area</span><strong>{formatArea(result.sourceArea, unit)}</strong></div>
                  <div><span>Your pan area</span><strong>{formatArea(result.targetArea, unit)}</strong></div>
                  <div><span>Same recipe, new pan</span><strong>{Math.round(result.unscaledDepthRatio * 100)}% depth</strong></div>
                </div>
                <div className="pan-result-advice">
                  <p><strong>Batter depth:</strong> {copy.depth}</p>
                  <p><strong>Bake time:</strong> {copy.timing}</p>
                  {result.approximate && result.caveat && <p><strong>Shape/depth note:</strong> {result.caveat}</p>}
                </div>
              </>
            ) : (
              <p>{result.reason}</p>
            )}
          </div>
        </section>

        <section className="tool-shell pan-scale-section" aria-labelledby="pan-scale-title">
          <div className="converter-section-heading">
            <span className="scaler-step">2</span>
            <div>
              <span className="tool-card-eyebrow">Optional</span>
              <h2 id="pan-scale-title">Scale the ingredients for the new pan.</h2>
            </div>
          </div>

          <div className="scaler-workspace converter-workspace">
            <div className="scaler-input-card">
              <div className="scaler-card-heading">
                <h3>Original ingredients</h3>
                <button type="button" className="tool-text-button" onClick={() => setIngredients(SAMPLE_INGREDIENTS)}>Use example</button>
              </div>
              <label className="sr-only" htmlFor="pan-ingredients">Recipe ingredient list</label>
              <textarea id="pan-ingredients" value={ingredients} onChange={(event) => setIngredients(event.target.value)} spellCheck="false" />
              <p className="scaler-hint">Quantities are multiplied by the pan-area ratio. Lines without a leading quantity stay as written.</p>
            </div>

            <div className="scaler-output-card" aria-live="polite">
              <div className="scaler-card-heading scaler-output-heading">
                <h3>For your pan</h3>
                {result.ok && <span className="scale-factor">{describeMultiplier(result.multiplier)}</span>}
              </div>
              {result.ok && scaled.output.trim() ? (
                <>
                  <pre className="scaled-list">{scaled.output}</pre>
                  <div className="scaler-result-meta">
                    <span>{scaled.scaledCount} {scaled.scaledCount === 1 ? 'line' : 'lines'} scaled</span>
                    {scaled.unchangedCount > 0 && <span>{scaled.unchangedCount} left as written</span>}
                  </div>
                  <button type="button" className="btn btn-fruit scaler-copy" onClick={copyIngredients}>{copied ? 'Copied ✓' : 'Copy scaled ingredients'}</button>
                </>
              ) : (
                <div className="scaler-empty">Enter two valid pans and your scaled ingredient list will appear here.</div>
              )}
            </div>
          </div>
        </section>

        <section className="tool-shell scaler-notes-section">
          <div className="chef-note-card">
            <span className="chef-note-kicker">The useful caveat</span>
            <h2>Pan area can scale batter. It cannot promise a bake time.</h2>
            <p>
              Scaling by surface area keeps batter depth roughly similar when the pans have comparable depth and shape. That makes it a good starting point for cakes, brownies and tray bakes — but ovens, pan material, batter type and actual pan depth still matter.
            </p>
            {scalingNotes.length > 0 && (
              <ul>{scalingNotes.map((note) => <li key={note}>{note}</li>)}</ul>
            )}
          </div>
        </section>

        <section className="tool-shell tool-explainer pan-explainer">
          <div>
            <span className="doc-eyebrow">How it works</span>
            <h2>Same depth = target area ÷ original area.</h2>
            <p>
              An 8-inch round pan has about 50.3 square inches of surface area. A 9-inch round has about 63.6. Divide 63.6 by 50.3 and you get roughly 1.27 — so making 1.27× the batter keeps the depth close to the original recipe.
            </p>
            <p>
              This is intentionally an area calculator, not a fake-precision oven predictor. Deep tins, very shallow trays, Bundt pans and unusually sloped pans are better compared by actual capacity.
            </p>
          </div>
          <div className="formula-card" aria-label="Baking pan conversion formula">
            <span>new pan area</span>
            <strong>÷</strong>
            <span>recipe pan area</span>
            <strong>=</strong>
            <span>recipe multiplier</span>
          </div>
        </section>

        <RelatedTools current="pan-converter" />

        <section className="tool-shell tool-app-cta" data-nosnippet="">
          <img src="/icons/icon-Tangerine.webp" alt="" width="72" height="72" loading="lazy" decoding="async" />
          <div>
            <span className="tool-card-eyebrow">Keep the recipe, not the maths</span>
            <h2>Savor keeps your recipes clean and cookable.</h2>
            <p>Save recipes from websites, screenshots, cookbooks and handwritten cards, then scale quantities whenever you need them.</p>
          </div>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="btn btn-fruit tool-app-button">Get Savor</a>
        </section>
      </main>
      <Footer />
    </>
  )
}
