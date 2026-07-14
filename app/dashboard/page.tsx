'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DRResult } from '@/types'
import { getDRColor, getDRRating } from '@/lib/utils'
import {
  Crown, Shield, LogOut, Globe, Download, Copy, Check, ChevronUp, ChevronDown,
  ArrowUpDown, BarChart3, Zap, TrendingUp, AlertCircle
} from 'lucide-react'

type SortKey = 'domain' | 'dr' | 'rating'

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(true)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DRResult[]>([])
  const [error, setError] = useState('')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [copied, setCopied] = useState(false)

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setSession(session)
      loadProfile(session.user.id).finally(() => setPageLoading(false))
    })
  }, [router, loadProfile])

  const isPro = profile?.plan === 'pro'
  const perCheck = isPro ? 1000 : 100
  const perDay = isPro ? null : 10
  const today = new Date().toISOString().slice(0, 10)
  const usedToday = profile?.last_check_date === today ? (profile?.checks_today ?? 0) : 0

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCheck = async () => {
    const domains = input.split('\n').map(d => d.trim()).filter(Boolean)
    if (!domains.length) return
    setLoading(true); setError(''); setResults([]); setSortKey(null)
    try {
      const res = await fetch('/api/dr-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ domains }),
      })
      const data = await res.json()
      if (res.status === 429) {
        setError(data.error)
      } else if (data.results) {
        setResults(data.results)
        loadProfile(session.user.id)
      } else {
        setError(data.error || 'Failed to fetch results.')
      }
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const sorted = sortKey === null ? [...results] : [...results].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'dr') cmp = a.dr - b.dr
    else if (sortKey === 'domain') cmp = a.domain.localeCompare(b.domain)
    else cmp = a.rating.localeCompare(b.rating)
    return sortDir === 'asc' ? cmp : -cmp
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const downloadCSV = () => {
    const csv = ['Domain,DR Score,Rating', ...sorted.map(r => `${r.domain},${r.dr},${r.rating}`), '', 'Checked on drchecker.io'].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'drchecker-io-results.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const copyResults = async () => {
    await navigator.clipboard.writeText(sorted.map(r => `${r.domain}\t${r.dr}\t${r.rating}`).join('\n'))
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const domainCount = input.split('\n').filter(d => d.trim()).length
  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-40" />
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" style={{ color: '#FF8A1E' }} /> : <ChevronDown className="w-3 h-3" style={{ color: '#FF8A1E' }} />
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,138,30,0.2)', borderTopColor: '#FF8A1E' }}></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Dashboard nav */}
      <nav className="sticky top-0 z-40" style={{ background: 'rgba(7,11,20,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-nav.png" alt="DR Checker" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            {profile?.is_admin && (
              <Link href="/admin" className="btn-outline px-4 py-2 text-xs gap-1.5"><Shield className="w-3.5 h-3.5" /> Admin</Link>
            )}
            <button onClick={handleLogout} className="btn-outline px-4 py-2 text-xs gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-muted text-sm mt-1">Your bulk DR checking dashboard</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${isPro ? '' : ''}`}
            style={isPro
              ? { background: 'linear-gradient(135deg, rgba(255,138,30,0.2), rgba(255,106,0,0.1))', border: '1px solid rgba(255,138,30,0.45)', color: '#FFA94D' }
              : { background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)', color: '#CBD5E1' }}>
            {isPro ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            {isPro ? 'PRO Plan' : 'Free Plan'}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <BarChart3 className="w-5 h-5" />, label: 'Domains per Check', value: perCheck.toLocaleString(), color: '#3B82F6' },
            { icon: <Zap className="w-5 h-5" />, label: 'Checks per Day', value: perDay === null ? 'Unlimited' : `${perDay}`, color: '#22C55E' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Used Today', value: perDay === null ? '∞' : `${usedToday} / ${perDay}`, color: '#F59E0B' },
            { icon: <Crown className="w-5 h-5" />, label: 'Plan', value: isPro ? 'Pro' : 'Free', color: '#FF8A1E' },
          ].map((s, i) => (
            <div key={s.label} className="card p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}35` }}>
                {s.icon}
              </div>
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-xs text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Upgrade banner for free users */}
        {!isPro && (
          <div className="card-glow p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 flex-shrink-0" style={{ color: '#FF8A1E' }} />
              <p className="text-sm text-white font-semibold">
                Upgrade to Pro <span className="text-muted font-normal">— 1,000 domains per check, unlimited checks, just $5/month.</span>
              </p>
            </div>
            <Link href="/#pricing" className="btn-primary px-5 py-2.5 text-xs flex-shrink-0">Upgrade to Pro</Link>
          </div>
        )}

        {/* Bulk checker */}
        <div className="card p-5 sm:p-6 mb-6" style={{ background: 'rgba(15,22,41,0.65)' }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <label className="text-sm font-bold text-white">Bulk DR Check <span className="text-muted font-normal">(one domain per line)</span></label>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${domainCount > perCheck ? '' : 'text-muted'}`}
              style={domainCount > perCheck ? { color: '#F59E0B', background: 'rgba(245,158,11,0.12)' } : {}}>
              {domainCount.toLocaleString()} / {perCheck.toLocaleString()} domains
            </span>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={"example.com\nahrefs.com\ngoogle.com"} rows={10}
            className="input-dark w-full px-4 py-3 text-sm font-mono resize-none" />
          {domainCount > perCheck && (
            <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: '#F59E0B' }}>
              <AlertCircle className="w-3.5 h-3.5" />
              Only the first {perCheck.toLocaleString()} domains will be checked{!isPro && <> — <Link href="/#pricing" className="underline font-semibold">upgrade to Pro</Link> for 1,000/check</>}.
            </div>
          )}
          <button onClick={handleCheck} disabled={loading || !input.trim()} className="mt-4 btn-primary w-full py-3.5 text-sm gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Checking domains...</>
              : <><Globe className="w-4 h-4" /> Check DR for All Domains</>}
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-4 rounded-xl text-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
            <span>{error}</span>
            {!isPro && <Link href="/#pricing" className="btn-primary px-4 py-2 text-xs flex-shrink-0">Upgrade to Pro</Link>}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="card overflow-hidden animate-slide-up" style={{ background: 'rgba(15,22,41,0.65)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-6 py-4 gap-3" style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
              <div>
                <h3 className="font-extrabold text-white">{results.length} Results</h3>
                <p className="text-xs text-muted mt-0.5">Tap column headers to sort</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyResults} className="btn-outline flex items-center gap-2 px-3 py-2 text-xs">
                  {copied ? <><Check className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                </button>
                <button onClick={downloadCSV} className="btn-primary flex items-center gap-2 px-3 py-2 text-xs">
                  <Download className="w-3.5 h-3.5" /> Download CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('domain')}><div className="flex items-center gap-1.5">Domain <SortIcon col="domain" /></div></th>
                    <th onClick={() => handleSort('dr')}><div className="flex items-center gap-1.5">DR Score <SortIcon col="dr" /></div></th>
                    <th onClick={() => handleSort('rating')}><div className="flex items-center gap-1.5">Rating <SortIcon col="rating" /></div></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => {
                    const color = getDRColor(r.dr)
                    const rating = getDRRating(r.dr)
                    return (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <Globe className="w-3 h-3 text-muted" />
                            </div>
                            <span className="font-semibold text-sm text-white break-all">{r.domain}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: `${color}20`, color }}>{r.dr}</div>
                            <div className="w-16 h-1.5 rounded-full hidden sm:block" style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${r.dr}%`, background: color }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></span>{rating}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}>
              {[
                { label: 'Average DR', value: Math.round(results.reduce((s, r) => s + r.dr, 0) / results.length) },
                { label: 'Highest DR', value: Math.max(...results.map(r => r.dr)) },
                { label: 'Lowest DR', value: Math.min(...results.map(r => r.dr)) },
                { label: 'Excellent (70+)', value: results.filter(r => r.dr >= 70).length },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-black gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
