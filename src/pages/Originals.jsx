import Footer from '../components/Footer'
import { SAVOR_ORIGINALS } from '../data/originals'
import './pages.css'
import './originals.css'

export default function Originals() {
  return (
    <>
      <main className="page doc-page originals-page">
        <div className="originals-inner">
          <header className="originals-intro">
            <span className="doc-eyebrow">From Caleb’s kitchen</span>
            <h1 className="doc-title">Savor Originals.</h1>
            <p className="originals-lead">Dinner on an ordinary Tuesday. Something different when you have the time.</p>
            <p>Original recipes from the chef behind Savor: cupboard dinners, cooking adventures, and the things worth making again. Pick the one that fits your evening.</p>
            <a className="originals-author" href="/about/">Meet Caleb, the cook behind the app →</a>
          </header>

          <section aria-label="Original recipes" className="originals-grid">
            {SAVOR_ORIGINALS.map((recipe, index) => (
              <article key={recipe.slug} className="originals-card">
                <a className="originals-image-link" href={recipe.href} aria-label={`Cook ${recipe.name}`}>
                  <img src={recipe.post.ogImage} alt={recipe.post.ogImageAlt} width={recipe.post.ogImageWidth} height={recipe.post.ogImageHeight} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                </a>
                <div className="originals-card-body">
                  <span className="originals-series">{recipe.series} · No. {recipe.number ?? 1}</span>
                  <p className="originals-mood">{recipe.mood}</p>
                  <h2><a href={recipe.href}>{recipe.name}</a></h2>
                  <p>{recipe.description}</p>
                  <p className="originals-effort">{recipe.effort}</p>
                  <a className="originals-cook" href={recipe.href}>Get cooking <span aria-hidden="true">→</span></a>
                </div>
              </article>
            ))}
          </section>

          <aside className="originals-next">
            <div>
              <span className="doc-eyebrow">Leave it to chance</span>
              <h2>Still cannot choose?</h2>
              <p>That is how this started. Let Potluck pick a recipe and see where dinner takes you.</p>
            </div>
            <a href="/potluck/">Spin for dinner →</a>
          </aside>
          <p className="originals-community">Looking for recipes shared by other Savor cooks? <a href="/recipes/">Browse community recipes →</a></p>
        </div>
      </main>
      <Footer />
    </>
  )
}
