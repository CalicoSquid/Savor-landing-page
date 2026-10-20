import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'

const post = BLOG_POSTS.find(p => p.slug === 'salt-pork-blaff')

export default function SaltPorkBlaff() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <p><strong>Back of the Cupboard · No. 1</strong></p>
      <p>A weekly invitation to cook something you might otherwise walk straight past. Starting with the dinner that stayed with me for more than a decade.</p>
      <p><a href="#recipe">Jump to the recipe in development ↓</a></p>

      <h2>Before there was a spin button</h2>
      <p>Over a decade ago, while I was grinding through long hours in professional kitchens, deciding what to cook at home could feel harder than the cooking itself. The decision fatigue was very real.</p>
      <p>Once a week, we handed the decision to a cookbook. Rifle through the pages, stop at random, and cook whatever we landed on. No exceptions.</p>
      <p>My first go landed on salt pork blaff. Lots of ingredients, a bit of a project, and an absolutely amazing meal. I have forgotten plenty of dinners since then. I never forgot that one.</p>
      <p>That game of recipe roulette became the inspiration for <a href="/potluck/">Potluck</a>. Back of the Cupboard brings back the cooking adventure: occasionally taking on a dish you would never have chosen from your usual rotation.</p>

      <figure className="blog-post-figure">
        <img src="/blog/salt-pork-blaff.jpg" width="1200" height="630" alt="AI illustration of a bowl of broth with browned pork, carrots, spring onions, thyme and lime" decoding="async" />
        <figcaption>AI-generated illustration of the idea, not a photograph of this recipe. The finished dish should include the plantain and generous vegetables described below.</figcaption>
      </figure>

      <h2>Cooking from a memory</h2>
      <p>I no longer have the original recipe. What I remember is boiling the salt pork, frying it until crisp, and using the cooking broth as the base, with plenty of vegetables and plantain or green bananas.</p>
      <p>This is a new version built around that memory, rather than a reproduction of the lost cookbook recipe or a claim to a definitive regional blaff. The aim is a savoury, aromatic broth, vegetables with some body, lime at the finish, and crisp pork added at the table.</p>

      <section id="recipe">
        <h2>Salt pork blaff with green plantain, vegetables &amp; lime</h2>
        <div className="blog-post-callout">
          <div className="blog-post-callout-title">Recipe in development</div>
          <p>This original version has not yet been kitchen-tested. Quantities and timings are starting points, particularly because salt pork varies considerably in saltiness, fat content and thickness.</p>
          <p><strong>Serves:</strong> approximately 4 generously.<br /><strong>Allow:</strong> roughly 2–3 hours, plus any refrigerated soaking required by your salt pork.</p>
        </div>
        <h3>Ingredients</h3>
        <ul>
          <li>600 g meaty salt pork, preferably belly with a good balance of meat and fat</li>
          <li>2 medium green plantains</li>
          <li>1 large onion, sliced</li>
          <li>4 spring onions, sliced, whites and greens kept separate</li>
          <li>5 garlic cloves, chopped</li>
          <li>2 carrots, cut into substantial pieces</li>
          <li>1 chayote (christophene), peeled, cored and cut into chunks</li>
          <li>300 g firm pumpkin or squash, peeled and cut into chunks</li>
          <li>250 g white cabbage, cut into wide ribbons</li>
          <li>6 sprigs fresh thyme</li>
          <li>2 bay leaves</li>
          <li>1 whole Scotch bonnet chilli, left intact</li>
          <li>2 limes, one for finishing and one cut into wedges</li>
          <li>A small handful of parsley, chopped</li>
          <li>Freshly ground black pepper</li>
          <li>Water, and a little neutral oil if needed for frying</li>
        </ul>
        <h3>Method</h3>
        <ol>
          <li id="step-1"><strong>Prepare the salt pork.</strong> Follow the product instructions for desalting and preparation. Keep any soaking in the fridge and discard the soaking water. This recipe starts with commercially prepared salt pork; it is not a method for curing fresh pork.</li>
          <li id="step-2"><strong>Simmer until tender.</strong> Put the pork in a saucepan, cover generously with fresh water, and add the bay leaves and half the thyme. Bring to the boil, then simmer gently until fully cooked and tender, beginning checks after about an hour; a thick piece may take considerably longer. Keep it covered with water. Follow any cooking directions on the packaging. For a whole cut of pork, check at least 63°C in the centre followed by a three-minute rest; tenderness may require further cooking.</li>
          <li id="step-3"><strong>Check the broth.</strong> Lift out the cooked pork. Taste a cooled spoonful of its cooking liquid. For the vegetable pot, start with about 1 litre of liquid, combining a little pork broth with fresh water until pleasantly savoury. Add more broth gradually only if needed. Very salty cooking liquid may only be useful in small quantities; do not reduce it.</li>
          <li id="step-4"><strong>Crisp the pork.</strong> Once cool enough to handle, remove any tough rind and cut the pork into bite-sized pieces. Pat very dry. Fry in batches in a heavy pan over medium heat, allowing the fat to render and the edges to turn golden and crisp. Add a little oil only if needed. Watch for splattering and set the pork aside.</li>
          <li id="step-5"><strong>Start the vegetable pot.</strong> In a large saucepan, soften the onion and spring-onion whites in a tablespoon of the rendered fat for about 8 minutes. Add the garlic for another minute. Pour in the prepared broth and add the remaining thyme and whole chilli. Keep the chilli intact for a gentler heat and remove it if the broth becomes hot enough for you.</li>
          <li id="step-6"><strong>Add the plantain and vegetables.</strong> Trim the plantains, slit the skin lengthways and peel, then cut into thick rounds. Add them with the carrots and simmer for about 10 minutes. Add the chayote and squash and continue gently for another 10–15 minutes, adding water if needed. Add the cabbage for the final 5–8 minutes. Treat these as checking points: the plantain should be cooked through and the vegetables tender without collapsing.</li>
          <li id="step-7"><strong>Finish and serve.</strong> Remove the thyme stalks, bay and whole chilli. Add lime juice gradually, black pepper, parsley and spring-onion greens. Taste before considering any extra salt. Ladle into bowls and add the crisp pork immediately before serving, with lime wedges alongside.</li>
        </ol>
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
