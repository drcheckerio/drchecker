import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to your DR Checker account to access bulk Domain Rating checking and your dashboard.',
  alternates: { canonical: 'https://drchecker.io/login' },
}
export default function LoginLayout({ children }: { children: React.ReactNode }) { return children }
