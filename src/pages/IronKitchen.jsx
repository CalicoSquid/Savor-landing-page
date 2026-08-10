import { useLocation } from 'react-router-dom'
import './iron-kitchen.css'
import Footer from '../components/Footer'
import { PLAY_URL } from '../data/seoPages'

const IRON_KITCHEN_URL = 'https://ironkitcheninc.com/'
const IRON_KITCHEN_STORY_URL = 'https://ironkitcheninc.com/pages/our-story'

// Browser → production-app canary. Keep this isolated from the public CTA.
// Open /iron-kitchen?test=1 to reveal the test control.
const TEST_COLLAB_ID = 'IKI_TEST'
const TEST_CLAIM_URL = `savor://collab?id=${TEST_COLLAB_ID}`

export default function IronKitchen() {
  const { search } = useLocation()
  const showTestClaim = new URLSearchParams(search).get('test') === '1'

  return (
    <main className="page iki-page">
      <section className="iki-hero">
        <div className="container iki-hero-inner">
          <div className="iki-hero-badge" aria-hidden="true">
            <img src="/images/iron-kitchen-logo.webp" alt="" width="512" height="512" />
          </div>

          <p className="iki-kicker">Savor × Iron Kitchen Inc.</p>
          <h1>A little something from one family kitchen to another.</h1>
          <p className="iki-hero-lead">
            We teamed up with Iron Kitchen Inc. — a family-run North Carolina company making American-built
            culinary tools — to bring a little of their kitchen into Savor.
          </p>

          <div className="iki-palette" aria-label="Iron Kitchen collaboration theme colors">
            <span className="iki-palette-orange" />
            <span className="iki-palette-gold" />
            <span className="iki-palette-ink" />
            <span className="iki-palette-cream" />
          </div>

          <div className="iki-hero-actions">
            <a
              href={IRON_KITCHEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="iki-btn iki-btn--primary"
            >
              Visit Iron Kitchen to claim the theme <span aria-hidden="true">↗</span>
            </a>
            <a href={PLAY_URL} target="_blank" rel="noreferrer" className="iki-secondary-link">
              Don&rsquo;t have Savor yet? Get the app →
            </a>
          </div>
        </div>
      </section>

      <section className="iki-theme-strip">
        <div className="container iki-theme-strip-inner">
          <div>
            <p className="iki-kicker iki-kicker--dark">Exclusive Savor theme</p>
            <h2>Forged in fire.</h2>
            <p>
              Bold orange, black and warm cream — Iron Kitchen&rsquo;s colors, tucked into Savor without turning
              your recipe box into an advertisement.
            </p>
          </div>
          <img
            src="/images/iron-kitchen-logo.webp"
            alt="Iron Kitchen Inc."
            width="512"
            height="512"
            loading="lazy"
          />
        </div>
      </section>

      <section className="iki-story">
        <div className="container iki-story-grid">
          <div className="iki-story-mark" aria-hidden="true">
            <img src="/images/iron-kitchen-logo.webp" alt="" width="512" height="512" loading="lazy" />
            <div className="iki-story-facts">
              <span>East Bend, North Carolina</span>
              <span>Family-run</span>
              <span>Made in America</span>
            </div>
          </div>

          <div className="iki-story-copy">
            <p className="iki-kicker">Meet Iron Kitchen</p>
            <h2>Built by cooks. And engineers.</h2>
            <p>
              Iron Kitchen is two brothers in East Bend, North Carolina, bringing backgrounds in mechanical
              engineering and automation to the kitchen. They started with a pretty down-to-earth idea: the tools
              you use all the time ought to be made well enough to stick around.
            </p>
            <p>
              They design and build in the USA, care more about reliability than shortcuts, and clearly like
              cooking enough to make the whole thing personal. We like that.
            </p>
            <a
              href={IRON_KITCHEN_STORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="iki-text-link"
            >
              Read their story <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="iki-same-kitchen">
        <div className="container iki-same-kitchen-inner">
          <p className="iki-kicker">Why this works</p>
          <h2>Different tools. Same kitchen.</h2>
          <p className="iki-same-kitchen-lead">
            Iron Kitchen makes the things you cook with. Savor keeps the recipes you cook from.
          </p>

          <div className="iki-two-sides">
            <div className="iki-side">
              <img src="/images/iron-kitchen-logo.webp" alt="" width="512" height="512" loading="lazy" />
              <div>
                <strong>Iron Kitchen</strong>
                <span>Practical culinary tools designed to work hard and last.</span>
              </div>
            </div>
            <span className="iki-plus" aria-hidden="true">+</span>
            <div className="iki-side">
              <img src="/icons/icon-Tangerine.webp" alt="" width="160" height="160" loading="lazy" />
              <div>
                <strong>Savor</strong>
                <span>A calm, ad-free home for the recipes worth keeping.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="iki-partner">
        <div className="container iki-partner-inner">
          <img
            src="/images/iron-kitchen-logo.webp"
            alt="Iron Kitchen Inc."
            className="iki-partner-logo"
            width="512"
            height="512"
            loading="lazy"
          />
          <p className="iki-kicker">Go meet the makers</p>
          <h2>Take a look at what the brothers are building.</h2>
          <p>
            Explore Iron Kitchen&rsquo;s tools and story — and, if you use Savor, pick up the exclusive Iron Kitchen
            theme while you&rsquo;re there.
          </p>
          <a
            href={IRON_KITCHEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="iki-btn iki-btn--primary"
          >
            Visit Iron Kitchen Inc. <span aria-hidden="true">↗</span>
          </a>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="iki-partner-savor-link">
            New to Savor? Get the app first →
          </a>
        </div>
      </section>

      {showTestClaim && (
        <aside className="iki-test-claim" aria-label="Collaboration test controls">
          <div>
            <strong>IKI test handoff</strong>
            <span>Canary only — not part of the public collaboration flow.</span>
          </div>
          <a href={TEST_CLAIM_URL}>Open test theme in Savor</a>
        </aside>
      )}

      <Footer />
    </main>
  )
}
