import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "DR Checker — Free Bulk Domain Rating Checker",
    template: "%s | DR Checker"
  },
  description: "Check Ahrefs Domain Rating for any website instantly. Free bulk DR checker — check up to 1000 domains at once with real Ahrefs data.",
  keywords: ["domain rating checker", "DR checker", "Ahrefs DR", "bulk domain rating", "website authority checker", "SEO tool"],
  openGraph: {
    type: "website",
    url: "https://drchecker.io",
    title: "DR Checker — Free Bulk Domain Rating Checker",
    description: "Check Ahrefs Domain Rating for any website instantly. Real data, lightning fast.",
    siteName: "DR Checker",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
