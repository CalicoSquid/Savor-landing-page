import PinterestSave from '../../components/PinterestSave'
import { originalPinterestDetails, pinterestImageAttributes } from '../../lib/pinterest'
import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'
import { hotSmokedSalmon as recipe } from '../../data/hotSmokedSalmon'
import './salt-pork-blaff.css'

const post = BLOG_POSTS.find(p => p.slug === 'hot-smoked-salmon-fennel-dill-vodka')
const pin = originalPinterestDetails(post)
const pageUrl = `https://getsavor.recipes/blog/${post.slug}/`
const recipeMetadata = {
  '@context': 'https://schema.org', '@type': 'Recipe',
  name: post.title, description: post.metaDesc, image: post.ogImage,
  author: { '@type': 'Person', name: 'Caleb' }, datePublished: post.date,
  prepTime: 'PT15M', cookTime: 'PT40M', totalTime: 'PT6H55M',
  recipeYield: '6–8 servings', recipeCategory: 'Main course',
  keywords: 'hot-smoked salmon, oven-smoked salmon, fennel dill vodka, Signature Recipes',
  recipeIngredient: recipe.ingredients,
  recipeInstructions: recipe.steps.map((step, i) => ({ '@type': 'HowToStep', ...step, url: `${pageUrl}#step-${i + 1}`, position: i + 1 })),
  url: pageUrl, mainEntityOfPage: pageUrl,
}

export default function HotSmokedSalmon() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeMetadata).replace(/</g, '\\u003c') }} />
      <p><a href="/originals/?series=signature#recipes">Savor Originals</a> · <strong>Signature Recipes · No. 1</strong></p>
      <p><a href="#recipe">Straight to the recipe ↓</a></p>
      {recipe.intro.map(text => <p key={text}>{text}</p>)}

      <section id="recipe" className="blaff-recipe-card" aria-labelledby="salmon-recipe-title">
        <img className="blaff-recipe-image" src="/blog/oven-smoked-salmon-fennel-dill-vodka.webp" width={post.ogImageWidth} height={post.ogImageHeight} style={{ aspectRatio: '4 / 3', objectPosition: 'center 52%' }} alt={pin.altText} {...pinterestImageAttributes(pin)} decoding="async" />
        <div className="blaff-recipe-content">
          <span className="doc-eyebrow">Signature Recipes · Recipe No. 1</span>
          <h2 id="salmon-recipe-title">{post.title}</h2>
          <p>A short cure, a handful of woodchips, and absolutely no smoker required.</p>
          <p><strong>Serves:</strong> 6–8, depending on what you’re doing with it<br /><strong>Prep:</strong> 15 minutes · <strong>Cure:</strong> 5–6 hours in the fridge<br /><strong>Cook:</strong> approximately 30–40 minutes, until the centre reaches 63°C (145°F)<br /><strong>Total:</strong> approximately 5¾–7 hours, plus any extra fridge-drying time</p>
          <div className="blaff-recipe-actions">
            <a href={`savor://create?url=${encodeURIComponent(pageUrl)}`}>Save to Savor</a>
            <PinterestSave details={pin} />
          </div>
          <h3>Ingredients</h3>
          <ul>{recipe.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
          <h3>Equipment</h3>
          <p>A heavy metal roasting tray specifically safe for both hob and oven, a metal rack that keeps the fish above the chips, foil and a food thermometer. Use food-grade smoking woodchips suitable for your equipment, following the supplier’s quantity guidance.</p>
          <p>Check that your oven manufacturer permits indoor smoking before using this method. Avoid non-stick coatings, glass trays and improvised setups. Keep the tray covered and ventilate the kitchen.</p>
          <h3>Method</h3>
          <ol>{recipe.steps.map((step, i) => <li key={step.name} id={`step-${i + 1}`}><strong>{step.name}.</strong>{step.text.split(/\n\s*\n/).map(text => <p key={text}>{text}</p>)}</li>)}</ol>
        </div>
      </section>

      <h2>Cook Like a Pro</h2>
      {recipe.notes.map(note => <section key={note.name}><h3>{note.name}</h3>{note.text.split(/\n\s*\n/).map(text => <p key={text}>{text}</p>)}</section>)}
      <h2>Make ahead &amp; storage</h2>
      <p>{recipe.ahead}</p>
      <p>Refrigerate within two hours of cooking. The 63°C (145°F) centre-temperature guidance follows <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures">FoodSafety.gov’s cooking-temperature chart</a>.</p>
      <p>Browse more <a href="/originals/">Savor Originals</a>, or try <a href="/blog/sticky-soy-braised-pork-neck-shiitake/">sticky soy-braised pork neck with shiitake mushrooms</a> for another slow-afternoon project.</p>
    </BlogPostLayout>
  )
}
