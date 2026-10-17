import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

const alexandria = localFont({
  src: "../public/fonts/Alexandria.ttf",
  weight: "100 900",
  style: "normal",
  variable: "--font-alexandria",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://alaamir.co"),
  title: "عمرہ سروے | AlAamir International",
  description: "اپنی عمرہ ترجیحات، رہائش اور بجٹ بتائیں تاکہ AlAamir International آپ کے لیے موزوں سفر کی تجاویز تیار کر سکے۔",
  alternates: { canonical: "/" },
  openGraph: { title: "عمرہ سروے | AlAamir International", description: "اپنے عمرہ سفر کی ترجیحات ہمارے ساتھ شیئر کریں۔", locale: "ur_PK", type: "website" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ur" dir="rtl" className={alexandria.variable}><body>{children}</body></html>;
}
