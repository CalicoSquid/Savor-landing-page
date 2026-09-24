import { useMemo, useState } from 'react'
import '@fontsource/jetbrains-mono/600.css'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import { PLAY_URL } from '../data/seoPages'
import { buildScalingNotes, scaleIngredientList } from '../lib/recipeScaler'
import './pages.css'
import './tools.css'

const SAMPLE = `1 1/2 cups flour
3/4 cup milk
2 eggs
1 tbsp butter
1 tsp salt
Black pepper to taste`

export default function RecipeScaler() {
  const [ingredients, setIngredients] = useState(SAMPLE)
  const [originalServings, setOriginalServings] = useState('4')
  const [targetServings, setTargetServings] = useState('7')
  const [copied, setCopied] = useState(false)

  const result = useMemo(
    () => scaleIngredientList(ingredients, originalServings, targetServings),
    [ingredients, originalServings, targetServings],
  )

  const notes = useMemo(
    () => buildScalingNotes(ingredients, result.factor, result.fractionalEgg),
    [ingredients, result.factor, result.fractionalEgg],
  )

  const validServings = Number(originalServings) > 0 && Number(targetServings) > 0

  async function copyResult() {
    if (!result.output.trim()) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(result.output)
      } else {
        const fallback = document.createElement('textarea')
        fallback.value = result.output
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

  function resetSample() {
    setIngredients(SAMPLE)
    setOriginalServings('4')
    setTargetServings('7')
    setCopied(false)
  }

  return (
    <>
      <main className="page tool-page">
        <section className="tool-hero">
          <div className="tool-shell">
            <a href="/tools/" className="tool-back-link">← Free kitchen tools</a>
            <span className="doc-eyebrow">Free recipe scaler</span>
            <h1>Scale a recipe up or down without doing fractions in your head.</h1>
            <p className="tool-lead">
              Paste your ingredient list, tell us how many servings it makes and how many you need. The maths happens instantly — your kitchen judgement remains gloriously human.
            </p>
          </div>
        </section>

        <section className="tool-shell scaler-workspace" aria-label="Recipe scaling calculator">
          <div className="scaler-input-card">
            <div className="scaler-card-heading">
              <div>
                <span className="scaler-step">1</span>
                <h2>Paste your ingredients</h2>
              </div>
              <button type="button" className="tool-text-button" onClick={resetSample}>Use example</button>
            </div>

            <label className="sr-only" htmlFor="ingredients">Ingredient list</label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              spellCheck="false"
              placeholder={'500 g potatoes\n2 tbsp olive oil\n1/2 tsp salt'}
            />
            <p className="scaler-hint">Start each ingredient with its quantity. Lines like “salt to taste” stay unchanged.</p>

            <div className="servings-row">
              <label>
                <span>Original servings</span>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  inputMode="decimal"
                  value={originalServings}
                  onChange={(event) => setOriginalServings(event.target.value)}
                />
              </label>
              <span className="servings-arrow" aria-hidden="true">→</span>
              <label>
                <span>I need</span>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  inputMode="decimal"
                  value={targetServings}
                  onChange={(event) => setTargetServings(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="scaler-output-card" aria-live="polite">
            <div className="scaler-card-heading scaler-output-heading">
              <div>
                <span className="scaler-step">2</span>
                <h2>Your scaled recipe</h2>
              </div>
              {validServings && (
                <span className="scale-factor">× {Number(result.factor.toFixed(3))}</span>
              )}
            </div>

            {!validServings ? (
              <div className="scaler-empty">Enter serving numbers above zero to scale the recipe.</div>
            ) : result.output.trim() ? (
              <>
                <pre className="scaled-list">{result.output}</pre>
                <div className="scaler-result-meta">
                  <span>{result.scaledCount} {result.scaledCount === 1 ? 'line' : 'lines'} scaled</span>
                  {result.unchangedCount > 0 && <span>{result.unchangedCount} left as written</span>}
                </div>
                <button type="button" className="btn btn-fruit scaler-copy" onClick={copyResult}>
                  {copied ? 'Copied ✓' : 'Copy scaled ingredients'}
                </button>
              </>
            ) : (
              <div className="scaler-empty">Paste an ingredient list and the scaled version will appear here.</div>
            )}
          </div>
        </section>

        <section className="tool-shell scaler-notes-section">
          <div className="chef-note-card">
            <span className="chef-note-kicker">The calculator does the maths. You still do the cooking.</span>
            <h2>A few things worth knowing before you make the bigger batch.</h2>
            {notes.length ? (
              <ul>
                {notes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            ) : (
              <p>Most ordinary ingredient quantities scale cleanly. Cooking time, seasoning and pan geometry are the bits that deserve your attention.</p>
            )}
            <a href="/blog/how-to-scale-a-recipe/" className="tool-inline-link">Read the chef’s guide to scaling recipes →</a>
          </div>
        </section>

        <section className="tool-shell tool-explainer">
          <div>
            <span className="doc-eyebrow">How it works</span>
            <h2>The simple recipe scaling formula</h2>
            <p>
              Divide the servings you want by the servings the original recipe makes. That is your scaling factor. A recipe for 4 scaled to 10 portions has a factor of 2.5, so each ingredient quantity is multiplied by 2.5.
            </p>
            <p>
              This tool understands common whole numbers, decimals, fractions like 3/4 and mixed amounts like 1 1/2. Ingredient lines without a leading quantity are deliberately left alone.
            </p>
          </div>
          <div className="formula-card" aria-label="Recipe scaling formula">
            <span>target servings</span>
            <strong>÷</strong>
            <span>original servings</span>
            <strong>=</strong>
            <span>scaling factor</span>
          </div>
        </section>

        <RelatedTools current="recipe-scaler" />

        <section className="tool-shell tool-app-cta" data-nosnippet="">
          <img src="/icons/icon-Tangerine.webp" alt="" width="72" height="72" loading="lazy" decoding="async" />
          <div>
            <span className="tool-card-eyebrow">Want this built into every recipe?</span>
            <h2>Savor scales saved recipes while you cook.</h2>
            <p>Save recipes from websites, screenshots, cookbooks and handwritten cards, then change the serving count whenever you need it.</p>
          </div>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="btn btn-fruit tool-app-button">Get Savor</a>
        </section>
      </main>
      <Footer />
    </>
  )
}
