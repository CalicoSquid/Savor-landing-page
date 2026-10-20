import Footer from '../components/Footer'
import { SAFETY_PRINTABLES } from '../data/safetyPrintables'
import './pages.css'
import './food-safety-printables.css'

function Downloads({ slug, title }) {
  return (
    <div className="safety-downloads">
      <a download href={`/printables/${slug}-a4.pdf`} aria-label={`Download ${title}, A4 PDF`}>Download A4 PDF ↓</a>
      <a download href={`/printables/${slug}-letter.pdf`} aria-label={`Download ${title}, US Letter PDF`}>US Letter PDF ↓</a>
    </div>
  )
}

export default function FoodSafetyPrintables() {
  return (
    <>
      <main className="page doc-page safety-printables">
        <div className="doc-inner">
          <span className="doc-eyebrow">Free from Savor</span>
          <h1 className="doc-title">The kitchen close-down kit.</h1>
          <p className="doc-lead">The inspector has gone home. The bacteria haven’t.</p>
          <p>Three practical sheets for the fridge door, the cupboard or the next batch of leftovers. Free to download, with no email address or account required.</p>
          <p>Made to go with <a href="/blog/food-safety-lessons-from-a-chef/">“They’re Here”: food-safety lessons from a chef</a>.</p>

          <section className="safety-kit" aria-labelledby="full-kit-title">
            <span className="doc-eyebrow">All three sheets · 3 pages</span>
            <h2 id="full-kit-title">Grab the whole kit</h2>
            <p>Closing checklist, leftover labels and fridge reference. Choose your paper size; each sheet fits one page.</p>
            <Downloads slug="kitchen-close-down-kit" title="Kitchen close-down kit" />
            <a className="safety-preview" href="/printables/kitchen-close-down-kit.html">Read or print the web version →</a>
          </section>

          <h2>Or pick a sheet</h2>
          <div className="safety-sheets">
            {SAFETY_PRINTABLES.map((sheet, index) => (
              <section className="safety-sheet-card" id={sheet.slug} key={sheet.slug} aria-labelledby={`${sheet.slug}-title`}>
                <span className="doc-eyebrow">Sheet 0{index + 1} · 1 page</span>
                <h3 id={`${sheet.slug}-title`}>{sheet.title}</h3>
                <p>{sheet.description}</p>
                <p className="safety-detail">{sheet.detail}</p>
                <Downloads slug={sheet.slug} title={sheet.title} />
                <a className="safety-preview" href={`/printables/${sheet.slug}.html`}>Read or print this sheet →</a>
              </section>
            ))}
          </div>

          <section className="safety-guidance" aria-labelledby="guidance-title">
            <h2 id="guidance-title">A few useful details</h2>
            <p>Use the A4 or US Letter file that matches your printer. These are low-ink designs on white paper. The labels are for cutting out and attaching to containers, not for a particular adhesive-label product.</p>
            <p>For home kitchens, using UK Food Standards Agency guidance as the everyday baseline. Homemade garlic-in-oil follows the specifically identified US National Center for Home Food Preservation advice. Follow product instructions and shorter food-specific limits. A handwritten date cannot establish that food was cooled or stored safely.</p>
            <p><strong>Guidance checked:</strong> 21 October 2026. Source links are included in every sheet.</p>
            <ul>
              <li><a href="https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker#rice">FSA: cooked rice</a></li>
              <li><a href="https://www.gov.uk/government/publications/cooking-your-food/cooking-your-food#using-your-leftovers">FSA: leftovers and reheating</a></li>
              <li><a href="https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely">FSA: chilling and fridge organisation</a></li>
              <li><a href="https://nchfp.uga.edu/how/freeze/vegetable/freezing-garlic-in-oil/">NCHFP: homemade garlic-in-oil</a></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
