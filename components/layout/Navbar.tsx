'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, TrendingUp, Search, Layers, Tag, BookOpen, LogIn } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'DR Checker', href: '/', icon: <Search className="w-4 h-4" /> },
    { label: 'Bulk DR Checker', href: '/bulk-dr-checker', icon: <Layers className="w-4 h-4" /> },
    { label: 'Increase DR', href: '/increase-dr', icon: <TrendingUp className="w-4 h-4" />, accent: true },
    { label: 'Pricing', href: '/#pricing', icon: <Tag className="w-4 h-4" /> },
    { label: 'Blog', href: '/blog', icon: <BookOpen className="w-4 h-4" /> },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

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
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-nav.png" alt="DR Checker — Free Bulk Ahrefs Domain Rating Checker"
              className="h-14 sm:h-16 w-auto transition-transform group-hover:scale-[1.03]" />
          </Link>

          {/* Desktop nav — glassy pill bar */}
          <div className="hidden lg:flex items-center gap-1 px-1.5 py-1.5 rounded-2xl"
            style={{ background: 'rgba(15,22,41,0.55)', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(12px)' }}>
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link key={link.href} href={link.href}
                  className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group"
                  style={
                    active
                      ? { background: 'linear-gradient(135deg, rgba(255,138,30,0.18), rgba(255,106,0,0.1))', color: '#FFB25E', border: '1px solid rgba(255,138,30,0.35)' }
                      : { color: '#8B96AD', border: '1px solid transparent' }
                  }>
                  <span className={`transition-colors ${active ? '' : 'group-hover:text-white'}`}
                    style={{ color: active ? '#FFB25E' : link.accent ? '#FFA94D' : undefined }}>
                    {link.icon}
                  </span>
                  <span className={active ? '' : 'group-hover:text-white transition-colors'}>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            <Link href="/login"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ color: '#CBD5E1', background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.15)' }}>
              <LogIn className="w-4 h-4" /> Log in
            </Link>
            <Link href="/signup" className="btn-primary px-5 py-2.5 text-sm">Sign up free</Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl"
            aria-label="Menu"
            style={{ background: 'rgba(15,22,41,0.65)', border: '1px solid rgba(148,163,184,0.15)' }}>
            {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mx-3 mb-3 p-3 rounded-2xl animate-slide-up"
          style={{ background: 'rgba(10,15,30,0.98)', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(16px)' }}>
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={active
                    ? { background: 'linear-gradient(135deg, rgba(255,138,30,0.18), rgba(255,106,0,0.1))', color: '#FFB25E', border: '1px solid rgba(255,138,30,0.35)' }
                    : { color: '#CBD5E1', border: '1px solid rgba(148,163,184,0.08)' }}
                  onClick={() => setMobileOpen(false)}>
                  <span style={{ color: active ? '#FFB25E' : link.accent ? '#FFA94D' : '#8B96AD' }}>{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
            <div className="border-t my-2" style={{ borderColor: 'rgba(148,163,184,0.1)' }} />
            <Link href="/login"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)' }}
              onClick={() => setMobileOpen(false)}>
              <LogIn className="w-4 h-4" /> Log in
            </Link>
            <Link href="/signup" className="btn-primary py-3 text-sm" onClick={() => setMobileOpen(false)}>Sign up free</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
