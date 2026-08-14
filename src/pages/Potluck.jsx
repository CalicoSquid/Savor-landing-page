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
  verdictFor,
} from '../lib/potluckWeb'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck'
const POTLUCK_STATS_URL = 'https://savor-app-server-gql-production.up.railway.app/potluck-stats'
const MIN_SPIN_MS = 1800

const STEPS = [
  {
    badge: '🎰',
    title: 'Spin the wheel.',
    body: 'One tap. The reels tumble. No menus, no scrolling, no twenty open tabs — just turn it over to fate.',
  },
  {
    badge: '🍽️',
    title: 'The universe decides.',
    body: "One recipe lands. That's dinner. The wheel doesn't miss — and it's got opinions about your choices.",
  },
  {
    badge: { img: '/icons/icon-Tangerine.webp', alt: 'Savor' },
    title: 'Save it to Savor.',
    body: 'Love what landed? Open the recipe, then send the keeper straight to Savor for next time.',
  },
]

const VERDICTS = [
  'Resistance is futile. Also delicious.',
  'Good luck doing better.',
  'Don’t make it weird. Just cook it.',
  'That’s dinner. No appeals.',
  'Pudding counts as dinner. Officially, now.',
  'Stop scrolling. Start cooking.',
]

const SPINNING_LINES = [
  'Consulting the stars…',
  'Collapsing timelines…',
  'Reviewing your questionable options…',
  'Asking the void…',
  'Processing destiny…',
  'Submitting dinner for cosmic approval…',
]

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

export default function Potluck() {
  const [spinCount, setSpinCount] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | spinning | revealed
  const [recipe, setRecipe] = useState(null)
  const [verdict, setVerdict] = useState('')
  const [spinLine, setSpinLine] = useState(SPINNING_LINES[0])
  const [reelSymbol, setReelSymbol] = useState(REEL_SYMBOLS[0])
  const [error, setError] = useState('')
  const [shareStatus, setShareStatus] = useState('')
  const seenIds = useRef([])
  const previousCount = useRef(null)

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
      // This counter only goes up. A stale CDN response should never make the
      // public number visibly tick backwards after a fresh web spin.
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
        if (!Number.isFinite(nextCount) || nextCount < 0) {
          throw new Error('Invalid Potluck stats payload')
        }

        failures = 0
        if (!cancelled) animateTo(nextCount)
      } catch {
        // Stats are decorative; back off quietly if the endpoint has a hiccup.
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
    setSpinLine(SPINNING_LINES[Math.floor(Math.random() * SPINNING_LINES.length)])

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

      if (previousCount.current !== null) {
        previousCount.current += 1
        setSpinCount(previousCount.current)
      }
    } catch {
      setPhase(recipe ? 'revealed' : 'idle')
      setError('The universe lost the connection. Give it another spin.')
    }
  }, [phase, recipe])

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

  const time = recipe ? fmtMins(totalMins(recipe)) : null
  const meta = [recipe?.cuisine, recipe?.category]
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index)

  return (
    <>
      <main className="page potluck-page">

        {/* ── Playable hero ──────────────────────────────────────────────── */}
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
              <h1 className="pl-h1">What&rsquo;s for dinner? <span className="spark">Spin.</span></h1>
              <p className="pl-sub">
                No signup. No install. No deciding. Let the universe pick a real recipe right here.
              </p>
            </div>

            <div className={`pl-wheel pl-wheel--${phase}`} aria-live="polite">
              {phase === 'revealed' && recipe?.image ? (
                <img src={recipe.image} alt="" className="pl-wheel-result" />
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

              {phase === 'revealed' ? <span className="pl-wheel-scrim" aria-hidden="true" /> : null}

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
                  <p className="pl-result-verdict">{verdict}</p>
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
                    <button type="button" className="pl-btn pl-btn--ghost" onClick={handleSpin}>Spin again</button>
                    <button type="button" className="pl-share-btn" onClick={handleShare}>Share the verdict</button>
                  </div>
                  <div className="pl-savor-nudge">
                    <img src="/icons/icon-Tangerine.webp" alt="" width="34" height="34" />
                    <span>Keeper? The recipe page can send it straight to <Link to="/">Savor</Link>.</span>
                  </div>
                  {shareStatus ? <p className="pl-share-status" role="status">{shareStatus}</p> : null}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="pl-spin-button"
                    onClick={handleSpin}
                    disabled={phase === 'spinning'}
                  >
                    <span className="pl-spin-button-title">{phase === 'spinning' ? 'Spinning…' : 'SPIN'}</span>
                    <span className="pl-spin-button-sub">{phase === 'spinning' ? spinLine : 'Let the universe pick dinner'}</span>
                  </button>
                  {error ? <p className="pl-spin-error">{error}</p> : null}
                </>
              )}
            </div>

            <div className={`pl-spin-count${spinCount === null ? ' is-loading' : ''}`}>
              <span className="pl-spin-count-number">
                {spinCount === null ? '···' : spinCount.toLocaleString()}
              </span>
              <span className="pl-spin-count-label">spins and counting</span>
            </div>

            <p className="pl-app-nudge">Want the wheel on your home screen?</p>
            <a href={PLAY_URL} target="_blank" rel="noreferrer" className="pl-play-link">
              <img
                src="/potluck/play2.webp"
                alt="Get Potluck on Google Play"
                className="pl-play-badge"
                width="440"
                height="121"
                loading="eager"
                decoding="async"
              />
            </a>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="pl-section">
          <div className="pl-container">
            <span className="pl-eyebrow">How it works</span>
            <h2 className="pl-h2">Three taps from hungry to cooking.</h2>
            <div className="pl-steps">
              {STEPS.map((s) => (
                <div className="pl-step" key={s.title}>
                  <div className="pl-step-badge">
                    {typeof s.badge === 'object'
                      ? <img
                          src={s.badge.img}
                          alt={s.badge.alt}
                          width="160"
                          height="160"
                          loading="lazy"
                          decoding="async"
                        />
                      : <span>{s.badge}</span>}
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Personality strip ────────────────────────────────────────── */}
        <section className="pl-section pl-voice">
          <div className="pl-container pl-voice-inner">
            <span className="pl-dots"><span /><span /><span /></span>
            <p className="pl-voice-quote">
              The universe has spoken. <span className="gold">Argue with it later.</span>
            </p>
            <p className="pl-voice-sub">
              Potluck has a mouth on it. Every spin lands with a verdict —
              sometimes cheeky, sometimes uncanny, always final.
            </p>
            <div className="pl-verdicts">
              {VERDICTS.map((v) => <span className="pl-verdict" key={v}>{v}</span>)}
            </div>
          </div>
        </section>

        {/* ── 86 / The Void teaser ───────────────────────────────────── */}
        <section className="pl-void-teaser" aria-label="A warning from the universe">
          <div className="pl-container pl-void-teaser-inner">
            <span className="pl-void-teaser-86" aria-hidden="true">86</span>
            <p className="pl-void-teaser-copy">
              You&rsquo;ll see this in the app. <strong>Don&rsquo;t press it.</strong> I know you will. Please don&rsquo;t.
            </p>
            <span className="pl-void-teaser-name" aria-hidden="true">The Void</span>
          </div>
        </section>

        {/* ── Potluck × Savor ──────────────────────────────────────────── */}
        <section className="pl-section">
          <div className="pl-container pl-pair-inner">
            <div className="pl-pair">
              <span className="pl-eyebrow">Better together</span>
              <h2 className="pl-h2">Potluck decides. Savor keeps it.</h2>
              <p>
                <strong>Potluck</strong> is the fastest answer to “what’s for dinner?” —
                a single spin and you’re cooking. <strong>Savor</strong> is where the keepers live:
                the recipes you loved, saved and organised and ad-free.
              </p>
              <Link to="/" className="pl-btn pl-btn--teal">Meet Savor →</Link>
            </div>
            <div className="pl-pair-icons">
              <img
                src="/potluck/potluck-icon.webp"
                alt="Potluck"
                className="pl-pair-icon"
                width="192"
                height="192"
                loading="lazy"
                decoding="async"
              />
              <span className="pl-pair-x">×</span>
              <img
                src="/icons/icon-Tangerine.webp"
                alt="Savor"
                className="pl-pair-icon"
                width="160"
                height="160"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* ── Download band ────────────────────────────────────────────── */}
        <section className="pl-download">
          <div className="pl-container pl-section pl-download-inner">
            <h2>Spin for your supper.</h2>
            <p>Potluck is free on the web. Get the Android app if you want fate one tap away.</p>
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
    </>
  )
}
