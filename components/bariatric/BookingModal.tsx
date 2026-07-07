"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const concerns = [
  "Weight Loss Surgery",
  "Obesity & High BMI",
  "Type 2 Diabetes Management",
  "Hypertension",
  "Sleep Apnea",
  "Joint Pain due to Weight",
  "Other",
];

const FORM_NAME = "Marina Bariatrics";

type Status = "idle" | "loading" | "error";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      on(event: "payment.failed", handler: (response: RazorpayFailedResponse) => void): void;
      open(): void;
    };
  }
}

type RazorpayFailedResponse = {
  error?: {
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BookingModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", concern: "" });
  const [status, setStatus] = useState<Status>("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const leadSubmittedRef = useRef(false);

  useEffect(() => {
    const show = () => {
      leadSubmittedRef.current = false;
      setOpen(true);
      setStatus("idle");
    };
    window.addEventListener("open-booking-modal", show);
    return () => window.removeEventListener("open-booking-modal", show);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitLead = async () => {
    if (leadSubmittedRef.current) return;

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "Consultation Modal",
        formName: FORM_NAME,
        name: form.name,
        phone: form.phone,
        concern: form.concern,
        pageUrl: window.location.href,
      }),
    });

    if (!res.ok) throw new Error("Lead submission failed");
    leadSubmittedRef.current = true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Capture the lead before payment starts so checkout issues do not lose it.
      await submitLead();

      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay failed to load");

      // 2. Create order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, formName: FORM_NAME }),
      });
      if (!orderRes.ok) throw new Error("Order creation failed");
      const { orderId, amount, currency, keyId } = await orderRes.json();

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "Marina's Clinic",
        description: "Bariatric Consultation — Rs.1500",
        image: "/Marina-logo.png",
        prefill: { name: form.name, contact: form.phone },
        theme: { color: "#126e6e" },
        modal: {
          ondismiss: async () => {
            router.push("/thank-you");
          },
        },
        handler: async (response: Record<string, string>) => {
          // 4. Verify payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              formName: FORM_NAME,
              name: form.name,
              phone: form.phone,
            }),
          });
          const verified = await verifyRes.json();
          if (!verified.success) { setStatus("error"); return; }

          // 5. Redirect to thank-you
          router.push("/thank-you");
        },
      });

      rzp.on("payment.failed", async (response) => {
        const metadata = response.error?.metadata;

        if (metadata?.payment_id && metadata.order_id) {
          await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "payment.failed",
              razorpay_order_id: metadata.order_id,
              razorpay_payment_id: metadata.payment_id,
              name: form.name,
              phone: form.phone,
            }),
          });
        }
      });

      rzp.open();
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="modal-card" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Book Consultation">
        <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>

        <div className="modal-eyebrow">Book Your Consultation</div>
        <h2 className="modal-title">Rs.1· In-Clinic · Limited Slots</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label htmlFor="m-name">Full Name</label>
            <input id="m-name" type="text" placeholder="Your name" value={form.name} onChange={set("name")} required disabled={status === "loading"} />
          </div>
          <div className="modal-field">
            <label htmlFor="m-phone">Phone Number</label>
            <input id="m-phone" type="tel" placeholder="+91 99999 99999" value={form.phone} onChange={set("phone")} required disabled={status === "loading"} />
          </div>
          <div className="modal-field">
            <label htmlFor="m-concern">Primary Concern</label>
            <select id="m-concern" value={form.concern} onChange={set("concern")} required disabled={status === "loading"}>
              <option value="" disabled>Select your concern</option>
              {concerns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {status === "error" && <p className="modal-error">Payment failed. Please try again.</p>}
          <button type="submit" className="btn modal-submit" disabled={status === "loading"}>
            {status === "loading" ? "Opening Payment…" : "Proceed to Pay Rs.1500"}
          </button>
        </form>
      </div>
    </div>
  );
}
