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
        <div className="iki-brand-ribbon">Family-operated <span aria-hidden="true">|</span> Made in America</div>
        <div className="iki-hero-grid" aria-hidden="true" />

        <div className="container iki-hero-inner">
          <div className="iki-hero-copy">
            <div className="iki-lockup" aria-label="Savor and Iron Kitchen Inc.">
              <img
                src="/images/Savor_white.webp"
                alt="Savor"
                className="iki-lockup-savor"
                width="480"
                height="150"
              />
              <span className="iki-lockup-times" aria-hidden="true">×</span>
              <img
                src="/images/iron-kitchen-logo.webp"
                alt="Iron Kitchen Inc."
                className="iki-lockup-iron"
                width="512"
                height="512"
              />
            </div>

            <p className="iki-eyebrow">Forged in fire</p>
            <h1>Cook in color.<br />Built to last.</h1>
            <p className="iki-hero-lead">
              Savor keeps the recipes worth making. Iron Kitchen builds culinary tools worth keeping.
              Together, we made an exclusive Savor theme for cooks who care about both.
            </p>

            <div className="iki-hero-actions">
              <a
                href={IRON_KITCHEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="iki-btn iki-btn--primary"
              >
                Visit Iron Kitchen to claim the theme <span aria-hidden="true">↗</span>
              </a>
              <a href={PLAY_URL} target="_blank" rel="noreferrer" className="iki-btn iki-btn--secondary">
                Get Savor
              </a>
            </div>
            <p className="iki-hero-note">The free collaboration theme is offered through Iron Kitchen Inc.</p>
          </div>

          <div className="iki-theme-preview" aria-label="Preview of the Savor and Iron Kitchen collaboration theme">
            <div className="iki-preview-topline">
              <span>Exclusive Savor theme</span>
              <img src="/images/iron-kitchen-logo.webp" alt="" width="512" height="512" />
            </div>
            <div className="iki-preview-appbar">
              <img src="/images/Savor_white.webp" alt="Savor" width="480" height="150" />
              <span>Forged in fire</span>
            </div>
            <div className="iki-preview-card">
              <p className="iki-preview-label">Tonight&rsquo;s recipe</p>
              <h2>Smashburger night</h2>
              <div className="iki-preview-line iki-preview-line--long" />
              <div className="iki-preview-line" />
              <div className="iki-preview-line iki-preview-line--short" />
              <div className="iki-preview-swatches" aria-hidden="true">
                <span className="iki-swatch iki-swatch--orange" />
                <span className="iki-swatch iki-swatch--black" />
                <span className="iki-swatch iki-swatch--cream" />
              </div>
            </div>
            <p className="iki-preview-foot">A little Iron Kitchen in your recipe box.</p>
          </div>
        </div>
      </section>

      <section className="iki-story">
        <div className="container iki-story-grid">
          <div className="iki-maker-card" aria-hidden="true">
            <div className="iki-maker-card-band">Iron Kitchen Inc.</div>
            <img src="/images/iron-kitchen-logo.webp" alt="" width="512" height="512" />
            <strong>Family-run.<br />American-made.<br />Built with purpose.</strong>
            <span>East Bend, North Carolina</span>
          </div>

          <div className="iki-story-copy">
            <p className="iki-section-kicker">Meet Iron Kitchen</p>
            <h2>Engineering belongs in the kitchen, too.</h2>
            <p>
              Based in East Bend, North Carolina, Iron Kitchen Inc. is a family-run company built by two
              brothers with backgrounds in mechanical engineering and automation — and a serious love of cooking.
            </p>
            <p>
              Their idea is refreshingly simple: kitchen and butcher-shop tools shouldn&rsquo;t be disposable.
              They should be thoughtfully engineered, made with integrity, and ready for years of real use.
            </p>
            <p>
              That felt familiar to us. Savor was built around the same instinct: keep the things that matter,
              remove the clutter, and make something you actually want to live with.
            </p>
            <a
              href={IRON_KITCHEN_STORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="iki-text-link"
            >
              Read the Iron Kitchen story <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="iki-theme-section">
        <div className="container iki-theme-section-inner">
          <div className="iki-theme-copy">
            <p className="iki-section-kicker">The collaboration theme</p>
            <h2>Bold orange. Black iron. Your recipes.</h2>
            <p>
              The Iron Kitchen theme brings their unmistakable orange-and-black identity into Savor without
              turning your recipe collection into an ad. It&rsquo;s still Savor — just forged a little differently.
            </p>
          </div>

          <div className="iki-theme-details">
            <div>
              <span className="iki-detail-label">Theme</span>
              <strong>Iron Kitchen Inc.</strong>
            </div>
            <div>
              <span className="iki-detail-label">Label</span>
              <strong>Forged in fire</strong>
            </div>
            <div>
              <span className="iki-detail-label">Cost</span>
              <strong>Free collaboration gift</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="iki-claim-flow">
        <div className="container">
          <div className="iki-claim-heading">
            <p className="iki-section-kicker">How to get it</p>
            <h2>The gift starts at Iron Kitchen.</h2>
            <p>
              We wanted this collaboration to send people toward the makers, not away from them. The permanent
              claim lives with Iron Kitchen; Savor simply receives the gift when you tap their button.
            </p>
          </div>

          <div className="iki-claim-paths">
            <article className="iki-claim-path">
              <span className="iki-step">01</span>
              <h3>Already use Savor?</h3>
              <p>
                Visit Iron Kitchen on your Android phone and use their Savor collaboration button. Savor opens
                and adds the exclusive theme to your collection.
              </p>
              <a
                href={IRON_KITCHEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="iki-btn iki-btn--dark"
              >
                Go to Iron Kitchen <span aria-hidden="true">↗</span>
              </a>
            </article>

            <article className="iki-claim-path">
              <span className="iki-step">02</span>
              <h3>New to Savor?</h3>
              <p>
                Install Savor from Google Play, then return to Iron Kitchen and tap their collaboration button.
                There&rsquo;s no code to remember and no purchase verification.
              </p>
              <a href={PLAY_URL} target="_blank" rel="noreferrer" className="iki-btn iki-btn--outline">
                Get Savor on Google Play
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="iki-recipes">
        <div className="container iki-recipes-inner">
          <div className="iki-recipes-copy">
            <p className="iki-section-kicker">Cook it. Keep it.</p>
            <h2>A good recipe deserves better than another browser tab.</h2>
            <p>
              Savor is an ad-free home for the recipes you actually care about — saved from websites, screenshots,
              cookbook pages, handwritten cards and anywhere else real recipes turn up.
            </p>
            <p>
              Find something worth cooking at Iron Kitchen? Keep it with the rest of your recipe box instead of
              trying to remember where you found it.
            </p>
            <a href="/" className="iki-text-link">See what Savor does <span aria-hidden="true">→</span></a>
          </div>

          <div className="iki-recipe-stack" aria-hidden="true">
            <div className="iki-recipe-sheet iki-recipe-sheet--back" />
            <div className="iki-recipe-sheet iki-recipe-sheet--mid" />
            <div className="iki-recipe-sheet iki-recipe-sheet--front">
              <span>Saved with Savor</span>
              <strong>Keep the recipe.<br />Lose the clutter.</strong>
              <div className="iki-recipe-rule" />
              <div className="iki-recipe-rule iki-recipe-rule--short" />
              <div className="iki-recipe-rule" />
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
          <p className="iki-section-kicker">The people behind the tools</p>
          <h2>Made in America. Made to work.</h2>
          <p>
            Explore Iron Kitchen&rsquo;s culinary equipment, practical resources, and the family story behind a
            North Carolina company bringing industrial-grade thinking into the kitchen.
          </p>
          <a
            href={IRON_KITCHEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="iki-btn iki-btn--primary"
          >
            Visit Iron Kitchen Inc. <span aria-hidden="true">↗</span>
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
