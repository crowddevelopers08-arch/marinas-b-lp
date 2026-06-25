const marqueeItems = ["Advanced Bariatric Surgery", "Laparoscopic Weight Loss", "Sleeve Gastrectomy", "Gastric Bypass", "Metabolic Surgery", "Diabetes Remission", "Long-term Results", "Same-Day Consultations"];

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...marqueeItems, ...marqueeItems].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
      </div>
    </div>
  );
}
