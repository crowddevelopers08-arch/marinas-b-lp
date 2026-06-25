import { symptoms } from "./data";
import RevealSymptomCard from "./RevealSymptomCard";
import { SectionHeading } from "./Shared";

export default function CandidateSection() {
  return (
    <section id="candidate">
      <div className="wrap center">
        <SectionHeading eyebrow="Are You a Candidate?" title="If You Relate to Any of These, This Consultation Is for You" center />
      </div>

      {/* Desktop grid */}
      <div className="wrap symptom-grid-wrap">
        <div className="symptom-grid">
          {symptoms.map((item, index) => (
            <RevealSymptomCard key={item} index={index}>
              <span className="tick">✓</span><p>{item}</p>
            </RevealSymptomCard>
          ))}
        </div>
      </div>

      {/* Mobile auto-scroll */}
      <div className="symptom-scroll-outer">
        <div className="symptom-scroll-track">
          {[...symptoms, ...symptoms].map((item, i) => (
            <div className="symptom-card in" key={i}>
              <span className="tick">✓</span><p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
