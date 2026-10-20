import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'
import './salt-pork-blaff.css'

const post = BLOG_POSTS.find(p => p.slug === 'salt-pork-blaff')

const ingredients = [
  "600 g meaty salt pork, or 600 g fresh skinless pork belly plus 30 g ordinary salt for the homemade option",
  "2 medium green plantains",
  "1 large onion, sliced",
  "4 spring onions, sliced, whites and greens kept separate",
  "5 garlic cloves, chopped",
  "2 carrots, cut into substantial pieces",
  "1 chayote (christophene), peeled, cored and cut into chunks",
  "300 g firm pumpkin or squash, peeled and cut into chunks",
  "250 g white cabbage, cut into wide ribbons",
  "6 sprigs fresh thyme",
  "2 bay leaves",
  "1 whole Scotch bonnet chilli, left intact",
  "2 limes, one for finishing and one cut into wedges",
  "A small handful of parsley, chopped",
  "Freshly ground black pepper",
  "Water, and a little neutral oil if needed for frying"
]
const steps = [
  {
    "name": "Prepare the pork",
    "text": "Use 600 g shop-bought salt pork, desalted according to its packaging, or start a day ahead: rub 600 g fresh skinless pork belly with 30 g ordinary salt, cover and refrigerate at 4°C or below for 24 hours, turning once, then brush off and rinse briefly without splashing. This short salting does not extend the fresh pork use-by date. Do not use nitrite curing salt or saltpetre. Keep any soaking refrigerated and discard soaking water."
  },
  {
    "name": "Simmer until tender",
    "text": "Put the pork in a saucepan, cover generously with fresh water, and add the bay leaves and half the thyme. Bring to the boil, then simmer gently until fully cooked and tender, beginning checks after about an hour; a thick piece may take considerably longer. Keep it covered with water. Follow any cooking directions on the packaging. For a whole cut of pork, check at least 63°C in the centre followed by a three-minute rest; tenderness may require further cooking."
  },
  {
    "name": "Check the broth",
    "text": "Lift out the cooked pork. Taste a cooled spoonful of its cooking liquid. For the vegetable pot, start with about 1 litre of liquid, combining a little pork broth with fresh water until pleasantly savoury. Add more broth gradually only if needed. Very salty cooking liquid may only be useful in small quantities; do not reduce it."
  },
  {
    "name": "Crisp the pork",
    "text": "Once cool enough to handle, remove any tough rind and cut the pork into bite-sized pieces. Pat very dry. Fry in batches in a heavy pan over medium heat, allowing the fat to render and the edges to turn golden and crisp. Add a little oil only if needed. Watch for splattering and set the pork aside."
  },
  {
    "name": "Start the vegetable pot",
    "text": "In a large saucepan, soften the onion and spring-onion whites in a tablespoon of the rendered fat for about 8 minutes. Add the garlic for another minute. Pour in the prepared broth and add the remaining thyme and whole chilli. Keep the chilli intact for a gentler heat and remove it if the broth becomes hot enough for you."
  },
  {
    "name": "Add the plantain and vegetables",
    "text": "Trim the plantains, slit the skin lengthways and peel, then cut into thick rounds. Add them with the carrots and simmer for about 10 minutes. Add the chayote and squash and continue gently for another 10–15 minutes, adding water if needed. Add the cabbage for the final 5–8 minutes. Treat these as checking points: the plantain should be cooked through and the vegetables tender without collapsing."
  },
  {
    "name": "Finish and serve",
    "text": "Remove the thyme stalks, bay and whole chilli. Add lime juice gradually, black pepper, parsley and spring-onion greens. Taste before considering any extra salt. Ladle into bowls and add the crisp pork immediately before serving, with lime wedges alongside."
  }
]
const pageUrl = 'https://getsavor.recipes/blog/salt-pork-blaff/'
const recipeMetadata = {
  '@context': 'https://schema.org', '@type': 'Recipe',
  name: 'Salt pork blaff with green plantain, vegetables & lime',
  description: 'Vegetables and green plantain in a thyme-scented pork broth, finished with lime and crisp pork belly.',
  image: 'https://getsavor.recipes/blog/salt-pork-blaff-closeup.jpg',
  author: { '@type': 'Person', name: 'Caleb' }, datePublished: '2026-10-20',
  recipeYield: '4 servings', keywords: 'salt pork blaff, green plantain, pork belly',
  recipeIngredient: ingredients,
  recipeInstructions: steps.map((step, i) => ({ '@type': 'HowToStep', name: step.name, text: step.text, url: `${pageUrl}#step-${i + 1}`, position: i + 1 })),
  url: pageUrl, mainEntityOfPage: pageUrl,
}


export default function SaltPorkBlaff() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeMetadata).replace(/</g, '\\u003c') }} />
      <p><strong>Back of the Cupboard · No. 1</strong></p>
      <p>A weekly invitation to cook something you might otherwise walk straight past. Starting with the dinner that stayed with me for more than a decade.</p>
      <p><a href="#recipe">Jump to the recipe ↓</a></p>

      <h2>Before there was a spin button</h2>
      <p>Over a decade ago, while I was grinding through long hours in professional kitchens, deciding what to cook at home could feel harder than the cooking itself. The decision fatigue was very real.</p>
      <p>Once a week, we handed the decision to a cookbook. Rifle through the pages, stop at random, and cook whatever we landed on. No exceptions.</p>
      <p>My first go landed on salt pork blaff. Lots of ingredients, a bit of a project, and an absolutely amazing meal. I have forgotten plenty of dinners since then. I never forgot that one.</p>
      <p>That game of recipe roulette became the inspiration for <a href="/potluck/">Potluck</a>. Back of the Cupboard brings back the cooking adventure: occasionally taking on a dish you would never have chosen from your usual rotation.</p>

      <h2>The bits that stayed with me</h2>
      <p>Some meals leave you with a precise set of instructions. This one left me with textures and flavours: salt pork boiled until tender, then fried crisp; a savoury broth carrying plenty of vegetables; plantain, lime, and the pleasure of cooking something completely outside the usual rotation.</p>
      <p>What follows is my interpretation, pieced together from the bits still rattling around in my head. It is how I would bring that dinner back to the table today, rather than a reconstruction of the cookbook page or a definitive regional version.</p>
      <p>I made the salt pork myself from pork belly that first time. You can take that extra step, or buy meaty salt pork and begin with the pot. Both belong here.</p>

      <h2>Start a day ahead: the pork belly option</h2>
      <p>For a short refrigerated salting, rub 600 g fresh, skinless pork belly with 30 g ordinary food-grade salt. Put it in a covered non-reactive container in the fridge at 4°C or below for 24 hours, turning once. Brush off the salt and rinse briefly without splashing, then proceed with the simmer below. This makes freshly salted belly for cooking; it is not a long keeping cure or a substitute for a validated preservation method. Use ordinary salt, not nitrite curing salt or saltpetre.</p>
      <p>Keep the belly within its original use-by date and the normal 3–5 day refrigerated window for fresh pork, including the salting day. Cook it promptly after salting. For shop-bought salt pork, follow its own soaking and cooking instructions instead.</p>

      <section id="recipe" className="blaff-recipe-card" aria-labelledby="blaff-recipe-title">
        <img className="blaff-recipe-image" src="/blog/salt-pork-blaff-closeup.jpg" width="1200" height="800" alt="Salt pork blaff with crisp pork belly, green plantain and vegetables in a golden broth" decoding="async" />
        <div className="blaff-recipe-content">
        <span className="doc-eyebrow">Back of the Cupboard · Recipe No. 1</span>
        <h2 id="blaff-recipe-title">Salt pork blaff with green plantain, vegetables &amp; lime</h2>
        <p>A generous pot of vegetables and plantain in a thyme-scented pork broth, finished with lime and crisp pieces of belly.</p>
        <p><strong>Serves:</strong> 4 generously.<br /><strong>Allow:</strong> roughly 2–3 hours, plus 24 hours if salting your own belly, or any soaking needed for shop-bought pork.</p>
        <div className="blaff-recipe-actions">
          <a href={`savor://create?url=${encodeURIComponent('https://getsavor.recipes/blog/salt-pork-blaff/')}`}>Save to Savor</a>
          <a className="blaff-pinterest" href={`https://www.pinterest.com/pin/create/button/?${new URLSearchParams({ url: 'https://getsavor.recipes/blog/salt-pork-blaff/', media: 'https://getsavor.recipes/blog/salt-pork-blaff-closeup.jpg', description: 'Salt pork blaff with green plantain, vegetables and lime — the dinner that inspired Potluck.' })}`} target="_blank" rel="noopener noreferrer">Save to Pinterest</a>
        </div>
        <h3>Ingredients</h3>
        <ul>{ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
        <h3>Method</h3>
        <ol>{steps.map((step, i) => <li key={step.name} id={`step-${i + 1}`}><strong>{step.name}.</strong> {step.text}</li>)}</ol>
        </div>
      </section>

      <h2>What to put alongside it</h2>
      <p>Coconut rice would be my first choice: something mild to catch the broth, with the plantain already in the pot. Use your usual coconut rice recipe and keep the seasoning restrained until you have tasted the pork broth.</p>
      <p>Firm green cooking bananas are another direction to try in place of the plantain, but their cooking time will need checking separately. Save the very ripe, sweet fruit for another dish.</p>

      <h2>The shopping expedition is part of it</h2>
      <p>Try Caribbean grocers, international food shops, and larger fruit-and-vegetable markets for salt pork, green plantains and christophene. Ask for meaty cooking salt pork rather than a piece that is almost entirely fat. Chayote may be labelled christophene or chocho.</p>
      <p>This is a dinner to give some time to. Buy the unfamiliar ingredient, clear a bit of space, and enjoy having something different on the stove.</p>

      <h2>A note on keeping leftovers</h2>
      <p>Refrigerate within two hours, dividing the broth and vegetables into shallow containers so they cool promptly. Use within 3–4 days and reheat to 74°C throughout. Keep any remaining crisp pork separate for texture. Salt pork does not make the finished vegetable dish shelf-stable.</p>
      <p>Cooking and storage guidance: <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures">FoodSafety.gov minimum cooking temperatures</a> and <a href="https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts">cold food storage guidance</a>.</p>

      <div className="blog-post-callout">
        <div className="blog-post-callout-title">Your turn to play recipe roulette</div>
        <p>A random cookbook page gave me a meal I remembered for years. Potluck is the browser version of that same invitation: let someone else make the decision, then get cooking.</p>
        <a className="blog-post-callout-link" href="/potluck/">Let Potluck choose your next dinner →</a>
      </div>
    </BlogPostLayout>
  )
}
