import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Bariatric Surgery Consultation - Marina's Clinic",
  description:
    "Permanent, medically proven weight loss solutions. Book a bariatric and metabolic surgery consultation at Marina's Clinic.",

  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/dxntva1vn/image/upload/v1794027007/Marina-logo_tjcywr.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://res.cloudinary.com/dxntva1vn/image/upload/v1794027007/Marina-logo_tjcywr.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple:
      "https://res.cloudinary.com/dxntva1vn/image/upload/v1794027007/Marina-logo_tjcywr.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-5CK5DZPR"
          strategy="beforeInteractive"
        />
        <Script id="gtag-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
