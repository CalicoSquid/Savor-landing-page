// src/pages/About.jsx
import './pages.css'
import Footer from '../components/Footer'

const PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'

export default function About() {

  return (
    <>
      <main className="page doc-page">
        <div className="container doc-inner">
          <span className="doc-eyebrow">About</span>
          <h1 className="doc-title">It started with my mum’s recipe cards.</h1>
          <p className="doc-lead">
            I’m Caleb, a former chef and the person behind Savor. When I found
            my mum’s old recipe cards, stained and smudged from years of use,
            I wanted somewhere to keep them properly. They mattered rather more
            than the state of the paper suggested.
          </p>
          <p className="doc-lead">
            That became a recipe app. Then came recipes of my own, tools for the
            awkward bits of kitchen maths, and Potluck for the evenings when
            deciding what to cook is somehow harder than cooking it. The recipe
            box has acquired a few neighbours.
          </p>

          <div className="about-block">
            <h2>A home for the recipes you keep</h2>
            <p>
              The <a href={PLAY_URL} target="_blank" rel="noreferrer">Savor app</a>{' '}
              saves recipes from websites, reads cookbook pages and handwritten
              cards, and helps turn the recipe rattling around in your head into
              something you can cook from. Keep them together, find them again,
              and share the good ones if you fancy it.
            </p>
            <p>
              It’s ad-free, with ingredients and instructions where you can
              actually find them. Having spent years cooking professionally,
              I have fairly strong feelings about things getting in the way
              when dinner is already on the stove.
            </p>
          </div>

          <div className="about-block">
            <h2>Recipes from my kitchen</h2>
            <p>
              <a href="/originals/">Savor Originals</a> is where I put the things
              worth making again. There are two fairly different ways dinner
              tends to happen around here.
            </p>
            <p>
              <a href="/originals/?series=autopilot#recipes"><strong>Dinner on Autopilot</strong></a>{' '}
              is for an ordinary evening: familiar ingredients, sensible swaps
              and less hands-on effort. Each recipe has a Little Trick — one
              useful bit of cooking knowledge to take into the next dinner.
            </p>
            <p>
              <a href="/originals/?series=cupboard#recipes"><strong>Back of the Cupboard</strong></a>{' '}
              gives the forgotten or slightly awkward ingredient its moment.
              Sometimes that means a bag of dried mushrooms finally earning
              the shelf space. Sometimes it means cooking something I would
              usually walk straight past.
            </p>
          </div>

          <div className="about-block">
            <h2>Let the tools do the maths</h2>
            <p>
              The free <a href="/tools/">kitchen tools</a> help you scale a recipe,
              convert measurements, compare baking tins and work out portions.
              They work right here in the browser, without an account. Halving
              dinner shouldn’t require a maths exam before you’ve even peeled
              an onion.
            </p>
          </div>

          <div className="about-block">
            <h2>And when you still can’t choose</h2>
            <p>
              Years ago, we used to open a cookbook at random and cook whatever
              we landed on. <a href="/potluck/">Potluck</a> grew out of that:
              give it a spin, get a recipe, and see where dinner takes you.
              You still have to do the cooking. I haven’t managed to negotiate
              that part away.
            </p>
          </div>

          <div className="about-block">
            <h2>Still one cook behind it</h2>
            <p>
              I build Savor under the name <strong>CalicoSquid</strong>, from a
              farm in Montenegro. The professional cooking came first; learning
              to build all this followed. I write about both the useful bits and
              the occasional kitchen mishap over on the <a href="/blog/">blog</a>.
            </p>
            <p>
              There are good people along the way, too. The{' '}
              <a href="/iron-kitchen/">Savor × Iron Kitchen collaboration</a>{' '}
              brings together their kitchen tools and recipes with a place to
              keep them. There’s a free app theme in it as well, because
              apparently I also have opinions about the colour of a recipe box.
            </p>
          </div>

          <div className="doc-cta">
            <h2>Find something good to cook.</h2>
            <p><a href="/originals/">Browse Savor Originals →</a>{' '}·{' '}<a href="/tools/">Explore the kitchen tools →</a></p>
            <a
              href={PLAY_URL}
              target="_blank"
              rel="noreferrer"
              className="doc-cta-badge-link"
            >
              <img
                src="/potluck/play2.webp"
                alt="Get Savor on Google Play"
                className="doc-cta-badge"
                width="440"
                height="121"
                loading="lazy"
                decoding="async"
              />
            </a>
            <a
              href="/faq/"
              style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
            >
              Read the frequently asked questions →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
