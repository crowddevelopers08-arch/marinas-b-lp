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
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const stopVideo = (video: HTMLVideoElement | null) => {
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const stopOtherVideos = (activeIndex: number) => {
    videoRefs.current.forEach((video, index) => {
      if (!video || index === activeIndex) return;
      stopVideo(video);
    });
  };

  const selectVideo = (index: number) => {
    videoRefs.current.forEach(stopVideo);
    setActive(index);
  };

  const prev = () => {
    selectVideo((active - 1 + videos.length) % videos.length);
  };

  const next = () => {
    selectVideo((active + 1) % videos.length);
  };

  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => video?.pause());
    };
  }, []);

  return (
    <section className="mistakes">
      <div className="wrap center">
        <SectionHeading eyebrow="What Doctor Say's" title="Quick videos. Clear answers. Better decisions." center />
      </div>
      <div className="vtest-carousel-wrap">
        <button className="vtest-arrow" onClick={prev} aria-label="Previous video">&#8249;</button>
        <div className="vtest-carousel">
          {videos.map(({ src, label }, i) => (
            <div key={src} className={`vtest-slide${i === active ? " vtest-slide--active" : ""}`}>
              <div className="vtest">
                <video
                  ref={(element) => {
                    videoRefs.current[i] = element;
                  }}
                  src={src}
                  controls
                  playsInline
                  preload="metadata"
                  className="vtest-video"
                  onPlay={() => stopOtherVideos(i)}
                  onPlaying={() => stopOtherVideos(i)}
                />
                {label ? <div className="video-label">{label}</div> : null}
              </div>
            </div>
          ))}
        </div>
        <button className="vtest-arrow" onClick={next} aria-label="Next video">&#8250;</button>
      </div>
      <div className="vtest-dots">
        {videos.map((_, i) => (
          <button
            key={i}
            className={`vtest-dot${i === active ? " vtest-dot--active" : ""}`}
            onClick={() => selectVideo(i)}
            aria-label={`Show video ${i + 1}`}
          />
        ))}
      </div>
      <div className="vtest-full-video">
        <p>Want to watch more complete patient videos and doctor updates?</p>
        <a
          href="https://www.instagram.com/dr.preethimrinalini?igsh=YWkzdmlsc3l0aWF5"
          target="_blank"
          rel="noopener noreferrer"
        >
          View full videos on Instagram
        </a>
      </div>
    </section>
  );
}
