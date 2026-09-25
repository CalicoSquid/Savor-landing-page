import { useEffect, useMemo, useState } from 'react'
import '@fontsource/jetbrains-mono/600.css'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import ToolAppCta from '../components/ToolAppCta'
import {
  CONVERTER_UNITS,
  conversionIngredientNames,
  convertMeasurement,
  convertRecipeText,
  formatConvertedValue,
  unitShortLabel,
} from '../lib/measurementConverter'
import { loadConversionDataset, readCachedConversionDataset } from '../lib/conversionData'
import './pages.css'
import './tools.css'

const RECIPE_SAMPLE = `1 1/2 cups all-purpose flour
3/4 cup milk
2 tbsp butter
1/3 cup brown sugar
8 oz cream cheese
1 tsp vanilla
Bake at 350°F`

function UnitSelect({ id, value, onChange }) {
  const groups = ['Weight', 'Volume', 'Temperature']
  return (
    <select id={id} value={value} onChange={onChange}>
      {groups.map((group) => (
        <optgroup label={group} key={group}>
          {CONVERTER_UNITS.filter((unit) => unit.group === group).map((unit) => (
            <option value={unit.value} key={unit.value}>{unit.label}</option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

async function writeClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const fallback = document.createElement('textarea')
  fallback.value = text
  fallback.setAttribute('readonly', '')
  fallback.style.position = 'fixed'
  fallback.style.opacity = '0'
  document.body.appendChild(fallback)
  fallback.select()
  document.execCommand('copy')
  fallback.remove()
}

export default function MeasurementConverter() {
  const [amount, setAmount] = useState('1')
  const [fromUnit, setFromUnit] = useState('cup')
  const [toUnit, setToUnit] = useState('g')
  const [ingredientName, setIngredientName] = useState('flour')
  const [conversionData, setConversionData] = useState(() => readCachedConversionDataset())
  const [dataStatus, setDataStatus] = useState(() => readCachedConversionDataset() ? 'cache' : 'loading')
  const [recipe, setRecipe] = useState(RECIPE_SAMPLE)
  const [targetSystem, setTargetSystem] = useState('metric')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadConversionDataset()
      .then(({ dataset, source }) => {
        if (cancelled) return
        setConversionData(dataset)
        setDataStatus(source)
      })
      .catch(() => {
        if (!cancelled) setDataStatus('error')
      })
    return () => { cancelled = true }
  }, [])

  const ingredientNames = useMemo(
    () => conversionIngredientNames(conversionData, { weightVolumeOnly: true }),
    [conversionData],
  )

  const quickResult = useMemo(
    () => convertMeasurement(amount, fromUnit, toUnit, ingredientName, conversionData),
    [amount, fromUnit, toUnit, ingredientName, conversionData],
  )

  const recipeResult = useMemo(
    () => convertRecipeText(recipe, targetSystem, conversionData),
    [recipe, targetSystem, conversionData],
  )

  async function copyRecipe() {
    if (!recipeResult.output.trim()) return
    try {
      await writeClipboard(recipeResult.output)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  function swapUnits() {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  return (
    <>
      <main className="page tool-page">
        <section className="tool-hero">
          <div className="tool-shell">
            <a href="/tools/" className="tool-back-link">← Free kitchen tools</a>
            <span className="doc-eyebrow">Measurements</span>
            <h1>Cooking measurement converter</h1>
            <p className="tool-lead">
              Convert a single amount or an ingredient list. For cups to grams, choose the ingredient so the estimate uses its weight per cup.
            </p>
            <p className={`converter-data-status is-${dataStatus}`}>
              {conversionData
                ? 'Volume-to-weight estimates use Savor’s ingredient measurements.'
                : dataStatus === 'error'
                  ? 'Ingredient estimates are unavailable. Direct unit and temperature conversions still work.'
                  : 'Loading ingredient estimates. Direct conversions are ready to use.'}
            </p>
          </div>
        </section>

        <section className="tool-shell converter-quick-section" aria-labelledby="quick-converter-title">
          <div className="converter-section-heading">
            <div>
              <h2 id="quick-converter-title">Convert an amount</h2>
            </div>
          </div>

          <div className="converter-quick-card">
            <label className="converter-field converter-amount-field">
              <span>Amount</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                aria-label="Amount to convert"
              />
            </label>

            <label className="converter-field">
              <span>From</span>
              <UnitSelect id="converter-from" value={fromUnit} onChange={(event) => setFromUnit(event.target.value)} />
            </label>

            <button type="button" className="converter-swap" onClick={swapUnits} aria-label="Swap conversion units">⇄</button>

            <label className="converter-field">
              <span>To</span>
              <UnitSelect id="converter-to" value={toUnit} onChange={(event) => setToUnit(event.target.value)} />
            </label>

            {quickResult.needsIngredient || quickResult.needsIngredientData || quickResult.approximate ? (
              <label className="converter-field converter-ingredient-field">
                <span>Ingredient</span>
                <input
                  type="text"
                  list="converter-ingredients"
                  value={ingredientName}
                  onChange={(event) => setIngredientName(event.target.value)}
                  placeholder="Start typing: flour, tahini, oats…"
                  autoComplete="off"
                />
                <datalist id="converter-ingredients">
                  {ingredientNames.map((name) => <option value={name} key={name} />)}
                </datalist>
              </label>
            ) : null}

            <div className="converter-answer" aria-live="polite">
              {quickResult.ok ? (
                <>
                  <span className="converter-answer-label">Result</span>
                  <strong>{formatConvertedValue(quickResult.value, toUnit)} <small>{unitShortLabel(toUnit)}</small></strong>
                  {quickResult.approximate && quickResult.ingredient ? (
                    <p>Approximate — using Savor’s conversion value for {quickResult.ingredient.name}.</p>
                  ) : (
                    <p>Direct unit conversion.</p>
                  )}
                </>
              ) : (
                <>
                  <span className="converter-answer-label">Result</span>
                  <strong className="converter-answer-empty">—</strong>
                  <p>{quickResult.needsIngredientData && dataStatus === 'error'
                    ? 'Ingredient estimates are unavailable. You can still convert between units of weight, volume or temperature.'
                    : quickResult.reason}</p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="tool-shell recipe-converter-section" aria-labelledby="recipe-converter-title">
          <div className="converter-section-heading">
            <div>
              <h2 id="recipe-converter-title">Convert an ingredient list</h2>
            </div>
          </div>

          <div className="recipe-converter-toolbar">
            <span>Convert recipe to</span>
            <div className="system-toggle" role="group" aria-label="Target measurement system">
              <button
                type="button"
                className={targetSystem === 'metric' ? 'is-active' : ''}
                onClick={() => setTargetSystem('metric')}
                aria-pressed={targetSystem === 'metric'}
              >Metric</button>
              <button
                type="button"
                className={targetSystem === 'us' ? 'is-active' : ''}
                onClick={() => setTargetSystem('us')}
                aria-pressed={targetSystem === 'us'}
              >US</button>
            </div>
          </div>

          <div className="scaler-workspace converter-workspace">
            <div className="scaler-input-card">
              <div className="scaler-card-heading">
                <h3>Your recipe</h3>
                <button type="button" className="tool-text-button" onClick={() => setRecipe(RECIPE_SAMPLE)}>Use example</button>
              </div>
              <label className="sr-only" htmlFor="recipe-to-convert">Recipe ingredient list</label>
              <textarea
                id="recipe-to-convert"
                value={recipe}
                onChange={(event) => setRecipe(event.target.value)}
                spellCheck="false"
                placeholder={'2 cups flour\n8 oz cream cheese\n1 tbsp butter'}
              />
              <p className="scaler-hint">Start each ingredient line with its quantity and unit. “c” means cups when followed by an ingredient; use °C or °F for temperatures.</p>
            </div>

            <div className="scaler-output-card" aria-live="polite">
              <div className="scaler-card-heading scaler-output-heading">
                <h3>{targetSystem === 'metric' ? 'Metric version' : 'US version'}</h3>
                {recipeResult.convertedCount > 0 && <span className="scale-factor">{recipeResult.convertedCount} converted</span>}
              </div>
              {recipeResult.output.trim() ? (
                <>
                  <pre className="scaled-list">{recipeResult.output}</pre>
                  {!conversionData && (
                    <p className="scaler-hint">Using direct conversions: cups become millilitres and grams become ounces. Ingredient estimates {dataStatus === 'error' ? 'are unavailable right now' : 'will appear when loaded'}.</p>
                  )}
                  <div className="scaler-result-meta">
                    {recipeResult.approximateCount > 0 && (
                      <span>{recipeResult.approximateCount} ingredient-aware {recipeResult.approximateCount === 1 ? 'estimate' : 'estimates'}</span>
                    )}
                    <span>Temperatures rounded for cooking</span>
                  </div>
                  <button type="button" className="btn btn-fruit scaler-copy" onClick={copyRecipe}>
                    {copied ? 'Copied ✓' : 'Copy converted recipe'}
                  </button>
                </>
              ) : (
                <div className="scaler-empty">Paste a recipe and the converted version will appear here.</div>
              )}
            </div>
          </div>
        </section>

        <section className="tool-shell scaler-notes-section">
          <div className="chef-note-card">
            <span className="chef-note-kicker">About the estimates</span>
            <h2>Cups to grams depends on the ingredient</h2>
            <p>
              A cup of flour weighs less than a cup of honey. Volume-to-weight conversions use Savor’s ingredient data and are marked as estimates. Packing, chopping and brand differences can affect the weight.
            </p>
            <p>
              For precise baking, use a scale and the recipe’s original weights where available.
            </p>
          </div>
        </section>

        <RelatedTools current="measurement-converter" />

        <ToolAppCta />
      </main>
      <Footer />
    </>
  )
}
