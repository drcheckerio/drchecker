import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Contact Us — DR Checker Support',
  description: 'Contact the drchecker.io team about bulk DR checking, Pro subscriptions, or a custom Increase DR package. We reply within 24 hours.',
  alternates: { canonical: 'https://drchecker.io/contact' },
}
export default function ContactLayout({ children }: { children: React.ReactNode }) { return children }
