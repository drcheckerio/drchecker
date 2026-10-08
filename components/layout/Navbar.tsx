'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Menu, X, TrendingUp, Search, Layers, Tag, BookOpen, LogIn, LayoutDashboard, Shield, Crown, LogOut, ChevronDown, User } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadProfile = async (uid: string) => {
      const { data } = await supabase.from('profiles').select('full_name, plan, is_admin, email').eq('id', uid).single()
      setProfile(data)
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setProfile(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
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

  const isPro = profile?.plan === 'pro'
  const displayName = profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Account'
  const initial = (displayName[0] || 'A').toUpperCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false); setMobileOpen(false)
    router.push('/')
  }

  const AccountButton = () => (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl transition-all"
        style={{ background: 'rgba(15,22,41,0.65)', border: '1px solid rgba(148,163,184,0.15)' }}>
        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
          style={{ background: 'linear-gradient(135deg, #FF8A1E, #FF6A00)' }}>{initial}</span>
        <span className="text-sm font-semibold text-white max-w-[90px] truncate">{displayName}</span>
        {isPro && <Crown className="w-3.5 h-3.5" style={{ color: '#FFA94D' }} />}
        <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl animate-slide-up z-50"
          style={{ background: 'rgba(10,15,30,0.98)', border: '1px solid rgba(148,163,184,0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
          <div className="px-3 py-2.5 mb-1 rounded-xl" style={{ background: 'rgba(148,163,184,0.05)' }}>
            <div className="text-sm font-bold text-white truncate">{profile?.full_name || displayName}</div>
            <div className="text-xs text-muted truncate">{profile?.email || user?.email}</div>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={isPro ? { background: 'rgba(255,138,30,0.15)', color: '#FFA94D', border: '1px solid rgba(255,138,30,0.3)' } : { background: 'rgba(148,163,184,0.1)', color: '#CBD5E1' }}>
              {isPro ? <><Crown className="w-2.5 h-2.5" /> PRO</> : 'FREE'}
            </span>
          </div>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors">
            <LayoutDashboard className="w-4 h-4 text-muted" /> Dashboard
          </Link>
          {profile?.is_admin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors">
              <Shield className="w-4 h-4" style={{ color: '#FFA94D' }} /> Admin Panel
            </Link>
          )}
          {!isPro && (
            <Link href="/#pricing" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors" style={{ color: '#FFA94D' }}>
              <Crown className="w-4 h-4" /> Upgrade to Pro
            </Link>
          )}
          <div className="border-t my-1.5" style={{ borderColor: 'rgba(148,163,184,0.1)' }} />
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4 text-muted" /> Log out
          </button>
        </div>
      )}
    </div>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(7,11,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(148,163,184,0.1)' : '1px solid transparent',
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center group flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-nav.png" alt="DR Checker — Free Bulk Ahrefs Domain Rating Checker"
              className="h-14 sm:h-16 w-auto transition-transform group-hover:scale-[1.03]" />
          </Link>

          {/* Desktop nav pill bar */}
          <div className="hidden lg:flex items-center gap-1 px-1.5 py-1.5 rounded-2xl"
            style={{ background: 'rgba(15,22,41,0.55)', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(12px)' }}>
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link key={link.href} href={link.href}
                  className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group"
                  style={active
                    ? { background: 'linear-gradient(135deg, rgba(255,138,30,0.18), rgba(255,106,0,0.1))', color: '#FFB25E', border: '1px solid rgba(255,138,30,0.35)' }
                    : { color: '#8B96AD', border: '1px solid transparent' }}>
                  <span className={active ? '' : 'group-hover:text-white transition-colors'}
                    style={{ color: active ? '#FFB25E' : link.accent ? '#FFA94D' : undefined }}>{link.icon}</span>
                  <span className={active ? '' : 'group-hover:text-white transition-colors'}>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            {user ? <AccountButton /> : (
              <>
                <Link href="/login" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ color: '#CBD5E1', background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.15)' }}>
                  <LogIn className="w-4 h-4" /> Log in
                </Link>
                <Link href="/signup" className="btn-primary px-5 py-2.5 text-sm">Sign up free</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl"
            aria-label="Menu" style={{ background: 'rgba(15,22,41,0.65)', border: '1px solid rgba(148,163,184,0.15)' }}>
            {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mx-3 mb-3 p-3 rounded-2xl animate-slide-up"
          style={{ background: 'rgba(10,15,30,0.98)', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(16px)' }}>
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-3 mb-2 rounded-xl" style={{ background: 'rgba(148,163,184,0.05)' }}>
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white" style={{ background: 'linear-gradient(135deg, #FF8A1E, #FF6A00)' }}>{initial}</span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{profile?.full_name || displayName}</div>
                <div className="text-[11px] text-muted truncate">{profile?.email || user?.email}</div>
              </div>
              {isPro && <span className="ml-auto"><Crown className="w-4 h-4" style={{ color: '#FFA94D' }} /></span>}
            </div>
          )}
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
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'rgba(148,163,184,0.06)' }} onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard className="w-4 h-4 text-muted" /> Dashboard
                </Link>
                {profile?.is_admin && (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>
                    <Shield className="w-4 h-4" style={{ color: '#FFA94D' }} /> Admin Panel
                  </Link>
                )}
                {!isPro && (
                  <Link href="/#pricing" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold" style={{ color: '#FFA94D' }} onClick={() => setMobileOpen(false)}>
                    <Crown className="w-4 h-4" /> Upgrade to Pro
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white text-left" style={{ border: '1px solid rgba(148,163,184,0.15)' }}>
                  <LogOut className="w-4 h-4 text-muted" /> Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)' }} onClick={() => setMobileOpen(false)}>
                  <LogIn className="w-4 h-4" /> Log in
                </Link>
                <Link href="/signup" className="btn-primary py-3 text-sm" onClick={() => setMobileOpen(false)}>Sign up free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
