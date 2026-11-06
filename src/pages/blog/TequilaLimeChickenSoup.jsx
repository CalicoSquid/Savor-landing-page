import BlogPostLayout from '../../components/BlogPostLayout'
import PinterestSave from '../../components/PinterestSave'
import { originalPinterestDetails, pinterestImageAttributes } from '../../lib/pinterest'
import { BLOG_POSTS } from '../../data/blogPosts'
import { tequilaLimeChickenSoup as recipe } from '../../data/tequilaLimeChickenSoup'
import './salt-pork-blaff.css'

const post = BLOG_POSTS.find(p => p.slug === 'tequila-lime-chicken-soup')
const pin = originalPinterestDetails(post)
const pageUrl = `https://getsavor.recipes/blog/${post.slug}/`
const metadata = {
  '@context': 'https://schema.org', '@type': 'Recipe',
  name: recipe.title, description: post.metaDesc, image: post.ogImage,
  author: { '@type': 'Person', name: 'Caleb' }, datePublished: post.date,
  prepTime: 'PT20M', cookTime: 'PT45M', totalTime: 'PT65M',
  recipeYield: recipe.serves, recipeCategory: 'Soup',
  keywords: 'tequila lime chicken soup, chipotle chicken soup, Signature Recipes',
  recipeIngredient: recipe.ingredients.filter(item => !item.startsWith('## ')),
  recipeInstructions: recipe.steps.map(([name, text], i) => ({ '@type': 'HowToStep', name, text, position: i + 1, url: `${pageUrl}#step-${i + 1}` })),
  url: pageUrl, mainEntityOfPage: pageUrl,
}
const groups = []
for (const item of recipe.ingredients) {
  if (item.startsWith('## ')) groups.push({ title: item.slice(3), items: [] })
  else groups.at(-1).items.push(item)
}
function paragraphs(text) {
  return text.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph.split(/(\*\*[^*]+\*\*)/g).map((part, j) => part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part)}</p>)
}

export default function TequilaLimeChickenSoup() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata).replace(/</g, '\\u003c') }} />
      <p><a href="/originals/?series=signature#recipes">Savor Originals</a> · <strong>Signature Recipes · No. 3</strong></p>
      <p><a href="#recipe">Straight to the recipe ↓</a></p>
      {recipe.intro.map(text => <p key={text}>{text}</p>)}
      <section id="recipe" className="blaff-recipe-card" aria-labelledby="soup-recipe-title">
        <img className="blaff-recipe-image" src="/blog/tequila-lime-chicken-soup.webp" width={post.ogImageWidth} height={post.ogImageHeight} style={{ aspectRatio: '4 / 3', objectPosition: 'center 55%' }} alt={pin.altText} {...pinterestImageAttributes(pin)} decoding="async" />
        <div className="blaff-recipe-content">
          <span className="doc-eyebrow">Signature Recipes · Recipe No. 3</span>
          <h2 id="soup-recipe-title">{recipe.title}</h2>
          <p><em>{recipe.subtitle}</em></p>
          <p><strong>Serves:</strong> {recipe.serves}<br /><strong>Prep:</strong> {recipe.prep} · <strong>Cook:</strong> {recipe.cook}</p>
          <div className="blaff-recipe-actions">
            <a href={`savor://create?url=${encodeURIComponent(pageUrl)}`}>Save to Savor</a>
            <PinterestSave details={pin} />
          </div>
          <h3>Ingredients</h3>
          {groups.map(group => <section key={group.title}><h4>{group.title}</h4><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></section>)}
          <h3>Method</h3>
          <ol>{recipe.steps.map(([name, text], i) => <li key={name} id={`step-${i + 1}`}><strong>{name}.</strong>{paragraphs(text)}</li>)}</ol>
        </div>
      </section>
      <h2>Cook Like a Pro</h2>
      {recipe.notes.map(([name, text]) => <section key={name}><h3>{name}</h3>{paragraphs(text)}</section>)}
      <h2>Serving &amp; Keeping</h2>
      {paragraphs(recipe.ahead)}
      <p>More from <a href="/originals/?series=signature#recipes">Signature Recipes</a>: <a href="/blog/hot-smoked-salmon-fennel-dill-vodka/">oven-smoked salmon</a> and <a href="/blog/lemon-brownies-strawberry-tree-jam/">lemon brownies</a>.</p>
    </BlogPostLayout>
  )
}
