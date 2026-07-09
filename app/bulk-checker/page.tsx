'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { DRResult } from '@/types'
import { cleanDomain, getDRColor, getDRRating } from '@/lib/utils'
import { ArrowUpDown, Download, Copy, Check, ChevronUp, ChevronDown, Layers, Globe, AlertCircle, Crown } from 'lucide-react'
import Link from 'next/link'

type SortKey = 'domain' | 'dr' | 'rating'
type SortDir = 'asc' | 'desc'

const GUEST_DOMAINS_PER_CHECK = 20
const GUEST_CHECKS_PER_DAY = 3

function getGuestChecksToday(): number {
  if (typeof window === 'undefined') return 0
  try {
    const data = JSON.parse(localStorage.getItem('drc_guest_checks') || '{}')
    const today = new Date().toDateString()
    return data.date === today ? data.count : 0
  } catch { return 0 }
}

function incrementGuestChecks() {
  const today = new Date().toDateString()
  const count = getGuestChecksToday() + 1
  localStorage.setItem('drc_guest_checks', JSON.stringify({ date: today, count }))
  return count
}

export default function BulkCheckerPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DRResult[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('dr')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [checksUsed, setChecksUsed] = useState<number | null>(null)

  const handleCheck = async () => {
    const used = getGuestChecksToday()
    setChecksUsed(used)
    if (used >= GUEST_CHECKS_PER_DAY) {
      setError(`You've used all ${GUEST_CHECKS_PER_DAY} free checks for today. Sign up free for 10 checks/day with 100 domains each — or go Pro for unlimited.`)
      return
    }

    const domains = input.split('\n').map(d => d.trim()).filter(Boolean).slice(0, GUEST_DOMAINS_PER_CHECK)
    if (!domains.length) return
    setLoading(true); setError(''); setResults([]); setProgress(0)
    try {
      const cleaned = domains.map(cleanDomain).filter(Boolean)
      const progressInterval = setInterval(() => setProgress(p => Math.min(p + 12, 88)), 250)
      const res = await fetch('/api/dr-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains: cleaned }),
      })
      clearInterval(progressInterval)
      setProgress(100)
      const data = await res.json()
      if (data.results) {
        setResults(data.results)
        setChecksUsed(incrementGuestChecks())
      } else {
        setError('Failed to fetch results. Please try again.')
      }
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false); setTimeout(() => setProgress(0), 600) }
  }

  const sortedResults = [...results].sort((a, b) => {
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
    const header = 'Domain,DR Score,Rating'
    const rows = sortedResults.map(r => `${r.domain},${r.dr},${r.rating}`)
    const csv = [header, ...rows, '', 'Checked on drchecker.io — Free Bulk Ahrefs DR Checker'].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'drchecker-io-results.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const copyResults = async () => {
    const text = sortedResults.map(r => `${r.domain}\t${r.dr}\t${r.rating}`).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const domainCount = input.split('\n').filter(d => d.trim()).length
  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-40" />
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" style={{ color: '#FF8A1E' }} /> : <ChevronDown className="w-3 h-3" style={{ color: '#FF8A1E' }} />
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center mb-10">
          <div className="badge-primary mb-4"><Layers className="w-3 h-3" /> Bulk Checker</div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 text-white">Bulk Domain Rating <span className="gradient-text">Checker</span></h1>
          <p className="text-muted max-w-xl mx-auto">Check Ahrefs DR for multiple domains at once. Paste one domain per line.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { icon: '👤', label: 'Guest', limit: `${GUEST_DOMAINS_PER_CHECK} domains · ${GUEST_CHECKS_PER_DAY} checks/day`, active: true, href: '' },
            { icon: '✅', label: 'Free Account', limit: '100 domains · 10 checks/day', active: false, href: '/signup' },
            { icon: '👑', label: 'Pro — $5/mo', limit: '1,000 domains · Unlimited', active: false, href: '/#pricing' },
          ].map((tier) => (
            <div key={tier.label} className="card p-4 flex items-center gap-3"
              style={tier.active ? { borderColor: 'rgba(255,138,30,0.4)', background: 'rgba(255,138,30,0.05)' } : {}}>
              <span className="text-xl">{tier.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-white">{tier.label}</div>
                <div className="text-xs text-muted truncate">{tier.limit}</div>
              </div>
              {tier.active
                ? <span className="ml-auto text-xs font-bold flex-shrink-0" style={{ color: '#FF8A1E' }}>Current</span>
                : <Link href={tier.href} className="ml-auto text-xs font-bold hover:underline flex-shrink-0" style={{ color: '#FF8A1E' }}>Upgrade</Link>}
            </div>
          ))}
        </div>

        <div className="card p-5 sm:p-6 mb-6" style={{ background: 'rgba(15,22,41,0.65)' }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <label className="text-sm font-bold text-white">Enter Domains <span className="text-muted font-normal">(one per line)</span></label>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${domainCount > GUEST_DOMAINS_PER_CHECK ? '' : 'text-muted'}`}
              style={domainCount > GUEST_DOMAINS_PER_CHECK ? { color: '#F59E0B', background: 'rgba(245,158,11,0.12)' } : {}}>
              {domainCount} / {GUEST_DOMAINS_PER_CHECK} domains
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"example.com\nahrefs.com\ngoogle.com"}
            rows={8}
            className="input-dark w-full px-4 py-3 text-sm font-mono resize-none"
          />
          {domainCount > GUEST_DOMAINS_PER_CHECK && (
            <div className="mt-2 flex items-center gap-2 text-xs flex-wrap" style={{ color: '#F59E0B' }}>
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Only the first {GUEST_DOMAINS_PER_CHECK} domains will be checked. <Link href="/signup" className="underline font-semibold">Sign up free</Link> for 100 per check.
            </div>
          )}
          <button onClick={handleCheck} disabled={loading || !input.trim()}
            className="mt-4 btn-primary w-full py-3.5 text-sm gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Checking domains...</>
              : <><Globe className="w-4 h-4" /> Check DR for All Domains</>}
          </button>
          {loading && progress > 0 && (
            <div className="mt-3 w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FF8A1E, #FF6A00)' }} />
            </div>
          )}
          {checksUsed !== null && checksUsed < GUEST_CHECKS_PER_DAY && (
            <p className="mt-3 text-xs text-muted text-center">{GUEST_CHECKS_PER_DAY - checksUsed} of {GUEST_CHECKS_PER_DAY} free checks remaining today</p>
          )}
        </div>

        {error && (
          <div className="mb-6 px-4 py-4 rounded-xl text-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
            <span>{error}</span>
            <Link href="/signup" className="btn-primary px-4 py-2 text-xs flex-shrink-0">Sign Up Free</Link>
          </div>
        )}

        {results.length > 0 && (
          <div className="card overflow-hidden animate-slide-up" style={{ background: 'rgba(15,22,41,0.65)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-6 py-4 gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
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
                  {sortedResults.map((r, i) => {
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
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: `${color}20`, color }}>
                              {r.dr}
                            </div>
                            <div className="w-16 h-1.5 rounded-full hidden sm:block" style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${r.dr}%`, background: color }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></span>
                            {rating}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
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

        <div className="mt-8 card-glow p-6 text-center">
          <Crown className="w-8 h-8 mx-auto mb-3" style={{ color: '#FF8A1E' }} />
          <h3 className="font-extrabold text-white mb-2">Need Bigger Checks?</h3>
          <p className="text-muted text-sm mb-5 max-w-md mx-auto">Free account: 100 domains × 10 checks/day. Pro: 1,000 domains with unlimited checks for just $5/month.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn-primary px-6 py-2.5 text-sm">Sign Up Free</Link>
            <Link href="/#pricing" className="btn-outline px-6 py-2.5 text-sm">See Pro Plan — $5/mo</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
