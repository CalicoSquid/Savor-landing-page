import { useEffect, useMemo, useState } from 'react'
import '@fontsource/jetbrains-mono/600.css'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import { PLAY_URL } from '../data/seoPages'
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
    () => conversionData
      ? convertRecipeText(recipe, targetSystem, conversionData)
      : { output: '', convertedCount: 0, approximateCount: 0 },
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
            <span className="doc-eyebrow">Free cooking converter</span>
            <h1>Convert cups, grams, ounces, ml — or an entire recipe.</h1>
            <p className="tool-lead">
              Do one quick kitchen conversion, or paste a whole ingredient list and flip it between US and metric. Ingredient-aware conversions handle the awkward bit where cups and grams are not the same thing.
            </p>
            <p className={`converter-data-status is-${dataStatus}`}>
              {conversionData
                ? <>Powered by the same <strong>{conversionData.count}-entry ingredient conversion library</strong> used inside Savor{dataStatus === 'cache' ? ' — cached while we refresh it.' : '.'}</>
                : dataStatus === 'error'
                  ? <>Savor’s ingredient library is temporarily unavailable. Direct unit and temperature conversions still work.</>
                  : <>Loading Savor’s ingredient conversion library…</>}
            </p>
          </div>
        </section>

        <section className="tool-shell converter-quick-section" aria-labelledby="quick-converter-title">
          <div className="converter-section-heading">
            <span className="scaler-step">1</span>
            <div>
              <span className="tool-card-eyebrow">Quick conversion</span>
              <h2 id="quick-converter-title">One amount, straight answer.</h2>
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

            {quickResult.needsIngredient || quickResult.approximate ? (
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
                  <p>{quickResult.reason}</p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="tool-shell recipe-converter-section" aria-labelledby="recipe-converter-title">
          <div className="converter-section-heading">
            <span className="scaler-step">2</span>
            <div>
              <span className="tool-card-eyebrow">Whole recipe converter</span>
              <h2 id="recipe-converter-title">Paste the list. Change the kitchen.</h2>
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
              <p className="scaler-hint">Keep the quantity and unit at the start of each ingredient line. Temperatures can appear anywhere in the text.</p>
            </div>

            <div className="scaler-output-card" aria-live="polite">
              <div className="scaler-card-heading scaler-output-heading">
                <h3>{targetSystem === 'metric' ? 'Metric version' : 'US version'}</h3>
                {recipeResult.convertedCount > 0 && <span className="scale-factor">{recipeResult.convertedCount} converted</span>}
              </div>
              {!conversionData ? (
                <div className="scaler-empty">
                  {dataStatus === 'error'
                    ? 'The ingredient conversion library is unavailable right now. Try again once the Savor API is reachable.'
                    : 'Loading Savor’s ingredient conversion library…'}
                </div>
              ) : recipeResult.output.trim() ? (
                <>
                  <pre className="scaled-list">{recipeResult.output}</pre>
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
            <span className="chef-note-kicker">Why ingredient-aware matters</span>
            <h2>A cup measures space. A gram measures weight.</h2>
            <p>
              One cup of flour does not weigh the same as one cup of honey, butter or oats. When this tool crosses between volume and weight it uses the same practical ingredient conversion data as the Savor app, marks the result as approximate and leaves room for kitchen judgement.
            </p>
            <p>
              For precise baking, weighing ingredients is still the better habit. Brands, packing and measuring technique can all move the number a little.
            </p>
          </div>
        </section>

        <RelatedTools current="measurement-converter" />

        <section className="tool-shell tool-app-cta" data-nosnippet="">
          <img src="/icons/icon-Tangerine.webp" alt="" width="72" height="72" loading="lazy" decoding="async" />
          <div>
            <span className="tool-card-eyebrow">Prefer not to do this every time?</span>
            <h2>Savor keeps recipe measurements flexible.</h2>
            <p>Save recipes from websites, screenshots, cookbooks and handwritten cards, then keep a clean version ready to cook.</p>
          </div>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="btn btn-fruit tool-app-button">Get Savor</a>
        </section>
      </main>
      <Footer />
    </>
  )
}
