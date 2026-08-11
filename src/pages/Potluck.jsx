// src/pages/Potluck.jsx — showcase page for the (new) Potluck app.
import './potluck.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck'
const POTLUCK_STATS_URL = 'https://savor-app-server-gql-production.up.railway.app/potluck-stats'

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
    body: 'Love what landed? One tap sends it straight to Savor, saved and scaled and yours for next time.',
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

export default function Potluck() {
  const [spinCount, setSpinCount] = useState(null)
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
      const start = previousCount.current ?? nextCount
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

  return (
    <>
      <main className="page potluck-page">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
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

            <div className="pl-wheel" aria-hidden="true">
              <img
                src="/potluck/outer.webp"
                alt=""
                className="pl-wheel-outer"
                width="640"
                height="640"
                loading="eager"
                decoding="async"
              />
              <span className="pl-wheel-spin">
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
              <span className="pl-wheel-glass-t" />
              <span className="pl-wheel-glass-b" />
              <span className="pl-wheel-marker l" />
              <span className="pl-wheel-marker r" />
            </div>

            <div className={`pl-spin-count${spinCount === null ? ' is-loading' : ''}`}>
              <span className="pl-spin-count-number">
                {spinCount === null ? '···' : spinCount.toLocaleString()}
              </span>
              <span className="pl-spin-count-label">spins and counting</span>
            </div>

            <h1 className="pl-h1">One spin. <span className="spark">Dinner, decided.</span></h1>
            <p className="pl-sub">
              No scrolling. No deciding. Let the universe pick tonight’s recipe —
              you just turn the oven on.
            </p>
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

        {/* ── The Void ─────────────────────────────────────────────────── */}
        <section className="pl-section pl-void">
          <div className="pl-void-grain" aria-hidden="true" />
          <div className="pl-container pl-void-layout">
            <div className="pl-void-copy">
              <span className="pl-void-signature" aria-hidden="true">
                <span /><span /><span />
              </span>
              <span className="pl-eyebrow pl-eyebrow--void">The Void</span>
              <h2 className="pl-h2 pl-void-title">You asked me to choose. You literally asked.</h2>
              <p className="pl-void-lead">
                Hate what landed? <strong>86 it.</strong> The dish drops out of
                the wheel and into the Void, where Potluck keeps a quiet little
                record of every time you overruled the universe.
              </p>
              <p className="pl-void-fine">
                Changed your mind? Fine. Return a dish to circulation, or empty
                the whole Void and pretend none of this happened. The universe
                will pretend too. Poorly.
              </p>
              <blockquote className="pl-void-whisper">
                “Pardoned. The void is disappointed; I am not.”
              </blockquote>
            </div>

            <div className="pl-void-demo" aria-label="Example of The Void in Potluck">
              <div className="pl-void-demo-head">
                <div>
                  <h3>The Void</h3>
                  <p>Recipes you&rsquo;ve 86&rsquo;d live here, beyond the reach of the wheel.</p>
                </div>
                <span className="pl-void-count">3</span>
              </div>

              <div className="pl-void-well">
                <div className="pl-void-row">
                  <span className="pl-void-86">86</span>
                  <span className="pl-void-row-copy">
                    <strong>That one you absolutely rejected</strong>
                    <small>Banished today</small>
                  </span>
                  <span className="pl-void-return">↶ <span>Return</span></span>
                </div>
                <div className="pl-void-row">
                  <span className="pl-void-86">86</span>
                  <span className="pl-void-row-copy">
                    <strong>A perfectly good dish</strong>
                    <small>Banished yesterday</small>
                  </span>
                  <span className="pl-void-return">↶ <span>Return</span></span>
                </div>
                <div className="pl-void-row">
                  <span className="pl-void-86">86</span>
                  <span className="pl-void-row-copy">
                    <strong>One less star in the sky</strong>
                    <small>Banished Aug 8</small>
                  </span>
                  <span className="pl-void-return">↶ <span>Return</span></span>
                </div>
              </div>

              <div className="pl-void-empty">
                <span aria-hidden="true">⌫</span>
                <span>Empty the void</span>
              </div>
            </div>
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
                the recipes you loved, saved and organised and ad-free. Every spin you fall for
                is one tap away from your Savor collection.
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