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

import { demoRecipeSchema as RECIPE_SCHEMA } from '../data/demoRecipe'

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'

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

export default function DemoBlog() {
  const runningRef = useRef(false)
  const [shooting, setShooting] = useState(false)
  const simRunningRef = useRef(false)
  const simTimersRef = useRef([])
  const [simPhase, setSimPhase] = useState('off') // off | bloom | idle | checking | ready | importing
  const [savorMode, setSavorMode] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  // Page-level meta: title, noindex, fonts. Same DOM-patching approach as
  // RecipePage.jsx (no head-management library in this app), reverted on
  // unmount so leaving the route doesn't leak into the next page.
  useEffect(() => {
    const prevTitle = document.title
    document.title = "The Only Lasagne Recipe You'll Ever Need (An Odyssey) | The Hearth & Hollow"

    const added = []
    const setMeta = (attr, key, content) => {
      const el = document.createElement('meta')
      el.setAttribute(attr, key)
      el.setAttribute('content', content)
      document.head.appendChild(el)
      added.push(el)
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
      added.forEach((el) => el.remove())
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
    return () => simTimersRef.current.forEach(clearTimeout)
  }, [])

  // Escape closes the fallback modal (desktop/keyboard).
  useEffect(() => {
    if (!showFallback) return
    const onKey = (e) => { if (e.key === 'Escape') setShowFallback(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showFallback])

  // Same, for the onboarding modal.
  useEffect(() => {
    if (!showIntro) return
    const onKey = (e) => { if (e.key === 'Escape') setShowIntro(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showIntro])

  function beginSimulation() {
    if (simRunningRef.current) return
    simRunningRef.current = true
    setSimPhase('bloom')

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
  // heuristic to detect whether the OS actually switched to Savor. If
  // nothing happens within INSTALL_CHECK_MS, the app isn't installed —
  // show the Play Store fallback instead of failing silently.
  function handleReadyTap() {
    if (simPhase !== 'ready') return
    setSimPhase('importing')

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
      if (!leftPage) setShowFallback(true)
      simRunningRef.current = false
      setSimPhase('off')
      setSavorMode(false)
    }, INSTALL_CHECK_MS)
    simTimersRef.current.push(timeoutId)
  }

  function closeFallback() {
    setShowFallback(false)
  }

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
        <div id="db-recipe-card">
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
          squircle buttons on the right. Cosmetic only — the buttons are
          non-functional here; exiting back to the blog is the CTA's job. */}
      {savorMode && (
        <div className="db-sim-header" aria-hidden="true">
          <img src="/icons/icon-Tangerine.webp" alt="" className="db-sim-header-mark" />
          <div className="db-sim-header-actions">
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

      {/* ── App-not-installed fallback ── */}
      {showFallback && (
        <div className="db-sim-modal-backdrop" onClick={closeFallback}>
          <div
            className="db-sim-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Get Savor"
            onClick={(e) => e.stopPropagation()}
          >
            <img src="/icons/icon-Tangerine.webp" alt="" className="db-sim-modal-icon" />
            <h3 className="db-sim-modal-title">Looks like you don't have Savor yet</h3>
            <p className="db-sim-modal-body">
              Get it free and try this for real — same one-tap import, any recipe site.
            </p>
            <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="db-sim-modal-btn">
              Get Savor on Google Play
            </a>
            <button type="button" className="db-sim-modal-close" onClick={closeFallback}>
              Not now
            </button>
          </div>
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