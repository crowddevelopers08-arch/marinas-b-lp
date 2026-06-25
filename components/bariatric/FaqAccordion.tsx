"use client";

import { useState } from "react";

export default function FaqAccordion({ items }: { items: readonly (readonly [string, string])[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map(([question, answer], index) => {
        const isOpen = openIndex === index;
        return (
          <div className={`faq-item ${isOpen ? "open" : ""}`} key={question}>
            <button className="faq-q" type="button" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen}>
              {question}
              <span className="pm">+</span>
            </button>
            <div className="faq-a" style={{ maxHeight: isOpen ? 260 : 0 }}>
              <p>{answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
