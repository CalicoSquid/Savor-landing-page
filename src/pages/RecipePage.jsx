import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './RecipePage.css'

const APOLLO_URI = import.meta.env.VITE_APOLLO_URI || 'https://savor-production.up.railway.app/graphql'

const QUERY = `
  query PublicRecipe($id: ID!) {
    publicRecipe(id: $id) {
      id
      name
      description
      image
      ingredients
      instructions
      category
      cuisine
      sourceUrl
      scrapedWithAI
      imageCredit { photographer photographerUrl }
      times { prep { hours minutes } cook { hours minutes } total { hours minutes } }
      recipeYield
      user { name username theme }
    }
  }
`

function formatTime(t) {
  if (!t) return null
  const parts = []
  if (t.hours > 0) parts.push(`${t.hours}h`)
  if (t.minutes > 0) parts.push(`${t.minutes}m`)
  return parts.length ? parts.join(' ') : null
}

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return null }
}

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'

export default function RecipePage() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(APOLLO_URI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { id } }),
    })
      .then(r => r.json())
      .then(({ data, errors }) => {
        if (errors?.length || !data?.publicRecipe) throw new Error('Recipe not found')
        setRecipe(data.publicRecipe)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  // Update page meta for OG/WhatsApp preview
  useEffect(() => {
    if (!recipe) return
    document.title = `${recipe.name} · Savor`
    const setMeta = (prop, val, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}="${prop}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el) }
      el.setAttribute('content', val)
    }
    const desc = recipe.description || `${recipe.cuisine || ''} recipe saved on Savor`.trim()
    setMeta('og:title', recipe.name)
    setMeta('og:description', desc)
    setMeta('og:image', recipe.image || '/icons/Savor2.png')
    setMeta('og:url', window.location.href)
    setMeta('og:type', 'article')
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', recipe.name, 'name')
    setMeta('twitter:description', desc, 'name')
    setMeta('robots', 'noindex, nofollow', 'name')
  }, [recipe])

  const prepTime = recipe && formatTime(recipe.times?.prep)
  const cookTime = recipe && formatTime(recipe.times?.cook)
  const totalTime = recipe && formatTime(recipe.times?.total)

  if (loading) return (
    <div className="rp-state">
      <div className="rp-spinner" />
      <p>Loading recipe…</p>
    </div>
  )

  if (error || !recipe) return (
    <div className="rp-state">
      <div className="rp-not-found">
        <img src="/icons/Savor2.png" alt="Savor" className="rp-nf-logo" />
        <h2>Recipe not found</h2>
        <p>This recipe may have been removed or the link is incorrect.</p>
        <a href={PLAY_STORE} className="rp-store-btn" target="_blank" rel="noopener noreferrer">
          Get Savor on Android
        </a>
      </div>
    </div>
  )

  return (
    <div className="rp-root">
      {/* noindex already set via meta, belt-and-suspenders */}

      {/* Hero */}
      <div className="rp-hero">
        {recipe.image
          ? <img src={recipe.image} alt={recipe.name} className="rp-hero-img" />
          : <div className="rp-hero-placeholder"><span>🍴</span></div>
        }
        <div className="rp-hero-overlay" />
        {recipe.imageCredit?.photographer && (
          <a
            className="rp-credit"
            href={recipe.imageCredit.photographerUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            📷 {recipe.imageCredit.photographer}
          </a>
        )}
      </div>

      <div className="rp-body">

        {/* Header */}
        <div className="rp-header">
          <div className="rp-chips">
            {recipe.cuisine && <span className="rp-chip">{recipe.cuisine}</span>}
            {recipe.category && <span className="rp-chip rp-chip--sec">{recipe.category}</span>}
          </div>
          <h1 className="rp-title">{recipe.name}</h1>
          {recipe.description && <p className="rp-desc">{recipe.description}</p>}

          {/* Author */}
          {recipe.user && (
            <div className="rp-author">
              <img
                src={`/icons/icon-${recipe.user.theme || 'default'}.png`}
                alt={recipe.user.name || recipe.user.username}
                className="rp-avatar"
                onError={e => { e.target.src = '/icons/icon-default.png' }}
              />
              <span className="rp-author-name">
                Saved by {recipe.user.name || recipe.user.username}
              </span>
            </div>
          )}
        </div>

        {/* Stats bar */}
        {(prepTime || cookTime || totalTime || recipe.recipeYield) && (
          <div className="rp-stats">
            {prepTime && <div className="rp-stat"><span className="rp-stat-label">Prep</span><span className="rp-stat-val">{prepTime}</span></div>}
            {cookTime && <div className="rp-stat"><span className="rp-stat-label">Cook</span><span className="rp-stat-val">{cookTime}</span></div>}
            {totalTime && <div className="rp-stat"><span className="rp-stat-label">Total</span><span className="rp-stat-val">{totalTime}</span></div>}
            {recipe.recipeYield && <div className="rp-stat"><span className="rp-stat-label">Serves</span><span className="rp-stat-val">{recipe.recipeYield}</span></div>}
          </div>
        )}

        {/* Source */}
        {recipe.sourceUrl && (
          <a className="rp-source" href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
            <span className="rp-source-icon">🔗</span>
            <span>Original recipe · {getDomain(recipe.sourceUrl)}</span>
            <span className="rp-source-arrow">↗</span>
          </a>
        )}

        {/* Ingredients */}
        {recipe.ingredients?.length > 0 && (
          <section className="rp-section">
            <h2 className="rp-section-title">Ingredients</h2>
            <ul className="rp-ingredients">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="rp-ingredient">
                  <span className="rp-ingredient-dot" />
                  <span>{typeof ing === 'string' ? ing : `${ing.amount ?? ''} ${ing.unit ?? ''} ${ing.name ?? ''}`.trim()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Instructions */}
        {recipe.instructions?.length > 0 && (
          <section className="rp-section">
            <h2 className="rp-section-title">Instructions</h2>
            <ol className="rp-instructions">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="rp-step">
                  <span className="rp-step-num">{i + 1}</span>
                  <span>{typeof step === 'string' ? step : step.text || step.instruction || JSON.stringify(step)}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* CTA */}
        <div className="rp-cta">
          <img src="/icons/Savor2.png" alt="Savor" className="rp-cta-logo" />
          <p className="rp-cta-text">Save recipes from anywhere. Cook without the clutter.</p>
          <a href={PLAY_STORE} className="rp-store-btn" target="_blank" rel="noopener noreferrer">
            Get Savor on Android
          </a>
        </div>

      </div>
    </div>
  )
}