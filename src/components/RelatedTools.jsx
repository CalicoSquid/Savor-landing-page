import { TOOL_PAGE_BY_ID } from '../data/toolPages'

export default function RelatedTools({ current }) {
  const tool = TOOL_PAGE_BY_ID[current]
  if (!tool) return null

  const related = tool.related.map((id) => TOOL_PAGE_BY_ID[id]).filter(Boolean)
  if (!related.length) return null

  return (
    <section className="tool-shell related-tools" aria-labelledby={`related-tools-${current}`}>
      <span className="doc-eyebrow">Related kitchen tools</span>
      <h2 id={`related-tools-${current}`}>Keep the kitchen maths moving.</h2>
      <div className="related-tools-grid">
        {related.map((item) => (
          <a href={item.href} className="related-tool-card" key={item.id}>
            <span className="tool-card-eyebrow">{item.category}</span>
            <strong>{item.title}</strong>
            <span>{item.description}</span>
            <em>{item.action} →</em>
          </a>
        ))}
      </div>
    </section>
  )
}
