import { afterItems, beforeItems } from "./data";
import { SectionHeading } from "./Shared";

export default function BeforeAfterSection() {
  return (
    <section className="mistakes">
      <div className="wrap center"><SectionHeading eyebrow="The Transformation" title="Life Before vs. Life After Treatment" center /></div>
      <div className="wrap">
        <div className="ba-grid">
          <div className="ba-card"><span className="ba-label before">Before</span><ul className="ba-list before">{beforeItems.map((item) => <li key={item}><span className="mk">x</span>{item}</li>)}</ul></div>
          <div className="ba-card"><span className="ba-label after">After</span><ul className="ba-list after">{afterItems.map((item) => <li key={item}><span className="mk">OK</span>{item}</li>)}</ul></div>
        </div>
      </div>
    </section>
  );
}
