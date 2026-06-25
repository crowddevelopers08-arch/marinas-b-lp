import { BookButton } from "./Shared";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Important Message for Weight Loss Patients</span>
          <h1>Watch This Before You Decide What To Do About Your Weight</h1>
          <p className="lead">Discover why thousands of people continue struggling with obesity, failed diets, and health complications without realising that a permanent, medically proven solution exists.</p>
          <div className="hero-actions">
            <BookButton>Book My Consultation - Rs.1500</BookButton>
            <a className="btn btn-ghost" href="#candidate">Am I a Candidate?</a>
          </div>
        </div>
        <div className="hero-media">
          <div className="hero-video-wrap">
            <video
              src="https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video2_qtujea.mp4"
              controls
              playsInline
              preload="metadata"
              className="vsl-video"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
