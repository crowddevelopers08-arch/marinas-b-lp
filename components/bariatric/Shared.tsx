"use client";

export function LogoChip() {
  return (
    <div className="logo-chip text-logo" aria-label="Marina's Clinic">
      <span className="logo-main">Marina&apos;s</span>
      <span className="logo-sub">Clinic</span>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, lead, center = false }: { eyebrow: string; title: string; lead?: string; center?: boolean }) {
  return (
    <div className={center ? "center" : undefined}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}

export function BookButton({ children, className = "btn" }: { children: React.ReactNode; className?: string }) {
  const open = () => window.dispatchEvent(new CustomEvent("open-booking-modal"));
  return <button type="button" className={className} onClick={open}>{children}</button>;
}

export function PlayButton({ small = false }: { small?: boolean }) {
  return <span className={small ? "play-btn small" : "play-btn"}>Play</span>;
}
