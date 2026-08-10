import './iron-kitchen.css'
import Footer from '../components/Footer'
import { PLAY_URL } from '../data/seoPages'

const IRON_KITCHEN_URL = 'https://ironkitcheninc.com/'

// Pass 2 browser → production-app canary. Once the deployed page has proven
// the full claim path, this is the only value that needs to change to "IKI".
const COLLAB_ID = 'IKI'
const CLAIM_URL = `savor://collab?id=${COLLAB_ID}`

export default function IronKitchen() {
  return (
    <main className="page iki-page">
      <section className="iki-hero">
        <div className="iki-hero-grid" aria-hidden="true" />
        <div className="container iki-hero-inner">
          <div className="iki-hero-copy">
            <p className="iki-eyebrow">Savor <span>×</span> Iron Kitchen Inc.</p>
            <h1>Good tools. Good recipes. Built to stick around.</h1>
            <p className="iki-hero-lead">
              Savor keeps the recipes worth making. Iron Kitchen builds the equipment worth keeping.
              We teamed up on an exclusive Savor theme for cooks who care about both.
            </p>
            <div className="iki-hero-actions">
              <a href={CLAIM_URL} className="iki-btn iki-btn--claim">
                Claim your IKI theme
              </a>
              <a href={PLAY_URL} target="_blank" rel="noreferrer" className="iki-btn iki-btn--play">
                Get Savor
              </a>
            </div>
            <p className="iki-claim-hint">The claim button opens the Savor Android app.</p>
          </div>

          <div className="iki-theme-preview" aria-label="Preview of the Savor and Iron Kitchen collaboration theme">
            <div className="iki-preview-topline">
              <span>Exclusive theme</span>
              <span className="iki-preview-mark">IKI</span>
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
                <span className="iki-swatch iki-swatch--gunmetal" />
                <span className="iki-swatch iki-swatch--steel" />
              </div>
            </div>
            <p className="iki-preview-foot">Made to cook. Built to last.</p>
          </div>
        </div>
      </section>

      <section className="iki-story">
        <div className="container iki-story-grid">
          <div>
            <p className="iki-section-kicker">From one family kitchen to another</p>
            <h2>A collaboration that makes sense at the workbench and the stove.</h2>
          </div>
          <div className="iki-story-copy">
            <p>
              Iron Kitchen Inc. is a family-run North Carolina company founded by two brothers,
              bringing an engineering mindset to American-made culinary tools designed to perform
              reliably and hold up over time.
            </p>
            <p>
              Savor comes from the same sort of instinct: make something useful, make it carefully,
              and give it a place in real kitchens. This theme brings Iron Kitchen&rsquo;s bold orange,
              gunmetal and steel character into your Savor recipe collection.
            </p>
            <a href={IRON_KITCHEN_URL} target="_blank" rel="noopener noreferrer" className="iki-text-link">
              Meet Iron Kitchen Inc. <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="iki-claim" id="claim">
        <div className="container">
          <div className="iki-claim-panel">
            <div className="iki-claim-heading">
              <p className="iki-section-kicker">A little something for your recipe box</p>
              <h2>Your Iron Kitchen Savor theme is waiting.</h2>
              <p>No code. No purchase verification. Just a permanent collaboration gift for the community.</p>
            </div>

            <div className="iki-claim-paths">
              <div className="iki-claim-path">
                <span className="iki-step">01</span>
                <h3>Already use Savor?</h3>
                <p>Open this page on your Android device and tap below. Savor will handle the claim from there.</p>
                <a href={CLAIM_URL} className="iki-btn iki-btn--claim">Claim your IKI theme</a>
              </div>

              <div className="iki-claim-path">
                <span className="iki-step">02</span>
                <h3>New to Savor?</h3>
                <p>Install Savor from Google Play, then come back to this page and tap the claim button.</p>
                <a href={PLAY_URL} target="_blank" rel="noreferrer" className="iki-btn iki-btn--play">Get Savor on Google Play</a>
              </div>
            </div>

            <div className="iki-desktop-note">
              <strong>On a computer?</strong> The theme is claimed inside the Savor Android app. Install Savor on your phone,
              reopen <span>getsavor.recipes/iron-kitchen</span> there, and tap the claim button.
            </div>
          </div>
        </div>
      </section>

      <section className="iki-recipes">
        <div className="container iki-recipes-inner">
          <div className="iki-recipes-copy">
            <p className="iki-section-kicker">Cook it. Keep it.</p>
            <h2>Iron Kitchen recipes belong in a recipe box, not a browser tab.</h2>
            <p>
              When an Iron Kitchen recipe catches your eye, Savor can turn the recipe page into a clean,
              cookable card in your own collection — alongside recipes saved from screenshots, books,
              handwritten cards and everywhere else you actually find things worth cooking.
            </p>
            <a href="/" className="iki-text-link">See what Savor saves <span aria-hidden="true">→</span></a>
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
          <p className="iki-section-kicker">Iron Kitchen Inc.</p>
          <h2>Engineered in North Carolina. Made for kitchens that get used.</h2>
          <p>
            Explore Iron Kitchen&rsquo;s American-made kitchen and butcher-shop equipment, practical guides,
            and the story behind the family business.
          </p>
          <a href={IRON_KITCHEN_URL} target="_blank" rel="noopener noreferrer" className="iki-btn iki-btn--partner">
            Visit Iron Kitchen Inc. <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
