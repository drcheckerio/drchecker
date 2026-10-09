import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Create Your Free Account',
  description: 'Sign up free for DR Checker — 50 domains per bulk check, 10 checks every day, CSV export. No credit card required.',
  alternates: { canonical: 'https://drchecker.io/signup' },
}
export default function SignupLayout({ children }: { children: React.ReactNode }) { return children }
