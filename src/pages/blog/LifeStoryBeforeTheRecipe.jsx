// src/pages/blog/LifeStoryBeforeTheRecipe.jsx
import { useEffect } from 'react'
import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'

const post = BLOG_POSTS.find((p) => p.slug === 'life-story-before-the-recipe')

export default function LifeStoryBeforeTheRecipe() {
  useEffect(() => {
    document.title = `${post.title} | Savor Blog`
  }, [])

  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <h2>We all know the scroll</h2>
      <p>You&rsquo;re standing in the kitchen with butter softening on the counter and onions already in the pan.</p>
      <p>You search for easy chicken curry.</p>
      <p>You tap the first result.</p>
      <p>
        And suddenly you&rsquo;re reading about a family holiday in 2009, a golden
        retriever called Max, and the author&rsquo;s lifelong relationship with
        cinnamon.
      </p>
      <p>Somewhere, eventually, there&rsquo;s a recipe.</p>
      <p>First, though, there&rsquo;s a lot of scrolling.</p>

      <h2>It&rsquo;s not actually the blogger&rsquo;s fault</h2>
      <p>It can feel ridiculous, but there&rsquo;s a reason so many recipe sites look like this.</p>
      <p>
        Search engines generally reward pages with useful context, original
        writing and detailed explanations. If someone spends hours testing a
        recipe, taking photographs and publishing it for free, they also need
        that page to appear in search results.
      </p>
      <p>Longer articles can help with that.</p>
      <p>
        So while the internet jokes about &ldquo;the life story before the
        lasagne,&rdquo; most food bloggers aren&rsquo;t padding for fun.
        They&rsquo;re trying to make a living.
      </p>

      <h2>The problem is timing</h2>
      <p>The story isn&rsquo;t really the problem.</p>
      <p>The problem is when you&rsquo;re trying to cook.</p>
      <p>
        If you&rsquo;re browsing recipes over coffee, the extra context can be
        interesting. Maybe you learn why a particular ingredient works, or
        where the recipe came from.
      </p>
      <p>But if you&rsquo;ve already decided to cook it?</p>
      <p>You&rsquo;re usually just trying to answer four questions.</p>
      <ul>
        <li>What ingredients do I need?</li>
        <li>What temperature?</li>
        <li>What do I do next?</li>
        <li>How long will it take?</li>
      </ul>
      <p>Everything else can wait.</p>

      <h2>That&rsquo;s why &ldquo;Jump to Recipe&rdquo; became a meme</h2>
      <p>There&rsquo;s a reason almost every recipe website now has a Jump to Recipe button.</p>
      <p>There are browser extensions that automatically skip straight to recipe cards.</p>
      <p>People have even built apps just to extract recipes from web pages.</p>
      <p>Nobody wants less cooking.</p>
      <p>They just want less scrolling.</p>

      <h2>That&rsquo;s exactly why I built Savor</h2>
      <p>When I started building Savor, I wasn&rsquo;t trying to replace recipe websites.</p>
      <p>I still discover most of my recipes there.</p>
      <p>
        I just wanted a way to get from a great recipe page to something I could
        actually cook from.
      </p>

      <figure className="blog-post-figure">
        <img src="/screenshots/found.webp" alt="Savor detecting a recipe while browsing and offering to import it" />
        <figcaption>Savor spots a recipe as you browse — no copying, no pasting, no life story.</figcaption>
      </figure>

      <p>
        Savor searches every page you visit, and lets you know when it finds a
        recipe. Then it rebuilds it into clean ingredients and steps, lets you
        scale the servings, and saves it in your own recipe box.
      </p>
      <p>The original article is still there if you want it.</p>
      <p>The cooking version just isn&rsquo;t buried underneath three thousand words.</p>

      <div className="blog-post-callout">
        <div className="blog-post-callout-title">See it happen in real time</div>
        <p>
          We built a (very) over-the-top fake recipe blog just to show this off
          &mdash; Marguerite Hollow&rsquo;s tragic lasagne saga, and the exact
          moment Savor cuts straight through it.
        </p>
        <a href="/demo" className="blog-post-callout-link">Try the demo &rarr;</a>
        <div className="blog-post-callout-caption">A full recipe page turned into a clean recipe in a few seconds.</div>
      </div>

      <h2>You don&rsquo;t have to choose</h2>
      <p>Recipe blogs are where great recipes are discovered.</p>
      <p>They&rsquo;re also where people earn a living writing them.</p>
      <p>Those stories have value.</p>
      <p>They just aren&rsquo;t always what you need when dinner&rsquo;s already started.</p>
      <p>Sometimes you want to read.</p>
      <p>Sometimes you just want to cook.</p>
    </BlogPostLayout>
  )
}