import { mistakes } from "./data";
import { SectionHeading } from "./Shared";

export default function MistakesSection() {
  return (
    <section className="mis">
      <div className="wrap">
        <SectionHeading eyebrow="The Biggest Mistake" title="What Most Weight Loss Patients Do Wrong" />
        <p className="mistake-body">Obesity is not a willpower problem. It is a medical condition that often requires medical intervention.</p>
        <div className="mistake-grid">
          {mistakes.map((item, index) => <div className="mistake-block" key={item}><div className="num">{String(index + 1).padStart(2, "0")}</div><p>{item}</p></div>)}
        </div>
      </div>
    </section>
  );
}
