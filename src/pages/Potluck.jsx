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
const APP_PITCH_KEY = 'potluck:web-app-pitch-shown:v1'

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

function AppPitch({ onClose }) {
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
        <p>Three verdicts and apparently we&rsquo;re doing this properly.</p>
        <p>
          In the app I remember this week&rsquo;s dinners, let you cast recipes into <strong>The Void</strong>,
          and keep a much better record of your insolence.
        </p>
        <p className="pl-pitch-last">You may continue here. <strong>I simply won&rsquo;t remember you.</strong></p>
        <a href={PLAY_URL} target="_blank" rel="noreferrer" className="pl-btn pl-btn--orange pl-pitch-cta">
          Let the universe remember me →
        </a>
        <button type="button" className="pl-pitch-dismiss" onClick={onClose}>Remain anonymous to fate</button>
      </section>
    </div>
  )
}

export default function Potluck() {
  const [spinCount, setSpinCount] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | spinning | revealed
  const [recipe, setRecipe] = useState(null)
  const [verdict, setVerdict] = useState('')
  const [spinLine, setSpinLine] = useState(() => pick(SPINNING_LINES))
  const [reelSymbol, setReelSymbol] = useState(REEL_SYMBOLS[0])
  const [error, setError] = useState('')
  const [shareStatus, setShareStatus] = useState('')
  const [resultImageFailed, setResultImageFailed] = useState(false)
  const [sessionSpins, setSessionSpins] = useState(0)
  const [showAppPitch, setShowAppPitch] = useState(false)
  const [showVoidTease, setShowVoidTease] = useState(false)
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
    setError('')
    setShareStatus('')
    setShowVoidTease(false)
    setSpinLine(pick(SPINNING_LINES))
    setResultImageFailed(false)
    if (pitchTimerRef.current) window.clearTimeout(pitchTimerRef.current)

    try {
      const visitorId = getPotluckVisitorId()
      const [picked] = await Promise.all([
        fetchRandomRecipe({
          excludeIds: seenIds.current.slice(-30),
          visitorId,
        }),
        sleep(MIN_SPIN_MS),
      ])

      seenIds.current = [...seenIds.current, picked.id].slice(-30)
      setRecipe(picked)
      setVerdict(verdictFor(picked))
      setPhase('revealed')

      const nextSpins = sessionSpinsRef.current + 1
      sessionSpinsRef.current = nextSpins
      setSessionSpins(nextSpins)
      pitchPendingRef.current = pitchPendingRef.current || (
        nextSpins >= 3 && !pitchHandledRef.current && !localFlag(APP_PITCH_KEY)
      )

      if (previousCount.current !== null) {
        previousCount.current += 1
        setSpinCount(previousCount.current)
      }
    } catch {
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
    const text = `Potluck just decided I’m making ${recipe.name}. The universe has spoken.`

    try {
      if (navigator.share) {
        await navigator.share({ title: `Potluck chose ${recipe.name}`, text, url })
        setShareStatus('Verdict dispatched.')
        return
      }
      await navigator.clipboard.writeText(`${text} ${url}`)
      setShareStatus('Verdict copied.')
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') setShareStatus('Copy the link and blame Mercury.')
    }
  }, [recipe])

  const handleThemeClaim = useCallback(() => {
    if (isAndroidDevice()) {
      // Explicit Android intent: installed Savor receives savor://collab?id=POTLUCK.
      // If Savor is absent, Chrome falls back to the Play listing. The claim is
      // intentionally handled by Savor's existing generic collab route.
      window.location.href = POTLUCK_THEME_INTENT_URL
      return
    }

    setShowThemeClaimHelp(true)
  }, [])

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
        <section className="pl-hero">
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
              <p className="pl-sub">{idleCopy.subline}</p>
            </div>

            <div className={`pl-wheel pl-wheel--${phase}`} aria-live="polite">
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
                <>
                  <p className="pl-oracle-kicker">The universe has spoken</p>
                  <h2 className="pl-result-name">{recipe.name}</h2>
                  <p className="pl-result-verdict">
                    <TypewriterVerdict text={verdict} onComplete={handleVerdictComplete} />
                  </p>
                  {(time || recipe.recipeYield || meta.length > 0) && (
                    <div className="pl-result-meta">
                      {time ? <span>⏱ {time}</span> : null}
                      {recipe.recipeYield ? <span>🍽 {recipe.recipeYield}</span> : null}
                      {meta.slice(0, 2).map((item) => <span key={item}>{item}</span>)}
                    </div>
                  )}
                  {error ? <p className="pl-spin-error">{error}</p> : null}
                  <div className="pl-result-actions">
                    <Link to={`/r/${recipe.id}`} className="pl-btn pl-btn--teal">See the recipe →</Link>
                    <button type="button" className="pl-btn pl-btn--ghost" onClick={handleSpin}>{rerollLabel}</button>
                    <button
                      type="button"
                      className={`pl-86-button${showVoidTease ? ' is-open' : ''}`}
                      onClick={() => setShowVoidTease((open) => !open)}
                      aria-expanded={showVoidTease}
                      aria-controls="pl-web-void-tease"
                    >
                      86
                    </button>
                    <button type="button" className="pl-share-btn" onClick={handleShare}>Share the verdict</button>
                  </div>

                  {showVoidTease ? (
                    <div className="pl-web-void" id="pl-web-void-tease">
                      <div className="pl-web-void-copy">
                        <strong>Nice try.</strong>
                        <span>The Void is app territory. Banish it there and I&rsquo;ll keep it out of future spins.</span>
                      </div>
                      <a href={PLAY_URL} target="_blank" rel="noreferrer" className="pl-web-void-link">Enter The Void →</a>
                    </div>
                  ) : null}

                  <div className="pl-savor-nudge">
                    <img src="/icons/icon-Tangerine.webp" alt="" width="34" height="34" />
                    <span>Fate picked it. If it&rsquo;s a keeper, the recipe page can make it permanent in <Link to="/">Savor</Link>.</span>
                  </div>
                  {shareStatus ? <p className="pl-share-status" role="status">{shareStatus}</p> : null}
                </>
              ) : (
                <>
                  {phase === 'spinning' ? <p className="pl-spinning-line">{spinLine}</p> : null}
                  <button
                    type="button"
                    className="pl-spin-button"
                    onClick={handleSpin}
                    disabled={phase === 'spinning'}
                  >
                    <span className="pl-spin-button-title">{phase === 'spinning' ? 'DECIDING…' : 'SPIN'}</span>
                    <span className="pl-spin-button-sub">{phase === 'spinning' ? 'Do not interfere with the timeline' : 'Hand dinner over to fate'}</span>
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
            </div>
          </div>
        </section>

        {/* ── The app remembers ───────────────────────────────────────── */}
        <section className="pl-section pl-memory-section">
          <div className="pl-container pl-memory-inner">
            <div className="pl-memory-copy">
              <span className="pl-eyebrow">The app remembers</span>
              <h2 className="pl-h2">A browser visit is fate. The app makes it personal.</h2>
              <p>
                Spin here as much as you like. Potluck on Android keeps a little history of your choices,
                your rebellions, and the recipes you decided no longer deserve to exist.
              </p>
              <a href={PLAY_URL} target="_blank" rel="noreferrer" className="pl-play-link">
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

        {/* ── 86 / The Void teaser ───────────────────────────────────── */}
        <section className="pl-void-teaser" aria-label="A warning from the universe">
          <div className="pl-container pl-void-teaser-inner">
            <span className="pl-void-teaser-86" aria-hidden="true">86</span>
            <p className="pl-void-teaser-copy">
              The Void is real. <strong>It is in the app. You have been warned.</strong>
            </p>
            <span className="pl-void-teaser-name" aria-hidden="true">The Void</span>
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

            <div className="pl-pair-cta">
              <div className="pl-pair-icons">
                <img src="/potluck/potluck-icon.webp" alt="Potluck" className="pl-pair-icon" width="192" height="192" loading="lazy" decoding="async" />
                <span className="pl-pair-x">×</span>
                <img src="/icons/icon-Tangerine.webp" alt="Savor" className="pl-pair-icon" width="160" height="160" loading="lazy" decoding="async" />
              </div>
              <div>
                <h3>Fate chooses. Savor keeps.</h3>
                <p>Found a keeper? Savor saves recipes from websites, text, screenshots and the occasional act of cosmic intervention.</p>
                <Link to="/" className="pl-btn pl-btn--teal">Meet Savor →</Link>
              </div>
            </div>

            <article className="pl-theme-gift">
              <div className="pl-theme-gift-mark">
                <img
                  src="/potluck/potluck-icon.webp"
                  alt=""
                  width="192"
                  height="192"
                  loading="lazy"
                  decoding="async"
                />
                <span className="pl-theme-gift-free">FREE</span>
              </div>

              <div className="pl-theme-gift-copy">
                <span className="pl-eyebrow">A gift from the universe</span>
                <h3>The universe has redecorated.</h3>
                <p>
                  Potluck escaped into Savor: cosmic orange, deep teal and just enough green to imply this was planned.
                  The theme is yours for free. Fate has covered the bill.
                </p>
                <div className="pl-theme-swatches" aria-label="Potluck theme colours">
                  <span className="pl-theme-swatch pl-theme-swatch--orange" />
                  <span className="pl-theme-swatch pl-theme-swatch--teal" />
                  <span className="pl-theme-swatch pl-theme-swatch--green" />
                  <span className="pl-theme-swatch pl-theme-swatch--cream" />
                </div>
                <div className="pl-theme-gift-actions">
                  <button type="button" className="pl-btn pl-btn--orange" onClick={handleThemeClaim}>
                    Claim the Potluck theme →
                  </button>
                  <span>Already have Savor? This opens it directly.</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── Final app pull ───────────────────────────────────────────── */}
        <section className="pl-download">
          <div className="pl-container pl-section pl-download-inner">
            <span className="pl-dots"><span /><span /><span /></span>
            <h2>Still defying me in a browser?</h2>
            <p>Fine. Put the universe in your pocket. I&rsquo;ll remember what happened.</p>
            <a href={PLAY_URL} target="_blank" rel="noreferrer" className="pl-play-link">
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
        </section>

      </main>
      <Footer />
      {showAppPitch ? <AppPitch onClose={() => setShowAppPitch(false)} /> : null}
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
              Savor is on Android right now. Open Potluck on your Android phone and tap <strong>Claim the Potluck theme</strong> again.
              If Savor is installed, it opens straight to the gift. If not, Google Play will take it from there.
            </p>
            <div className="pl-theme-modal-actions">
              <a href={SAVOR_PLAY_URL} target="_blank" rel="noreferrer" className="pl-btn pl-btn--orange">Get Savor →</a>
              <button type="button" className="pl-btn pl-btn--ghost" onClick={() => setShowThemeClaimHelp(false)}>Got it</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
