import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'

const post = BLOG_POSTS.find((p) => p.slug === 'save-recipes-from-websites')

export default function SaveRecipesFromWebsites() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <p>
        The internet is very good at helping you find a recipe and strangely bad at helping you find the same recipe again three weeks later.
      </p>
      <p>
        You bookmark one. Screenshot another. Leave six tabs open. Send one to yourself in a message with absolutely no context.
        Eventually you have hundreds of saved recipes and somehow still search Google from scratch every time you want to cook.
      </p>
      <p>
        If you want to save recipes from websites properly, the goal is not just to keep the link. It is to keep the recipe <em>findable</em>,
        <em> cookable</em>, and connected to the original source.
      </p>

      <h2>First: decide what &ldquo;saved&rdquo; actually means</h2>
      <p>
        A bookmark is technically a saved recipe. So is a screenshot. So is a browser tab you have been afraid to close since February.
      </p>
      <p>
        But a useful recipe collection should let you answer a few simple questions quickly: What was that chicken thing I liked?
        Can I search for it by ingredient? How many does it serve? Where did it originally come from? Can I cook from it without fighting the webpage?
      </p>
      <p>
        If your system cannot do those things, you have probably built an archive of places recipes used to be rather than a collection you can actually cook from.
      </p>

      <h2>The common ways to save online recipes</h2>

      <h3>Bookmarks</h3>
      <p>
        Bookmarks are excellent for &ldquo;I might make this someday.&rdquo; They are less useful once you have a few hundred of them.
        Titles change, folders become junk drawers, and the recipe still lives inside whatever ads, pop-ups and layout the original site uses.
      </p>
      <p>
        Keep using bookmarks for browsing. I just would not make them the permanent home of the recipes you actually cook.
      </p>

      <h3>Screenshots</h3>
      <p>
        Screenshots feel wonderfully permanent because the recipe cannot disappear from underneath you. The problem comes later:
        an ingredient list split across four images, mixed into your camera roll between a parking receipt and somebody&rsquo;s dog.
      </p>
      <p>
        They are a good emergency capture. They are a terrible filing cabinet.
      </p>

      <h3>Print, PDF and notes</h3>
      <p>
        Printing still works. A piece of paper next to the stove does not dim its screen, send notifications or care that your fingers are covered in flour.
        Saving a clean PDF is useful too, especially for recipes you want available offline.
      </p>
      <p>
        The trade-off is organisation. Unless you are disciplined about filenames and folders, digital printouts eventually become another pile.
        Notes apps are more searchable, but copying ingredients and instructions by hand gets old very quickly.
      </p>

      <h3>A dedicated recipe collection</h3>
      <p>
        If you cook from online recipes regularly, this is the point where a recipe organiser starts making sense.
        The important part is not having an app for the sake of having an app. It is separating the <em>recipe you cook from</em> from the <em>page you discovered it on</em>.
      </p>
      <p>
        You get one consistent format for ingredients, servings and instructions, while keeping the original source attached for attribution, context and the day you decide you actually do want to read the author&rsquo;s story.
      </p>

      <h2>A system that still works a year from now</h2>
      <p>You do not need an elaborate taxonomy. You need a few boring rules that you will actually keep using.</p>
      <ol>
        <li><strong>Give recipes one permanent home.</strong> Not bookmarks <em>and</em> screenshots <em>and</em> Notes <em>and</em> a folder called FOOD NEW.</li>
        <li><strong>Keep the original source.</strong> The person who published the recipe deserves the credit, and sometimes you will want their notes or updated version.</li>
        <li><strong>Save the useful information, not just a picture of it.</strong> Ingredients and instructions should be searchable text if you want the collection to become more useful over time.</li>
        <li><strong>Organise lightly.</strong> A few useful categories beat forty tags you have to maintain. Dinner, baking, favourites and &ldquo;make this next&rdquo; will get you surprisingly far.</li>
        <li><strong>Delete the misses.</strong> A recipe box gets better when you remove the things you made once and never want to see again.</li>
      </ol>

      <h2>How I do it in Savor</h2>
      <p>
        This exact problem is why Savor has a browser inside it. When you open a recipe page, Savor looks for the actual recipe on the page and tells you when it finds one.
        Tap once and it rebuilds the ingredients and instructions into the same clean format as the rest of your collection.
      </p>

      <figure className="blog-post-figure">
        <img
          src="/screenshots/found.webp"
          srcSet="/screenshots/found-240.webp 240w, /screenshots/found.webp 480w"
          sizes="(max-width: 560px) 240px, 320px"
          alt="Savor detecting a recipe on a website and offering to import it"
          width="480"
          height="1002"
          loading="lazy"
          decoding="async"
        />
        <figcaption>A recipe found on the web, ready to turn into something you can actually cook from.</figcaption>
      </figure>

      <p>
        I deliberately do not think the original page should vanish. Food blogs are where recipes are discovered, tested, explained and published.
        The point is simply that once dinner has started, you should not have to rediscover the recipe every time you need the next step.
      </p>

      <div className="blog-post-callout">
        <div className="blog-post-callout-title">About that three-thousand-word recipe page&hellip;</div>
        <p>
          There is a real reason recipe sites put so much writing before the ingredients. It is more complicated — and more reasonable — than the usual internet joke suggests.
        </p>
        <a href="/blog/life-story-before-the-recipe/" className="blog-post-callout-link">Why recipes come with a life story &rarr;</a>
      </div>

      <h2>The best recipe-saving system is the one you use while cooking</h2>
      <p>
        That is the test I would use, whether your system is an app, a binder or a terrifyingly well-maintained spreadsheet.
      </p>
      <p>
        Can you remember roughly what you want, find it in a few seconds, and start cooking?
      </p>
      <p>If yes, you have saved the recipe.</p>
      <p>If not, you have mostly saved yourself another search.</p>
      <p>
        And if the recipes you are trying to rescue live on paper rather than the web, I have a separate guide to
        <a href="/blog/save-handwritten-recipe-cards/"> preserving handwritten recipe cards</a> before the originals disappear.
      </p>
    </BlogPostLayout>
  )
}
