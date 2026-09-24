import { useMemo, useState } from 'react'
import Footer from '../components/Footer'
import RelatedTools from '../components/RelatedTools'
import { PLAY_URL } from '../data/seoPages'
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
            <span className="doc-eyebrow">Free ingredient substitution finder</span>
            <h1>Find an ingredient substitute that actually works for the recipe.</h1>
            <p className="tool-lead">
              Find practical ingredient swaps with the ratio, what will change, and the situations where that substitute is a bad idea. Because “use yogurt” is not enough information.
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
                <p className="sub-no-result">I do not have that one yet. Try a broader ingredient name.</p>
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
            <span className="chef-note-kicker">Chef reality check</span>
            <h2>A substitute can replace a function. It cannot always recreate the original ingredient.</h2>
            <ul>
              <li><strong>Baking is less forgiving.</strong> Acidity, fat, water, protein and leavening can all change the result.</li>
              <li><strong>Taste as you go in savoury food.</strong> Salt, acidity and sweetness vary wildly between brands.</li>
              <li><strong>For allergies, read the actual label.</strong> A suggested substitute is not a guarantee that a packaged product is allergen-free or free from cross-contact.</li>
            </ul>
          </div>
        </section>

        <section className="tool-shell tool-explainer sub-explainer">
          <div>
            <span className="doc-eyebrow">Why context matters</span>
            <h2>The same ingredient can be doing completely different jobs.</h2>
            <p>
              An egg might bind a burger, emulsify mayonnaise, add moisture to a cake or provide nearly all the structure in a soufflé. One universal “egg substitute” would be misleading.
            </p>
            <p>
              Savor groups substitutions by what you are actually cooking, then tells you what changes. That makes the swap useful before you discover the problem in the oven.
            </p>
          </div>
          <div className="formula-card sub-formula" aria-label="Ingredient substitution approach">
            <span>ingredient</span>
            <strong>+</strong>
            <span>its job in the recipe</span>
            <strong>→</strong>
            <span>best practical swap</span>
            <strong>+</strong>
            <span>what will change</span>
          </div>
        </section>

        <section className="tool-shell portion-search-section sub-search-intents">
          <span className="doc-eyebrow">Common kitchen emergencies</span>
          <h2>What can I substitute for…?</h2>
          <div className="portion-search-grid">
            <button type="button" onClick={() => chooseIngredient('buttermilk')}><strong>Buttermilk</strong><span>Milk + acid, yogurt or kefir — and when each works.</span></button>
            <button type="button" onClick={() => chooseIngredient('egg')}><strong>Eggs</strong><span>Pick a binder or moisture substitute without pretending it will make a soufflé.</span></button>
            <button type="button" onClick={() => chooseIngredient('heavy-cream')}><strong>Heavy cream</strong><span>Different answers for sauces, batters and anything that needs to whip.</span></button>
            <button type="button" onClick={() => chooseIngredient('cornstarch')}><strong>Cornstarch</strong><span>Arrowroot, potato starch or flour, with the texture trade-offs explained.</span></button>
          </div>
        </section>

        <RelatedTools current="ingredient-substitutions" />

        <section className="tool-shell tool-app-cta" data-nosnippet="">
          <img src="/icons/icon-Tangerine.webp" alt="" width="72" height="72" loading="lazy" decoding="async" />
          <div>
            <span className="tool-card-eyebrow">Keep the recipe you rescued</span>
            <h2>Save it in Savor.</h2>
            <p>Import recipes from websites, screenshots, cookbooks and handwritten cards, then keep your own notes and changes with the recipe you actually cook.</p>
          </div>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="btn btn-fruit tool-app-button">Get Savor</a>
        </section>
      </main>
      <Footer />
    </>
  )
}
