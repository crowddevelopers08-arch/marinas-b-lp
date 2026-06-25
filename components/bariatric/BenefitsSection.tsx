import { benefits } from "./data";
import { SectionHeading } from "./Shared";

const BenefitCard = ({ icon, title, copy }: { icon: string; title: string; copy: string }) => (
  <div className="benefit">
    <div className="ic">{icon}</div>
    <h3>{title}</h3>
    <p>{copy}</p>
  </div>
);

export default function BenefitsSection() {
  return (
    <section>
      <div className="wrap center">
        <SectionHeading eyebrow="Modern Treatment" title="Why Bariatric Surgery Is Different Today" center />
      </div>

      {/* Desktop grid */}
      <div className="wrap benefit-grid-wrap">
        <div className="benefit-grid">
          {benefits.map(([icon, title, copy]) => (
            <BenefitCard key={title} icon={icon} title={title} copy={copy} />
          ))}
        </div>
      </div>

      {/* Mobile auto-scroll */}
      <div className="benefit-scroll-outer">
        <div className="benefit-scroll-track">
          {[...benefits, ...benefits].map(([icon, title, copy], i) => (
            <BenefitCard key={i} icon={icon} title={title} copy={copy} />
          ))}
        </div>
      </div>
    </section>
  );
}
