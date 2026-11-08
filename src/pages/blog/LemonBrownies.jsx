import PinterestSave from '../../components/PinterestSave'
import { originalPinterestDetails, pinterestImageAttributes } from '../../lib/pinterest'
import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'
import { lemonBrownies as recipe } from '../../data/lemonBrownies'
import './salt-pork-blaff.css'

const post = BLOG_POSTS.find(p => p.slug === 'lemon-brownies-strawberry-tree-jam')
const pin = originalPinterestDetails(post)
const pageUrl = `https://getsavor.recipes/blog/${post.slug}/`
const recipeMetadata = {
  '@context': 'https://schema.org', '@type': 'Recipe',
  name: 'Lemon Brownies with Strawberry Tree Jam', description: post.metaDesc, image: post.ogImage,
  author: { '@type': 'Person', name: 'Caleb' }, datePublished: post.date,
  prepTime: 'PT15M', cookTime: 'PT28M', totalTime: 'PT43M',
  recipeYield: recipe.serves, recipeCategory: 'Dessert',
  keywords: 'lemon brownies, lemon glaze, lemon bars, Signature Recipes',
  recipeIngredient: recipe.ingredients.filter(item => !item.startsWith('## ')),
  recipeInstructions: recipe.steps.map((step, i) => ({ '@type': 'HowToStep', ...step, url: `${pageUrl}#step-${i + 1}`, position: i + 1 })),
  url: pageUrl, mainEntityOfPage: pageUrl,
}

function emphasis(text) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) => part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part)
}

function IngredientGroups() {
  const groups = []
  for (const item of recipe.ingredients) {
    if (item.startsWith('## ')) groups.push({ title: item.slice(3), items: [] })
    else groups.at(-1).items.push(item)
  }
  return groups.map(group => <section key={group.title}><h4>{group.title}</h4><ul>{group.items.map(item => <li key={item}>{emphasis(item)}</li>)}</ul></section>)
}

export default function LemonBrownies() {
  const jam = recipe.jam
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeMetadata).replace(/</g, '\\u003c') }} />
      <p><a href="/originals/?series=signature#recipes">Savor Originals</a> · <strong>Signature Recipes · No. 2</strong></p>
      <p><a href="#recipe">Straight to the brownies ↓</a> · <a href="#strawberry-tree-jam">Optional strawberry tree jam ↓</a></p>
      {recipe.intro.map(text => <p key={text}>{emphasis(text)}</p>)}

      <section id="recipe" className="blaff-recipe-card" aria-labelledby="brownies-recipe-title">
        <img className="blaff-recipe-image" src="/blog/lemon-brownies.webp" width={post.ogImageWidth} height={post.ogImageHeight} style={{ aspectRatio: '4 / 3', objectPosition: 'center 58%' }} alt={pin.altText} {...pinterestImageAttributes(pin)} decoding="async" />
        <div className="blaff-recipe-content">
          {recipe.imageCaption && <p><em>{recipe.imageCaption}</em></p>}
          <span className="doc-eyebrow">Signature Recipes · Recipe No. 2</span>
          <h2 id="brownies-recipe-title">Lemon Brownies with Strawberry Tree Jam</h2>
          <p><em>{recipe.subtitle}</em></p>
          <p><strong>Makes:</strong> {recipe.serves}<br /><strong>Prep:</strong> {recipe.prep} · <strong>Bake:</strong> 22–28 minutes<br /><strong>Tin:</strong> {recipe.equipment}<br /><strong>Allow:</strong> 37–43 minutes, plus time to cool completely and let the glaze set.</p>
          <div className="blaff-recipe-actions">
            <a href={`savor://create?url=${encodeURIComponent(pageUrl)}`}>Save to Savor</a>
            <PinterestSave details={pin} />
          </div>
          <h3>Ingredients</h3>
          <IngredientGroups />
          <h3>Method</h3>
          <ol>{recipe.steps.map((step, i) => <li key={step.name} id={`step-${i + 1}`}><strong>{step.name}.</strong> {step.text}</li>)}</ol>
          <p>Serving with jam? <a href="#strawberry-tree-jam">The optional strawberry tree version is below</a>. Raspberries work beautifully too.</p>
        </div>
      </section>

      <h2>Cook Like a Pro</h2>
      {recipe.notes.map(note => <p key={note.name}><strong>{note.name}.</strong> {note.text}</p>)}

      <section id="strawberry-tree-jam" className="blaff-recipe-card" aria-labelledby="jam-recipe-title">
        <div className="blaff-recipe-content">
          <span className="doc-eyebrow">To go with the brownies · Optional accompaniment</span>
          <h2 id="jam-recipe-title">{jam.title}</h2>
          <p><em>{jam.subtitle}</em></p>
          <p>This is the little extra from the Montenegro story. You don’t need it to make the brownies, and you don’t need to go hunting for a strawberry tree. Fresh raspberries are a perfectly good way to get on with dessert.</p>
          <p><strong>Makes:</strong> {jam.serves}<br /><strong>Prep:</strong> {jam.prep} · <strong>Cook:</strong> {jam.cook}</p>
          <p><strong>Refrigerator preserve only.</strong> {jam.preservationNotice}</p>
          <h3>Ingredients</h3>
          <ul>{jam.ingredients.map(item => <li key={item}>{emphasis(item)}</li>)}</ul>
          <h3>Method</h3>
          <ol>{jam.steps.map((step, i) => <li key={step.name} id={`jam-step-${i + 1}`}><strong>{step.name}.</strong> {step.text}</li>)}</ol>
          <h3>Cook Like a Pro</h3>
          {jam.notes.map(note => <p key={note.name}><strong>{note.name}.</strong> {note.text}</p>)}
          <p><a href="#recipe">Back to the lemon brownies ↑</a></p>
        </div>
      </section>
      <p>Browse more <a href="/originals/?series=signature#recipes">Signature Recipes</a>, including <a href="/blog/hot-smoked-salmon-fennel-dill-vodka/">oven-smoked salmon with fennel, dill and vodka</a>.</p>
    </BlogPostLayout>
  )
}
