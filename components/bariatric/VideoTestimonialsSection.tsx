"use client";

import { useState } from "react";
import { SectionHeading } from "./Shared";

const videos = [
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762970/video1_kaazse.mp4", label: "" },
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video2_qtujea.mp4", label: "" },
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video3_rpzmq3.mp4", label: "" },
];

export default function VideoTestimonialsSection() {
  const [active, setActive] = useState(1);
  const prev = () => setActive((i) => (i - 1 + videos.length) % videos.length);
  const next = () => setActive((i) => (i + 1) % videos.length);

  return (
    <section className="mistakes">
      <div className="wrap center">
        <SectionHeading eyebrow="Real Patient Journeys" title="Hear It From Those Who Took the Step" center />
      </div>
      <div className="vtest-carousel-wrap">
        <button className="vtest-arrow" onClick={prev} aria-label="Previous">&#8249;</button>
        <div className="vtest-carousel">
          {videos.map(({ src, label }, i) => (
            <div
              key={src}
              className={`vtest-slide${i === active ? " vtest-slide--active" : ""}`}
              onClick={() => setActive(i)}
            >
              <div className="vtest">
                <video
                  src={src}
                  controls={i === active}
                  playsInline
                  preload="metadata"
                  className="vtest-video"
                />
                <div className="video-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="vtest-arrow" onClick={next} aria-label="Next">&#8250;</button>
      </div>
      <div className="vtest-dots">
        {videos.map((_, i) => (
          <button
            key={i}
            className={`vtest-dot${i === active ? " vtest-dot--active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Go to story ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
