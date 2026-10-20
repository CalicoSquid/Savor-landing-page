import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'
import './salt-pork-blaff.css'

const post = BLOG_POSTS.find(item => item.slug === 'one-pan-smoky-tomato-rice')
const pageUrl = `https://getsavor.recipes/blog/${post.slug}/`
const imageUrl = post.ogImage
const ingredients = [
  '3 tbsp olive oil, divided between the rice and eggs',
  '1 medium onion, finely chopped',
  '3 garlic cloves, finely chopped',
  '2 tsp smoked paprika',
  '1/2 tsp ground cumin',
  '1/4 tsp chilli flakes, optional',
  '250 g uncooked white long-grain rice, rinsed and drained well (not brown or easy-cook rice)',
  '1 x 400 g tin chopped tomatoes, including the juice',
  '1 x 400 g tin chickpeas, drained and rinsed (about 240 g drained)',
  '350 ml hot vegetable stock, plus a little extra hot water if needed',
  '100 g baby spinach',
  '4 eggs',
  '1/2 lemon, cut into wedges',
  'Salt and freshly ground black pepper, to taste',
  'A small handful of chopped parsley, optional',
]
const steps = [
  {
    name: 'Soften the onion',
    text: 'Use a wide, deep non-stick sauté pan, about 28 cm across, with a close-fitting lid. Heat 2 tablespoons of the oil over a medium heat. Add the onion and cook for 5 minutes, stirring, until softened. Stir in the garlic, smoked paprika, cumin and optional chilli flakes for 30 seconds. Keep the spices moving so they do not catch.',
  },
  {
    name: 'Build the tomato base',
    text: 'Add the tomatoes and their juice. Simmer uncovered for 4–5 minutes, stirring occasionally, until slightly thickened. Stir in the drained rice and chickpeas, then pour in the hot stock. Scrape the base gently to release any stuck onion. Season lightly, remembering that stock already contains salt.',
  },
  {
    name: 'Cook the rice',
    text: 'Bring to a gentle simmer, cover and turn the heat down low. Cook for 18–22 minutes without repeatedly lifting the lid or stirring. Check the rice: it should be tender and most of the liquid absorbed. If the grains are still firm and the pan is dry, add 2–3 tablespoons of hot water, cover and cook for another 3–5 minutes. If the rice is tender but wet, cook uncovered briefly to let excess liquid evaporate.',
  },
  {
    name: 'Add the greens and rest',
    text: 'Scatter the spinach over the rice, replace the lid and take the pan off the heat. Leave for 5 minutes, then gently fold in the wilted spinach and loosen the rice with a fork. Taste and adjust the salt and pepper. Spoon into warmed serving bowls and cover loosely while you cook the eggs.',
  },
  {
    name: 'Fry the eggs in the same pan',
    text: 'Wipe any remaining tomato from the pan with kitchen paper held in tongs. Add the remaining tablespoon of oil and return to a medium-high heat. Crack in the eggs, in batches if needed. Fry until the edges are crisp and the whites set, about 3–4 minutes. Turn the heat down if they brown too quickly. Flip carefully and cook a little longer until the yolks are firm, or use pasteurised eggs if you prefer a softer finish. The rice only waits while the eggs cook; serve promptly.',
  },
  {
    name: 'Finish and eat',
    text: 'Top each bowl of rice with an egg. Add parsley if using, black pepper and a squeeze of lemon. Take the bowls straight to the table while the egg edges are still crisp.',
  },
]
const recipe = {
  '@context': 'https://schema.org',
  '@type': 'Recipe',
  name: 'One-pan smoky tomato rice with chickpeas and crispy eggs',
  description: 'Smoky tomato rice with chickpeas, wilted spinach and crisp-edged fried eggs, cooked in one pan with cupboard staples.',
  image: imageUrl,
  author: { '@type': 'Person', name: 'Caleb', url: 'https://getsavor.recipes/about/' },
  datePublished: post.date,
  recipeYield: '4 servings',
  recipeCategory: 'Dinner',
  keywords: 'one-pan tomato rice, chickpeas and eggs, cupboard cooking, Dinner on Autopilot',
  prepTime: 'PT10M',
  cookTime: 'PT40M',
  totalTime: 'PT50M',
  recipeIngredient: ingredients,
  recipeInstructions: steps.map((step, i) => ({ '@type': 'HowToStep', ...step, position: i + 1, url: `${pageUrl}#step-${i + 1}` })),
  url: pageUrl,
  mainEntityOfPage: pageUrl,
}
const pinterestParams = new URLSearchParams({ url: pageUrl, media: imageUrl, description: recipe.name })

export default function SmokyTomatoRice() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipe).replace(/</g, '\\u003c') }} />
      <p><strong>Dinner on Autopilot · No. 1</strong></p>
      <p>Some nights you want a cooking adventure. Other nights you want the cupboard to sort itself out and produce dinner. This is for the second kind.</p>
      <p><a href="#recipe">Skip the pep talk and get cooking ↓</a></p>
      <p>A tin of tomatoes, a tin of chickpeas and a handful of rice do most of the work. Smoked paprika gives it some depth; a fried egg brings the crispy edges. The spinach counts as getting something green involved.</p>
      <p>Dinner on Autopilot is about dependable formats built around kitchen essentials, with room for whatever needs using. This one uses a single pan: cook the rice, spoon it into bowls, then fry the eggs in that same pan. No hidden second frying pan in the small print.</p>

      <section id="recipe" className="blaff-recipe-card" aria-labelledby="autopilot-recipe-title">
        <img className="blaff-recipe-image" src="/blog/smoky-tomato-rice.jpg" width="1200" height="800" alt={post.ogImageAlt} decoding="async" />
        <div className="blaff-recipe-content">
          <span className="doc-eyebrow">Dinner on Autopilot · Recipe No. 1</span>
          <h2 id="autopilot-recipe-title">Smoky tomato rice with chickpeas &amp; crispy eggs</h2>
          <p>Soft tomato rice, plenty of chickpeas, greens and a crisp-edged egg. A generous squeeze of lemon at the end wakes the whole thing up.</p>
          <p><strong>Serves:</strong> 4.<br /><strong>Prep:</strong> 10 minutes. <strong>Cook:</strong> about 40 minutes.<br /><strong>Equipment:</strong> a deep 28 cm non-stick sauté pan with a lid.</p>
          <div className="blaff-recipe-actions">
            <a href={`savor://create?url=${encodeURIComponent(pageUrl)}`}>Save to Savor</a>
            <a className="blaff-pinterest" href={`https://www.pinterest.com/pin/create/button/?${pinterestParams}`} target="_blank" rel="noopener noreferrer">Save to Pinterest</a>
          </div>
          <h3>Ingredients</h3>
          <ul>{ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
          <h3>Method</h3>
          <ol>{steps.map((step, i) => <li key={step.name} id={`step-${i + 1}`}><strong>{step.name}.</strong> {step.text}</li>)}</ol>
        </div>
      </section>

      <h2>The bits that make it work</h2>
      <p><strong>Use the rice listed.</strong> Brown rice takes longer and needs a different amount of liquid; this is not a straight swap. A tight lid and a gentle heat matter more than watching the clock to the second. Pan width, rice brands and the juiciness of the tomatoes all affect the finish, so use the checks in the method.</p>
      <p><strong>Let the tomatoes cook down first.</strong> A few minutes uncovered gives you a thicker base. Keep the paprika away from fierce dry heat so it tastes smoky rather than burnt.</p>
      <p><strong>The eggs go last.</strong> Frying them on top of the rice would steam them. Moving the rice to the bowls first gives you proper fried edges without adding another pan to the washing-up.</p>

      <h2>Use what you have</h2>
      <ul>
        <li><strong>No chickpeas?</strong> A drained 400 g tin of butter beans or cannellini beans works here. Fold softer beans through gently.</li>
        <li><strong>No fresh spinach?</strong> Defrost about 100 g frozen spinach, squeeze out excess water and stir it through when checking the rice near the end. Heat through thoroughly before resting.</li>
        <li><strong>Half a pepper hanging around?</strong> Dice it and soften it with the onion.</li>
        <li><strong>No smoked paprika?</strong> Sweet paprika still makes a good tomato rice; it just will not have the same smoky flavour.</li>
        <li><strong>Skipping the eggs?</strong> Add a second tin of drained chickpeas with the first for a more substantial plant-based version, and use vegetable stock.</li>
      </ul>
      <p>For a different missing ingredient, the <a href="/tools/ingredient-substitutions/">ingredient substitution finder</a> is there to help. Keep the rice type and basic liquid balance intact.</p>

      <h2>Tomorrow’s lunch</h2>
      <p>Set aside any spare rice before topping it with eggs. Cool it quickly in shallow portions, ideally within one hour, then refrigerate and use within 24 hours. Reheat only once until steaming hot throughout, adding a splash of water if needed. Cook a fresh egg when serving rather than saving the fried topping.</p>
      <p>That follows the <a href="https://www.food.gov.uk/safety-hygiene/home-food-fact-checker">Food Standards Agency’s cooked-rice guidance</a>.</p>

      <div className="blog-post-callout">
        <div className="blog-post-callout-title">Another evening, another level of effort</div>
        <p>Let <a href="/potluck/">Potluck pick a different dinner</a> when the decision is the difficult bit. For a slower cooking project, try <a href="/blog/salt-pork-blaff/">Salt Pork Blaff, the meal that started it all</a>.</p>
      </div>
    </BlogPostLayout>
  )
}
