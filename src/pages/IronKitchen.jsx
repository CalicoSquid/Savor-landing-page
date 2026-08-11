import { useLocation } from 'react-router-dom'
import './iron-kitchen.css'
import Footer from '../components/Footer'
import { PLAY_URL } from '../data/seoPages'

const IRON_KITCHEN_URL = 'https://ironkitcheninc.com/'
const IRON_KITCHEN_STORY_URL = 'https://ironkitcheninc.com/pages/our-story'

// Browser → production-app canary. Keep this isolated from the public CTA.
// Open /iron-kitchen?test=1 to reveal the test control.
const TEST_COLLAB_ID = 'IKI'
const TEST_CLAIM_URL = `savor://collab?id=${TEST_COLLAB_ID}`

export default function IronKitchen() {
  const { search } = useLocation()
  const showTestClaim = new URLSearchParams(search).get('test') === '1'

  return (
    <main className="page iki-page">
      <section className="iki-hero">
        <div className="container iki-hero-inner">
          <div className="iki-hero-copy">
            <p className="iki-kicker">A Savor × Iron Kitchen collaboration</p>
            <h1>Good tools deserve good recipes.</h1>
            <p className="iki-hero-lead">
              Iron Kitchen makes hard-working kitchen tools — and recipes worth putting them to use. Savor gives
              those recipes a home. We&rsquo;re both small, hands-on, and built around people who actually cook, so
              teaming up felt pretty natural.
            </p>

            <p className="iki-hero-theme-note">
              <strong>A little something extra.</strong> Because it&rsquo;s nice to bring something to the table, Savor
              users can pick up a free Iron Kitchen theme over at IKI.
            </p>

            <div className="iki-hero-actions">
              <a
                href={IRON_KITCHEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="iki-btn iki-btn--primary"
              >
                Visit Iron Kitchen <span aria-hidden="true">↗</span>
              </a>
              <a href={PLAY_URL} target="_blank" rel="noreferrer" className="iki-secondary-link">
                Don&rsquo;t have Savor yet? Get the app →
              </a>
            </div>
          </div>

          <aside className="iki-hero-brand" aria-label="About Iron Kitchen Inc.">
            <img
              src="/images/iron-kitchen-logo.webp"
              alt="Iron Kitchen Inc."
              width="512"
              height="512"
            />
            <div className="iki-hero-brand-copy">
              <span>Iron Kitchen Inc.</span>
              <strong>Built in East Bend, North Carolina.</strong>
              <p>American-made kitchen tools, shaped by engineering and a serious love of cooking.</p>
            </div>
          </aside>
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
          <div className="iki-story-mark">
            <p className="iki-story-place">East Bend, North Carolina</p>
            <p className="iki-story-statement">
              Family-run. American-made. Built with the kind of care you notice after years of use.
            </p>
            <div className="iki-story-facts" aria-label="Iron Kitchen company details">
              <span>Two brothers</span>
              <span>Engineering-led</span>
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
            Iron Kitchen makes the things you cook with — and the recipes to put them to work. Savor keeps those
            recipes organized, searchable, and yours.
          </p>

          <div className="iki-two-sides">
            <div className="iki-side">
              <span className="iki-side-label">Iron Kitchen</span>
              <div>
                <strong>Make it well.</strong>
                <span>Hard-working culinary tools, plus practical recipes built around actually using them.</span>
              </div>
            </div>
            <span className="iki-plus" aria-hidden="true">+</span>
            <div className="iki-side">
              <span className="iki-side-label">Savor</span>
              <div>
                <strong>Keep it close.</strong>
                <span>A calm, ad-free home where those recipes stay easy to find and worth coming back to.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="iki-partner">
        <div className="container iki-partner-inner">
          <p className="iki-kicker">Go meet the makers</p>
          <h2>Take a look at what the brothers are building.</h2>
          <p>
            Explore Iron Kitchen&rsquo;s tools, recipes and story — and, if you use Savor, pick up the exclusive Iron Kitchen
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
