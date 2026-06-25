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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
