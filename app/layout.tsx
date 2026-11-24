import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL('https://drchecker.io'),
  title: {
    default: "Ahrefs DR Checker — Free Bulk Domain Rating Checker | drchecker.io",
    template: "%s | DR Checker"
  },
  description: "Check Ahrefs Domain Rating (DR) of any website free. Bulk DR checker for up to 1,000 domains at once, with live Ahrefs data, sorting and CSV export.",
  keywords: ["ahrefs dr checker", "domain rating checker", "bulk dr checker", "check domain rating free", "increase domain rating", "ahrefs domain rating", "dr checker tool", "website authority checker"],
  openGraph: {
    type: "website",
    url: "https://drchecker.io",
    title: "Ahrefs DR Checker — Free Bulk Domain Rating Checker",
    description: "Check Ahrefs DR of any website free. Bulk check up to 1,000 domains with live Ahrefs data and CSV export.",
    siteName: "DR Checker",
    images: [{ url: "/logo-full.png", width: 1200, height: 600, alt: "DR Checker — Free Bulk Ahrefs DR Checker" }],
  },
  robots: { index: true, follow: true },
  verification: { google: '038Zy26d8MIZrr_v03ytiDGcOaioLdaal1fcqgRJpNY' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
