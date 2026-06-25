"use client";

import { useEffect, useState } from "react";
import { textTestimonials } from "./data";
import { SectionHeading } from "./Shared";

const Card = ({ item }: { item: typeof textTestimonials[number] }) => (
  <div className="ttest">
    <div className="stars">★★★★★</div>
    <p>{item.text}</p>
    <div className="who">
      <div className="avatar">{item.initials}</div>
      <div><div className="nm">{item.name}</div><div className="sub">Verified Patient</div></div>
    </div>
  </div>
);

export default function TextTestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % textTestimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section>
      <div className="wrap center">
        <SectionHeading eyebrow="Patient Words" title="What Patients Say After Their Consultation" center />
      </div>

      {/* Desktop — normal grid */}
      <div className="wrap ttest-grid-wrap">
        <div className="ttest-grid">
          {textTestimonials.map((item) => <Card key={item.name} item={item} />)}
        </div>
      </div>

      {/* Mobile — auto carousel */}
      <div className="ttest-carousel-outer">
        <div className="wrap">
          {textTestimonials.map((item, i) => (
            <div key={item.name} className={`ttest-slide${i === active ? " ttest-slide--active" : ""}`}>
              <Card item={item} />
            </div>
          ))}
        </div>
        <div className="ttest-dots">
          {textTestimonials.map((_, i) => (
            <button
              key={i}
              className={`ttest-dot${i === active ? " ttest-dot--active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
