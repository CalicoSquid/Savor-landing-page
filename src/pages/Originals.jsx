import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import { SAVOR_ORIGINALS } from '../data/originals'
import './pages.css'
import './originals.css'

const SERIES = [
  { id: 'autopilot', name: 'Dinner on Autopilot', tagline: 'Good food. Less thinking.', description: 'Everyday ingredients, forgiving recipes and one little trick that makes dinner better. Less hands-on effort, whether it is a quick pan or a tray left to the oven.' },
  { id: 'cupboard', name: 'Back of the Cupboard', tagline: "You’ve got what? Let’s cook it.", description: 'The forgotten, unusual or awkward ingredient gets its moment. A little curiosity, a few practical swaps and something worth making again. Take the time it needs.' },
]
const PAGE_SIZE = 12

export default function Originals() {
  const [params] = useSearchParams()
  // The static document contains all recipes; apply bookmarked filters after hydration.
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  const selected = ready ? SERIES.find(series => series.id === params.get('series')) : undefined
  const recipes = [...SAVOR_ORIGINALS]
    .sort((a, b) => b.post.date.localeCompare(a.post.date))
    .filter(recipe => !selected || recipe.series === selected.name)
  const pages = Math.max(1, Math.ceil(recipes.length / PAGE_SIZE))
  const requestedPage = ready ? Number(params.get('page')) : 1
  const currentPage = Number.isInteger(requestedPage) ? Math.max(1, Math.min(pages, requestedPage)) : 1
  useEffect(() => {
    if (window.location.hash === '#recipes') document.getElementById('recipes')?.scrollIntoView()
  }, [selected?.id, currentPage])
  const visibleRecipes = recipes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const collectionUrl = (series, page = 1) => {
    const query = new URLSearchParams()
    if (series) query.set('series', series)
    if (page > 1) query.set('page', String(page))
    return `/originals/${query.size ? `?${query}` : ''}#recipes`
  }
  return (
    <>
      <main className="page doc-page originals-page">
        <div className="originals-inner">
          <header className="originals-intro">
            <span className="doc-eyebrow">From Caleb’s kitchen</span>
            <h1 className="doc-title">Savor Originals.</h1>
            <p className="originals-lead">Less thinking, more cooking.</p>
            <p>Original recipes from Caleb’s kitchen. Everyday dinners and cupboard discoveries, with a little know-how to take into your next meal.</p>
            <a className="originals-author" href="/about/">Meet Caleb, the cook behind the app →</a>
          </header>

          <section className="originals-series-grid" aria-label="Two ways to get cooking">
            {SERIES.map((series, index) => (
              <article className="originals-series-intro" key={series.id}>
                <span className="doc-eyebrow">Series 0{index + 1}</span>
                <h2>{series.name}</h2>
                <p className="originals-tagline">{series.tagline}</p>
                <p>{series.description}</p>
                <Link to={collectionUrl(series.id)}>Browse {series.name} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </section>

          <section id="recipes" className="originals-collection" aria-labelledby="originals-recipes-title">
            <div className="originals-collection-heading">
              <h2 id="originals-recipes-title">Find your next dinner</h2>
              <p>Newest recipes first. Pick what fits your evening.</p>
            </div>
            <nav className="originals-filters" aria-label="Filter recipes by series">
              <Link to={collectionUrl()} aria-current={!selected ? 'page' : undefined}>All recipes</Link>
              {SERIES.map(series => <Link key={series.id} to={collectionUrl(series.id)} aria-current={selected?.id === series.id ? 'page' : undefined}>{series.name}</Link>)}
            </nav>
            <p className="originals-count" role="status">{recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}{selected ? ` · ${selected.name}` : ''}</p>
            <div className="originals-grid">
            {visibleRecipes.map((recipe, index) => (
              <article key={recipe.slug} className="originals-card">
                <a className="originals-image-link" href={recipe.href} aria-label={`Cook ${recipe.name}`}>
                  <img src={recipe.post.ogImage} alt={recipe.post.ogImageAlt} width={recipe.post.ogImageWidth} height={recipe.post.ogImageHeight} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                </a>
                <div className="originals-card-body">
                  <span className="originals-series">{recipe.series} · No. {recipe.number ?? 1}</span>
                  <h3><a href={recipe.href}>{recipe.name}</a></h3>
                  <p>{recipe.description}</p>
                  <p className="originals-effort">{recipe.effort}</p>
                  <a className="originals-cook" href={recipe.href}>Get cooking <span aria-hidden="true">→</span></a>
                </div>
              </article>
            ))}
            </div>
            {pages > 1 && <nav className="originals-pagination" aria-label="Recipe pages">
              {currentPage > 1 && <Link to={collectionUrl(selected?.id, currentPage - 1)}>← Previous</Link>}
              <span>Page {currentPage} of {pages}</span>
              {currentPage < pages && <Link to={collectionUrl(selected?.id, currentPage + 1)}>Next →</Link>}
            </nav>}
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
