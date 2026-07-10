'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, BarChart3, TrendingUp } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'DR Checker', href: '/' },
    { label: 'Bulk DR Checker', href: '/bulk-dr-checker' },
    { label: 'Increase DR', href: '/increase-dr' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Blog', href: '/blog' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(7,11,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(148,163,184,0.1)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-nav.png" alt="DR Checker — Free Bulk Ahrefs Domain Rating Checker"
              className="h-14 sm:h-16 w-auto transition-transform group-hover:scale-[1.03]" />
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="nav-link px-3 py-2">Log in</Link>
            <Link href="/signup" className="btn-primary px-5 py-2 text-sm">Sign up free</Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 card flex items-center justify-center" aria-label="Menu" style={{ borderRadius: '10px' }}>
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden mx-3 mb-3 card p-4 animate-slide-up" style={{ background: 'rgba(10,15,30,0.97)' }}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                onClick={() => setMobileOpen(false)}>
                {link.label === 'Increase DR' && <TrendingUp className="w-4 h-4" style={{ color: '#FFA94D' }} />}
                {link.label}
              </Link>
            ))}
            <div className="border-t my-2" style={{ borderColor: 'rgba(148,163,184,0.1)' }} />
            <Link href="/login" className="px-4 py-3 rounded-xl text-sm font-medium text-center text-white hover:bg-white/5" onClick={() => setMobileOpen(false)}>Log in</Link>
            <Link href="/signup" className="btn-primary py-3 text-sm" onClick={() => setMobileOpen(false)}>Sign up free</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
