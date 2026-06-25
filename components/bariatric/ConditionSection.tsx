import { conditions } from "./data";
import { SectionHeading } from "./Shared";

export default function ConditionSection() {
  return (
    <section>
      <div className="wrap center"><SectionHeading eyebrow="Understand Your Condition" title="Two Conditions, One Medical Approach" center /></div>
      <div className="wrap">
        <div className="split-2">
          {conditions.map((condition) => <div className="cond-card" key={condition.title}><div className="cond-head">{condition.title}</div><ul className="cond-list">{condition.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}
        </div>
      </div>
    </section>
  );
}
