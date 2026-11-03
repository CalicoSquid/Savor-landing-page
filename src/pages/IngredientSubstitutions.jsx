import { useId, useMemo, useRef, useState } from 'react'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import ToolAppCta from '../components/ToolAppCta'
import {
  SUBSTITUTION_INGREDIENTS,
  SUBSTITUTION_CATEGORIES,
  exactSubstitution,
  suggestSubstitutions,
  scaleSubstitution,
  substitutionCopyText,
  getSubstitutionContext,
  getSubstitutionIngredient,
  popularSubstitutionIds,
  searchSubstitutions,
} from '../lib/substitutionFinder'
import './pages.css'
import './tools.css'

const POPULAR = popularSubstitutionIds()

function ResultOption({ item, ingredient, usage }) {
  const amountId = useId()
  const [amount, setAmount] = useState(String(item.measure?.amount ?? 1))
  const [copyStatus, setCopyStatus] = useState('')
  const scaled = item.measure ? scaleSubstitution(item, amount) : null
  async function copySwap() {
    try {
      await navigator.clipboard.writeText(substitutionCopyText(ingredient, usage, item, amount))
      setCopyStatus('Copied swap and cautions.')
    } catch {
      setCopyStatus('Copy unavailable. Select the text to copy it manually.')
    }
  }
  return (
    <article className="sub-option-card">
      <div className="sub-option-heading">
        <h3>{item.name}</h3>
        <span>{item.fit}</span>
      </div>
      <dl>
        <div><dt>Swap</dt><dd>{item.swap}</dd></div>
        <div><dt>Expect</dt><dd>{item.changes}</dd></div>
        {item.avoid && <div className="sub-avoid"><dt>Watch out</dt><dd>{item.avoid}</dd></div>}
      </dl>
      {item.measure && <div className="sub-amount">
        <label htmlFor={amountId}>Amount of {ingredient.name.toLowerCase()} to replace ({item.measure.unit})</label>
        <input id={amountId} type="number" min="0" max="1000" step="any" inputMode="decimal" value={amount}
          onChange={(event) => { setAmount(event.target.value); setCopyStatus('') }} />
        <div aria-live="polite">{scaled.ok ? <><strong>For your amount</strong><ul>{scaled.lines.map((line) => <li key={line}>{line}</li>)}</ul></> : <p>{scaled.reason}</p>}</div>
        <p className="scaler-hint">Scaled amounts are a starting point. Keep the preparation instructions and cautions above.</p>
      </div>}
      <button type="button" className="tool-text-button sub-copy" disabled={scaled && !scaled.ok} onClick={copySwap}>Copy this swap</button>
      <p className="scaler-hint" role="status">{copyStatus}</p>
    </article>
  )
}

export default function IngredientSubstitutions() {
  const browseRef = useRef(null)
  const headingRef = useRef(null)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('buttermilk')
  const [ingredientId, setIngredientId] = useState('buttermilk')
  const ingredient = getSubstitutionIngredient(ingredientId)
  const [contextId, setContextId] = useState(ingredient?.contexts[0]?.id || 'baking')
  const matches = useMemo(() => searchSubstitutions(query), [query])
  const selectedContext = getSubstitutionContext(ingredientId, contextId)
  const suggestions = useMemo(() => suggestSubstitutions(query), [query])
  const browseItems = SUBSTITUTION_INGREDIENTS.filter((item) => category === 'All' || item.category === category).sort((a, b) => a.name.localeCompare(b.name))

  function chooseIngredient(id) {
    const next = getSubstitutionIngredient(id)
    if (!next) return
    setIngredientId(id)
    setQuery(next.name)
    setContextId(next.contexts[0]?.id || 'general')
    if (browseRef.current) browseRef.current.open = false
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  function onQueryChange(value) {
    setQuery(value)
    const exact = exactSubstitution(value)
    if (exact) {
      setIngredientId(exact.id)
      setContextId(exact.contexts[0]?.id || 'general')
    } else {
      setIngredientId(null)
    }
  }

  return (
    <>
      <main className="page tool-page">
        <section className="tool-hero">
          <div className="tool-shell">
            <a href="/tools/" className="tool-back-link">← Free kitchen tools</a>
            <span className="doc-eyebrow">Ingredient swaps</span>
            <h1>Ingredient substitutions</h1>
            <p className="tool-lead">
              Search 40 everyday ingredients or browse by category. Choose how you’re cooking, compare swaps and cautions, and adjust measured substitutions to the amount you need.
            </p>
          </div>
        </section>

        <section className="tool-shell sub-workspace" aria-label="Ingredient substitution finder">
          <div className="sub-picker-card">
            <div className="converter-section-heading">
              <span className="scaler-step">1</span>
              <div>
                <span className="tool-card-eyebrow">What are you missing?</span>
                <h2>Search an ingredient</h2>
              </div>
            </div>

            <label className="converter-field sub-search-field">
              <span>Ingredient</span>
              <input
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Try buttermilk, eggs, cornstarch…"
                autoComplete="off"
                aria-describedby="sub-search-help"
                onKeyDown={(event) => { if (event.key === 'Enter' && matches[0]) { event.preventDefault(); chooseIngredient(matches[0].id) } }}
              />
            </label>

            <p className="scaler-hint" id="sub-search-help">Regional names work too: try cornflour, bicarb or crème fraîche. Press Enter to choose the first match.</p>
            <div className="sub-search-results" aria-label="Matching ingredients">
              {matches.length ? matches.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={ingredientId === item.id ? 'is-active' : ''}
                  aria-pressed={ingredientId === item.id}
                  onClick={() => chooseIngredient(item.id)}
                >
                  <strong>{item.name}</strong>
                  <span>{item.summary}</span>
                </button>
              )) : (
                <div className="sub-no-result" role="status">No entry for that ingredient yet. Try a broader name or browse the ingredients below.
                  {suggestions.length > 0 && <div className="sub-suggestions"><span>Did you mean?</span>{suggestions.map((item) => <button type="button" key={item.id} onClick={() => chooseIngredient(item.id)}>{item.name}</button>)}</div>}
                </div>
              )}
            </div>

            <div className="sub-popular-row">
              <span>Popular:</span>
              {POPULAR.map((id) => {
                const item = getSubstitutionIngredient(id)
                return <button type="button" key={id} onClick={() => chooseIngredient(id)}>{item.name}</button>
              })}
            </div>
            <details className="sub-browse" ref={browseRef}>
              <summary>Browse all {SUBSTITUTION_INGREDIENTS.length} ingredients</summary>
              <label className="converter-field"><span>Category</span><select aria-label="Browse ingredient category" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>All</option>{SUBSTITUTION_CATEGORIES.map((name) => <option key={name}>{name}</option>)}
              </select></label>
              <div className="sub-browse-list">{browseItems.map((item) => <button type="button" key={item.id} onClick={() => chooseIngredient(item.id)}>{item.name}</button>)}</div>
            </details>
          </div>

          <div className="sub-result-column">
            {ingredient ? (
              <>
                <div className="sub-selected-heading">
                  <span className="tool-card-eyebrow">Substitute for</span>
                  <h2 ref={headingRef} tabIndex="-1">{ingredient.name}</h2>
                  <p>{ingredient.summary}</p>
                  {ingredient.sources && <div className="sub-sources">{ingredient.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>}
                </div>

                {ingredient.contexts.length > 1 && (
                  <div className="sub-contexts" role="group" aria-label={`How ${ingredient.name} is being used`}>
                    {ingredient.contexts.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className={selectedContext?.id === item.id ? 'is-active' : ''}
                        onClick={() => setContextId(item.id)}
                        aria-pressed={selectedContext?.id === item.id}
                      >
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="sub-options" aria-live="polite">
                  {selectedContext?.options.map((item) => <ResultOption item={item} ingredient={ingredient} usage={selectedContext} key={`${ingredient.id}:${selectedContext.id}:${item.name}`} />)}
                </div>
              </>
            ) : (
              <div className="sub-empty">Search for an ingredient to see the best swaps.</div>
            )}
          </div>
        </section>

        <section className="tool-shell scaler-notes-section">
          <div className="chef-note-card">
            <span className="chef-note-kicker">Substitution notes</span>
            <h2>Choose a swap for the recipe</h2>
            <ul>
              <li><strong>Baking is less forgiving.</strong> Acidity, fat, water, protein and leavening can all change the result.</li>
              <li><strong>Taste as you go in savoury food.</strong> Salt, acidity and sweetness vary wildly between brands.</li>
              <li><strong>Preserving needs tested recipes.</strong> Do not use these swaps to change canning, curing or fermentation formulas.</li>
              <li><strong>For allergies, read the actual label.</strong> A suggested substitute is not a guarantee that a packaged product is allergen-free or free from cross-contact.</li>
            </ul>
            <p className="scaler-hint">Ratios labelled 1:1 use the basis stated in the swap. Cups and spoons are cooking measures; use the original recipe’s weights for precise baking.</p>
            <p className="sub-sources"><a href="https://food.unl.edu/article/ingredient-substitutions/" target="_blank" rel="noreferrer">Nebraska Extension reference ↗</a>{' · '}<a href="https://extension.usu.edu/archive/list-of-ingredient-substitutions-for-cooking-and-baking" target="_blank" rel="noreferrer">Utah State Extension reference ↗</a></p>
          </div>
        </section>

        <RelatedTools current="ingredient-substitutions" />

        <ToolAppCta />
      </main>
      <Footer />
    </>
  )
}
