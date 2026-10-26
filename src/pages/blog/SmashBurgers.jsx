import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'
import './salt-pork-blaff.css'
import './smash-burgers.css'

const post = BLOG_POSTS.find(p => p.slug === 'smash-burgers-pickle-mustard-sauce')
const pageUrl = `https://getsavor.recipes/blog/${post.slug}/`
const originalUrl = 'https://ironkitcheninc.com/pages/recipes/classic-smash-burgers'
const themeUrl = 'https://ironkitcheninc.com/pages/iron-kitchen-x-savor'
const ingredients = [
  '500 g beef mince, about 20% fat, kept cold',
  '4 soft burger buns, split',
  '8 slices burger cheese or American-style cheese',
  '15 g butter, softened, for the buns',
  'Salt and freshly ground black pepper',
  '3 tbsp mayonnaise',
  '2 tsp yellow mustard, plus more to taste',
  '2 tbsp finely chopped pickled gherkins, plus 1–2 tsp brine from the jar',
  'Optional extras: sliced pickles, finely chopped onion or shredded lettuce',
  'A little neutral oil, only if your cooking surface needs it',
]
const steps = [
  { name: 'Mix the quick sauce', text: 'Stir together the mayonnaise, mustard and chopped gherkins. Add 1 tsp pickle brine, then taste before adding more. Aim for tangy and spoonable, rather than runny. Set aside while you prepare the burgers.' },
  { name: 'Portion the beef', text: 'Split the cold mince into eight portions, about 60–65 g each. Gently gather them into rough balls; do not knead the meat or mix salt through it. Keep chilled until the pan is ready. Have the cheese, buns and a clean serving plate nearby.' },
  { name: 'Toast the buns and heat the pan', text: 'Lightly butter the cut faces of the buns and toast them in a heavy frying pan or on a flat griddle until golden. Set aside. Bring the cooking surface up to a high heat, using a thin wipe of neutral oil if needed. Cast iron or a sturdy uncoated metal griddle works well for this method.' },
  { name: 'Smash once, then leave it', text: 'Put two beef balls well apart on the hot surface. Immediately flatten each firmly with a flat burger press or sturdy metal spatula, using a small piece of baking parchment between the tool and meat if it sticks, then removing the paper. Make the patties thin, with ragged edges, and a little wider than the buns. Season the exposed surface with salt and pepper. Cook undisturbed for about 2 minutes, until the underside has a deep brown crust.' },
  { name: 'Scrape, flip and melt', text: 'Slide a sturdy metal turner firmly underneath each patty so the crust comes with it. Turn over, top each with cheese and cook for roughly another minute, or as long as needed to reach 71°C / 160°F in the centre. Insert an instant-read thermometer sideways into the thin patty. Stack the two cooked patties and place in a bun. Repeat in batches, allowing the pan to recover its heat. Wash or change utensils that touched raw beef before handling the finished burgers.' },
  { name: 'Sauce and serve', text: 'Spread pickle–mustard sauce inside the buns and add any extra pickles, onion or lettuce you fancy. Serve the double burgers as each batch is ready. A bowl of crisps, bagged salad or slaw is perfectly respectable alongside. Dinner on Autopilot does not require a second cooking project.' },
]
const recipeMetadata = {
  '@context': 'https://schema.org', '@type': 'Recipe',
  name: post.title, description: post.metaDesc,
  image: { '@type': 'ImageObject', url: post.ogImage, contentUrl: post.ogImage, width: 1440, height: 810, creditText: 'Iron Kitchen Inc.', creator: { '@type': 'Organization', name: 'Iron Kitchen Inc.', url: 'https://ironkitcheninc.com/' } },
  author: { '@type': 'Person', name: 'Caleb' }, datePublished: post.date,
  isBasedOn: { '@type': 'Recipe', name: 'Classic Smash Burgers', url: originalUrl, author: { '@type': 'Organization', name: 'Iron Kitchen Inc.' } },
  prepTime: 'PT10M', cookTime: 'PT20M', totalTime: 'PT30M',
  recipeYield: '4 double burgers', recipeCategory: 'Dinner', recipeCuisine: 'American-inspired',
  keywords: 'easy smash burgers, double smash burger, pickle mustard burger sauce, Iron Kitchen, Dinner on Autopilot',
  recipeIngredient: ingredients,
  recipeInstructions: steps.map((step, i) => ({ '@type': 'HowToStep', ...step, url: `${pageUrl}#step-${i + 1}`, position: i + 1 })),
  url: pageUrl, mainEntityOfPage: pageUrl,
}

export default function SmashBurgers() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeMetadata).replace(/</g, '\\u003c') }} />
      <p><a href="/originals/">Savor Originals</a> · <strong>Dinner on Autopilot · No. 3</strong></p>
      <p className="smash-collab-credit">From our <a href="/iron-kitchen/">Savor × Iron Kitchen collaboration</a>. Adapted from <a href={originalUrl} target="_blank" rel="noopener noreferrer">Iron Kitchen’s Classic Smash Burgers</a>, with a quick pickle–mustard sauce from Savor.</p>
      <p>Burger night does not need an ingredients list longer than the takeaway menu. We have taken Iron Kitchen’s hot-pan approach, gone for two thin patties per bun, and put the pickle jar to work in a tangy, three-ingredient sauce. The brine gets a job. You get dinner.</p>
      <p><a href="#recipe">Straight to the recipe ↓</a></p>

      <section id="recipe" className="blaff-recipe-card" aria-labelledby="smash-recipe-title">
        <figure className="smash-recipe-figure">
          <img className="blaff-recipe-image smash-recipe-image" src="/blog/iron-kitchen-smash-burgers.webp" width="1440" height="810" alt={post.ogImageAlt} decoding="async" />
          <figcaption>Photo: <a href={originalUrl} target="_blank" rel="noopener noreferrer">Iron Kitchen Inc.</a> Their classic burger is pictured; the pickle–mustard sauce below is Savor’s addition.</figcaption>
        </figure>
        <div className="blaff-recipe-content">
          <span className="doc-eyebrow">Dinner on Autopilot · Recipe No. 3</span>
          <h2 id="smash-recipe-title">Smash burgers with quick pickle–mustard sauce</h2>
          <p>Two thin beef patties, plenty of browned edges, melted cheese and a sauce you can mix while the pan heats.</p>
          <p><strong>Makes:</strong> 4 double burgers · <strong>Difficulty:</strong> Easy<br /><strong>Prep:</strong> 10 minutes · <strong>Cook:</strong> 15–20 minutes in batches<br /><strong>Total:</strong> about 25–30 minutes, depending on pan size.</p>
          <div className="blaff-recipe-actions">
            <a href={`savor://create?url=${encodeURIComponent(pageUrl)}`}>Save to Savor</a>
            <a className="blaff-pinterest" href={`https://www.pinterest.com/pin/create/button/?${new URLSearchParams({ url: pageUrl, media: post.ogImage, description: `${post.title} — adapted from Iron Kitchen Inc.; photo by Iron Kitchen Inc.` })}`} target="_blank" rel="noopener noreferrer">Save to Pinterest</a>
          </div>
          <h3>Ingredients</h3>
          <ul>{ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
          <h3>Method</h3>
          <ol>{steps.map((step, i) => <li key={step.name} id={`step-${i + 1}`}><strong>{step.name}.</strong> {step.text}</li>)}</ol>
        </div>
      </section>

      <h2>The Little Trick: smash early, then leave it alone</h2>
      <p>The first press spreads the raw beef across the hot metal, giving you more surface to brown. Once it is cooking, stop pressing and let that crust form. When you flip, scrape underneath rather than peeling the burger away and leaving the best bit in the pan. It is a smash burger, not a stress ball.</p>

      <h2>Autopilot swaps</h2>
      <p><strong>No American-style cheese?</strong> Thin cheddar slices work; allow a little longer to melt. <strong>No mayonnaise?</strong> Mustard and sliced pickles still make a good burger. <strong>No burger press?</strong> A sturdy, flat metal spatula can do the job. <strong>Small pan?</strong> Cook fewer patties at once, rather than crowding them and losing the heat.</p>

      <aside className="smash-partner-note" aria-labelledby="smash-partner-title">
        <span className="doc-eyebrow">Savor × Iron Kitchen Inc.</span>
        <h2 id="smash-partner-title">Good tools. A free theme. A very decent burger.</h2>
        <p>Iron Kitchen makes tools for cooks who put them to work, including presses for exactly this sort of dinner. Their classic recipe is where this one started. Our contribution is the pickle-jar sauce and a place to keep the recipe for next time.</p>
        <p>Already using Savor on Android? Visit IKI’s Savor page to claim the free Iron Kitchen theme. New to the app? Their page explains how to get started.</p>
        <div className="smash-partner-links">
          <a href={themeUrl} target="_blank" rel="noopener noreferrer">Get the free IKI Savor theme ↗</a>
          <a href="/iron-kitchen/">Meet Savor × Iron Kitchen →</a>
          <a href={originalUrl} target="_blank" rel="noopener noreferrer">Cook IKI’s original recipe ↗</a>
        </div>
      </aside>
      <p className="smash-source-note">Ground beef cooking guidance: <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures" target="_blank" rel="noopener noreferrer">FoodSafety.gov</a>. Temperature, rather than colour alone, is the check that matters.</p>
      <p>More easy dinners: <a href="/blog/paprika-chicken-crispy-potatoes/">paprika chicken and crispy potatoes</a>, or browse all <a href="/originals/">Savor Originals</a>.</p>
    </BlogPostLayout>
  )
}
