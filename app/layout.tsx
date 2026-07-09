import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://drchecker.io'),
  title: {
    default: "Ahrefs DR Checker — Free Bulk Domain Rating Checker | drchecker.io",
    template: "%s | DR Checker"
  },
  description: "Check Ahrefs Domain Rating (DR) of any website free. Bulk DR checker for up to 1,000 domains. Plus guaranteed DR increase services — DR 20+ to DR 70+ in 2-4 weeks.",
  keywords: ["ahrefs dr checker", "domain rating checker", "bulk dr checker", "check domain rating free", "increase domain rating", "ahrefs domain rating", "dr checker tool", "website authority checker"],
  openGraph: {
    type: "website",
    url: "https://drchecker.io",
    title: "Ahrefs DR Checker — Free Bulk Domain Rating Checker",
    description: "Check Ahrefs DR of any website free. Bulk check up to 1,000 domains. Guaranteed DR increase services available.",
    siteName: "DR Checker",
    images: [{ url: "/logo-full.png", width: 1200, height: 600, alt: "DR Checker — Free Bulk Ahrefs DR Checker" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
