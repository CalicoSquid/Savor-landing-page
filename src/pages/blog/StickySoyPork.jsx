import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'
import './salt-pork-blaff.css'

const post = BLOG_POSTS.find(p => p.slug === 'sticky-soy-braised-pork-neck-shiitake')
const pageUrl = `https://getsavor.recipes/blog/${post.slug}/`
const ingredients = [
  '600–900 g pork neck, cut into large chunks',
  '25–40 g dried shiitake mushrooms',
  '4–5 cloves garlic, smashed',
  '1 thumb-sized piece ginger, sliced',
  '1 large onion, sliced',
  '4 tbsp soy sauce',
  '1–2 tbsp brown sugar or honey',
  '1 tbsp rice vinegar or apple cider vinegar',
  '1 star anise (optional)',
  '½ tsp chilli flakes, or to taste',
  '300–500 ml reserved mushroom soaking liquid',
  '1 tbsp neutral oil',
  'Up to 1 tsp sesame oil, to taste (optional)',
  'Spring onions, sliced, to garnish',
  'Steamed rice and garlicky greens or stir-fried cabbage, to serve',
]
const steps = [
  { name: 'Rehydrate the mushrooms', text: 'Cover the dried shiitake with hot water and soak for 30–45 minutes until softened. Squeeze out excess liquid, trim tough stems and slice larger mushrooms. Reserve the soaking liquid, straining it through a fine sieve to remove any grit.' },
  { name: 'Brown the pork', text: 'Pat the pork dry and season lightly with salt. Heat the neutral oil in a heavy-bottomed pot over medium-high heat. Sear the pork in batches until deeply golden on all sides, then lift out and set aside.' },
  { name: 'Build the aromatics', text: 'Reduce the heat to medium. Soften the onion in the pork fat until lightly caramelised. Add the ginger, garlic and chilli flakes and cook for another 1–2 minutes until fragrant.' },
  { name: 'Build the sauce', text: 'Add the brown sugar or honey and stir until dissolved. Stir in the soy sauce and vinegar, scraping up the browned bits from the bottom of the pot.' },
  { name: 'Slow braise', text: 'Return the pork to the pot with the shiitake and optional star anise. Add enough strained mushroom liquid to reach halfway to two-thirds up the pork. Bring to a gentle simmer, cover and cook over low heat for 2–3 hours, turning occasionally, until fork-tender. Add a little water if the liquid reduces too quickly.' },
  { name: 'Reduce and glaze', text: 'Remove the lid and star anise. Skim excess fat if necessary. Increase the heat slightly and simmer uncovered until the sauce is thick and glossy and coats the pork and mushrooms. Taste and adjust with soy sauce, sugar or vinegar: savoury first, gently sweet, with enough acidity to balance the pork.' },
  { name: 'Finish and serve', text: 'Stir through a few drops of sesame oil, adding more to taste, and scatter with spring onions. Serve over fluffy steamed rice with garlicky greens or stir-fried cabbage.' },
]
const recipeMetadata = {
  '@context': 'https://schema.org', '@type': 'Recipe',
  name: post.title, description: 'Tender pork neck and dried shiitake mushrooms slow-braised with soy, ginger and garlic, finished in a glossy, sticky sauce.',
  image: post.ogImage, author: { '@type': 'Person', name: 'Caleb' },
  datePublished: post.date, prepTime: 'PT45M', cookTime: 'PT3H', totalTime: 'PT3H45M',
  recipeYield: '2–4 servings', recipeCategory: 'Dinner',
  keywords: 'soy-braised pork neck, dried shiitake mushrooms, sticky pork, slow braised pork',
  recipeIngredient: ingredients,
  recipeInstructions: steps.map((step, i) => ({ '@type': 'HowToStep', ...step, url: `${pageUrl}#step-${i + 1}`, position: i + 1 })),
  url: pageUrl, mainEntityOfPage: pageUrl,
}

export default function StickySoyPork() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeMetadata).replace(/</g, '\\u003c') }} />
      <p><a href="/originals/">Savor Originals</a> · <strong>Back of the Cupboard · No. 2</strong></p>
      <p>This one is literally from the back of the cupboard. A bag of dried shiitake mushrooms surfaced from the depths, and I had a kilo of pork neck defrosting because it was the cheapest cut I could find. Dinner had apparently been hiding in two different places.</p>
      <p>Pork neck rewards a slow afternoon: the fat and connective tissue soften into tender, rich meat while the mushrooms lend their soaking liquid to the braise. Soy, ginger and garlic do the rest. Reduce it all to a dark, sticky glaze and put rice underneath. The cupboard has done enough; it is not washing up.</p>
      <p><a href="#recipe">Straight to the recipe ↓</a></p>

      <section id="recipe" className="blaff-recipe-card" aria-labelledby="pork-recipe-title">
        <img className="blaff-recipe-image" src="/blog/sticky-soy-pork-shiitake.jpg" width="1536" height="1024" alt={post.ogImageAlt} decoding="async" />
        <div className="blaff-recipe-content">
          <span className="doc-eyebrow">Back of the Cupboard · Recipe No. 2</span>
          <h2 id="pork-recipe-title">{post.title}</h2>
          <p>Meltingly tender pork, meaty shiitake mushrooms and a savoury glaze that clings to every piece.</p>
          <p><strong>Serves:</strong> 2–4<br /><strong>Prep:</strong> 45 minutes, including mushroom soaking<br /><strong>Cook:</strong> 2½–3 hours; allow longer if the pork needs it.</p>
          <div className="blaff-recipe-actions">
            <a href={`savor://create?url=${encodeURIComponent(pageUrl)}`}>Save to Savor</a>
            <a className="blaff-pinterest" href={`https://www.pinterest.com/pin/create/button/?${new URLSearchParams({ url: pageUrl, media: post.ogImage, description: post.title })}`} target="_blank" rel="noopener noreferrer">Save to Pinterest</a>
          </div>
          <h3>Ingredients</h3>
          <ul>{ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
          <h3>Method</h3>
          <ol>{steps.map((step, i) => <li key={step.name} id={`step-${i + 1}`}><strong>{step.name}.</strong> {step.text}</li>)}</ol>
        </div>
      </section>
      <h2>A few things worth keeping</h2>
      <p><strong>The mushroom water:</strong> strain it, then use it. That is a lot of flavour to pour down the sink. <strong>The patience:</strong> pork neck needs time, so let tenderness decide when it is ready. <strong>The restraint:</strong> one star anise is plenty. We are making dinner, not liquorice.</p>
      <p><strong>Making it ahead?</strong> The flavour is even better the next day. Refrigerate overnight, lift off the solidified excess fat, then gently reheat until piping hot throughout.</p>
      <p>Another cupboard dinner? Try <a href="/blog/one-pan-smoky-tomato-rice/">one-pan smoky tomato rice with chickpeas and crispy eggs</a>, or browse all <a href="/originals/">Savor Originals</a>.</p>
    </BlogPostLayout>
  )
}
