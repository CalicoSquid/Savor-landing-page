import PinterestSave from '../../components/PinterestSave'
import { originalPinterestDetails, pinterestImageAttributes } from '../../lib/pinterest'
import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'
import './salt-pork-blaff.css'

const post = BLOG_POSTS.find(p => p.slug === 'paprika-chicken-crispy-potatoes')
const pin = originalPinterestDetails(post)
const pageUrl = `https://getsavor.recipes/blog/${post.slug}/`
const ingredients = [
  '4 bone-in, skin-on chicken thighs (about 800 g)',
  '800 g potatoes',
  '2 medium onions',
  '5 garlic cloves, skins on',
  '3 tbsp olive oil or vegetable oil',
  '2 tsp smoked or sweet paprika',
  '1 tsp dried oregano or mixed herbs',
  '1 tsp salt, plus extra to taste',
  '½ tsp black pepper',
  'Optional finish: a squeeze of lemon, a splash of vinegar or chopped parsley',
]
const steps = [
  { name: 'Get the oven hot', text: 'Preheat the oven to 220°C (200°C fan / 425°F). Put a large, sturdy metal roasting tray in the oven while it heats.' },
  { name: 'Prepare the vegetables', text: 'Cut the potatoes into wedges about 2 cm thick, leaving the skins on. Peel the onions and cut each into 6–8 chunky wedges. Leave the garlic cloves whole, with their skins on.' },
  { name: 'Season everything', text: 'Mix the oil, paprika, herbs, salt and pepper in a large bowl. Toss the potatoes and onions in it, then transfer the vegetables to a clean bowl, leaving a little seasoned oil behind. Rub the chicken all over with the remaining seasoning. Wash your hands and any utensils that have touched raw chicken.' },
  { name: 'Start the potatoes', text: 'Carefully remove the hot tray. Spread the potatoes and onions in a single layer; they should sizzle as they hit the metal. Leave space between the pieces, using two trays if needed. Roast for 10 minutes.' },
  { name: 'Add the chicken', text: 'Turn the potatoes, then nestle the chicken thighs between the vegetables, skin-side up. Scatter in the garlic cloves. Roast for another 30–35 minutes, until the potatoes are browned and tender and the chicken reaches at least 74°C / 165°F in the thickest part without touching bone. Give it another 5 minutes if it needs more colour or time to cook through.' },
  { name: 'Finish and serve', text: 'Rest the chicken for 5 minutes. Squeeze the soft garlic from its skins and mix into the pan juices, then spoon those juices over the chicken and potatoes. Finish with lemon, vinegar or parsley if you have them. Serve straight from the tray.' },
]
const recipeMetadata = {
  '@context': 'https://schema.org', '@type': 'Recipe',
  name: pin.title, description: post.metaDesc, image: post.ogImage,
  author: { '@type': 'Person', name: 'Caleb' }, datePublished: post.date,
  prepTime: 'PT10M', cookTime: 'PT45M', totalTime: 'PT55M',
  recipeYield: '4 servings', recipeCategory: 'Dinner',
  keywords: 'paprika chicken, crispy potatoes, chicken traybake, one-tray dinner, easy chicken thighs',
  recipeIngredient: ingredients,
  recipeInstructions: steps.map((step, i) => ({ '@type': 'HowToStep', ...step, url: `${pageUrl}#step-${i + 1}`, position: i + 1 })),
  url: pageUrl, mainEntityOfPage: pageUrl,
}

export default function PaprikaChicken() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeMetadata).replace(/</g, '\\u003c') }} />
      <p><a href="/originals/">Savor Originals</a> · <strong>Dinner on Autopilot · No. 2</strong></p>
      <p>For the evenings when you want a proper dinner but would rather the oven handled most of the cooking. Chicken, potatoes, onions and garlic get a paprika coating, then roast together until golden. Ten minutes of effort. The oven can take the credit; you can take the crispy bits.</p>
      <p>The little trick is a hot metal tray and enough space for the potatoes to roast. Give them a ten-minute head start, add the chicken, and let heat and time get on with it.</p>
      <p><a href="#recipe">Get straight to the recipe ↓</a></p>
      <section id="recipe" className="blaff-recipe-card" aria-labelledby="chicken-recipe-title">
        <img className="blaff-recipe-image" src="/blog/paprika-chicken-crispy-potatoes.jpg" width={post.ogImageWidth} height={post.ogImageHeight} alt={pin.altText} {...pinterestImageAttributes(pin)} decoding="async" />
        <div className="blaff-recipe-content">
          <span className="doc-eyebrow">Dinner on Autopilot · Recipe No. 2</span>
          <h2 id="chicken-recipe-title">Paprika chicken &amp; crispy potatoes</h2>
          <p>Golden chicken, crispy-edged potatoes, sweet onions and soft roasted garlic. A proper dinner with barely any washing up.</p>
          <p><strong>Serves:</strong> 4 · <strong>Difficulty:</strong> Easy<br /><strong>Prep:</strong> 10 minutes · <strong>Cook:</strong> 40–45 minutes<br /><strong>Total:</strong> 50–55 minutes, plus 5 minutes resting. Allow extra time for the oven to heat if needed.</p>
          <div className="blaff-recipe-actions">
            <a href={`savor://create?url=${encodeURIComponent(pageUrl)}`}>Save to Savor</a>
            <PinterestSave details={pin} />
          </div>
          <h3>Ingredients</h3>
          <ul>{ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
          <h3>Method</h3>
          <ol>{steps.map((step, i) => <li key={step.name} id={`step-${i + 1}`}><strong>{step.name}.</strong> {step.text}</li>)}</ol>
        </div>
      </section>
      <h2>The little trick: start with a hot tray</h2>
      <p>Preheated metal gives the potatoes an immediate blast of heat. Space lets moisture escape, so the edges brown instead of steaming. If the tray is crowded, use two. Dinner on Autopilot still needs somewhere to park.</p>
      <h2>Autopilot swaps</h2>
      <ul>
        <li><strong>Chicken:</strong> drumsticks work too, as pictured, but may need longer. Boneless pieces cook faster: add them later and check the same internal temperature.</li>
        <li><strong>Vegetables:</strong> swap potatoes for sweet potatoes, carrots or squash, checking softer vegetables earlier. Add extra carrots at the start; peppers or courgettes can go in for the last 20 minutes.</li>
        <li><strong>Seasoning:</strong> sweet paprika is fine if you have no smoked. Try thyme, rosemary or mixed herbs instead of oregano, and ½ tsp garlic powder in place of fresh garlic.</li>
      </ul>
      <h2>Make it your own</h2>
      <p>For a sticky finish, brush the chicken with a teaspoon of honey mixed with a little mustard during the final 10 minutes. For something brighter, add lemon wedges to the tray and finish with extra oregano. Or leave it alone. Crispy chicken and roasted garlic have very little to prove.</p>
      <p><strong>The Savor tip:</strong> learn what enough space, heat and time look like, and this traybake becomes a useful template for whatever chicken and vegetables you have.</p>
      <p>Another low-effort dinner? Try <a href="/blog/one-pan-smoky-tomato-rice/">smoky tomato rice with chickpeas and crispy eggs</a>, or browse all <a href="/originals/">Savor Originals</a>.</p>
    </BlogPostLayout>
  )
}
