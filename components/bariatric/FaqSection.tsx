import { faqs } from "./data";
import FaqAccordion from "./FaqAccordion";
import { SectionHeading } from "./Shared";

export default function FaqSection() {
  return (
    <section className="mistakes">
      <div className="wrap center"><SectionHeading eyebrow="Common Questions" title="Your Bariatric Surgery Questions, Answered" center /></div>
      <div className="wrap"><FaqAccordion items={faqs} /></div>
    </section>
  );
}
