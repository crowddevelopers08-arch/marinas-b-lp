import { afterItems, beforeItems } from "./data";
import Image from "next/image";
import { SectionHeading } from "./Shared";

const transformations = [
  {
    image: "/before1.png",
    name: "Patient Transformation",
    result: "Mobility, confidence, and daily energy improved",
  },
  {
    image: "/before2.png",
    name: "Weight Loss Journey",
    result: "Visible change with specialist-led medical support",
  },
  {
    image: "/before3.png",
    name: "Life After Treatment",
    result: "Better routine, healthier habits, renewed confidence",
  },
];

export default function BeforeAfterSection() {
  return (
    <section className="before-after-section">
      <div className="wrap center">
        <SectionHeading
          eyebrow="The Transformation"
          title="Real Change You Can See"
          lead="Every patient journey is personal. These transformations show what structured bariatric care can help unlock."
          center
        />
      </div>
      <div className="wrap">
        <div className="ba-photo-grid">
          {transformations.map((item, index) => (
            <article className="ba-photo-card" key={item.image}>
              <div className="ba-photo">
                <Image
                  src={item.image}
                  alt={`${item.name} before and after bariatric treatment`}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 30vw, 330px"
                  className="ba-photo-img"
                />
                {/* <div className="ba-photo-tags" aria-hidden="true">
                  <span>Before</span>
                  <span>After</span>
                </div> */}
              </div>
              {/* <div className="ba-photo-copy"> */}
                {/* <span className="ba-count">0{index + 1}</span> */}
                {/* <h3>{item.name}</h3>
                <p>{item.result}</p> */}
              {/* </div> */}
            </article>
          ))}
        </div>

        {/* <div className="ba-grid">
          <div className="ba-card">
            <span className="ba-label before">Before</span>
            <ul className="ba-list before">
              {beforeItems.map((item) => (
                <li key={item}><span className="mk">x</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="ba-card">
            <span className="ba-label after">After</span>
            <ul className="ba-list after">
              {afterItems.map((item) => (
                <li key={item}><span className="mk">OK</span>{item}</li>
              ))}
            </ul>
          </div>
        </div> */}
      </div>
    </section>
  );
}
