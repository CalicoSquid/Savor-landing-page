// src/pages/DemoBlog.jsx
//
// A fictional, deliberately over-written recipe blog — used to demo how
// Savor's in-app browser detects and imports a recipe. Not a real site,
// not a real blogger. Deliberately excluded from the sitemap and robots.txt
// (see public/robots.txt) and noindexed here at the page level too.
//
// No site chrome (see Nav.jsx / no <Footer /> import) — the page needs to
// read as a standalone foreign site, not part of getsavor.recipes.
import { useEffect, useRef, useState } from 'react'
import './DemoBlog.css'

// Self-hosted fonts (bundled at build time, served same-origin). Replaces the
// old runtime <link> to fonts.googleapis.com, which stalled inside Savor's
// in-app WebView and left onLoadEnd never firing (eternal spinner). Only the
// exact weights/styles this page uses:
import '@fontsource/playfair-display/600.css'        // section headings
import '@fontsource/playfair-display/700.css'        // titles, ad headline
import '@fontsource/playfair-display/700-italic.css' // hero title italic
import '@fontsource/lora/400.css'                    // body
import '@fontsource/lora/400-italic.css'             // lede, source note
import '@fontsource/lora/600.css'                    // byline bold, buttons
import '@fontsource/lora/700.css'                    // CTA button
import '@fontsource/caveat/600.css'                  // tagline, blockquote
import '@fontsource/jetbrains-mono/500.css'          // mono labels/meta
// Self-hosted, same reasoning as the imports above (no runtime Google Fonts
// request on this route — that's the exact stall that caused the original
// WebView eternal-spinner bug). Raleway is Savor's actual in-app font,
// used only by the import-simulation overlay below — NOT the fluff-blog
// content, which stays on Lora/Playfair/Caveat on purpose.
import '@fontsource/raleway/400.css'
import '@fontsource/raleway/700.css'

import { demoRecipeSchema as RECIPE_SCHEMA, demoRecipeGroups } from '../data/demoRecipe'

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'

// Matches the real app's Times.jsx formatting exactly (see savor-app
// src/components/recipeCard/components/Times.jsx) — same "2h 30m" / "30m"
// output, just reading from the schema's ISO8601 durations (PT2H30M) instead
// of a {hours, minutes} object.
function formatISODuration(iso) {
  const h = /(\d+)H/.exec(iso)?.[1]
  const m = /(\d+)M/.exec(iso)?.[1]
  const parts = []
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)
  return parts.length ? parts.join(' ') : '\u2014'
}

// Matches the real app's ProgressBar.jsx getStatusMessage exactly — same
// thresholds, same copy. The percentage curve driving it is synthetic here
// (fixed PROGRESS_MS timeline, no real backend call to wait on), but the
// message-per-threshold logic is copied as-is.
function getStatusMessage(progress, complete) {
  if (complete) return 'Recipe ready!'
  if (progress < 20) return 'Fetching page...'
  if (progress < 45) return 'Reading recipe data...'
  if (progress < 70) return 'Extracting ingredients...'
  if (progress < 90) return 'Almost there...'
  return 'Finishing up...'
}

// Auto-scroll shoot timeline — paced with reading pauses, tuned to the
// beat script. Triggered only by the hidden corner button; a normal
// visitor never sees it fire.
//
//   beat        target              dwell   caption (for reference)
//   ---------------------------------------------------------------------
//   0.0-1.4s    top                 1400ms  "POV: you fancied lasagne..."
//   1.4-3.6s    story               2200ms  "...I just want lasagne."
//   3.6-5.4s    tuscany             1800ms  "scrolling."
//   5.4-6.7s    ad                  1300ms  "an ad. lovely."
//   6.7-8.5s    etymology           1800ms  "why do I know this now"
//   8.5-9.0s    jump-btn-wrap       500ms   (arrives at the button, beat before tap)
//   9.0-9.4s    almost   [BOUNCE]   1800ms  "it lied to me." — false summit,
//                                            recipe card is NOT visible here
//   9.4-10.3s   recipe-card         3000ms  "...that was the whole recipe."
//
// Total ~14.7s of page motion — leaves room in a 20s cut for the native
// Savor bar-bloom + tap + reveal beats, which happen outside the webpage.
const STEPS = [
  { id: 'db-top', dwell: 1400, duration: 0 },
  { id: 'db-story', dwell: 2200, duration: 900 },
  { id: 'db-tuscany', dwell: 1800, duration: 850 },
  { id: 'db-ad', dwell: 1300, duration: 800 },
  { id: 'db-etymology', dwell: 1800, duration: 850 },
  { id: 'db-jump-btn-wrap', dwell: 500, duration: 800 },
  { id: 'db-almost', dwell: 1800, duration: 420, bounce: true, pulse: true }, // the fake jump
  { id: 'db-recipe-card', dwell: 3000, duration: 900 },
]

// Standard pacing ease — smooth reads.
function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

// Overshoot-and-settle — used only for the false-summit jump, so that one
// beat *feels* different: a decisive snap past the target that springs
// back, selling "relief" for a fraction of a second before the text
// underneath reveals it wasn't the payoff.
function easeOutBack(t) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function scrollToY(targetY, duration, useBounce) {
  return new Promise((resolve) => {
    const startY = window.scrollY
    const delta = targetY - startY
    if (duration <= 0 || Math.abs(delta) < 2) {
      window.scrollTo(0, targetY)
      resolve()
      return
    }
    const easeFn = useBounce ? easeOutBack : ease
    let startTime = null
    function frame(now) {
      if (!startTime) startTime = now
      const p = Math.min((now - startTime) / duration, 1)
      window.scrollTo(0, startY + delta * easeFn(p))
      if (p < 1) requestAnimationFrame(frame)
      else resolve()
    }
    requestAnimationFrame(frame)
  })
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// ── Import simulation ────────────────────────────────────────────────────
// A styled clone of Savor's in-app RecipeBar + a lightweight app header
// (see savor/src/components/search/components/RecipeBar.jsx, WebView.jsx,
// and appBar/*.jsx), staged entirely on this page. The blog content
// underneath never changes — that's deliberate, it's literally what the
// real in-app browser would show. Only the chrome around it is simulated;
// the deep link fired at the end (savor://create) is real, so the handoff
// into the app is a genuine import, not a mockup of one.
//
// Phases: bloom (transition cover) → idle → checking → ready → importing.
// "savorMode" is a separate flag for the header + page framing, which
// persists across idle/checking/ready/importing so the header doesn't
// flicker between phases — only the bottom bar's content changes.
const BLOOM_REVEAL_MS = 380   // point mid-bloom where we scroll-to-top + mount the header, still hidden under the cover
const BLOOM_TOTAL_MS = 820    // full rise+hold+fade duration — must match the CSS keyframe below
const SIM_IDLE_MS = 1000
const SIM_CHECKING_MS = 1000
const INSTALL_CHECK_MS = 1600
const PROGRESS_MS = 2200      // synthetic duration for the progress ring — mirrors the real
                               // ProgressBar.jsx's easing quality, but on a fixed timeline
                               // since there's no real backend call to actually wait on here

export default function DemoBlog() {
  const runningRef = useRef(false)
  const [shooting, setShooting] = useState(false)
  const simRunningRef = useRef(false)
  const simTimersRef = useRef([])
  const [simPhase, setSimPhase] = useState('off') // off | bloom | idle | checking | ready | importing
  const [savorMode, setSavorMode] = useState(false)
  const [showRecipeReveal, setShowRecipeReveal] = useState(false)
  // 'progress' (circular progress ring, mirroring the real app's ProgressBar.jsx)
  // or 'recipe' (the actual recipe, once the ring completes). Both stages
  // share the same full-screen shell (see .db-reveal) — only the content
  // inside it swaps, so it reads as one continuous screen rather than two
  // separate popups.
  const [revealStage, setRevealStage] = useState('progress')
  const [progressPct, setProgressPct] = useState(0)
  const [progressDone, setProgressDone] = useState(false)
  const progressRafRef = useRef(null)
  const [showIntro, setShowIntro] = useState(true)

  // Fake paywall over the recipe — a bit, never a real gate. Only triggers
  // for people who scroll to it manually; tapping the floating icon (or the
  // CTA) is the express lane and skips it entirely, permanently, even if
  // they later exit Savor mode and keep scrolling. Also suppressed during
  // a scripted shoot take, so it can't interrupt a recording.
  const recipeCardRef = useRef(null)
  const [recipeGated, setRecipeGated] = useState(false)
  const [usedExpressLane, setUsedExpressLane] = useState(false)
  const [fakeSubscribeLabel, setFakeSubscribeLabel] = useState('Become an Insider — $29.99/mo')
  const gateTriggeredRef = useRef(false)
  const usedExpressLaneRef = useRef(false)
  const shootingRef = useRef(false)

  function stopProgressSequence() {
    if (progressRafRef.current != null) {
      cancelAnimationFrame(progressRafRef.current)
      progressRafRef.current = null
    }
  }

  // Drives the progress ring from 0-100 on a fixed, eased timeline. The real
  // ProgressBar.jsx animates toward an indefinite 99% and only completes when
  // real data arrives — there's no real backend call here to wait on, so this
  // is a synthetic timeline instead, but the easing quality and the
  // status-message thresholds (getStatusMessage) are copied as-is.
  function runProgressSequence() {
    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / PROGRESS_MS)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgressPct(Math.round(eased * 100))
      if (t < 1) {
        progressRafRef.current = requestAnimationFrame(tick)
      } else {
        progressRafRef.current = null
        setProgressDone(true)
        const doneTimer = setTimeout(() => setRevealStage('recipe'), 500)
        simTimersRef.current.push(doneTimer)
      }
    }
    progressRafRef.current = requestAnimationFrame(tick)
  }

  function closeRecipeReveal() {
    stopProgressSequence()
    setShowRecipeReveal(false)
  }

  // Page-level meta: title, noindex, fonts. Same DOM-patching approach as
  // RecipePage.jsx (no head-management library in this app), reverted on
  // unmount so leaving the route doesn't leak into the next page.
  useEffect(() => {
    const prevTitle = document.title
    document.title = "The Only Lasagne Recipe You'll Ever Need (An Odyssey) | The Hearth & Hollow"

    // On the prerendered build these tags already ship statically (see
    // prerender.js), present before React mounts. Reuse the existing tag
    // in that case instead of appending a duplicate — only create a fresh
    // one on paths that never got a static version (dev server, or any
    // non-prerendered render). Either way, reverted on unmount.
    const created = []
    const restored = []
    const setMeta = (attr, key, content) => {
      const existing = document.querySelector(`meta[${attr}="${key}"]`)
      if (existing) {
        restored.push([existing, existing.getAttribute('content')])
        existing.setAttribute('content', content)
      } else {
        const el = document.createElement('meta')
        el.setAttribute(attr, key)
        el.setAttribute('content', content)
        document.head.appendChild(el)
        created.push(el)
      }
    }

    setMeta('name', 'robots', 'noindex, nofollow')
    setMeta('property', 'og:title', "The Only Lasagne Recipe You'll Ever Need (An Odyssey)")
    setMeta('property', 'og:description', 'A demo of how Savor pulls a clean recipe out of even the fluffiest recipe blog.')
    setMeta('property', 'og:type', 'article')
    setMeta('name', 'twitter:card', 'summary')

    // JSON-LD — on the prerendered build this already ships statically in the
    // initial HTML (see prerender.js), present before React mounts, which is
    // what Savor's in-app browser needs. Only inject at runtime if it's NOT
    // already there (the dev server / any non-prerendered render path), so we
    // never end up with two copies after hydration.
    let ldEl = null
    if (!document.getElementById('demo-recipe-jsonld')) {
      ldEl = document.createElement('script')
      ldEl.id = 'demo-recipe-jsonld'
      ldEl.type = 'application/ld+json'
      ldEl.textContent = JSON.stringify(RECIPE_SCHEMA)
      document.head.appendChild(ldEl)
    }

    return () => {
      document.title = prevTitle
      created.forEach((el) => el.remove())
      restored.forEach(([el, prevContent]) => el.setAttribute('content', prevContent))
      if (ldEl) ldEl.remove()
    }
  }, [])

  async function runShoot() {
    if (runningRef.current) return
    runningRef.current = true
    setShooting(true)
    for (const step of STEPS) {
      const el = document.getElementById(step.id)
      if (!el) continue
      const targetY = el.getBoundingClientRect().top + window.scrollY - 18
      await scrollToY(targetY, step.duration, step.bounce)
      if (step.pulse) {
        el.classList.add('db-pulse')
        setTimeout(() => el.classList.remove('db-pulse'), 650)
      }
      await wait(step.dwell)
    }
    runningRef.current = false
    setShooting(false)
  }

  // Clear any pending simulation timers on unmount so a stray setState
  // can't fire after the user's already navigated away.
  useEffect(() => {
    return () => {
      simTimersRef.current.forEach(clearTimeout)
      stopProgressSequence()
    }
  }, [])

  // Escape closes the recipe reveal (desktop/keyboard).
  useEffect(() => {
    if (!showRecipeReveal) return
    const onKey = (e) => { if (e.key === 'Escape') closeRecipeReveal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showRecipeReveal])

  // Same, for the onboarding modal.
  useEffect(() => {
    if (!showIntro) return
    const onKey = (e) => { if (e.key === 'Escape') setShowIntro(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showIntro])

  // Same, for the fake paywall.
  useEffect(() => {
    if (!recipeGated) return
    const onKey = (e) => { if (e.key === 'Escape') setRecipeGated(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [recipeGated])

  // Keep a ref mirror of `shooting` so the IntersectionObserver callback
  // below (subscribed once, on mount) always reads the live value instead
  // of the stale one from its closure.
  useEffect(() => { shootingRef.current = shooting }, [shooting])

  // Same, for usedExpressLane — the state drives rendering (showPaywall,
  // below), the ref is only ever read inside the observer's callback.
  useEffect(() => { usedExpressLaneRef.current = usedExpressLane }, [usedExpressLane])

  // Trigger the paywall the first time the recipe card scrolls into view —
  // but only for someone who got there by scrolling manually. Skipped
  // entirely if they've already used the express lane, and suppressed
  // during a scripted shoot take so it can't interrupt a recording.
  useEffect(() => {
    const el = recipeCardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !usedExpressLaneRef.current &&
            !shootingRef.current &&
            !gateTriggeredRef.current
          ) {
            gateTriggeredRef.current = true
            setRecipeGated(true)
          }
        })
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // The "subscribe" button is decorative — the joke is that it looks like a
  // real paywall CTA and does nothing. A little shake plus a beat of copy
  // makes tapping it feel like a punchline instead of a dead button.
  function handleFakeSubscribeTap() {
    setFakeSubscribeLabel('Nice try.')
    setTimeout(() => setFakeSubscribeLabel('Become an Insider — $29.99/mo'), 1600)
  }

  function beginSimulation() {
    if (simRunningRef.current) return
    simRunningRef.current = true
    setSimPhase('bloom')

    // Entering Savor mode by any means — the floating icon or the CTA,
    // both call this — is the express lane. Set it here, at the point of
    // the actual action, rather than reacting to `savorMode` changing in
    // an effect. Permanent for the rest of the session: showPaywall below
    // reads this state directly, so the paywall stays suppressed even
    // after exiting Savor mode and scrolling back down.
    setUsedExpressLane(true)

    // Mid-bloom, while the screen is still covered: jump to the top and
    // mount the header. Both are invisible to the user until the bloom
    // fades over them, which is what sells this as "a new screen" rather
    // than "the page jumped while you watched."
    simTimersRef.current.push(
      setTimeout(() => {
        window.scrollTo(0, 0)
        setSavorMode(true)
      }, BLOOM_REVEAL_MS)
    )
    simTimersRef.current.push(setTimeout(() => setSimPhase('idle'), BLOOM_TOTAL_MS))
    simTimersRef.current.push(
      setTimeout(() => setSimPhase('checking'), BLOOM_TOTAL_MS + SIM_IDLE_MS)
    )
    simTimersRef.current.push(
      setTimeout(
        () => setSimPhase('ready'),
        BLOOM_TOTAL_MS + SIM_IDLE_MS + SIM_CHECKING_MS
      )
    )
  }

  // CTA in Savor mode — swaps back to the plain comedy blog and lands the
  // reader on the divorce story (the CTA copy promises exactly that). No
  // bloom on the way out; this is a deliberate, instant undo. The double-rAF
  // lets savorMode's reflow (header unmount, padding removal) settle before
  // we measure #db-story's position, so the smooth-scroll target is correct.
  function exitSavorMode() {
    simTimersRef.current.forEach(clearTimeout)
    simTimersRef.current = []
    stopProgressSequence()
    simRunningRef.current = false
    setSimPhase('off')
    setSavorMode(false)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document
          .getElementById('db-story')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    )
  }

  // Fires the real deep link, then uses the standard visibility-change
  // Fires the real deep link, then uses the standard visibility-change
  // heuristic to detect whether the OS actually switched to Savor. The
  // reveal shell opens immediately in its 'progress' stage — no reason to
  // wait on the deep-link race before giving feedback — and its own timeline
  // (runProgressSequence) carries it into the actual recipe. If the deep
  // link succeeds first, the OS backgrounds the tab and none of this
  // matters; the timeout below just resets everything cleanly in case the
  // person comes back to this tab later.
  function handleReadyTap() {
    if (simPhase !== 'ready') return
    setSimPhase('importing')

    setShowRecipeReveal(true)
    setRevealStage('progress')
    setProgressPct(0)
    setProgressDone(false)
    runProgressSequence()

    const pageUrl =
      typeof window !== 'undefined' ? window.location.href : 'https://getsavor.recipes/demo'
    const deepLink = `savor://create?url=${encodeURIComponent(pageUrl)}`

    let leftPage = false
    const markLeft = () => { leftPage = true }
    // visibilitychange covers the common Android Chrome app-switch; pagehide
    // is the more reliable signal when the browser is fully backgrounded by
    // the launched app. Either firing means Savor opened — no fallback needed.
    const onVisibility = () => { if (document.hidden) markLeft() }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', markLeft)

    const cleanup = () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', markLeft)
    }

    window.location.href = deepLink

    const timeoutId = setTimeout(() => {
      cleanup()
      simRunningRef.current = false
      setSimPhase('off')
      setSavorMode(false)
      // If Savor opened, leftPage is true and the OS has already switched
      // away — stop the ring and reset, so a return to this tab later shows
      // the plain blog rather than a stuck animation. If not, the reveal
      // stays open and its own progress sequence carries it to the recipe.
      if (leftPage) {
        stopProgressSequence()
        setShowRecipeReveal(false)
      }
    }, INSTALL_CHECK_MS)
    simTimersRef.current.push(timeoutId)
  }

  // Derived, not stored: the paywall should never be visible once the
  // express lane's been used, regardless of how recipeGated itself got
  // set — computing it here means there's no separate state to keep in
  // sync. Reads usedExpressLane (state), never the ref — refs can't be
  // read during render.
  const showPaywall = recipeGated && !usedExpressLane

  return (
    <div className={`db-page${savorMode ? ' db-savor-mode' : ''}${shooting ? ' db-shooting' : ''}`}>
      {showIntro && (
        <div className="db-sim-modal-backdrop" onClick={() => setShowIntro(false)}>
          <div
            className="db-sim-modal"
            role="dialog"
            aria-modal="true"
            aria-label="About this page"
            onClick={(e) => e.stopPropagation()}
          >
            <img src="/icons/icon-Tangerine.webp" alt="" className="db-sim-modal-icon" />
            <h3 className="db-sim-modal-title">This blog isn&rsquo;t real.</h3>
            <p className="db-sim-modal-body">
              We wrote an absurdly over-written recipe post on purpose, to show off something that is real: Savor&rsquo;s browser finding an actual recipe buried in all&hellip; this. Enjoy Marguerite&rsquo;s descent into lasagne-based grief, or tap the little Savor icon any time you&rsquo;ve had enough.
            </p>
            <button type="button" className="db-sim-modal-btn" onClick={() => setShowIntro(false)}>
              Let&rsquo;s go
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        className="db-savor-float"
        onClick={beginSimulation}
        aria-label="Skip to how this works in Savor"
      >
        <img src="/icons/icon-Tangerine.webp" alt="" className="db-savor-float-icon" />
      </button>
      <button
        id="db-shoot-trigger"
        className="db-shoot-trigger"
        aria-hidden="true"
        tabIndex={-1}
        onClick={runShoot}
      />

      <div className="db-topstrip">est. 2011 · a hearth &amp; hollow production · print-friendly below</div>

      <header className="db-masthead">
        <div className="db-site-name">The Hearth &amp; Hollow</div>
        <div className="db-tagline">slow food, slower stories</div>
      </header>

      <div className="db-wrap">
        <div className="db-hero" id="db-top">
          <div className="db-hero-art">
            <img
              className="db-hero-img"
              src="/images/lasagne.webp"
              alt="A steaming pan of lasagne"
            />
            <div className="db-steam" />
            <div className="db-steam db-s2" />
            <div className="db-steam db-s3" />
            <span className="db-hero-credit">
              Photo: <a href="https://unsplash.com/@rabbit_in_blue?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noreferrer">Karolina Kołodziejczak</a> / <a href="https://unsplash.com/photos/sliced-pizza-on-white-ceramic-plate-OSMAK8b74ls?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noreferrer">Unsplash</a>
            </span>
          </div>
        </div>

        <h1 className="db-title">
          The Only Lasagne Recipe You'll Ever Need <em>(An Odyssey)</em>
        </h1>
        <div className="db-byline">
          By <b>Marguerite Hollow</b> · updated 47 times · 22 min read
        </div>
        <div className="db-rating">
          ★★★★★ 4.98 <span>from 1,247 reviews — jump to see why they're wrong</span>
        </div>

        <nav className="db-jumpnav">
          <a href="#db-story">The Story</a>
          <a href="#db-ad">A Word From Our Sponsor</a>
          <a href="#db-etymology">On The Word "Lasagne"</a>
          <a href="#db-history">A Brief History (600 words)</a>
          <a href="#db-almost">Jump to Recipe</a>
        </nav>

        <p className="db-lede">
          Before we get to the lasagne, you deserve to know why this dish saved my marriage. And then ended it.
        </p>

        <section id="db-story">
          <h2 className="db-section">The Story</h2>
          <p>
            It began, as most things in my kitchen do, with grief disguised as hunger. Robert and I had been
            married for six years when I first layered this particular ragù, and I want to be honest with you
            here, in this space, because that is the kind of writer I am: honesty first, recipe fourteenth.
          </p>
          <p>
            We had just moved into a house with a gas stove that hissed like it disapproved of us. I made the
            lasagne on a Tuesday. Robert cried at the table. Not from the onions — I hadn't gotten to the onions
            yet. He cried because, he said, it tasted like a version of me he hadn't met before. I took this as a
            compliment. In retrospect, I'm no longer sure it was one.
          </p>
          <p>
            We separated eleven months later. I kept the recipe. He kept the dog. I think about this trade often,
            usually while the béchamel is thickening, which — don't worry — we'll get to.
          </p>
        </section>

        <blockquote id="db-tuscany">
          "It was the autumn of 2011. A windswept hillside in Tuscany. A man named Giancarlo who I have never
          spoken to since."
        </blockquote>

        <p>
          Giancarlo did not teach me to cook. He taught me to <em>wait</em> — to let the ragù sit, undisturbed,
          the way you'd let a difficult truth sit at a dinner party. I've never forgotten the lesson, or found
          his contact information again, which feels thematically appropriate.
        </p>

        <div className="db-ad" id="db-ad">
          <div className="db-ad-label">Advertisement</div>
          <div className="db-ad-headline">$PASTA Coin</div>
          <div className="db-ad-sub">
            The world's first cryptocurrency backed entirely by carbohydrates. Diversify your portfolio the way
            you diversify your layers.
          </div>
          <button>Learn More (Not Financial Advice)</button>
        </div>

        <section id="db-etymology">
          <h2 className="db-section">On The Word "Lasagne"</h2>
          <p>
            The word lasagne derives from the Ancient Greek <em>lasanon</em> — meaning, roughly, "chamber pot."
            Sit with that. Sit with it the way the pasta sits with the sauce: patiently, and forever changed.
          </p>
          <p>
            Scholars disagree on precisely how a cooking vessel became a beloved family dinner, but I like to
            think it's a story about transformation. Or possibly plumbing. Etymology is like that sometimes.
          </p>
        </section>

        <section id="db-history">
          <h2 className="db-section">A Brief History (600 words)</h2>
          <p>
            Some say pasta was invented by Marco Polo, who brought it back from China in the 13th century like a
            very carb-forward souvenir. Those people are wrong, and I have devoted an embarrassing portion of my
            adult life to correcting them at dinner parties, which may explain the dog situation from earlier.
          </p>
          <p>
            Pasta appears in Italian texts predating Polo's travels by at least a century. But facts have never
            stopped a good origin myth, and frankly, neither has anyone's patience for the rest of what I'm about
            to tell you about durum wheat.
          </p>
          <p>
            <em>
              [Section continues for several hundred more words about durum wheat, medieval trade routes, and a
              tangent involving my grandmother's opinions on store-bought pasta sheets, which she considered, in
              her words, "a moral failing." Content abbreviated here so you don't have to suffer the way I did
              writing it.]
            </em>
          </p>
        </section>

        <div className="db-jump-btn-wrap" id="db-jump-btn-wrap">
          <a className="db-jump-btn" href="#db-almost">
            Jump to Recipe ↓
          </a>
        </div>

        <section id="db-freezing">
          <h2 className="db-section">A Necessary Digression on Freezing Leftovers</h2>
          <p>
            People ask me constantly whether this lasagne freezes well, and I want to honor that question with
            the seriousness it deserves, which is to say: several paragraphs. Freezing is, at its core, an act of
            faith — you are trusting a version of yourself three weeks from now to want what you want tonight,
            which, frankly, Robert never did, and look how that turned out.
          </p>
          <p>
            Wrap it tightly. Label it with the date, though I never do, preferring instead to open the freezer
            like a small archaeological dig, unsure whether I'm about to unearth dinner or 2019. Thaw overnight.
            Do not, under any circumstances, thaw it the way Giancarlo once thawed a duck, a story I am
            contractually unable to tell you here but have told at every dinner party since.
          </p>
        </section>

        <section id="db-almost">
          <p>
            <b>Almost.</b> First, my thoughts on the moon, and how it, too, waxes and wanes the way a good ragù
            does over three hours of simmering. I won't elaborate further. I already have, several times, in the
            newsletter you haven't subscribed to yet.
          </p>
          <p>
            Also — quickly — a word about my cousin's wedding, which had nothing to do with lasagne and
            everything to do with grief, timing, and a caterer named Dennis. I promise this is relevant. It is
            not relevant. We're almost there.
          </p>
          <p>
            Dennis, if you must know, served a lasagne at that wedding. A store-bought one. My grandmother — the
            store-bought-pasta-as-moral-failing grandmother, you'll recall — did not attend, having passed some
            years prior, but I felt her disappointment move through the reception hall like a draft. I have spent
            the intervening decade trying to cook my way back into her good opinion, which is difficult, on
            account of the aforementioned death. This recipe is the closest I've come. I'm telling you this not
            because it will help you make the lasagne — it will not — but because you clicked a button that said
            "Jump to Recipe," and I feel you should understand the kind of person who builds a button like that
            and then routes it here instead. We are, and I cannot stress this enough, almost there.
          </p>
        </section>

        <hr className="db-divider" id="db-recipe-jump" />

        {/* ============ THE ACTUAL RECIPE — plain on purpose, contrast is the joke ============ */}
        <div id="db-recipe-card" ref={recipeCardRef} className={`db-recipe-wrap${showPaywall ? ' db-recipe-gated' : ''}`}>
          <div className="db-recipe-content" aria-hidden={showPaywall}>
            <div className="db-rc-label">Recipe</div>
            <h3>The Only Lasagne Recipe You'll Ever Need</h3>
            <div className="db-meta">
              <span>Prep 30 min</span>
              <span>Ragù ~2 hr</span>
              <span>Bake 40 min</span>
              <span>Serves 8</span>
              <span>Oven 190°C</span>
            </div>

            <h4 className="db-rc-sub">Ragù</h4>
            <ul>
              <li>2 tbsp olive oil</li>
              <li>1 small onion, finely diced</li>
              <li>1 carrot, finely diced</li>
              <li>1 celery stalk, finely diced</li>
              <li>3 garlic cloves, minced</li>
              <li>1 lb ground beef, ½ lb ground pork</li>
              <li>½ cup dry white wine</li>
              <li>2 tbsp tomato paste</li>
              <li>28 oz canned crushed tomatoes</li>
              <li>1 cup whole milk, divided</li>
              <li>2 bay leaves · salt · pepper</li>
            </ul>
            <ol>
              <li>Cook onion, carrot, celery in oil over medium heat, 8 min, until soft.</li>
              <li>Add garlic, 1 min. Add beef and pork, brown 8-10 min, breaking apart.</li>
              <li>Add wine, simmer until mostly evaporated, 3 min. Stir in tomato paste, 2 min.</li>
              <li>Add tomatoes and bay leaves, season. Simmer uncovered on low, stirring now and then, 1.5-2 hr.</li>
              <li>Stir in ½ cup milk the last 15 min. Discard bay leaves.</li>
            </ol>

            <h4 className="db-rc-sub">Béchamel</h4>
            <ul>
              <li>4 tbsp butter</li>
              <li>4 tbsp flour</li>
              <li>4 cups whole milk, warmed</li>
              <li>¼ tsp nutmeg · salt · pepper</li>
            </ul>
            <ol>
              <li>Melt butter, whisk in flour. Cook 2 min, stirring, don't let it brown.</li>
              <li>Whisk in warm milk gradually. Simmer, whisking often, until thick, 8-10 min.</li>
              <li>Season with nutmeg, salt, pepper.</li>
            </ol>

            <h4 className="db-rc-sub">Assembly</h4>
            <ul>
              <li>1 lb fresh lasagne sheets</li>
              <li>1½ cups grated Parmigiano-Reggiano</li>
              <li>12 oz fresh mozzarella, torn</li>
            </ul>
            <ol>
              <li>Preheat oven to 190°C (375°F).</li>
              <li>Thin layer of ragù in a 9x13 dish, then pasta.</li>
              <li>Layer ragù, béchamel, Parmigiano. Repeat to 4 layers, ending on béchamel.</li>
              <li>Top with mozzarella and remaining Parmigiano.</li>
              <li>Cover, bake 25 min. Uncover, bake 15-20 min more until golden and bubbling.</li>
              <li>Rest 15 min before slicing.</li>
            </ol>

            <div className="db-rc-note">No memoir. No moon. Just dinner.</div>
          </div>

          {showPaywall && (
            <div className="db-paywall" role="dialog" aria-label="Subscribe to keep reading">
              <span className="db-paywall-badge">Members Only</span>
              <h4 className="db-paywall-title">You&rsquo;ve reached your monthly free lasagne.</h4>
              <p className="db-paywall-body">
                Become a Hearth &amp; Hollow Insider for $29.99/mo to keep reading.
                First month free. Second month also technically free, due to a
                loophole in this bit.
              </p>
              <p className="db-paywall-urgency">This offer expires in 4 minutes, or whenever you stop caring.</p>
              <button type="button" className="db-paywall-fake-btn" onClick={handleFakeSubscribeTap}>
                {fakeSubscribeLabel}
              </button>
              <div className="db-paywall-fine">Cancels never. Refunds nonexistent. Terms subject to vibes.</div>
              <button type="button" className="db-paywall-dismiss" onClick={() => setRecipeGated(false)}>
                No thanks, I&rsquo;ll just read it for free like it&rsquo;s a website
              </button>
            </div>
          )}
        </div>

        {/* A small reward for anyone who read the whole bit instead of
            tapping out early via the floating Savor icon. Stays in
            Marguerite's voice — the CTA right after this is the actual
            character break. */}
        <div className="db-reward">
          <div className="db-reward-label">A reward, of sorts</div>
          <h3 className="db-reward-title">Certificate of Completion</h3>
          <p className="db-reward-body">
            Awarded to <strong>you</strong>, for outlasting one divorce, one moon metaphor, and a caterer named Dennis who did not deserve this much attention. Robert did not make it this far. Frankly, neither did the dog.
          </p>
          <div className="db-reward-sig">— Marguerite Hollow, probably crying</div>
        </div>

        {/* The real payoff — breaks character on purpose. Everything above
            is the bit; this is the actual product moment. The CTA is
            mode-aware: in blog mode it launches the Savor simulation; once
            in Savor mode it becomes the way back to the comedy blog. */}
        <div className="db-cta" id="db-savor-cta">
          {savorMode ? (
            <button type="button" onClick={exitSavorMode} className="db-cta-btn db-cta-btn-back">
              Read more about Marguerite's divorce journey →
            </button>
          ) : (
            <button type="button" onClick={beginSimulation} className="db-cta-btn">
              See how it works in Savor →
            </button>
          )}
          <a href={PLAY_STORE} className="db-cta-alt" target="_blank" rel="noopener noreferrer">
            Don't have Savor? Get it free →
          </a>
        </div>
      </div>

      {/* ── App header — clone of Savor's home header (see savor Main.jsx
          StandardHeaderBg + appBar/*.jsx). Can't touch the real browser's
          own URL bar, so this stands in as the app chrome: primaryGradient
          background, the tangerine mark on the left, palette + account
          squircle buttons on the right. The mark is a real link back to
          getsavor.recipes — this page has no site chrome of its own, so
          once someone's in savorMode it's the only way back to the real
          site short of the CTA or the browser back button. A plain <a>,
          not a router <Link>, for the same WebView reason as Footer.jsx.
          The action buttons stay cosmetic — exiting the bit is the CTA's job. */}
      {savorMode && (
        <div className="db-sim-header">
          <a href="/" className="db-sim-header-mark-link" aria-label="Back to Savor">
            <img src="/icons/icon-Tangerine.webp" alt="" className="db-sim-header-mark" />
          </a>
          <div className="db-sim-header-actions" aria-hidden="true">
            <span className="db-sim-header-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c.93 0 1.5-.7 1.5-1.5 0-.42-.16-.78-.42-1.06-.25-.28-.41-.64-.41-1.05 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-8.39-10-8.39zM6.5 12c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </span>
            <span className="db-sim-header-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </span>
          </div>
        </div>
      )}

      {simPhase !== 'off' && (
        <>
          <div className={`db-sim-bloom${simPhase === 'bloom' ? ' active' : ''}`} />
          {simPhase !== 'bloom' && (
            <div className="db-sim-wrapper">
              {(simPhase === 'idle' || simPhase === 'checking' || simPhase === 'importing') && (
                <div
                  className={`db-sim-slim${simPhase !== 'idle' ? ' db-sim-pulse' : ''}`}
                >
                  <img src="/icons/icon-Tangerine.webp" alt="" className="db-sim-mark" />
                  <div className="db-sim-text">
                    <span className="db-sim-title">Savor</span>
                    <span className="db-sim-sub">
                      {simPhase === 'checking' && '  · checking this page…'}
                      {simPhase === 'importing' && '  · importing recipe…'}
                      {simPhase === 'idle' && '  · looking for a recipe'}
                    </span>
                  </div>
                  <div className="db-sim-dots">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              {simPhase === 'ready' && (
                <button type="button" className="db-sim-ready" onClick={handleReadyTap}>
                  <span className="db-sim-icon-badge">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12" /><path d="M6 11l6 6 6-6" /><path d="M5 21h14" />
                    </svg>
                  </span>
                  <span className="db-sim-ready-text">
                    <span className="db-sim-ready-title">Recipe found!</span>
                    <span className="db-sim-ready-sub">Save to your recipe box</span>
                  </span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                  <span className="db-sim-shine" />
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Recipe reveal ──────────────────────────────────────────────
          The actual payoff for anyone without Savor installed. Styling is
          pulled directly from the real app (savor-app src/components/
          recipeCard/): 26px RalewayBold title, the Prep/Cook/Total Times
          row, grouped ingredients with the uppercase-label-plus-divider
          header, and steps with the left-border "STEP N" treatment from
          Instructions.jsx. One continuous scroll rather than the real app's
          three tabs — everything visible at once reads as more complete for
          a single reveal moment, and there's no tab-switch animation to
          half-fake. */}
      {showRecipeReveal && (
        <div className="db-reveal" role="dialog" aria-modal="true" aria-label="The Only Lasagne Recipe You'll Ever Need">
          <div className="db-reveal-header">
            <button type="button" className="db-reveal-back" onClick={closeRecipeReveal} aria-label="Back">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <img src="/icons/icon-Tangerine.webp" alt="" className="db-reveal-header-mark" />
          </div>

          {revealStage === 'progress' ? (
            /* ── Progress ring ──────────────────────────────────────────
                Mirrors the real app's ProgressBar.jsx: 200px circular SVG,
                gradient stroke, percentage centered inside it, and the same
                status-message copy at the same thresholds (getStatusMessage
                above). The real component animates toward an indefinite 99%
                while it waits on an actual server response; this runs on a
                fixed synthetic timeline instead (runProgressSequence) since
                there's nothing real to wait on here. */
            <div className="db-reveal-scroll db-reveal-progress-scroll">
              <div className="db-reveal-progress">
                <div className="db-reveal-ring-wrap">
                  <svg className="db-reveal-ring" width="200" height="200" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="db-reveal-ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF5722" />
                        <stop offset="100%" stopColor="#FF9800" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,87,34,0.12)" strokeWidth="30" />
                    <circle
                      cx="100" cy="100" r="85" fill="none"
                      stroke="url(#db-reveal-ring-grad)" strokeWidth="30"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 85}
                      strokeDashoffset={2 * Math.PI * 85 - (progressPct / 100) * 2 * Math.PI * 85}
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <span className="db-reveal-ring-pct">{progressPct}%</span>
                </div>
                <p className={`db-reveal-progress-status${progressDone ? ' db-reveal-progress-done' : ''}`}>
                  {getStatusMessage(progressPct, progressDone)}
                </p>
              </div>
            </div>
          ) : (
            <div className="db-reveal-scroll">
              <h2 className="db-reveal-title">The Only Lasagne Recipe You&rsquo;ll Ever Need</h2>
              <p className="db-reveal-desc">{RECIPE_SCHEMA.description}</p>
              <p className="db-reveal-author">by {RECIPE_SCHEMA.author.name}</p>

              <div className="db-reveal-source">
                <span className="db-reveal-source-line" />
                <span className="db-reveal-source-inner">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
                  </svg>
                  thehearthandhollow.com
                </span>
                <span className="db-reveal-source-line" />
              </div>

              <div className="db-reveal-image">
                <img src="/images/lasagne.webp" alt="Baked lasagne, sliced" />
              </div>
              <p className="db-reveal-photo-credit">
                📷 Photo by <a href="https://unsplash.com/@rabbit_in_blue?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noreferrer">Karolina Kołodziejczak</a> on <a href="https://unsplash.com/photos/sliced-pizza-on-white-ceramic-plate-OSMAK8b74ls?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noreferrer">Unsplash</a>
              </p>

              <div className="db-reveal-times">
                <div className="db-reveal-time-cell">
                  <span className="db-reveal-time-label">Prep</span>
                  <span className="db-reveal-time-value">{formatISODuration(RECIPE_SCHEMA.prepTime)}</span>
                </div>
                <div className="db-reveal-time-cell db-reveal-time-mid">
                  <span className="db-reveal-time-label">Cook</span>
                  <span className="db-reveal-time-value">{formatISODuration(RECIPE_SCHEMA.cookTime)}</span>
                </div>
                <div className="db-reveal-time-cell">
                  <span className="db-reveal-time-label">Total</span>
                  <span className="db-reveal-time-value">{formatISODuration(RECIPE_SCHEMA.totalTime)}</span>
                </div>
              </div>

              <div className="db-reveal-divider" />

              <h3 className="db-reveal-section-title">Ingredients</h3>
              {demoRecipeGroups.map((group) => (
                <div key={group.label} className="db-reveal-group">
                  <div className="db-reveal-group-header">
                    <span className="db-reveal-group-label">{group.label}</span>
                    <span className="db-reveal-group-line" />
                  </div>
                  {group.items.map((item) => (
                    <div key={item} className="db-reveal-ingredient">{item}</div>
                  ))}
                </div>
              ))}

              <h3 className="db-reveal-section-title db-reveal-section-title-spaced">Instructions</h3>
              {RECIPE_SCHEMA.recipeInstructions.map((section) => (
                <div key={section.name} className="db-reveal-group">
                  <div className="db-reveal-group-header">
                    <span className="db-reveal-group-label">{section.name}</span>
                    <span className="db-reveal-group-line" />
                  </div>
                  {section.itemListElement.map((step, i) => (
                    <div key={i} className="db-reveal-step">
                      <span className="db-reveal-step-label">Step {i + 1}</span>
                      <p className="db-reveal-step-text">{step.text}</p>
                    </div>
                  ))}
                </div>
              ))}

              <div className="db-reveal-spacer" />
            </div>
          )}

          {revealStage === 'recipe' && (
            <div className="db-reveal-cta">
              <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="db-reveal-cta-btn">
                Get Savor — save recipes like this automatically
              </a>
              <div className="db-reveal-cta-sub">This is what every recipe looks like once Savor&rsquo;s done with it.</div>
            </div>
          )}
        </div>
      )}

      <footer className="db-footer">
        the hearth &amp; hollow · a fictional publication for demonstration purposes
        <br />
        no bloggers, brands, or people were harmed (or real) in the making of this page
      </footer>
    </div>
  )
}