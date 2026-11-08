import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'

const post = BLOG_POSTS.find(p => p.slug === 'vegan-pizza-toppings')

export default function VeganPizzaToppings() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <p>A good vegan pizza needs the same things as any good pizza: a base that cooks properly, toppings with plenty of flavour, and enough restraint to keep the middle from turning into a puddle.</p>
      <p>These vegan pizza topping ideas cover smoky courgette pepperoni, mushrooms, roasted vegetables and combinations that work with or without dairy-free cheese. Choose two or three main toppings, then add something sharp, fresh or spicy to finish.</p>
      <nav aria-label="In this guide"><p><a href="#combinations">Topping combinations</a> · <a href="#moisture">Avoiding soggy pizza</a> · <a href="#without-cheese">Pizza without cheese</a> · <a href="#questions">Common questions</a></p></nav>

      <h2 id="combinations">7 vegan pizza topping combinations</h2>
      <h3>1. Courgette pepperoni, tomato and oregano</h3>
      <p>Thin courgette rounds coated in paprika, fennel, garlic and chilli give you the smoky, spicy character of pepperoni using vegetables. Courgette is called zucchini in the US, so you may also see this described as zucchini pepperoni.</p>
      <p>Our <a href="/blog/vegan-pepperoni/">vegan pepperoni recipe</a> uses no seitan or tofu. Salt and dry the slices, marinate them, then arrange them directly on the pizza before baking. Pair with tomato sauce, oregano and a modest amount of vegan mozzarella, if you like.</p>
      <figure><a href="/blog/vegan-pepperoni/"><img src="/blog/vegan-pepperoni.webp" width="1254" height="1254" loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', borderRadius: '12px' }} alt="Paprika-coated courgette pepperoni on pizza, with fennel seeds, herbs and a heart-shaped slice." /></a><figcaption>Courgette pepperoni on pizza. Choose a dairy-free cheese or omit it for a fully vegan version.</figcaption></figure>
      <h3>2. Browned mushrooms, garlic and thyme</h3>
      <p>Cook sliced mushrooms in a hot pan until they release their liquid and begin to brown. Add garlic towards the end so it does not burn. Spread over a thin layer of tomato sauce, scatter with thyme and finish the baked pizza with black pepper.</p>
      <h3>3. Roasted peppers, red onion and olives</h3>
      <p>Sweet peppers, a little thinly sliced red onion and a few olives give you sweetness, sharpness and salt. Drain jarred roasted peppers thoroughly and blot them dry. Keep the olives scattered rather than covering every mouthful.</p>
      <h3>4. Aubergine, tomato and basil</h3>
      <p>Roast or pan-fry thin slices of aubergine until tender before putting them on the pizza; thick raw pieces can remain firm while the base finishes cooking. Pair with tomato sauce and add fresh basil after baking. A little chilli oil is welcome.</p>
      <h3>5. Artichokes, olives and lemon</h3>
      <p>Drain and dry preserved artichoke hearts, then cut them into manageable pieces. Combine with olives over tomato sauce or a light brushing of olive oil. Finish with a little lemon zest after baking. Check the ingredients of any prepared sauce or pesto for dairy.</p>
      <h3>6. Spinach, mushrooms and chilli</h3>
      <p>Wilt the spinach first and squeeze out excess water once it is cool enough to handle. Combine with browned mushrooms and chilli flakes. A little vegan cheese can bring it together, but garlic oil and a squeeze of lemon after baking also work.</p>
      <h3>7. Thin potato, rosemary and garlic oil</h3>
      <p>Use thin, just-tender slices of cooked potato, cooled and dried, over a lightly oiled base. Add rosemary, a little garlic oil and black pepper. Keep the potato in a single loose layer so the dough can bake properly. Finish with salt to taste.</p>

      <h2 id="moisture">How to keep vegetable pizza toppings from making the base soggy</h2>
      <ul>
        <li><strong>Cook watery vegetables when needed.</strong> Brown mushrooms, wilt spinach and roast aubergine before assembling.</li>
        <li><strong>Drain preserved toppings.</strong> Peppers, artichokes and olives should bring flavour rather than a spoonful of their packing liquid.</li>
        <li><strong>Salt and dry courgettes.</strong> For our pepperoni topping, rinse away excess salt and pat the rounds thoroughly dry before marinating.</li>
        <li><strong>Leave some space.</strong> A thick blanket of vegetables traps steam. A few well-chosen toppings usually work better.</li>
        <li><strong>Follow your dough's baking method.</strong> Preheat the oven and any stone or steel as directed. Home ovens and pizza ovens need different timings.</li>
      </ul>

      <h2 id="without-cheese">Vegan pizza toppings without cheese</h2>
      <p>You can make a satisfying pizza without a cheese substitute. Start with tomato sauce, garlic and oregano, then add one of the vegetable combinations above. Olives or capers supply little bursts of salt; olive oil adds richness; basil, rocket or lemon zest bring freshness after baking.</p>
      <p>For a simple starting point, try tomato, garlic, oregano and olive oil. For something more substantial, add browned mushrooms or courgette pepperoni. Use pesto only if it is labelled vegan or you have checked its ingredients.</p>

      <h2 id="questions">Common questions about vegan pizza toppings</h2>
      <h3>What can I use instead of pepperoni on a vegan pizza?</h3>
      <p>Try <a href="/blog/vegan-pepperoni/">paprika-and-fennel courgette pepperoni</a> for a vegetable option. Seitan-, tofu- and other plant-based pepperoni products are alternatives if you prefer them; check the label and cooking instructions.</p>
      <h3>Can I put raw courgette on pizza?</h3>
      <p>Thin slices can cook on the pizza, but excess water can soften the base. Our recipe salts, rinses and dries the courgette before marinating it, then bakes the slices directly on the pizza without precooking.</p>
      <h3>Do I need vegan cheese?</h3>
      <p>No. Tomato, garlic, herbs, vegetables and olive oil can make a complete topping. If you use dairy-free cheese, start with a modest amount and follow the product's instructions.</p>
      <h3>Is pizza dough vegan?</h3>
      <p>A dough made from flour, water, yeast, salt and olive oil can be vegan. Bought doughs and prepared bases may contain milk, butter, honey or other additions, so check the ingredients.</p>
      <p>Ready to cook? Start with the <a href="/blog/vegan-pepperoni/">vegan pepperoni recipe</a>, or browse <a href="/originals/">Savor Originals</a> for more recipes.</p>
    </BlogPostLayout>
  )
}
