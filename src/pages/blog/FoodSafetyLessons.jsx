import BlogPostLayout from '../../components/BlogPostLayout'
import { BLOG_POSTS } from '../../data/blogPosts'

const post = BLOG_POSTS.find(item => item.slug === 'food-safety-lessons-from-a-chef')
const sources = {
  rice: 'https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker#rice',
  garlic: 'https://nchfp.uga.edu/how/freeze/vegetable/freezing-garlic-in-oil/',
  cooling: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety',
  boards: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/cutting-boards',
  cleaning: 'https://www.gov.uk/food-hygiene-businesses/cleaning',
  chemicals: 'https://www.cdc.gov/hygiene/about/cleaning-and-disinfecting-with-bleach.html',
  chilling: 'https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely',
  leftovers: 'https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food#using-your-leftovers',
}

export default function FoodSafetyLessons() {
  return (
    <BlogPostLayout title={post.title} date={post.date} readTime={post.readTime}>
      <p><em>Your kitchen probably doesn’t need a clipboard. Your leftovers could use a date.</em></p>
      <p>I remember my first visit from the Environmental Health Officer like it was yesterday.</p>
      <p>We were halfway through a busy Friday lunch service when the chef burst into the kitchen looking as though he’d seen a ghost. His eyes darted from station to station. Sweat gathered at his collar.</p>
      <p>This was a man who had survived two wars and, presumably, a reasonable number of disagreements outside pubs.</p>
      <p>“They’re here,” he managed, while apparently deciding that the fryer needed an immediate polish.</p>
      <p>The brigade mobilised.</p>
      <p>As a junior commis with only a few weeks behind me, I had no idea who <em>they</em> were. Whoever they were, they clearly appreciated stainless steel. I put my head down and scrubbed my station until I could see my own confused face in it.</p>
      <p>The sous chef appeared to be having a private crisis in the corner.</p>
      <p>Then she walked in: a diminutive Scottish woman carrying a clipboard. The owner followed, offering coffee, wine, or anything else that might improve the situation.</p>
      <p>The EHO had arrived.</p>
      <p>I had imagined someone considerably more frightening. Then again, nobody had offered <em>me</em> wine for walking into the kitchen.</p>

      <h2>Unfortunately, bacteria are unimpressed by shiny steel</h2>
      <p>Looking back, the frantic polishing was understandable. A kitchen in the middle of service rarely looks ready for visitors.</p>
      <p>But a polished fryer tells you very little about what happened to yesterday’s rice.</p>
      <p>Food safety lives in the less photogenic details. How food was cooled. Where raw meat is stored. Whether that cloth has just wiped a chopping board or spent the morning touring the kitchen. Whether anybody knows what is in the unlabelled container at the back of the fridge.</p>
      <p>At home, you can borrow the useful habits from a professional kitchen without recreating the atmosphere of an impending court appearance. Start with the things that are easiest to overlook.</p>

      <p><strong>A note on the numbers:</strong> this article follows UK household guidance for everyday cooling, refrigeration and leftovers. The homemade garlic-oil guidance is specifically attributed to the US National Center for Home Food Preservation. These are home-kitchen habits, not a substitute for a food business’s safety procedures.</p>

      <h2 id="rice">The rice deserves more attention than you think</h2>
      <p>Rice feels harmless. It is cheap, dependable and usually minding its own business.</p>
      <p>Once cooked, though, it needs proper handling. Uncooked rice can contain spores of <em>Bacillus cereus</em>. Those spores can survive cooking, and poorly stored cooked rice can allow bacteria to grow and produce toxins. Reheating is not a reliable rescue operation.</p>
      <p>The important part is what happens between cooking and eating.</p>
      <p>If you are saving rice, divide it into small, shallow portions and cool it quickly. Following Food Standards Agency guidance, aim to cool it within an hour, refrigerate it, use it within 24 hours and reheat it only once, until steaming hot throughout. Don’t leave the saucepan on the hob all evening and deal with it before bed. <a href={sources.rice}>Read the FSA’s rice guidance.</a></p>
      <p>Tomorrow’s fried rice begins with how you handle tonight’s leftovers. The same applies to the spare portions of <a href="/blog/one-pan-smoky-tomato-rice/">our one-pan smoky tomato rice</a>.</p>

      <h2 id="garlic-oil">Garlic oil: lovely idea, specific responsibilities</h2>
      <p>Garlic in oil looks like something you should give people at Christmas.</p>
      <p>Put it in an attractive bottle, tie string around the neck, and suddenly you have an artisan product.</p>
      <p>You also have a food that needs more care than its appearance suggests.</p>
      <p>Homemade garlic-in-oil mixtures stored at room temperature can create conditions in which the bacteria responsible for botulism can grow. A bottle of oil does not make fresh garlic shelf-stable.</p>
      <p>The National Center for Home Food Preservation advises keeping homemade garlic-in-oil refrigerated at <strong>4°C/40°F or below for no more than four days</strong>, or freezing it for longer storage. Commercial products may have been processed differently; follow their labels. <a href={sources.garlic}>Read the NCHFP guidance.</a></p>
      <p>And a squeeze of lemon added by instinct is not a validated preservation method.</p>
      <p>Make it because it tastes good. Store it according to guidance, rather than according to how convincing the bottle looks.</p>

      <h2 id="cooling">A large pot is excellent for cooking and awkward for cooling</h2>
      <p>A deep saucepan holds heat beautifully.</p>
      <p>That is helpful while making a stew. Less helpful when you are trying to get the leftovers cold.</p>
      <p>The centre can remain warm long after the outside feels reasonably cool. Leaving the whole pot out until it reaches room temperature can take far too long.</p>
      <p>Divide larger quantities into shallow containers so heat can escape. Small portions of hot food can go into the fridge; for a large batch, an ice-water bath and smaller containers can help bring the temperature down promptly. Give the containers space rather than tightly stacking a tower of warm food. <a href={sources.cooling}>USDA guidance explains these cooling methods.</a></p>
      <p>Get perishable leftovers cooled and refrigerated within two hours. Rice needs the quicker handling described above. <a href={sources.leftovers}>See the FSA’s household leftovers guidance.</a></p>
      <p>The useful equipment here is often a few shallow tubs and a marker pen.</p>
      <p>A label reading “chicken stew, Tuesday” will tell you more on Friday than a lid and an optimistic expression.</p>

      <h2 id="boards">The chopping board does not need to look dirty</h2>
      <p>Cross-contamination is often an entirely ordinary sequence of events.</p>
      <p>You cut raw chicken. You move it to the pan. You chop some herbs for the finished dish.</p>
      <p>Same board. Same knife. Perhaps the same hands.</p>
      <p>The chicken gets cooked. The herbs don’t.</p>
      <p>Keeping a separate board for raw meat and another for ready-to-eat foods makes that sequence easier to avoid. If you are using the same equipment, clean and sanitise it appropriately between tasks, along with washing your hands and cleaning any surfaces touched by raw ingredients.</p>
      <p>Wood and plastic can both be suitable. Neither material compensates for poor cleaning, and badly worn boards with difficult-to-clean grooves need replacing. Follow the manufacturer’s care instructions. <a href={sources.boards}>USDA cutting-board guidance.</a></p>
      <p>Also consider the things surrounding the board: the tap you touched, the drawer handle, the pepper mill.</p>
      <p>A suspicious amount of kitchen equipment gets handled immediately after raw chicken.</p>

      <h2 id="cloths">The cloth has been places</h2>
      <p>A cloth can make a surface look clean while moving contamination somewhere new.</p>
      <p>If it has wiped raw meat juices, it should not then straighten up the salad area. A quick rinse is not necessarily enough to prepare it for another job.</p>
      <p>Use separate clean cloths for different tasks, replace them frequently, and wash reusable ones appropriately. Disposable paper is useful for cleaning up raw meat spills, followed by proper cleaning and disinfection of the surface. <a href={sources.cleaning}>Cleaning guidance from the FSA.</a></p>
      <p>The same principle applies to hands.</p>
      <p>Wiping them on an apron does not count as washing them. Even if you do it with the brisk confidence of someone on television.</p>

      <h2 id="chemicals">Cleaning chemicals need instructions, not enthusiasm</h2>
      <p>More cleaning product does not automatically mean more cleanliness.</p>
      <p>Some products remove dirt and grease. Others sanitise or disinfect. Some are suitable for food-contact surfaces; some require rinsing afterwards. Many need a specified contact time to work.</p>
      <p>Read the label.</p>
      <p>Use the stated dilution, allow the required contact time, and follow any rinsing instructions before food touches the surface again. Clean away food residue first where the instructions require it. <a href={sources.cleaning}>The FSA explains cleaning and disinfection.</a></p>
      <p>Keep chemicals away from food and never decant them into drinks bottles. Don’t mix cleaning products, especially bleach with acids or ammonia-containing products. <a href={sources.chemicals}>CDC guidance on using bleach safely.</a></p>
      <p>A powerful smell is not proof that you have done a better job.</p>

      <h2 id="fridge">Your fridge needs a little organisation</h2>
      <p>You do not need matching containers and a label maker that connects to your phone.</p>
      <p>You do need to keep raw food from dripping onto food that is ready to eat.</p>
      <p>Store raw meat and fish securely contained on the bottom shelf. Keep cooked food covered and separate. Use a fridge thermometer rather than assuming that the numbered dial tells you the actual temperature.</p>
      <p>Under UK household guidance, keep the fridge at <strong>5°C or below</strong>; particular foods may call for colder storage, such as the homemade garlic oil mentioned earlier. <a href={sources.chilling}>FSA chilling guidance.</a></p>
      <p>Don’t pack it so tightly that cold air cannot circulate. And remember that putting food in a fridge slows things down; it does not erase the hours it spent sitting out beforehand.</p>

      <h2 id="leftovers">“It smells fine” has limits</h2>
      <p>Smell is useful for spotting some spoilage.</p>
      <p>It cannot establish that a food has been stored safely.</p>
      <p>Some harmful bacteria and toxins do not announce themselves with a bad smell, an unusual colour or a small warning flag.</p>
      <p>Follow use-by dates, product instructions and the storage history you actually know. Don’t taste food to find out whether it is safe. Best-before dates concern quality rather than being the same as use-by dates. <a href={sources.rice}>The FSA’s home food fact checker explains the distinction.</a></p>
      <p>For general leftovers, UK household guidance is to eat them within 48 hours or freeze them, with shorter instructions for foods such as rice. Reheat only once, until steaming hot all the way through. Other countries publish different recommendations, so use the guidance appropriate to where you live rather than combining the most generous parts of several systems. <a href={sources.leftovers}>FSA leftovers and reheating guidance.</a></p>
      <p>If you cannot remember when you cooked something, a date label would have been considerably more useful than this paragraph.</p>

      <h2 id="close-down">A two-minute kitchen close-down</h2>
      <p>The habit worth taking home from a professional kitchen is a short check before you finish.</p>
      <ul>
        <li>Put perishable food away promptly; portion larger batches so they cool quickly.</li>
        <li>Label leftovers with what they are and when they were cooked.</li>
        <li>Check that raw food is contained and below ready-to-eat food.</li>
        <li>Clean boards, knives, handles and surfaces used during preparation.</li>
        <li>Deal with used cloths and wash your hands.</li>
        <li>Put cleaning products away from food.</li>
      </ul>
      <p>It is a modest routine. Done regularly, it is more useful than a frantic cleaning performance when somebody knocks.</p>
      <p>I still remember the chef polishing that fryer.</p>
      <p>Now, when I finish cooking, I’m more interested in what is cooling beside it.</p>

      <p><small>Guidance checked 21 October 2026. UK household guidance is the main baseline; specific US sources are identified above. Follow product instructions and any personal advice from your healthcare team where relevant.</small></p>
    </BlogPostLayout>
  )
}
