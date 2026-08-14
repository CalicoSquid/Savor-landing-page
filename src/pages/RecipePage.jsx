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
      ingredientGroups { label startIndex }
      instructions
      category
      cuisine
      sourceUrl
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
const SITE_URL = 'https://getsavor.recipes'
const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/images/savor-og.jpg`

function buildJsonLd(recipe, id) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description || undefined,
    image: recipe.image || undefined,
    recipeCategory: recipe.category || undefined,
    recipeCuisine: recipe.cuisine || undefined,
    recipeYield: recipe.recipeYield || undefined,
    recipeIngredient: recipe.ingredients?.map(ing =>
      typeof ing === 'string' ? ing : `${ing.amount ?? ''} ${ing.unit ?? ''} ${ing.name ?? ''}`.trim()
    ),
    recipeInstructions: recipe.instructions?.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: typeof step === 'string' ? step : step.text || step.instruction || '',
    })),
    url: recipe.sourceUrl || `${SITE_URL}/r/${encodeURIComponent(id)}`,
  }
  if (recipe.times?.prep) ld.prepTime = `PT${recipe.times.prep.hours || 0}H${recipe.times.prep.minutes || 0}M`
  if (recipe.times?.cook) ld.cookTime = `PT${recipe.times.cook.hours || 0}H${recipe.times.cook.minutes || 0}M`
  if (recipe.times?.total) ld.totalTime = `PT${recipe.times.total.hours || 0}H${recipe.times.total.minutes || 0}M`
  return JSON.stringify(ld).replace(/</g, '\\u003c')
}

const ICON_FILENAME = { Feijoa: 'Feijoah' }
function getThemeIcon(theme) {
  const key = typeof theme === 'string' ? theme.trim() : ''
  const name = ICON_FILENAME[key] ?? key
  return `/icons/icon-${name || 'default'}.webp`
}

function decode(str) {
  if (!str || typeof document === 'undefined') return str ?? ''
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

export default function RecipePage() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageFailed, setImageFailed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setImageFailed(false)
    setImageLoaded(false)
  }, [id])

  // Screen Wake Lock — keeps screen on while cooking, re-acquires on visibility change
  useEffect(() => {
    if (!('wakeLock' in navigator)) return
    let lock = null

    const acquire = () => {
      if (document.visibilityState === 'visible') {
        navigator.wakeLock.request('screen')
          .then(l => { lock = l })
          .catch(() => {})
      }
    }

    acquire()
    document.addEventListener('visibilitychange', acquire)
    return () => {
      document.removeEventListener('visibilitychange', acquire)
      lock?.release()
    }
  }, [])

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

  useEffect(() => {
    if (!recipe) return
    document.title = `${decode(recipe.name)} · Savor`
    const setMeta = (prop, val, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}="${prop}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el) }
      el.setAttribute('content', val)
    }
    const desc = (recipe.description || `${recipe.cuisine || recipe.category || 'A'} recipe saved on Savor`).replace(/\s+/g, ' ').trim()
    const metaDesc = desc.length > 180 ? `${desc.slice(0, 177).trimEnd()}…` : desc
    const pageUrl = `${SITE_URL}/r/${encodeURIComponent(id)}`
    let socialImage = DEFAULT_SOCIAL_IMAGE
    try { socialImage = new URL(recipe.image || DEFAULT_SOCIAL_IMAGE, SITE_URL).href } catch { /* use default */ }

    setMeta('description', metaDesc, 'name')
    setMeta('og:title', decode(recipe.name))
    setMeta('og:description', metaDesc)
    setMeta('og:image', socialImage)
    setMeta('og:image:secure_url', socialImage)
    setMeta('og:image:alt', decode(recipe.name))
    setMeta('og:url', pageUrl)
    setMeta('og:type', 'article')
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', decode(recipe.name), 'name')
    setMeta('twitter:description', metaDesc, 'name')
    setMeta('twitter:image', socialImage, 'name')
    setMeta('twitter:image:alt', decode(recipe.name), 'name')

    // Indexability: only ever index recipes with no sourceUrl (originals —
    // OCR/scan/handwritten, not scraped from another site). Anything with a
    // sourceUrl is someone else's content; point Google at the real thing
    // instead of letting us duplicate-rank against it.
    const isOriginal = !recipe.sourceUrl
    setMeta('robots', isOriginal ? 'index, follow' : 'noindex, follow', 'name')

    let linkEl = document.querySelector('link[rel="canonical"]')
    if (!linkEl) { linkEl = document.createElement('link'); linkEl.setAttribute('rel', 'canonical'); document.head.appendChild(linkEl) }
    linkEl.setAttribute('href', isOriginal ? pageUrl : recipe.sourceUrl)

    // JSON-LD — lets Savor's scraper parse this page cleanly
    let ldEl = document.getElementById('recipe-jsonld')
    if (!ldEl) { ldEl = document.createElement('script'); ldEl.id = 'recipe-jsonld'; ldEl.type = 'application/ld+json'; document.head.appendChild(ldEl) }
    ldEl.textContent = buildJsonLd(recipe, id)

    // Reset on unmount so a client-side nav away (e.g. recipe -> home via
    // SPA routing) doesn't leave this recipe's robots/canonical behind on
    // whatever page the person lands on next.
    return () => {
      ldEl?.remove()
      setMeta('robots', 'index, follow', 'name')
      const link = document.querySelector('link[rel="canonical"]')
      if (link) link.setAttribute('href', window.location.origin + '/')
    }
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
        <img
          src="/images/savor-final-ui.webp"
          alt="Savor"
          className="rp-nf-logo"
          width="480"
          height="148"
          decoding="async"
        />
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
      <div className="rp-body">

        {/* External recipe photos are best-effort in a browser. */}
        <div className={`rp-hero-wrap${!recipe.image || imageFailed ? ' rp-hero-wrap--placeholder' : ''}`}>
          {recipe.image && !imageFailed ? (
            <>
              <img
                src={recipe.image}
                alt={recipe.name}
                className={`rp-hero-img${imageLoaded ? ' is-loaded' : ''}`}
                width="1200"
                height="800"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImageLoaded(false); setImageFailed(true) }}
              />
              {!imageLoaded && <span className="rp-hero-loading" aria-hidden="true" />}
              {imageLoaded && recipe.imageCredit?.photographer && (
                <a
                  className="rp-credit"
                  href={recipe.imageCredit.photographerUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📷 {recipe.imageCredit.photographer}
                </a>
              )}
            </>
          ) : (
            <span className="rp-hero-placeholder" aria-hidden="true">🍽️</span>
          )}
        </div>

        {/* Header */}
        <div className="rp-header">
          <div className="rp-chips">
            {recipe.cuisine && <span className="rp-chip">{recipe.cuisine}</span>}
            {recipe.category && <span className="rp-chip rp-chip--sec">{recipe.category}</span>}
          </div>
          <h1 className="rp-title">{decode(recipe.name)}</h1>
          {recipe.description && <p className="rp-desc">{decode(recipe.description)}</p>}
          {recipe.user && (
            <div className="rp-author">
              <img
                src={getThemeIcon(recipe.user.theme)}
                alt=""
                className="rp-avatar"
                width="160"
                height="160"
                loading="lazy"
                decoding="async"
                onError={e => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/icons/icon-default.webp'
                }}
              />
              <span className="rp-author-name">
                Saved by {recipe.user.name || recipe.user.username}
              </span>
              <button className="rp-print-btn" onClick={() => window.print()}>
                🖨 Print recipe
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
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
            <span>🔗</span>
            <span>Original recipe · {getDomain(recipe.sourceUrl)}</span>
            <span className="rp-source-arrow">↗</span>
          </a>
        )}

        <div className="rp-sections-wrap">


        {/* Ingredients */}
        {recipe.ingredients?.length > 0 && (
          <section className="rp-section">
            <h2 className="rp-section-title">Ingredients</h2>
            <ul className="rp-ingredients">
              {recipe.ingredients.map((ing, i) => {
                const group = recipe.ingredientGroups?.find(g => g.startIndex === i)
                return (
                  <>
                    {group && (
                      <li key={`group-${i}`} className="rp-ingredient-group">
                        <span className="rp-ingredient-group-label">{group.label}</span>
                        <span className="rp-ingredient-group-line" />
                      </li>
                    )}
                    <li key={i} className="rp-ingredient">
                      <span className="rp-ingredient-dot" />
                      <span>{decode(typeof ing === 'string' ? ing : `${ing.amount ?? ''} ${ing.unit ?? ''} ${ing.name ?? ''}`.trim())}</span>
                    </li>
                  </>
                )
              })}
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
                  <span>{decode(typeof step === 'string' ? step : step.text || step.instruction || JSON.stringify(step))}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        </div>

        {/* CTA */}
        <div className="rp-cta">
          <img
            src="/images/savor-final-ui.webp"
            alt="Savor"
            className="rp-cta-logo"
            width="480"
            height="148"
            loading="lazy"
            decoding="async"
          />
          <p className="rp-cta-text">Save recipes from anywhere. Cook without the clutter.</p>
          <a
            href={`savor://create?url=${encodeURIComponent(`${SITE_URL}/r/${encodeURIComponent(id)}`)}`}
            className="rp-store-btn"
          >
           Save to Savor
          </a>
          <a href={PLAY_STORE} className="rp-get-savor-link" target="_blank" rel="noopener noreferrer">
            Don't have Savor? Get it free →
          </a>
        </div>

      </div>
    </div>
  )
}