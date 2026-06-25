"use client";

import SupportNavbar from "@/app/SupportNavbar";
import { useEffect } from "react";

export default function ThankYouPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      ((window as unknown) as { gtag: (...args: unknown[]) => void }).gtag("event", "conversion", {
        send_to: "AW-11005175836/NP50CNeMhascEJzQ1v8o",
        value: 1.0,
        currency: "INR",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--vk-lime-soft)] text-[var(--vk-green-dark)]">
      <SupportNavbar />
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-xl overflow-hidden rounded-tl-[36px] rounded-br-[36px] border border-[var(--vk-green)]/10 bg-white/95 p-8 text-center shadow-[0_24px_70px_rgba(18,110,110,0.16)] backdrop-blur sm:p-12">

          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--vk-lime-soft)] text-4xl font-black text-[var(--vk-green)]">
            ✓
          </div>

          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[var(--vk-pink)]" />
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--vk-green)]">
            Booking Confirmed
          </p>
          <h1 className="font-serif mb-4 text-3xl font-black text-[var(--vk-green-dark)] sm:text-5xl">
            Thank You!
          </h1>
          <p className="mx-auto mb-8 max-w-md text-base leading-7 text-gray-600 sm:text-lg">
            We&apos;ve received your consultation request. Our team will call you shortly to confirm your appointment slot.
          </p>

          <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-[var(--vk-green)]/10 bg-[var(--vk-lime-soft)] px-6 py-5 text-sm text-[var(--vk-green-dark)]">
            <div className="mb-2 font-semibold">What happens next?</div>
            <ol className="mt-2 list-none space-y-1 pl-0 text-left text-gray-600">
              <li>1. Our coordinator will call within 2 hours</li>
              <li>2. Your slot will be reserved on confirmation</li>
              <li>3. Visit us on the scheduled date</li>
            </ol>
          </div>

          <a
            href="/"
            className="inline-block rounded-full border-2 border-[var(--vk-pink)] bg-[var(--vk-pink)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(18,110,110,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--vk-pink-dark)]"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
