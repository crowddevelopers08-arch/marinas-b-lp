import SupportNavbar from "@/app/SupportNavbar";

export const metadata = {
  title: "Privacy Policy — Marina's Clinic",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--vk-lime-soft)] text-[var(--vk-green-dark)]">
      <SupportNavbar />
      <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-tl-[28px] rounded-br-[28px] border border-[var(--vk-green)]/10 bg-white/95 p-8 shadow-[0_24px_70px_rgba(18,110,110,0.12)] sm:p-12">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--vk-pink)]" />
            <h1 className="font-serif text-3xl font-black text-[var(--vk-green-dark)] sm:text-4xl">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">Last updated: June 2025</p>
          </div>

          <div className="space-y-6 text-sm leading-7 text-gray-600">
            <section>
              <h2 className="mb-2 text-lg font-bold text-[var(--vk-green-dark)]">1. Information We Collect</h2>
              <p>When you submit a consultation request on this website, we collect your name, phone number, and the health concern you have shared. We may also collect your IP address and browser information automatically through standard web technologies.</p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-[var(--vk-green-dark)]">2. How We Use Your Information</h2>
              <p>The information you provide is used solely to contact you regarding your consultation request and to assist in scheduling your appointment with our medical team. We do not use your personal information for marketing purposes without your explicit consent.</p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-[var(--vk-green-dark)]">3. Data Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties. Your data may be shared with our scheduling and CRM systems only to facilitate your consultation. These systems are bound by confidentiality obligations.</p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-[var(--vk-green-dark)]">4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal data. All form submissions are transmitted over HTTPS. However, no method of transmission over the internet is 100% secure.</p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-[var(--vk-green-dark)]">5. Cookies &amp; Tracking</h2>
              <p>This website uses cookies and similar tracking technologies (Google Analytics, Google Ads, Facebook Pixel, Microsoft Clarity) to understand how visitors use our site and to improve our services. You can disable cookies in your browser settings at any time.</p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-[var(--vk-green-dark)]">6. Your Rights</h2>
              <p>You have the right to request access to, correction of, or deletion of your personal information. To exercise these rights, please contact us using the details listed on our website.</p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold text-[var(--vk-green-dark)]">7. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact Marina&apos;s Clinic at the phone number or address listed on our website.</p>
            </section>
          </div>

          <div className="mt-10 text-center">
            <a
              href="/"
              className="inline-block rounded-full border-2 border-[var(--vk-pink)] bg-[var(--vk-pink)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(18,110,110,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--vk-pink-dark)]"
            >
              Back to Home
            </a>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
