"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./Shared";

const videos = [
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762970/video1_kaazse.mp4", label: "" },
  // { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video2_qtujea.mp4", label: "" },
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video3_rpzmq3.mp4", label: "" },
  // { src: "https://ik.imagekit.io/tpucbav8z/marinias1_squished.mp4", label: "" },
  // { src: "https://ik.imagekit.io/tpucbav8z/output%201hernia_squished.mp4", label: "" },
];

export default function VideoTestimonialsSection() {
  const [active, setActive] = useState(1);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const visibleVideoIndexes = [
    (active - 1 + videos.length) % videos.length,
    active,
    (active + 1) % videos.length,
  ];

  const prev = () => {
    selectVideo((active - 1 + videos.length) % videos.length);
  };
  const next = () => {
    selectVideo((active + 1) % videos.length);
  };
  const selectVideo = (index: number) => {
    if (index === active) return;
    setIsChanging(true);
    setIsAutoPaused(false);
    setActive(index);
  };

  useEffect(() => {
    if (isAutoPaused) return;

    const t = setInterval(() => {
      setIsChanging(true);
      setActive((i) => (i + 1) % videos.length);
    }, 5000);
    return () => clearInterval(t);
  }, [isAutoPaused]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video || index === active) return;
      video.pause();
      video.currentTime = 0;
    });
  }, [active]);

  useEffect(() => {
    if (!isChanging) return;
    const t = setTimeout(() => setIsChanging(false), 320);
    return () => clearTimeout(t);
  }, [isChanging, active]);

  return (
    <section className="mistakes">
      <div className="wrap center">
        <SectionHeading eyebrow="What Doctor Say's" title="Stories From Those Who Chose Change" center />
      </div>
      <div className="vtest-carousel-wrap">
        <button className="vtest-arrow" onClick={prev} aria-label="Previous">&#8249;</button>
        <div className={`vtest-carousel${isChanging ? " vtest-carousel--changing" : ""}`}>
          {visibleVideoIndexes.map((i) => {
            const { src, label } = videos[i];

            return (
            <div
              key={src}
              className={`vtest-slide${i === active ? " vtest-slide--active" : ""}`}
              onClick={() => {
                selectVideo(i);
              }}
            >
              <div className="vtest">
                <video
                  ref={(element) => {
                    videoRefs.current[i] = element;
                  }}
                  src={src}
                  controls={i === active}
                  playsInline
                  preload="metadata"
                  className="vtest-video"
                  onClick={(event) => event.stopPropagation()}
                  onPlay={() => setIsAutoPaused(true)}
                  onPlaying={() => setIsAutoPaused(true)}
                />
                <div className="video-label">{label}</div>
              </div>
            </div>
            );
          })}
        </div>
        <button className="vtest-arrow" onClick={next} aria-label="Next">&#8250;</button>
      </div>
      <div className="vtest-dots">
        {videos.map((_, i) => (
          <button
            key={i}
            className={`vtest-dot${i === active ? " vtest-dot--active" : ""}`}
            onClick={() => {
              selectVideo(i);
            }}
            aria-label={`Go to story ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
