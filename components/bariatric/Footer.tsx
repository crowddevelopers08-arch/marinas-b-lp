import Image from "next/image";

const PHONE_NUMBER ="+91 98840 00171";
const PHONE_HREF = "tel:+919884000171";

export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-grid max-sm:mb-8 sm:mb-12">
        <div className="footer-main">
          <Image className="footer-logo" src="/Marina-logo.png" alt="Marina's Clinic" width={300} height={200} />

          <div className="f-name">Dr.Preethi Mrinalini</div>
          <div className="f-role">Bariatric &amp; Metabolic Surgeon</div>
          <p className="disclaimer">Disclaimer: The information provided on this page is for general awareness and educational purposes only and does not constitute medical advice. Individual results from bariatric and metabolic surgery vary and are not guaranteed. Eligibility for any procedure is determined only after a clinical evaluation. Please consult a qualified surgeon before making any treatment decision. © Marina&apos;s Clinic - Gastro &amp; General Surgery.</p>
        </div>
        <div className="footer-contact" aria-label="Clinic contact details">
          <div className="f-contact-label">Visit Us</div>
          <address className="f-address">40 &amp; 54, Josier St, Nungambakkam, Chennai 600034</address>
          <a className="f-phone" href={PHONE_HREF}>{PHONE_NUMBER}</a>
        </div>
      </div>
    </footer>
  );
}
