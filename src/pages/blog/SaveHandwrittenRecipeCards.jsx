// src/pages/blog/SaveHandwrittenRecipeCards.jsx
import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'

const post = BLOG_POSTS.find((p) => p.slug === 'save-handwritten-recipe-cards')

export default function SaveHandwrittenRecipeCards() {

    return (
        <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
            <p>
                Somewhere in your family there&rsquo;s probably a box, a drawer, or a battered folder full of recipes that exist nowhere else.
                Handwritten. Stained in the corner from whatever was being cooked at the time.
                Written by someone who isn&rsquo;t around anymore to explain what they meant by &ldquo;a knob of butter.&rdquo;
                I built the scanning feature in Savor because I went looking for my own version of that box, and found exactly what you&rsquo;d expect:
                recipes that were one bad afternoon away from being gone for good.
            </p>

            <p>
                This isn&rsquo;t a pitch for the app. It&rsquo;s the checklist I wish someone had handed me before I went looking for my mum&rsquo;s cards.
            </p>

            <h2>They&rsquo;re more fragile than they look</h2>

            <p>
                A recipe card feels permanent right up until it isn&rsquo;t. Ink fades faster than paper does.
                Folds wear thin from being handled every Sunday for twenty years.
                And unlike almost everything else you own, there&rsquo;s usually only one copy — no cloud sync, no backup,
                sitting in exactly one drawer in exactly one house.
                A spill, a move, a house fire, or just a box that gets thrown out during a clear-out is all it takes.
            </p>

            <p>
                There&rsquo;s another kind of fragility.
                A lot of handwritten recipes are shorthand — &ldquo;the usual amount of flour,&rdquo; a measurement in a spoon that doesn&rsquo;t exist anymore,
                an ingredient known only by a nickname.
                While the person who wrote it is still around, that&rsquo;s part of the charm.
                Once they&rsquo;re not, it&rsquo;s the difference between a recipe you can actually cook and one you can only look at.
            </p>

            <h2>A photo on your phone is not a backup</h2>

            <p>
                This is the part where most people think they&rsquo;ve got it covered.
                Yes, you photographed the card once, at a family dinner, three phones ago.
                But it isn&rsquo;t much of a backup.
                It lives on one device, buried somewhere past ten thousand other photos.
                It isn&rsquo;t searchable by ingredient or name.
                It doesn&rsquo;t scale if you want to cook for twelve instead of four.
                And it&rsquo;s genuinely awkward to squint at a tiny, glare-covered photo on your phone with flour on your hands.
            </p>

            <p>
                A photo preserves what the card <em>looks</em> like.
                It doesn&rsquo;t preserve what it&rsquo;s <em>for</em>.
            </p>

            <p>
                Recipes aren&rsquo;t keepsakes because of the paper. They&rsquo;re keepsakes because people still cook them.
            </p>

            <h2>A real preservation checklist</h2>

            <ol>
                <li>
                    <strong>Shoot it flat, in even light.</strong> Natural window light beats flash every time —
                    flash bounces straight off glossy or laminated cards and wipes out exactly the words you need.
                    Shoot straight-on, not at an angle; an angled shot distorts the text and makes it harder to read later.
                </li>

                <li>
                    <strong>Get both sides.</strong> An enormous number of recipe cards have a second recipe, a note,
                    or a substitution scribbled on the back. It&rsquo;s easy to forget it exists until it&rsquo;s gone.
                </li>

                <li>
                    <strong>Don&rsquo;t laminate the original.</strong> It feels like the right thing to do,
                    but once it&rsquo;s done, there&rsquo;s no easy way back.
                    It can also trap moisture against paper that was never meant to be sealed.
                    An acid-free plastic sleeve gives you the same protection without permanently sealing the card.
                </li>

                <li>
                    <strong>Store it cool, dry, and dark.</strong> Sunlight and humidity age paper far faster than time alone does.
                    A drawer beats a windowsill.
                </li>

                <li>
                    <strong>Get the actual words out of the photo</strong>, not just an image of them.
                    This is the step almost everyone skips, and it&rsquo;s the one that decides whether the recipe survives as something you can cook from,
                    or just something you can look at.
                </li>

                <li>
                    <strong>Back it up in more than one place.</strong> Your camera roll is not redundancy —
                    it&rsquo;s one copy with better lighting.
                    Cloud storage plus one sibling or parent having their own copy is real redundancy.
                    The safest archive is one that exists in more than one place.
                </li>
            </ol>

            <h2>Getting the words out of the picture</h2>

            <p>
                This is the part I actually built Savor&rsquo;s scanner to solve, because photography alone doesn&rsquo;t solve it.
                You point your camera at a handwritten card or a page from an old cookbook, and Savor reads the handwriting —
                yes, even the messy kind, even faded pencil — and rebuilds it into a real recipe:
                a proper ingredient list, clear steps, scalable servings, and a searchable recipe.
                If the recipe doesn&rsquo;t have a photo, it&rsquo;ll even find one.
            </p>

            <figure className="blog-post-figure">
                <img
                    src="/screenshots/scan.webp"
                    srcSet="/screenshots/scan-240.webp 240w, /screenshots/scan.webp 480w"
                    sizes="(max-width: 560px) 240px, 320px"
                    alt="Savor rebuilding a recipe from a photographed handwritten card"
                    width="480"
                    height="1002"
                    loading="lazy"
                    decoding="async"
                />
                <figcaption>
                    A handwritten recipe card rebuilt into a searchable recipe with Savor.
                </figcaption>
            </figure>

            <p>
                It doesn&rsquo;t replace the original card. Nothing does.
                What it does is turn a photo of paper into something you can actually cook from at eight o&rsquo;clock on a Tuesday,
                with both hands full and no patience for squinting.
            </p>

            <h2>Do it this week</h2>

            <p>
                Recipes like this don&rsquo;t announce when they&rsquo;re about to be lost.
                There&rsquo;s no warning label on a fading recipe card.
                If there&rsquo;s a box like the one I&rsquo;m describing somewhere in your family,
                the best time to go through it was years ago, and the second best time is this week —
                before a move, before a clear-out, before it&rsquo;s a decision someone else has to make without you.
            </p>
        </BlogPostLayout>
    )
}