import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'

const post = BLOG_POSTS.find((p) => p.slug === 'how-to-scale-a-recipe')

export default function ScaleARecipe() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <p>
        Recipe scaling looks like a maths problem right up until you put the bigger pot on the stove.
      </p>
      <p>
        A recipe serves four. You need ten. The arithmetic says multiply everything by 2.5, and mathematically that is completely correct.
        Cooking, unfortunately, has pans, heat, evaporation, salt, eggs and guests who take portions the size of roof tiles.
      </p>
      <p>
        I spent years scaling recipes in professional kitchens. The multiplication is the easy bit. Here is what actually matters when you double,
        halve or otherwise bully a recipe into feeding a different number of people.
      </p>

      <h2>How to scale a recipe: the basic formula</h2>
      <p>
        Divide the number of servings you want by the number the original recipe makes. That gives you your scaling factor.
      </p>
      <p>
        A recipe that serves 4 and needs to serve 10 has a scaling factor of 2.5. Multiply each ingredient by 2.5.
        A recipe that serves 8 and needs to serve 4 has a factor of 0.5, so halve everything.
      </p>
      <p>That part really is that simple.</p>

      <h2>Most ingredients scale cleanly</h2>
      <p>
        Meat, vegetables, grains, stock, cream, tinned tomatoes, flour in a sauce — for ordinary savoury cooking, most of the ingredient list can simply follow the maths.
      </p>
      <p>
        If 500 g of potatoes serves four, 1 kg is a perfectly sensible starting point for eight. You do not need a special potato equation.
      </p>
      <p>The trouble starts with ingredients whose job is not just to provide bulk.</p>

      <h2>Do not blindly multiply salt, spice and acid</h2>
      <p>
        If I am making a much larger batch, I rarely throw the full calculated amount of salt, chilli, vinegar or lemon juice in at the beginning.
        Add most of it, cook, then taste and finish the seasoning at the end.
      </p>
      <p>
        This is partly because ingredients vary. One lemon is not another lemon. A teaspoon of one chilli powder can be very different from a teaspoon of another.
        It is also because a larger pot changes how flavours concentrate as water cooks away.
      </p>
      <p>The calculator gets you close. Your mouth gets you finished.</p>

      <h2>Cooking time does not double because the recipe did</h2>
      <p>This is probably the most common scaling mistake.</p>
      <p>
        Two litres of soup may take longer to come to the boil than one litre, but it does not need twice as long once it is simmering.
        Two trays of roast vegetables are not improved by simply leaving them in the oven for twice the time.
      </p>
      <p>
        Use the original cooking time as your first checkpoint and cook to the thing that actually matters: tenderness, colour, internal temperature,
        texture or whatever &ldquo;done&rdquo; means for that dish.
      </p>

      <h2>Pan size matters more than people expect</h2>
      <p>
        If you double a lasagne and put it into a dish with roughly twice the surface area, its depth stays similar and the original cooking instructions remain useful.
        Put the same doubled lasagne into one deep pot and you have made a different cooking problem.
      </p>
      <p>
        The middle now takes longer to heat, the edges spend longer cooking, and the top may be finished before the centre is.
      </p>
      <p>
        When possible, keep the depth of baked dishes close to the original. For big increases, two normal pans are often better than one heroic pan.
      </p>

      <h2>Baking deserves more respect</h2>
      <p>
        Soups and stews are forgiving. Cakes are keeping records.
      </p>
      <p>
        For baking, weigh ingredients if you can. A digital scale makes halving and multiplying far cleaner than trying to work out what 1.375 cups of flour looks like.
        Keep the proportions accurate, and pay particular attention to pan size and batter depth.
      </p>
      <p>
        If you want twice as much cake, two pans made from the original recipe size are usually a safer bet than one cake twice as deep.
        The same logic applies to breads, tray bakes and anything where the path heat takes through the food is part of the recipe.
      </p>

      <h2>What do you do with half an egg?</h2>
      <p>
        Crack it into a small bowl, beat it together, then use half by weight or volume. It is not glamorous, but neither is discovering halfway through a tiny batch of brownies that eggs refuse to understand fractions.
      </p>
      <p>
        This is another reason weighing ingredients becomes useful when scaling down. Awkward spoon fractions turn into perfectly ordinary gram amounts.
      </p>

      <h2>Write the scaled amounts down before you start</h2>
      <p>
        Do not stand over a hot pan repeatedly multiplying 3/4 teaspoon by 2.5 in your head. Scale the whole ingredient list first.
      </p>
      <p>
        It sounds obvious. Professional kitchens label and prep things in advance for exactly this reason: cooking gets much easier when the arithmetic is already over.
      </p>

      <h2>Or let the recipe do the maths</h2>
      <p>
        Savor has a servings control on saved recipes, so you can change the number of portions and have the ingredient amounts scale with it.
        That removes the annoying arithmetic; it does not repeal physics.
      </p>

      <figure className="blog-post-figure">
        <img
          src="/screenshots/recipe.webp"
          srcSet="/screenshots/recipe-240.webp 240w, /screenshots/recipe.webp 480w"
          sizes="(max-width: 560px) 240px, 320px"
          alt="A recipe in Savor with a servings control for scaling ingredient amounts"
          width="480"
          height="1002"
          loading="lazy"
          decoding="async"
        />
        <figcaption>The maths can be automatic. The pan is still your problem.</figcaption>
      </figure>

      <p>
        If you take one thing from this, make it this: <strong>scale quantities with maths, then cook with your senses.</strong>
      </p>
      <p>
        Multiply the ingredients. Keep an eye on the size and depth of the pan. Start checking around the original cooking time.
        Add aggressive seasonings in stages. Taste your food.
      </p>
      <p>That is most of recipe scaling, and it is far more reliable than pretending a dinner for twelve is just a dinner for four with bigger numbers.</p>
    </BlogPostLayout>
  )
}
