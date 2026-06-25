import { LogoChip } from "./Shared";

export default function Footer() {
  return (
    <footer>
      <div className="wrap sm:mb-12">
        <LogoChip />
        <div className="f-name">Dr.Preethi Mrinalini</div>
        <div className="f-role">Bariatric &amp; Metabolic Surgeon</div>
        <p className="disclaimer ">Disclaimer: The information provided on this page is for general awareness and educational purposes only and does not constitute medical advice. Individual results from bariatric and metabolic surgery vary and are not guaranteed. Eligibility for any procedure is determined only after a clinical evaluation. Please consult a qualified surgeon before making any treatment decision. © Marina&apos;s Clinic - Gastro &amp; General Surgery.</p>
      </div>
    </footer>
  );
}
