import Footer from '../components/Footer'
import { SHORTS } from '../data/shorts'
import './pages.css'
import './Shorts.css'

export default function Shorts() {
  const posts = [...SHORTS].sort((a, b) => b.featuredAt.localeCompare(a.featuredAt))
  return <>
    <main className="page doc-page shorts-page">
      <div className="container doc-inner shorts-inner">
        <a className="shorts-home" href="/">Savor / From our kitchen</a>
        <span className="doc-eyebrow">Seen it. Now cook it.</span>
        <h1 className="doc-title">Recipes from our videos.</h1>
        <p className="doc-lead">Find the dish that caught your eye. The full recipe is one tap away.</p>
        {posts.length ? <div className="shorts-grid">{posts.map(post => <article className="shorts-card" key={post.id}>
          <a className="shorts-image" href={post.recipeUrl} aria-label={`View ${post.title} recipe`}>
            {post.image ? <img src={post.image} alt={post.title} loading="lazy" width="600" height="600" /> : <span className="shorts-image-placeholder">From the Savor kitchen</span>}
          </a>
          <div className="shorts-card-body"><h2>{post.title}</h2><div className="shorts-links">
            <a className="shorts-recipe" href={post.recipeUrl}>View recipe <span aria-hidden="true">↗</span></a>
            {post.videoUrl && <a href={post.videoUrl} target="_blank" rel="noreferrer">Watch video</a>}
          </div></div>
        </article>)}</div> : <div className="shorts-empty"><h2>The next dish is on its way.</h2><p>Recipes will appear here as we share our cooking videos.</p><a href="https://www.instagram.com/savor_recipeapp/" target="_blank" rel="noreferrer">Follow Savor on Instagram ↗</a></div>}
        <p className="shorts-footnote">Save something delicious? <a href="/">Keep your recipes together with Savor.</a></p>
      </div>
    </main>
    <Footer />
  </>
}
