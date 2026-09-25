import { useMemo, useState } from 'react'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import ToolAppCta from '../components/ToolAppCta'
import {
  getSubstitutionContext,
  getSubstitutionIngredient,
  popularSubstitutionIds,
  searchSubstitutions,
} from '../lib/substitutionFinder'
import './pages.css'
import './tools.css'

const POPULAR = popularSubstitutionIds()

function ResultOption({ item }) {
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
    </article>
  )
}

export default function IngredientSubstitutions() {
  const [query, setQuery] = useState('buttermilk')
  const [ingredientId, setIngredientId] = useState('buttermilk')
  const ingredient = getSubstitutionIngredient(ingredientId)
  const [contextId, setContextId] = useState(ingredient?.contexts[0]?.id || 'baking')
  const matches = useMemo(() => searchSubstitutions(query), [query])
  const selectedContext = getSubstitutionContext(ingredientId, contextId)

  function chooseIngredient(id) {
    const next = getSubstitutionIngredient(id)
    if (!next) return
    setIngredientId(id)
    setQuery(next.name)
    setContextId(next.contexts[0]?.id || 'general')
  }

  function onQueryChange(value) {
    setQuery(value)
    const normalised = value.trim().toLowerCase()
    const exact = searchSubstitutions(value).find((item) => (
      item.name.toLowerCase() === normalised
      || item.aliases.some((alias) => alias.toLowerCase() === normalised)
    ))
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
              Look up a common ingredient, choose how you’re using it, and see suitable swaps, amounts and changes to expect.
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
              />
            </label>

            <div className="sub-search-results" aria-label="Matching ingredients">
              {matches.length ? matches.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={ingredientId === item.id ? 'is-active' : ''}
                  onClick={() => chooseIngredient(item.id)}
                >
                  <strong>{item.name}</strong>
                  <span>{item.summary}</span>
                </button>
              )) : (
                <p className="sub-no-result">No entry for that ingredient yet. Try a broader name or choose a popular ingredient below.</p>
              )}
            </div>

            <div className="sub-popular-row">
              <span>Popular:</span>
              {POPULAR.map((id) => {
                const item = getSubstitutionIngredient(id)
                return <button type="button" key={id} onClick={() => chooseIngredient(id)}>{item.name}</button>
              })}
            </div>
          </div>

          <div className="sub-result-column">
            {ingredient ? (
              <>
                <div className="sub-selected-heading">
                  <span className="tool-card-eyebrow">Substitute for</span>
                  <h2>{ingredient.name}</h2>
                  <p>{ingredient.summary}</p>
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
                  {selectedContext?.options.map((item) => <ResultOption item={item} key={item.name} />)}
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
              <li><strong>For allergies, read the actual label.</strong> A suggested substitute is not a guarantee that a packaged product is allergen-free or free from cross-contact.</li>
            </ul>
          </div>
        </section>

        <RelatedTools current="ingredient-substitutions" />

        <ToolAppCta />
      </main>
      <Footer />
    </>
  )
}
