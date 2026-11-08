import BlogPostLayout from '../../components/BlogPostLayout'
import PinterestSave from '../../components/PinterestSave'
import { originalPinterestDetails, pinterestImageAttributes } from '../../lib/pinterest'
import { BLOG_POSTS } from '../../data/blogPosts'
import { veganPepperoni as recipe } from '../../data/veganPepperoni'
import './salt-pork-blaff.css'

const post = BLOG_POSTS.find(p => p.slug === 'vegan-pepperoni')
const pin = originalPinterestDetails(post)
const pageUrl = `https://getsavor.recipes/blog/${post.slug}/`
const metadata = {
  '@context': 'https://schema.org', '@type': 'Recipe',
  name: recipe.title, description: post.metaDesc, image: post.ogImage,
  author: { '@type': 'Person', name: 'Caleb' }, datePublished: post.date,
  prepTime: 'PT15M',
  recipeYield: recipe.serves, recipeCategory: 'Pizza topping', suitableForDiet: 'https://schema.org/VeganDiet',
  keywords: 'vegan pepperoni recipe, courgette pepperoni, zucchini pepperoni, vegan pizza topping, vegan pepperoni without seitan',
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

export default function VeganPepperoni() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata).replace(/</g, '\\u003c') }} />
      <p><a href="/originals/?series=signature#recipes">Savor Originals</a> · <strong>Signature Recipes · No. 4</strong></p>
      <p><a href="#recipe">Straight to the recipe ↓</a></p>
      <p>This homemade vegan pepperoni turns courgette (zucchini) into a smoky, spicy pizza topping—without seitan, tofu or meat substitutes.</p>
      {recipe.intro.map(text => <p key={text}>{text}</p>)}
      <section id="recipe" className="blaff-recipe-card" aria-labelledby="pepperoni-recipe-title">
        <img className="blaff-recipe-image" src="/blog/vegan-pepperoni.webp" width={post.ogImageWidth} height={post.ogImageHeight} style={{ aspectRatio: '4 / 3', objectPosition: 'center 55%' }} alt={pin.altText} {...pinterestImageAttributes(pin)} decoding="async" />
        <div className="blaff-recipe-content">
          <span className="doc-eyebrow">Signature Recipes · Recipe No. 4</span>
          <h2 id="pepperoni-recipe-title">{recipe.title}</h2>
          <p><em>{recipe.subtitle}</em></p>
          <p><strong>Makes:</strong> {recipe.serves}<br /><strong>Prep:</strong> {recipe.prep} · <strong>Salting:</strong> {recipe.salting} · <strong>Marinating:</strong> {recipe.marinating}<br /><strong>Total:</strong> {recipe.total}</p>
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
      <h2>Keeping &amp; Preparing Ahead</h2>
      {paragraphs(recipe.ahead)}
      <h2>Making a vegan pizza?</h2>
      <p>The courgette pepperoni is vegan; use a vegan pizza base, sauce and dairy-free cheese (or leave the cheese off) for a fully vegan pizza. For more combinations, see our <a href="/blog/vegan-pizza-toppings/">vegan pizza toppings guide</a>.</p>
      <p>More from <a href="/originals/?series=signature#recipes">Signature Recipes</a>: <a href="/blog/hot-smoked-salmon-fennel-dill-vodka/">oven-smoked salmon</a> and <a href="/blog/lemon-brownies-strawberry-tree-jam/">lemon brownies</a>.</p>
    </BlogPostLayout>
  )
}
