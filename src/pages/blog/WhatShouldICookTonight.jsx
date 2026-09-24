import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'

const post = BLOG_POSTS.find((p) => p.slug === 'what-should-i-cook-tonight')

export default function WhatShouldICookTonight() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <p>
        &ldquo;What should I cook tonight?&rdquo; sounds like an easy question until it is 6:30, you are hungry, and every possible dinner has somehow become both acceptable and deeply annoying.
      </p>
      <p>
        The problem usually is not a lack of dinner ideas. It is too many decisions at once: what is in the fridge, how much effort you have left, what everyone else wants, whether you need leftovers, and whether you can face another trip to the shop.
      </p>
      <p>
        Professional kitchens make hundreds of food decisions, but they rarely make them from an infinite list. Constraints make the choice easier. You can use exactly the same trick at home.
      </p>

      <div className="blog-post-callout">
        <div className="blog-post-callout-title">Want to skip the committee meeting?</div>
        <p>Potluck is Savor&rsquo;s free random dinner generator. Spin once and it gives you a real recipe you can open and cook — not just the word &ldquo;tacos&rdquo; and a shrug.</p>
        <a className="blog-post-callout-link" href="/potluck/">Let Potluck pick dinner →</a>
        <div className="blog-post-callout-caption">Free in the browser. No signup. Rerolls permitted when fate is obviously wrong.</div>
      </div>

      <h2>First: stop asking for the perfect dinner</h2>
      <p>
        On an ordinary weeknight, dinner does not need to be the meal you would choose from every dish on Earth. It needs to be good enough, possible with the time and ingredients you have, and appealing enough that you actually start cooking it.
      </p>
      <p>
        That sounds obvious, but endless recipe feeds encourage the opposite behaviour. Every swipe introduces another candidate, which means the decision never closes. Give yourself a smaller box to choose from.
      </p>

      <h2>1. Decide how much effort you actually have</h2>
      <p>
        Before choosing a cuisine or a recipe, choose the level of effort. I use three rough buckets: <strong>cook</strong>, <strong>assemble</strong>, or <strong>survive</strong>.
      </p>
      <p>
        A cook night might be pasta from scratch, curry, roast chicken or something with several pans. Assemble means eggs on toast, quesadillas, a loaded salad, noodles with a quick sauce, or good things piled into a bowl. Survive means freezer food, sandwiches, leftovers or cereal if that is genuinely where the evening is headed.
      </p>
      <p>Once you are honest about energy, two thirds of the imaginary menu disappears.</p>

      <h2>2. Pick the ingredient that needs using first</h2>
      <p>
        Look at the fridge and choose the thing with the shortest remaining life. Half a cabbage, mushrooms getting soft, cooked chicken from yesterday, herbs beginning to wilt. That becomes the centre of the decision.
      </p>
      <p>
        This is often faster than starting with &ldquo;What cuisine do I fancy?&rdquo; because a real ingredient is a useful constraint. Mushrooms can become pasta, risotto, toast, an omelette or a stir-fry. Five possibilities are much easier than five thousand.
      </p>

      <h2>3. Choose a format, not a specific recipe</h2>
      <p>
        Most weeknight dinners belong to a surprisingly small number of shapes: pasta, rice bowl, soup, tray bake, tacos or wraps, curry, stir-fry, roast, salad, eggs, sandwich.
      </p>
      <p>
        Pick the shape first. Then fit what you have into it. &ldquo;We are having tacos&rdquo; is a much smaller problem than &ldquo;What should we eat?&rdquo;
      </p>

      <h2>4. Use the 20-minute test</h2>
      <p>
        If you are hungry enough that waiting sounds offensive, ask what can be on the table in roughly twenty minutes. Eggs, pasta, couscous, noodles, quick curries, fried rice, grilled sandwiches and leftovers suddenly move to the front of the queue.
      </p>
      <p>
        Do not choose a two-hour braise at 7pm because the photograph looked comforting. Save it for the day when the clock agrees with you.
      </p>

      <h2>5. Keep three emergency dinners</h2>
      <p>
        Every kitchen should have a few dinners that require almost no decision-making. Mine would be things built from pantry or freezer ingredients rather than a precise shopping list.
      </p>
      <p>
        Think pasta with garlic, chilli and whatever greens exist; eggs with toast and something sharp; rice or noodles with frozen vegetables and a fast sauce; tinned beans turned into soup, tacos or a warm bowl. Your emergency dinners do not need to impress anyone. They need to exist reliably.
      </p>

      <h2>6. If several meals sound fine, choose randomly</h2>
      <p>
        Randomness is useful when there is no meaningful reason to prefer one acceptable option over another. At that point, more analysis cannot improve the decision very much. It can only delay dinner.
      </p>
      <p>
        Write three ideas down and roll a die. Ask someone else to choose a number. Or use a <a href="/potluck/">random dinner generator like Potluck</a>. The important part is that the choice closes and you move into cooking mode.
      </p>
      <p>
        Potluck is deliberately closer to dinner roulette than a meal-planning system: it picks a real recipe, you can open the ingredients and method immediately, and if the universe suggests something ridiculous for your particular evening, you reroll.
      </p>

      <h2>7. If you hate the random answer, pay attention</h2>
      <p>
        This is my favourite trick because the random choice can reveal the preference you were failing to articulate. If the wheel lands on a rich pasta and your immediate reaction is &ldquo;ugh, not that,&rdquo; you have learned something. Maybe you want something fresh. Maybe you want spicy food. Maybe you cannot face another pan.
      </p>
      <p>
        Rejecting an answer is still progress. The next choice is now narrower.
      </p>

      <h2>What if you are cooking for other people?</h2>
      <p>
        Ask for constraints, not suggestions. &ldquo;Anything you do not want?&rdquo; is much easier to answer than &ldquo;What do you want for dinner?&rdquo; Once the vetoes are out of the way, choose from what remains.
      </p>
      <p>
        If the problem is quantity rather than the menu itself, Savor&rsquo;s <a href="/tools/portion-planner/">Food Portion Planner</a> can estimate how much pasta, rice, meat, potatoes and other staples you need for the number of people actually eating.
      </p>

      <h2>A simple dinner-decision rule</h2>
      <p>When your brain is finished for the day, use this order:</p>
      <ol>
        <li>How much effort do I have?</li>
        <li>What needs using?</li>
        <li>What meal format fits both?</li>
        <li>If several answers are equally good, choose one randomly.</li>
      </ol>
      <p>
        The goal is not to discover the perfect dinner. The goal is to stop deciding while there is still enough evening left to eat it.
      </p>

      <div className="blog-post-callout">
        <div className="blog-post-callout-title">Still staring into the fridge?</div>
        <p>Good. You have officially earned the wheel.</p>
        <a className="blog-post-callout-link" href="/potluck/">Spin the Potluck random dinner generator →</a>
        <div className="blog-post-callout-caption">One spin. One real recipe. Dinner can take it from here.</div>
      </div>
    </BlogPostLayout>
  )
}
