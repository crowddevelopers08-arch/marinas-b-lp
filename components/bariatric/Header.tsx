import Image from "next/image";
import { BookButton } from "./Shared";

export default function Header() {
  return (
    <header className="topbar">
      <div className="wrap">
        <div className="logo-chip logo-image">
          <Image src="/Marina-logo.png" alt="Marina's Clinic" width={300} height={200} priority />
        </div>
        <span className="clinic-tag">Bariatric &amp; Metabolic Surgery</span>
        <BookButton className="btn btn-ghost">Book Consultation</BookButton>
      </div>
    </header>
  );
}
