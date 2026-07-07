// src/pages/DemoBlog.jsx
//
// A fictional, deliberately over-written recipe blog — used to demo how
// Savor's in-app browser detects and imports a recipe. Not a real site,
// not a real blogger. Deliberately excluded from the sitemap and robots.txt
// (see public/robots.txt) and noindexed here at the page level too.
//
// No site chrome (see Nav.jsx / no <Footer /> import) — the page needs to
// read as a standalone foreign site, not part of getsavor.recipes.
import { useEffect, useRef } from 'react'
import './DemoBlog.css'

const RECIPE_SCHEMA = {
  '@context': 'https://schema.org/',
  '@type': 'Recipe',
  name: "The Only Lasagne Recipe You'll Ever Need (An Odyssey)",
  author: { '@type': 'Person', name: 'Marguerite Hollow' },
  datePublished: '2016-03-11',
  dateModified: '2026-07-02',
  description: 'A classic layered lasagne with ragù and béchamel, arrived at after considerable detour.',
  prepTime: 'PT30M',
  cookTime: 'PT2H30M',
  totalTime: 'PT3H',
  recipeYield: '8 servings',
  recipeCategory: 'Main Course',
  recipeCuisine: 'Italian',
  keywords: 'lasagne, ragù, béchamel, baked pasta, comfort food',
  recipeIngredient: [
    '2 tbsp olive oil',
    '1 small yellow onion, finely diced',
    '1 medium carrot, finely diced',
    '1 celery stalk, finely diced',
    '3 garlic cloves, minced',
    '1 lb ground beef',
    '1/2 lb ground pork',
    '1/2 cup dry white wine',
    '2 tbsp tomato paste',
    '28 oz canned crushed tomatoes',
    '1 cup whole milk, divided',
    '2 bay leaves',
    '4 tbsp unsalted butter',
    '4 tbsp all-purpose flour',
    '4 cups whole milk, warmed',
    '1/4 tsp freshly grated nutmeg',
    '1 lb fresh lasagne sheets',
    '1 1/2 cups grated Parmigiano-Reggiano',
    '12 oz fresh mozzarella, torn',
    'Salt and black pepper, to taste',
  ],
  recipeInstructions: [
    {
      '@type': 'HowToSection',
      name: 'Ragù',
      itemListElement: [
        { '@type': 'HowToStep', text: 'Heat olive oil in a heavy pot over medium heat. Add onion, carrot, and celery; cook 8 minutes until soft.' },
        { '@type': 'HowToStep', text: 'Add garlic and cook 1 minute until fragrant.' },
        { '@type': 'HowToStep', text: 'Add beef and pork. Break apart and brown, 8-10 minutes.' },
        { '@type': 'HowToStep', text: 'Pour in wine and simmer until mostly evaporated, about 3 minutes.' },
        { '@type': 'HowToStep', text: 'Stir in tomato paste and cook 2 minutes.' },
        { '@type': 'HowToStep', text: 'Add crushed tomatoes and bay leaves. Season with salt and pepper. Simmer uncovered on low, stirring occasionally, 1.5-2 hours.' },
        { '@type': 'HowToStep', text: 'Stir in 1/2 cup milk during the final 15 minutes. Discard bay leaves.' },
      ],
    },
    {
      '@type': 'HowToSection',
      name: 'Béchamel',
      itemListElement: [
        { '@type': 'HowToStep', text: 'Melt butter in a saucepan over medium heat. Whisk in flour and cook 2 minutes, stirring constantly, without browning.' },
        { '@type': 'HowToStep', text: 'Gradually whisk in warm milk. Simmer, whisking often, until thickened, 8-10 minutes.' },
        { '@type': 'HowToStep', text: 'Season with nutmeg, salt, and pepper. Remove from heat.' },
      ],
    },
    {
      '@type': 'HowToSection',
      name: 'Assembly',
      itemListElement: [
        { '@type': 'HowToStep', text: 'Preheat oven to 190°C (375°F).' },
        { '@type': 'HowToStep', text: 'Spread a thin layer of ragù in a 9x13-inch baking dish. Add a layer of pasta sheets.' },
        { '@type': 'HowToStep', text: 'Layer ragù, béchamel, and a scattering of Parmigiano. Repeat to build 4 layers, ending with béchamel.' },
        { '@type': 'HowToStep', text: 'Top with mozzarella and remaining Parmigiano.' },
        { '@type': 'HowToStep', text: 'Cover with foil and bake 25 minutes. Uncover and bake 15-20 minutes more, until golden and bubbling.' },
        { '@type': 'HowToStep', text: 'Rest 15 minutes before slicing.' },
      ],
    },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.98', ratingCount: '1247' },
}

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Caveat:wght@600&family=JetBrains+Mono:wght@500&display=swap'

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

export default function DemoBlog() {
  const runningRef = useRef(false)

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

    const fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    fontLink.href = FONT_HREF
    document.head.appendChild(fontLink)

    return () => {
      document.title = prevTitle
      added.forEach((el) => el.remove())
      fontLink.remove()
    }
  }, [])

  async function runShoot() {
    if (runningRef.current) return
    runningRef.current = true
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
  }

  return (
    <div className="db-page">
      {/* JSON-LD lives in the initial render tree (not a later effect) so
          it's present in the DOM at the same moment as everything else —
          no timing gap for Savor's on-load detection to race against. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(RECIPE_SCHEMA) }}
      />

      <div className="db-save-float">♥ Save</div>
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
              src="https://images.unsplash.com/photo-1619895092538-128341789043?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
          <a href="#db-recipe-jump">Jump to Recipe</a>
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

        {/* The real payoff — breaks character on purpose. Everything above
            is the bit; this is the actual product moment. */}
        <div className="db-cta">
          <p className="db-cta-text">
            That's Savor's in-app browser doing that — for real, live, on any recipe site.
          </p>
          <a
            href={`savor://browse?url=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.href : 'https://getsavor.recipes/demo'
            )}`}
            className="db-cta-btn"
          >
            Try it yourself →
          </a>
          <a href={PLAY_STORE} className="db-cta-alt" target="_blank" rel="noopener noreferrer">
            Don't have Savor? Get it free →
          </a>
        </div>
      </div>

      <footer className="db-footer">
        the hearth &amp; hollow · a fictional publication for demonstration purposes
        <br />
        no bloggers, brands, or people were harmed (or real) in the making of this page
      </footer>
    </div>
  )
}