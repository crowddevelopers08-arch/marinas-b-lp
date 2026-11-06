import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
        url: "/Marina-logo.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/Marina-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple:
      "/Marina-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
