"use client";

import Image from "next/image";

export default function SupportNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--vk-green)]/10 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 sm:px-6 sm:py-3">

        {/* Logo */}
        <a href="/" className="flex items-center no-underline">
          <Image
            src="/Marina-logo.png"
            alt="Marina's Clinic"
            width={160}
            height={82}
            priority
            className="h-15 w-auto sm:h-25"
          />
        </a>

        {/* CTA Button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--vk-green)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_6px_20px_rgba(18,110,110,0.28)] transition hover:-translate-y-0.5 hover:bg-[var(--vk-pink-dark)] sm:px-6 sm:py-2.5 sm:text-sm"
        >
          <span className="hidden sm:inline">Book Consultation</span>
          <span className="sm:hidden">Book Now</span>
        </a>

      </div>
    </nav>
  );
}
