import './pages.css'
import Footer from '../components/Footer'
import { PUBLIC_RECIPE_INDEX } from '../data/publicRecipeIndex.generated'

export default function Recipes() {
  return (
    <>
      <main className="page doc-page">
        <div className="container doc-inner">
          <span className="doc-eyebrow">Community recipes</span>
          <h1 className="doc-title">Recipes shared on Savor.</h1>
          <p className="doc-lead">
            A small public shelf of original recipes made or written by Savor cooks.
            Recipes imported from other websites stay linked to their original source
            instead of being republished here for search.
          </p>

          <div className="about-block">
            {PUBLIC_RECIPE_INDEX.length > 0 ? (
              <ul className="recipe-index-list">
                {PUBLIC_RECIPE_INDEX.map((recipe) => (
                  <li key={recipe.id} className="recipe-index-item">
                    <a href={`/r/${encodeURIComponent(recipe.id)}`} className="recipe-index-link">
                      {recipe.name}
                    </a>
                    {recipe.description && (
                      <p className="recipe-index-desc">{recipe.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Public recipes are being refreshed. Check back soon.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
