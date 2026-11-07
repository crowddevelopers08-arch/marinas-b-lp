"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./Shared";

const videos = [
  { src: "https://res.cloudinary.com/dxntva1vn/video/upload/v1794027096/reel-1_eoa55z.mp4", label: "" },
  { src: "https://res.cloudinary.com/dxntva1vn/video/upload/v1794027095/reel-2_zqugxr.mp4", label: "" },
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
    videoRefs.current[index]?.play().catch(() => {});
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
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="vtest-video"
                  onVolumeChange={(e) => {
                    // When the viewer unmutes one video, stop the others.
                    if (!e.currentTarget.muted) stopOtherVideos(i);
                  }}
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
