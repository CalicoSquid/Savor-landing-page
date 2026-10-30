import PinterestSave from '../../components/PinterestSave'
import { originalPinterestDetails, pinterestImageAttributes } from '../../lib/pinterest'
import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'
import './salt-pork-blaff.css'

const post = BLOG_POSTS.find(p => p.slug === 'bacon-leek-cheddar-bread-butter-pudding')
const pin = originalPinterestDetails(post)
const pageUrl = `https://getsavor.recipes/blog/${post.slug}/`
const ingredients = [
  '300 g stale bread, in thick slices',
  '60 g softened butter: 40 g for the bread and 20 g for the leeks, plus a little extra for the dish',
  '200 g smoked streaky bacon, chopped',
  '2 medium leeks, trimmed, thoroughly washed and thinly sliced',
  '150 g mature cheddar, grated',
  '600 ml whole milk',
  '4 large eggs',
  '2 bay leaves',
  '1 garlic clove, peeled and lightly crushed',
  '1 tsp finely chopped thyme leaves',
  '2 tsp Dijon mustard',
  'Freshly ground black pepper; a little salt only if needed',
  'Optional: chopped chives to finish',
]
const steps = [
  { name: 'Infuse the milk', text: 'Put the milk, bay leaves and crushed garlic in a saucepan. Heat gently until steaming, without boiling, then take off the heat and leave to infuse for 10 minutes. Remove the bay and garlic.' },
  { name: 'Crisp the bacon', text: 'Put the chopped bacon in a frying pan over a medium heat. Let the fat render and cook until the bacon is crisp. Lift it out with a slotted spoon and set aside. Drain off the rendered fat.' },
  { name: 'Soften the leeks', text: 'Add 20 g butter and the washed, sliced leeks to the pan. Cook gently for 8–10 minutes, stirring occasionally, until tender. Let any excess moisture cook away, then take off the heat.' },
  { name: 'Butter and layer the bread', text: 'Butter a roughly 2-litre baking dish. Spread the bread with the remaining 40 g butter, then cut it into generous chunks or leave it in slices. Layer it in the dish with the leeks, crisp bacon and cheddar, keeping a little cheese back for the top.' },
  { name: 'Make the savoury custard', text: 'Beat the eggs with the Dijon, chopped thyme and a generous grind of black pepper. Slowly whisk in the warm infused milk, adding a little at first so the eggs do not scramble. Go carefully with extra salt: the bacon and cheddar bring plenty.' },
  { name: 'Let it soak', text: 'Pour the custard evenly over the bread. Press the bread down gently to help it absorb the liquid, then leave for 20 minutes. Meanwhile, heat the oven to 180°C (160°C fan / 350°F). Scatter over the reserved cheddar before baking.' },
  { name: 'Bake until golden and set', text: 'Bake for 30–45 minutes, checking from 30 minutes, until the top is golden and crisp and the custard is set in the centre, with no liquid egg remaining. The middle should be moist rather than dry. Bread, dish depth and ovens all affect the timing; give it longer if needed and cover loosely with foil if the top browns too quickly.' },
  { name: 'Rest and serve', text: 'Leave it for 5 minutes before serving. Finish with chopped chives if you like. Spoon it alongside roast chicken, vegetables and gravy, making sure everyone gets some of the crisp top.' },
]
const recipeMetadata = {
  '@context': 'https://schema.org', '@type': 'Recipe',
  name: post.title, description: post.metaDesc, image: post.ogImage,
  author: { '@type': 'Person', name: 'Caleb' }, datePublished: post.date,
  prepTime: 'PT25M', cookTime: 'PT45M', totalTime: 'PT90M',
  recipeYield: '6 side servings', recipeCategory: 'Side dish', recipeCuisine: 'British',
  keywords: 'savoury bread and butter pudding, bacon leek cheddar, stale bread, Sunday roast side, Back of the Cupboard',
  recipeIngredient: ingredients,
  recipeInstructions: steps.map((step, i) => ({ '@type': 'HowToStep', ...step, url: `${pageUrl}#step-${i + 1}`, position: i + 1 })),
  url: pageUrl, mainEntityOfPage: pageUrl,
}

export default function SavouryBreadPudding() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeMetadata).replace(/</g, '\\u003c') }} />
      <p><a href="/originals/?series=cupboard#recipes">Savor Originals</a> · <strong>Back of the Cupboard · No. 3</strong></p>
      <p>I used to make savoury bread and butter pudding as a side for roast chicken, back when I was cooking Sunday roasts in the UK. We collected the stale bread from the previous days, so it was a very cheap addition to the plate.</p>
      <p>The filling changed. Red onion and goat’s cheese, sausage and sage, bacon and cheddar, or whatever other cheese we were using. I would often smoke my own cheese and do a smoky version. The custard had thyme, a little French mustard and black pepper, with bay and garlic infused into the milk.</p>
      <p>This version has smoked bacon, cheddar and leeks softened in butter. Fry the bacon until crisp first. You want that texture against the soft bread and custard.</p>
      <p><a href="#recipe">Get straight to the recipe ↓</a></p>
      <section id="recipe" className="blaff-recipe-card" aria-labelledby="pudding-recipe-title">
        <img className="blaff-recipe-image" src="/blog/bacon-leek-cheddar-bread-pudding.webp" width={post.ogImageWidth} height={post.ogImageHeight} style={{ aspectRatio: '4 / 3', objectPosition: 'center 55%' }} alt={pin.altText} {...pinterestImageAttributes(pin)} decoding="async" />
        <div className="blaff-recipe-content">
          <span className="doc-eyebrow">Back of the Cupboard · Recipe No. 3</span>
          <h2 id="pudding-recipe-title">Bacon, leek &amp; cheddar bread and butter pudding</h2>
          <p>Yesterday’s bread, crisp bacon, buttery leeks and a savoury custard. A side for Sunday roast chicken.</p>
          <p><strong>Serves:</strong> 6 as a side · <strong>Difficulty:</strong> Easy<br /><strong>Prep:</strong> about 25 minutes · <strong>Soak:</strong> 20 minutes<br /><strong>Bake:</strong> 30–45 minutes · <strong>Total:</strong> about 75–90 minutes, plus 5 minutes resting</p>
          <p><strong>Kitchen note:</strong> These home-sized quantities are a starting point adapted from my service method. This exact batch still needs a home test bake, so use the custard setting in the centre as your guide rather than the clock alone.</p>
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
      <h2>Give the bread a bit of time</h2>
      <p>Slices or chunks both work. Butter the bread first, layer everything up, then let it sit once the custard goes in. Stale bread needs a little time to soak it up. Leave some edges poking out so you get a crisp top as well as the soft middle.</p>
      <h2>The other versions</h2>
      <ul>
        <li><strong>Red onion and goat’s cheese:</strong> soften sliced red onion in butter and use it in place of the bacon and leeks. Swap the cheddar for goat’s cheese. Choose a vegetarian goat’s cheese if needed.</li>
        <li><strong>Sausage and sage:</strong> cook crumbled sausage meat through before layering it in, using it instead of the bacon. Swap the thyme for a little chopped sage.</li>
        <li><strong>Smoked cheese:</strong> use smoked cheddar, or another smoked cheese that melts well, in place of some or all of the cheddar.</li>
        <li><strong>Mustard:</strong> Dijon is a good starting point, but another smooth mustard works. A little prepared horseradish can replace it too. Start with 1 tsp; it should sit in the background.</li>
      </ul>
      <p>Serve it with roast chicken, roast vegetables and gravy. It is also a useful way to give the bread left from the week a job at Sunday lunch.</p>
      <p>More from <a href="/originals/?series=cupboard#recipes">Back of the Cupboard</a>: <a href="/blog/sticky-soy-braised-pork-neck-shiitake/">sticky soy-braised pork with shiitake</a> and <a href="/blog/salt-pork-blaff/">salt pork blaff</a>.</p>
    </BlogPostLayout>
  )
}
