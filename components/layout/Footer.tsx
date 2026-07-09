import Link from 'next/link'
import { BarChart3, Mail } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  const links = {
    Tools: [
      { label: 'DR Checker', href: '/' },
      { label: 'Bulk DR Checker', href: '/bulk-checker' },
      { label: 'Increase DR', href: '/increase-dr' },
    ],
    Company: [
      { label: 'Blog', href: '/blog' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Contact Us', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  }

  return (
    <footer className="mt-16" style={{ borderTop: '1px solid rgba(148,163,184,0.1)', background: 'rgba(7,11,20,0.8)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.png" alt="DR Checker logo" width={38} height={38} className="rounded-xl" />
              <span className="font-extrabold text-lg text-white">DR <span style={{ color: '#FF8A1E' }}>Checker</span></span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              The fastest way to check Ahrefs Domain Rating for any website — free bulk DR checker with live Ahrefs data, plus guaranteed DR increase services.
            </p>
            <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> Contact us
            </Link>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-bold text-sm mb-4 text-white">{category}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted text-sm hover:text-white transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}>
          <p className="text-muted text-xs">© {year} drchecker.io — All rights reserved.</p>
          <p className="text-muted text-xs flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: '#FF8A1E' }}></span>
            Live DR data powered by Ahrefs
          </p>
        </div>
      </div>
    </footer>
  )
}
