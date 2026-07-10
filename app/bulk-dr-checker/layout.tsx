import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bulk DR Checker — Check Ahrefs Domain Rating for 1,000 Domains at Once',
  description: 'The most powerful Bulk DR Checker online. Check Ahrefs Domain Rating for up to 1,000 domains in one click — free bulk domain rating checker with live Ahrefs data, CSV export and sorting. Built for SEO agencies and digital marketers.',
  keywords: ['bulk dr checker', 'bulk domain rating checker', 'check dr in bulk', 'bulk ahrefs dr checker', 'mass dr checker', 'multiple domain rating checker', 'bulk website authority checker', 'dr checker for agencies'],
  alternates: { canonical: 'https://drchecker.io/bulk-dr-checker' },
}

export default function BulkDRCheckerLayout({ children }: { children: React.ReactNode }) {
  return children
}
