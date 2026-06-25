import Link from 'next/link'
import { BarChart3, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const links = {
    Tools: [
      { label: 'DR Checker', href: '/' },
      { label: 'Bulk DR Checker', href: '/bulk-checker' },
      { label: 'Improve DR', href: '/#services' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Refund Policy', href: '/refund-policy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  }

  return (
    <footer className="border-t border-glass mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">DR Checker</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              The fastest and most accurate way to check Ahrefs Domain Rating for any website. Free bulk DR checker with real-time data.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 glass-card rounded-xl flex items-center justify-center hover:border-brand-500 transition-all" aria-label="Twitter">
                <ExternalLink className="w-4 h-4 text-muted" />
              </a>
              <a href="#" className="w-9 h-9 glass-card rounded-xl flex items-center justify-center hover:border-brand-500 transition-all" aria-label="LinkedIn">
                <ExternalLink className="w-4 h-4 text-muted" />
              </a>
              <Link href="/contact" className="w-9 h-9 glass-card rounded-xl flex items-center justify-center hover:border-brand-500 transition-all">
                <Mail className="w-4 h-4 text-muted" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-4">{category}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted text-sm hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-glass mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © {year} DR Checker. All rights reserved.
          </p>
          <p className="text-muted text-xs flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
            DR data powered by Ahrefs
          </p>
        </div>
      </div>
    </footer>
  )
}
