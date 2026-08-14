// src/pages/Potluck.jsx — Potluck's playable web front door.
import './potluck.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import {
  REEL_SYMBOLS,
  fetchRandomRecipe,
  fmtMins,
  getPotluckVisitorId,
  totalMins,
  trackPotluckEvent,
} from '../lib/potluckWeb'
import {
  IDLE_HEADLINES,
  IDLE_SUBLINES,
  REROLL_LABELS,
  SPINNING_LINES,
  pick,
  verdictFor,
} from '../lib/potluckVoice'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck&utm_source=potluck_web&utm_medium=web&utm_campaign=the_universe_remembers'
const SAVOR_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes&utm_source=potluck_web&utm_medium=theme_claim&utm_campaign=potluck_theme'
const POTLUCK_THEME_ID = 'POTLUCK'
const POTLUCK_THEME_INTENT_URL = `intent://collab?id=${POTLUCK_THEME_ID}#Intent;scheme=savor;package=com.calicosquid.savorrecipes;S.browser_fallback_url=${encodeURIComponent(SAVOR_PLAY_URL)};end`
const POTLUCK_STATS_URL = 'https://savor-app-server-gql-production.up.railway.app/potluck-stats'
const MIN_SPIN_MS = 1800
const APP_PITCH_KEY = 'potluck:web-app-pitch-shown:v2'

const isAndroidDevice = () => typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)

const APP_FEATURES = [
  {
    sigil: '7D',
    title: 'This Week',
    body: 'The dinners you actually choose stick around for seven days. Fate, with receipts.',
  },
  {
    sigil: '86',
    title: 'The Void',
    body: 'Banish a recipe from future spins. Reversible, technically. Emotionally? We’ll see.',
    void: true,
  },
  {
    sigil: '∞',
    title: 'I remember',
    body: 'The app remembers what you chose and what you cast out. The website is merely an acquaintance.',
  },
]

const SHARE_TEMPLATES = [
  (name) => `The Universe says I’m making ${name}. I appealed. It was denied.`,
  (name) => `Dinner has been assigned: ${name}. Apparently this is canon now.`,
  (name) => `I outsourced dinner to the cosmos and got ${name}. No appeals, apparently.`,
  (name) => `The edible multiverse has selected ${name} for me. I have questions.`,
  (name) => `Potluck says it’s ${name} tonight. The matter is cosmically settled.`,
  (name) => `My evening now has a plot: ${name}. Blame the universe.`,
]

const shareTextFor = (recipe) => {
  const template = SHARE_TEMPLATES[Math.floor(Math.random() * SHARE_TEMPLATES.length)]
  return template(recipe?.name || 'dinner')
}

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

function localFlag(key) {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function setLocalFlag(key) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, '1')
  } catch {
    // Browser storage is optional. The funnel still works without it.
  }
}

function TypewriterVerdict({ text, tone = 'default', onComplete }) {
  const [count, setCount] = useState(0)
  const callbackRef = useRef(onComplete)

  useEffect(() => {
    callbackRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const full = text || ''
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    setCount(reducedMotion ? full.length : 0)

    if (!full || reducedMotion) {
      callbackRef.current?.()
      return undefined
    }

    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setCount(i)
      if (i >= full.length) {
        window.clearInterval(id)
        callbackRef.current?.()
      }
    }, 42)

    return () => window.clearInterval(id)
  }, [text])

  const full = text || ''
  const shown = full.slice(0, count)
  const typing = count < full.length

  return (
    <span className={`pl-typewriter pl-typewriter--${tone}`} aria-label={full}>
      <span className="pl-typewriter-spacer" aria-hidden="true">“{full}”</span>
      <span className="pl-typewriter-live" aria-hidden="true">
        <span className="pl-typewriter-mark">“</span>{shown}
        {typing ? <span className="pl-typewriter-caret">|</span> : null}
        <span className="pl-typewriter-mark">”</span>
      </span>
    </span>
  )
}

function AppPitch({ onClose, onAppClick }) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="pl-pitch-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="pl-pitch"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pl-pitch-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="pl-pitch-close" onClick={onClose} aria-label="Close">×</button>
        <span className="pl-dots" aria-hidden="true"><span /><span /><span /></span>
        <p className="pl-pitch-eyebrow">A transmission from the universe</p>
        <h2 id="pl-pitch-title" className="pl-pitch-title">
          <TypewriterVerdict text="…Oh. You’re still here." />
        </h2>
        <p>Three verdicts. You have now ignored me twice. Apparently we&rsquo;re doing this properly.</p>
        <p>
          In the app I remember this week&rsquo;s dinners, let you cast recipes into <strong>The Void</strong>,
          and keep a much better record of your insolence.
        </p>
        <p className="pl-pitch-last">You may continue here. <strong>I simply won&rsquo;t remember you.</strong></p>
        <a href={PLAY_URL} target="_blank" rel="noreferrer" className="pl-btn pl-btn--orange pl-pitch-cta" onClick={onAppClick}>
          Make this official →
        </a>
        <button type="button" className="pl-pitch-dismiss" onClick={onClose}>Remain anonymous to fate</button>
      </section>
    </div>
  )
}

export default function Potluck() {
  const [spinCount, setSpinCount] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | spinning | revealed
  const [spinStage, setSpinStage] = useState('idle') // idle | summoning | sealing
  const [recipe, setRecipe] = useState(null)
  const [verdict, setVerdict] = useState('')
  const [spinLine, setSpinLine] = useState(() => pick(SPINNING_LINES))
  const [reelSymbol, setReelSymbol] = useState(REEL_SYMBOLS[0])
  const [error, setError] = useState('')
  const [shareStatus, setShareStatus] = useState('')
  const [resultImageFailed, setResultImageFailed] = useState(false)
  const [sessionSpins, setSessionSpins] = useState(0)
  const [showAppPitch, setShowAppPitch] = useState(false)
  const [showThemeClaimHelp, setShowThemeClaimHelp] = useState(false)
  const [idleCopy, setIdleCopy] = useState({
    headline: IDLE_HEADLINES[0],
    subline: IDLE_SUBLINES[0],
  })
  const seenIds = useRef([])
  const previousCount = useRef(null)
  const sessionSpinsRef = useRef(0)
  const pitchPendingRef = useRef(false)
  const pitchHandledRef = useRef(false)
  const pitchTimerRef = useRef(null)

  useEffect(() => {
    setIdleCopy({
      headline: pick(IDLE_HEADLINES),
      subline: pick(IDLE_SUBLINES),
    })
    pitchHandledRef.current = localFlag(APP_PITCH_KEY)
    trackPotluckEvent('visit')

    return () => {
      if (pitchTimerRef.current) window.clearTimeout(pitchTimerRef.current)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let animationFrame = null
    let pollTimer = null
    let failures = 0
    let inFlight = false

    const POLL_MS = 3000
    const MAX_BACKOFF_MS = 60000

    const animateTo = (nextCount) => {
      const current = previousCount.current
      if (current !== null && nextCount < current) return

      const start = current ?? nextCount
      previousCount.current = nextCount

      if (start === nextCount) {
        setSpinCount(nextCount)
        return
      }

      const startedAt = performance.now()
      const duration = 650
      const tick = (now) => {
        if (cancelled) return
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setSpinCount(Math.round(start + (nextCount - start) * eased))
        if (progress < 1) animationFrame = requestAnimationFrame(tick)
      }
      animationFrame = requestAnimationFrame(tick)
    }

    const clearPollTimer = () => {
      if (pollTimer) {
        window.clearTimeout(pollTimer)
        pollTimer = null
      }
    }

    const scheduleNextPoll = (delay = POLL_MS) => {
      clearPollTimer()
      if (cancelled || document.visibilityState !== 'visible') return
      pollTimer = window.setTimeout(loadStats, delay)
    }

    const loadStats = async () => {
      if (cancelled || inFlight || document.visibilityState !== 'visible') return
      inFlight = true

      try {
        const response = await fetch(POTLUCK_STATS_URL, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Potluck stats ${response.status}`)

        const data = await response.json()
        const nextCount = Number(data?.totalSpins)
        if (!Number.isFinite(nextCount) || nextCount < 0) throw new Error('Invalid Potluck stats payload')

        failures = 0
        if (!cancelled) animateTo(nextCount)
      } catch {
        failures += 1
      } finally {
        inFlight = false
        const backoff = failures
          ? Math.min(POLL_MS * (2 ** failures), MAX_BACKOFF_MS)
          : POLL_MS
        scheduleNextPoll(backoff)
      }
    }

    const handleVisibilityChange = () => {
      clearPollTimer()
      if (document.visibilityState === 'visible') loadStats()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    loadStats()

    return () => {
      cancelled = true
      clearPollTimer()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'spinning') return undefined
    let symbolIndex = Math.floor(Math.random() * REEL_SYMBOLS.length)
    const timer = window.setInterval(() => {
      symbolIndex = (symbolIndex + 1 + Math.floor(Math.random() * 4)) % REEL_SYMBOLS.length
      setReelSymbol(REEL_SYMBOLS[symbolIndex])
    }, 92)
    return () => window.clearInterval(timer)
  }, [phase])

  const handleSpin = useCallback(async () => {
    if (phase === 'spinning') return

    setPhase('spinning')
    setSpinStage('summoning')
    setError('')
    setShareStatus('')
    setSpinLine(pick(SPINNING_LINES))
    setResultImageFailed(false)
    if (pitchTimerRef.current) window.clearTimeout(pitchTimerRef.current)

    let chatterTimer = null
    try {
      chatterTimer = window.setTimeout(() => {
        setSpinLine(pick(SPINNING_LINES))
      }, 820)

      const visitorId = getPotluckVisitorId()
      const [picked] = await Promise.all([
        fetchRandomRecipe({
          excludeIds: seenIds.current.slice(-30),
          visitorId,
        }),
        sleep(MIN_SPIN_MS),
      ])

      if (chatterTimer) window.clearTimeout(chatterTimer)
      setSpinStage('sealing')
      setSpinLine('Sealing the timeline…')
      await sleep(300)

      seenIds.current = [...seenIds.current, picked.id].slice(-30)
      setRecipe(picked)
      setVerdict(verdictFor(picked))
      setPhase('revealed')
      setSpinStage('idle')

      const nextSpins = sessionSpinsRef.current + 1
      sessionSpinsRef.current = nextSpins
      setSessionSpins(nextSpins)
      if (nextSpins === 3) trackPotluckEvent('three_spins')
      pitchPendingRef.current = pitchPendingRef.current || (
        nextSpins >= 3 && !pitchHandledRef.current && !localFlag(APP_PITCH_KEY)
      )

      if (previousCount.current !== null) {
        previousCount.current += 1
        setSpinCount(previousCount.current)
      }
    } catch {
      if (chatterTimer) window.clearTimeout(chatterTimer)
      setSpinStage('idle')
      setPhase(recipe ? 'revealed' : 'idle')
      setError('The universe lost the connection. Give it another spin.')
    }
  }, [phase, recipe])

  const handleVerdictComplete = useCallback(() => {
    if (!pitchPendingRef.current) return
    pitchPendingRef.current = false
    pitchHandledRef.current = true
    setLocalFlag(APP_PITCH_KEY)
    pitchTimerRef.current = window.setTimeout(() => setShowAppPitch(true), 750)
  }, [])

  const handleShare = useCallback(async () => {
    if (!recipe) return
    const url = `${window.location.origin}/potluck/`
    const text = shareTextFor(recipe)

    try {
      if (navigator.share) {
        await navigator.share({ title: `Potluck chose ${recipe.name}`, text, url })
        trackPotluckEvent('share')
        setShareStatus('Verdict dispatched into the timeline.')
        return
      }
      await navigator.clipboard.writeText(`${text} ${url}`)
      trackPotluckEvent('share')
      setShareStatus('Verdict copied. Go bother someone else with it.')
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') setShareStatus('Copy the link and blame Mercury.')
    }
  }, [recipe])

  const handleThemeClaim = useCallback(() => {
    trackPotluckEvent('theme_claim_click')
    if (isAndroidDevice()) {
      // Explicit Android intent: installed Savor receives savor://collab?id=POTLUCK.
      // If Savor is absent, Chrome falls back to the Play listing. The claim is
      // intentionally handled by Savor's existing generic collab route.
      window.location.href = POTLUCK_THEME_INTENT_URL
      return
    }

    setShowThemeClaimHelp(true)
  }, [])

  const handleAppClick = useCallback(() => trackPotluckEvent('potluck_app_click'), [])
  const handleSavorClick = useCallback(() => trackPotluckEvent('savor_click'), [])
  const handleRecipeClick = useCallback(() => trackPotluckEvent('recipe_click'), [])
  const rerollLabel = REROLL_LABELS[
    Math.min(Math.max(sessionSpins - 1, 0), REROLL_LABELS.length - 1)
  ] || 'Spin again'

  const time = recipe ? fmtMins(totalMins(recipe)) : null
  const meta = [recipe?.cuisine, recipe?.category]
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index)

  return (
    <>
      <main className="page potluck-page">

        {/* ── Potluck itself ───────────────────────────────────────────── */}
        <section className={`pl-hero pl-hero--${phase}`}>
          <div className="pl-container pl-hero-inner">
            <img
              src="/potluck/potluck_wordmark.webp"
              alt="Potluck"
              className="pl-wordmark"
              width="640"
              height="241"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />

            <div className="pl-hero-copy">
              <h1 className="pl-h1">{idleCopy.headline}</h1>
            </div>

            <div className={`pl-wheel pl-wheel--${phase} pl-wheel-stage--${spinStage}`} aria-live="polite">
              {phase === 'revealed' ? (
                recipe?.image && !resultImageFailed ? (
                  <img
                    src={recipe.image}
                    alt=""
                    className="pl-wheel-result"
                    width="640"
                    height="640"
                    referrerPolicy="no-referrer"
                    onError={() => setResultImageFailed(true)}
                  />
                ) : (
                  <span className="pl-wheel-result-placeholder" aria-hidden="true">🍽️</span>
                )
              ) : null}

              {phase === 'revealed' && recipe ? (
                <Link
                  to={`/r/${recipe.id}`}
                  className="pl-wheel-card-link"
                  onClick={handleRecipeClick}
                  aria-label={`See recipe: ${recipe.name}`}
                >
                  <span className="pl-wheel-card-scrim" aria-hidden="true" />
                  <span className="pl-wheel-card-footer">
                    <span className="pl-wheel-card-hint">Tap for the recipe&nbsp; ›</span>
                    <span className="pl-wheel-card-title">{recipe.name}</span>
                  </span>
                </Link>
              ) : null}

              {phase === 'spinning' ? (
                <span className="pl-reel-symbol" aria-hidden="true">{reelSymbol}</span>
              ) : null}

              <span className="pl-wheel-spin" aria-hidden="true">
                <img
                  src="/potluck/spinner.webp"
                  alt=""
                  className="pl-wheel-spinner"
                  width="512"
                  height="512"
                  loading="eager"
                  decoding="async"
                />
              </span>

              <img
                src="/potluck/outer.webp"
                alt=""
                className="pl-wheel-outer"
                width="640"
                height="640"
                loading="eager"
                decoding="async"
              />
              <span className="pl-wheel-glass-t" />
              <span className="pl-wheel-glass-b" />
              <span className="pl-wheel-marker l" />
              <span className="pl-wheel-marker r" />
            </div>

            <div className="pl-oracle">
              {phase === 'revealed' && recipe ? (
                <div className="pl-result-panel" key={recipe.id}>
                  <p className="pl-oracle-kicker"><span /> The universe has spoken</p>
                  <h2 className="pl-result-name">{recipe.name}</h2>
                  <p className="pl-result-verdict">
                    <TypewriterVerdict text={verdict} onComplete={handleVerdictComplete} />
                  </p>
                  {(time || meta.length > 0) && (
                    <div className="pl-result-meta">
                      {time ? <span>⏱ {time}</span> : null}
                      {meta.slice(0, 1).map((item) => <span key={item}>{item}</span>)}
                    </div>
                  )}
                  {error ? <p className="pl-spin-error">{error}</p> : null}
                  <div className="pl-result-actions">
                    <Link to={`/r/${recipe.id}`} className="pl-btn pl-btn--teal pl-result-primary" onClick={handleRecipeClick}>
                      <span className="pl-result-primary-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                          <path d="M5.5 3v5.5a3 3 0 0 0 6 0V3M8.5 3v8M8.5 11v10" />
                          <path d="M16 3c2.6 2.7 2.6 7.1 0 10v8M16 3v10h3" />
                        </svg>
                      </span>
                      <span className="pl-result-primary-copy">
                        <strong>See the recipe</strong>
                        <small>Ingredients, steps, the lot</small>
                      </span>
                      <span className="pl-result-primary-arrow" aria-hidden="true">›</span>
                    </Link>
                    <button type="button" className="pl-btn pl-btn--ghost" onClick={handleSpin}>{rerollLabel}</button>
                    <button type="button" className="pl-share-btn" onClick={handleShare}>Share</button>
                  </div>

                  {shareStatus ? <p className="pl-share-status" role="status">{shareStatus}</p> : null}
                </div>
              ) : (
                <>
                  {phase === 'spinning' ? <p className="pl-spinning-line">{spinLine}</p> : null}
                  <button
                    type="button"
                    className="pl-spin-button"
                    onClick={handleSpin}
                    disabled={phase === 'spinning'}
                  >
                    <span className="pl-spin-button-title">{phase === 'spinning' ? 'Deciding…' : 'Spin'}</span>
                    <span className="pl-spin-button-sub">{phase === 'spinning' ? 'The cosmos is checking its notes' : 'Hand dinner over to fate'}</span>
                  </button>
                  {error ? <p className="pl-spin-error">{error}</p> : null}
                </>
              )}
            </div>

            <div className={`pl-spin-count${spinCount === null ? ' is-loading' : ''}`}>
              <span className="pl-spin-count-number">
                {spinCount === null ? '···' : spinCount.toLocaleString()}
              </span>
              <span className="pl-spin-count-label">cosmic verdicts issued</span>
              <span className="pl-spin-count-aside">Most were probably appealed.</span>
            </div>
          </div>
        </section>

        {/* ── The app remembers ───────────────────────────────────────── */}
        <section className="pl-section pl-memory-section">
          <div className="pl-container pl-memory-inner">
            <div className="pl-memory-copy">
              <span className="pl-eyebrow">The app remembers</span>
              <h2 className="pl-h2">The website gives a verdict. The app remembers what you did about it.</h2>
              <p>
                Keep this week&rsquo;s dinners, banish recipes into The Void, and carry an unnecessarily
                judgemental cosmic authority around in your pocket.
              </p>
              <a href={PLAY_URL} target="_blank" rel="noreferrer" className="pl-play-link" onClick={handleAppClick}>
                <img
                  src="/potluck/play2.webp"
                  alt="Get Potluck on Google Play"
                  className="pl-play-badge"
                  width="440"
                  height="121"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>

            <div className="pl-memory-grid">
              {APP_FEATURES.map((feature) => (
                <article className={`pl-memory-card${feature.void ? ' pl-memory-card--void' : ''}`} key={feature.title}>
                  <span className="pl-memory-sigil" aria-hidden="true">{feature.sigil}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Potluck × Savor ─────────────────────────────────────────── */}
        <section className="pl-section pl-cosmos-path">
          <div className="pl-container">
            <div className="pl-path-heading">
              <span className="pl-eyebrow">Potluck × Savor</span>
              <h2 className="pl-h2">Tonight. This week. Keep it.</h2>
              <p>Three different jobs. No reason to make any of them more complicated than that.</p>
            </div>

            <div className="pl-path-grid">
              <article className="pl-path-card">
                <span className="pl-path-label">WEB POTLUCK</span>
                <strong>Tonight</strong>
                <p>Ask the universe what to eat. Get an answer. Go cook.</p>
              </article>
              <span className="pl-path-arrow" aria-hidden="true">→</span>
              <article className="pl-path-card pl-path-card--app">
                <span className="pl-path-label">POTLUCK APP</span>
                <strong>This week</strong>
                <p>Remember the verdicts. Defy them. Throw things into The Void.</p>
              </article>
              <span className="pl-path-arrow" aria-hidden="true">→</span>
              <article className="pl-path-card pl-path-card--savor">
                <span className="pl-path-label">SAVOR</span>
                <strong>Keep it</strong>
                <p>The recipes actually worth keeping get a proper home.</p>
              </article>
            </div>

            <article className="pl-theme-gift">
              <div className="pl-theme-preview" aria-label="Free Potluck theme for Savor">
                <div className="pl-theme-preview-top">
                  <span className="pl-dots" aria-hidden="true"><span /><span /><span /></span>
                </div>
                <div className="pl-theme-preview-body">
                  <img src="/potluck/potluck-icon.webp" alt="" width="192" height="192" loading="lazy" decoding="async" />
                  <span className="pl-theme-preview-name">POTLUCK</span>
                  <strong>SAVOR THEME</strong>
                  <span className="pl-theme-preview-note">THE UNIVERSE HAS REDECORATED</span>
                </div>
                <div className="pl-theme-preview-stripe" aria-hidden="true"><span /><span /><span /></div>
              </div>

              <div className="pl-theme-gift-copy">
                <span className="pl-eyebrow">A gift from the universe</span>
                <h3>The universe has redecorated.</h3>
                <p>
                  Potluck escaped into Savor. The theme is free. Fate covered the bill.
                </p>
                <div className="pl-theme-gift-actions">
                  <button type="button" className="pl-btn pl-btn--orange" onClick={handleThemeClaim}>
                    Accept the gift →
                  </button>
                  <span>On Android, Savor opens straight to the gift.</span>
                </div>
              </div>
            </article>

          </div>
        </section>


      </main>
      <Footer />
      {showAppPitch ? <AppPitch onClose={() => setShowAppPitch(false)} onAppClick={handleAppClick} /> : null}
      {showThemeClaimHelp ? (
        <div
          className="pl-theme-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowThemeClaimHelp(false)
          }}
        >
          <section className="pl-theme-modal" role="dialog" aria-modal="true" aria-labelledby="pl-theme-modal-title">
            <button type="button" className="pl-theme-modal-close" onClick={() => setShowThemeClaimHelp(false)} aria-label="Close">×</button>
            <img src="/potluck/potluck-icon.webp" alt="" width="72" height="72" />
            <span className="pl-eyebrow">Potluck × Savor</span>
            <h2 id="pl-theme-modal-title">This particular cosmic gift needs Android.</h2>
            <p>
              Savor is on Android right now. Open this page on your Android phone and tap <strong>Accept the gift</strong> again.
              If Savor is installed, it opens straight to the gift. If not, Google Play will take it from there.
            </p>
            <div className="pl-theme-modal-actions">
              <a href={SAVOR_PLAY_URL} target="_blank" rel="noreferrer" className="pl-btn pl-btn--orange" onClick={handleSavorClick}>Get Savor →</a>
              <button type="button" className="pl-btn pl-btn--ghost" onClick={() => setShowThemeClaimHelp(false)}>Got it</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
