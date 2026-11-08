import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './RecipePage.css'
import { loadPublicRecipe } from '../lib/publicRecipe'
import PinterestSave from '../components/PinterestSave'
import { recipePinterestDetails, pinterestImageAttributes } from '../lib/pinterest'

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
    keywords: decode(recipe.name).replace(/\s+/g, ' ').trim() || undefined,
    recipeIngredient: recipe.ingredients?.map(ing =>
      typeof ing === 'string' ? ing : `${ing.amount ?? ''} ${ing.unit ?? ''} ${ing.name ?? ''}`.trim()
    ),
    recipeInstructions: recipe.instructions?.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: decode(typeof step === 'string' ? step : step.text || step.instruction || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s/)[0],
      url: `${SITE_URL}/r/${encodeURIComponent(recipe.canonicalRecipeId || id)}#step-${i + 1}`,
      text: typeof step === 'string' ? step : step.text || step.instruction || '',
    })),
    url: recipe.sourceUrl || `${SITE_URL}/r/${encodeURIComponent(recipe.canonicalRecipeId || id)}`,
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
  const [attempt, setAttempt] = useState(0)
  return <RecipeContent key={`${id}:${attempt}`} id={id} onRetry={() => setAttempt(value => value + 1)} />
}

function RecipeContent({ id, onRetry }) {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageFailed, setImageFailed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState(() => new Set())
  const toggleIngredient = index => setCheckedIngredients(previous => {
    const next = new Set(previous)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    return next
  })

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
    const controller = new AbortController()
    loadPublicRecipe(id)
      .then(recipe => {
        if (controller.signal.aborted) return
        if (recipe === null) {
          setError('not-found')
          return
        }
        setRecipe(recipe)
      })
      .catch(() => { if (!controller.signal.aborted) setError('network') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
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
    const pageUrl = `${SITE_URL}/r/${encodeURIComponent(recipe.canonicalRecipeId || id)}`
    const pin = recipePinterestDetails(recipe, pageUrl)
    let socialImage = DEFAULT_SOCIAL_IMAGE
    try { socialImage = new URL(recipe.image || DEFAULT_SOCIAL_IMAGE, SITE_URL).href } catch { /* use default */ }

    setMeta('description', metaDesc, 'name')
    setMeta('og:title', pin.title)
    setMeta('og:description', pin.description)
    setMeta('og:image', socialImage)
    setMeta('og:image:secure_url', socialImage)
    setMeta('og:image:alt', pin.altText)
    setMeta('og:url', pageUrl)
    setMeta('og:type', 'article')
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', pin.title, 'name')
    setMeta('twitter:description', pin.description, 'name')
    setMeta('twitter:image', socialImage, 'name')
    setMeta('twitter:image:alt', pin.altText, 'name')

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
  }, [recipe, id])

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
        <h2>{error === 'not-found' ? 'Recipe not found' : 'Could not load recipe'}</h2>
        <p>{error === 'not-found'
          ? 'This recipe may have been removed or the link is incorrect.'
          : 'Something went wrong loading this recipe. Please try again.'}</p>
        {error !== 'not-found' && <button className="rp-store-btn" onClick={onRetry}>Try again</button>}
        <a href={PLAY_STORE} className="rp-store-btn" target="_blank" rel="noopener noreferrer">
          Get Savor on Android
        </a>
      </div>
    </div>
  )

  const pin = recipePinterestDetails({ ...recipe, image: imageFailed ? null : recipe.image }, `${SITE_URL}/r/${encodeURIComponent(id)}`)

  return (
    <div className="rp-root">
      <aside className="rp-download-bar" aria-label="Get the Savor app">
        <div className="rp-download-inner">
          <div className="rp-download-brand">
            <Link to="/" aria-label="Savor home">
              <img src="/images/savor-final-ui.webp" alt="Savor" width="480" height="148" />
            </Link>
            <span>Your recipes, all together.</span>
          </div>
          <div className="rp-download-action">
            <a href={PLAY_STORE} className="rp-store-btn" target="_blank" rel="noopener noreferrer">
              Get Savor
            </a>
            <span>Free on Android</span>
          </div>
        </div>
      </aside>
      <div className={`rp-body${recipe.image && !imageFailed ? ' rp-body--with-photo' : ''}`}>

        {/* Header */}
        <div className="rp-header">
          <div className="rp-chips">
            {recipe.cuisine && <span className="rp-chip">{recipe.cuisine}</span>}
            {recipe.category && <span className="rp-chip rp-chip--sec">{recipe.category}</span>}
          </div>
          <h1 className="rp-title">{decode(recipe.name)}</h1>
          {recipe.description && <p className="rp-desc">{decode(recipe.description)}</p>}
          <div className="rp-author">
            {recipe.user && (
              <div className="rp-author-identity">
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
              </div>
            )}
              <div className="rp-recipe-actions">
                <PinterestSave details={pin} className="rp-pinterest-btn" />
              <button className="rp-print-btn" onClick={() => window.print()}>
                🖨 Print recipe
              </button>
              </div>
            </div>
        </div>

        <nav className="rp-quick-links" aria-label="Recipe sections">
          {recipe.ingredients?.length > 0 && <a href="#ingredients">Ingredients <span aria-hidden="true">↓</span></a>}
          {recipe.instructions?.length > 0 && <a href="#method">Method <span aria-hidden="true">↓</span></a>}
          <span>No account needed to cook.</span>
        </nav>

        {/* Stats */}
        {(prepTime || cookTime || totalTime || recipe.recipeYield) && (
          <div className="rp-stats">
            {prepTime && <div className="rp-stat"><span className="rp-stat-label">Prep</span><span className="rp-stat-val">{prepTime}</span></div>}
            {cookTime && <div className="rp-stat"><span className="rp-stat-label">Cook</span><span className="rp-stat-val">{cookTime}</span></div>}
            {totalTime && <div className="rp-stat"><span className="rp-stat-label">Total</span><span className="rp-stat-val">{totalTime}</span></div>}
            {recipe.recipeYield && <div className="rp-stat"><span className="rp-stat-label">Serves</span><span className="rp-stat-val">{recipe.recipeYield}</span></div>}
          </div>
        )}

        <p className="rp-print-provenance">
          Recipe: <a href={`${SITE_URL}/r/${encodeURIComponent(id)}`}>{`${SITE_URL}/r/${encodeURIComponent(id)}`}</a>
          {recipe.sourceUrl && getDomain(recipe.sourceUrl) && <> · Original source: <a href={recipe.sourceUrl}>{recipe.sourceUrl}</a></>}
          {recipe.image && !imageFailed && recipe.imageCredit?.photographer && <> · Photo: {recipe.imageCredit.photographer}</>}
        </p>

        {/* External recipe photos are best-effort in a browser. */}
        <div className={`rp-hero-wrap${!recipe.image || imageFailed ? ' rp-hero-wrap--placeholder' : ''}`}>
          {recipe.image && !imageFailed ? (
            <>
              <img
                src={recipe.image}
                alt={pin.altText}
                {...pinterestImageAttributes(pin)}
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
          <section className="rp-section" id="ingredients" aria-labelledby="ingredients-title">
            <h2 className="rp-section-title" id="ingredients-title">Ingredients</h2>
            <div className="rp-checklist-tools">
              <p aria-live="polite">{checkedIngredients.size ? `${checkedIngredients.size} of ${recipe.ingredients.length} ready` : 'Tap ingredients as you prepare them.'}</p>
              <button type="button" disabled={!checkedIngredients.size} onClick={() => setCheckedIngredients(new Set())}>Reset</button>
            </div>
            <ul className="rp-ingredients">
              {recipe.ingredients.map((ing, i) => {
                const group = recipe.ingredientGroups?.find(g => g.startIndex === i)
                return (
                  <Fragment key={i}>
                    {group && (
                      <li key={`group-${i}`} className="rp-ingredient-group">
                        <span className="rp-ingredient-group-label">{group.label}</span>
                        <span className="rp-ingredient-group-line" />
                      </li>
                    )}
                    <li key={i} className="rp-ingredient">
                      <label className={`rp-ingredient-label${checkedIngredients.has(i) ? ' is-checked' : ''}`}>
                        <input type="checkbox" checked={checkedIngredients.has(i)} onChange={() => toggleIngredient(i)} />
                        <span className="rp-ingredient-dot" aria-hidden="true" />
                        <span>{decode(typeof ing === 'string' ? ing : `${ing.amount ?? ''} ${ing.unit ?? ''} ${ing.name ?? ''}`.trim())}</span>
                      </label>
                    </li>
                  </Fragment>
                )
              })}
            </ul>
          </section>
        )}

        {/* Instructions */}
        {recipe.instructions?.length > 0 && (
          <section className="rp-section" id="method" aria-labelledby="method-title">
            <h2 className="rp-section-title" id="method-title">Instructions</h2>
            <ol className="rp-instructions">
              {recipe.instructions.map((step, i) => (
                <li key={i} id={`step-${i + 1}`} className="rp-step">
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
          <a href={PLAY_STORE} className="rp-store-btn" target="_blank" rel="noopener noreferrer">
            Get Savor free for Android
          </a>
          <a
            href={`savor://create?url=${encodeURIComponent(`${SITE_URL}/r/${encodeURIComponent(id)}`)}`}
            className="rp-get-savor-link"
          >
            Already have Savor? Save this recipe
          </a>
        </div>

      </div>
    </div>
  )
}
