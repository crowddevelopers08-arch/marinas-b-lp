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
        url: "https://res.cloudinary.com/dthj7fakc/image/upload/v1781681953/Marina-logo_v7lcbn.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://res.cloudinary.com/dthj7fakc/image/upload/v1781681953/Marina-logo_v7lcbn.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple:
      "https://res.cloudinary.com/dthj7fakc/image/upload/v1781681953/Marina-logo_v7lcbn.png",
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
