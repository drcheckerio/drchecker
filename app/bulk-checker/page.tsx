'use client'
import { useState, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Footer from '@/components/layout/Footer'
import { DRResult } from '@/types'
import { cleanDomain, getDRColor, getDRRating } from '@/lib/utils'
import { ArrowUpDown, Download, Copy, Check, ChevronUp, ChevronDown, Layers, Globe, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type SortKey = 'domain' | 'dr' | 'rating'
type SortDir = 'asc' | 'desc'

export default function BulkCheckerPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DRResult[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('dr')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const GUEST_LIMIT = 3

  const handleCheck = async () => {
    const domains = input.split('\n').map(d => d.trim()).filter(Boolean).slice(0, GUEST_LIMIT)
    if (!domains.length) return
    setLoading(true); setError(''); setResults([]); setProgress(0)
    try {
      const cleaned = domains.map(cleanDomain).filter(Boolean)
      // Simulate progress
      const progressInterval = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 200)
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
      } else {
        setError('Failed to fetch results. Please try again.')
      }
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false); setTimeout(() => setProgress(0), 500) }
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
    const header = 'Domain,DR Score,Rating,Backlinks,Referring Domains'
    const rows = sortedResults.map(r => `${r.domain},${r.dr},${r.rating},${r.backlinks ?? ''},${r.referring_domains ?? ''}`)
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'dr-check-results.csv'; a.click()
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
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-400" /> : <ChevronDown className="w-3 h-3 text-brand-400" />
  }

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="badge badge-brand mb-4"><Layers className="w-3 h-3" />Bulk Checker</div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4">Bulk Domain Rating <span className="gradient-text">Checker</span></h1>
          <p className="text-muted max-w-xl mx-auto">Check Ahrefs DR for multiple domains at once. Paste one domain per line below.</p>
        </div>

        {/* Limits Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { icon: '👤', label: 'Guest', limit: '3 domains/run', active: true },
            { icon: '✅', label: 'Free Account', limit: '100 domains/run · 10×/day', active: false },
            { icon: '💎', label: 'Pro $9.99/mo', limit: '1,000 domains/run · Unlimited', active: false },
          ].map((tier) => (
            <div key={tier.label} className={`glass-card p-4 flex items-center gap-3 ${tier.active ? 'border-brand-500/30' : ''}`} style={tier.active ? { background: 'rgba(99,102,241,0.06)' } : {}}>
              <span className="text-xl">{tier.icon}</span>
              <div>
                <div className="text-xs font-bold">{tier.label}</div>
                <div className="text-xs text-muted">{tier.limit}</div>
              </div>
              {!tier.active && <Link href="/signup" className="ml-auto text-xs text-brand-400 font-semibold hover:underline">Upgrade</Link>}
              {tier.active && <span className="ml-auto text-xs text-brand-400 font-semibold">Current</span>}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold">Enter Domains <span className="text-muted font-normal">(one per line)</span></label>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${domainCount > GUEST_LIMIT ? 'text-amber-400 bg-amber-500/10' : 'text-muted'}`}>
              {domainCount} / {GUEST_LIMIT} domains {domainCount > GUEST_LIMIT && '— guest limit'}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`example.com\ngoogle.com\nahrefs.com`}
            rows={8}
            className="glass-input w-full px-4 py-3 text-sm font-mono resize-none"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          />
          {domainCount > GUEST_LIMIT && (
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
              Only the first {GUEST_LIMIT} domains will be checked. <Link href="/signup" className="underline">Sign up free</Link> for 100 domains/run.
            </div>
          )}
          <button
            onClick={handleCheck}
            disabled={loading || !input.trim()}
            className="mt-4 btn-brand w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Checking domains...</>
            ) : (
              <><Globe className="w-4 h-4" />Check DR for All Domains</>
            )}
          </button>
          {loading && progress > 0 && (
            <div className="mt-3">
              <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
              </div>
            </div>
          )}
        </div>

        {error && <div className="mb-6 px-4 py-3 rounded-xl text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>{error}</div>}

        {/* Results Table */}
        {results.length > 0 && (
          <div className="glass-card overflow-hidden">
            {/* Table header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-glass">
              <div>
                <h3 className="font-bold">{results.length} Results</h3>
                <p className="text-xs text-muted mt-0.5">Click column headers to sort</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyResults} className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card text-xs font-medium hover:border-brand-500/30 transition-all">
                  {copied ? <><Check className="w-3.5 h-3.5 text-green-400" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                </button>
                <button onClick={downloadCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl btn-brand text-xs font-medium">
                  <Download className="w-3.5 h-3.5" />Download CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('domain')} className="cursor-pointer select-none">
                      <div className="flex items-center gap-1.5">Domain <SortIcon col="domain" /></div>
                    </th>
                    <th onClick={() => handleSort('dr')} className="cursor-pointer select-none">
                      <div className="flex items-center gap-1.5">DR Score <SortIcon col="dr" /></div>
                    </th>
                    <th onClick={() => handleSort('rating')} className="cursor-pointer select-none">
                      <div className="flex items-center gap-1.5">Rating <SortIcon col="rating" /></div>
                    </th>
                    <th>Backlinks</th>
                    <th>Ref. Domains</th>
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
                            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <Globe className="w-3 h-3 text-muted" />
                            </div>
                            <span className="font-medium text-sm">{r.domain}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: `${color}20`, color }}>
                              {r.dr}
                            </div>
                            {/* Mini bar */}
                            <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${r.dr}%`, background: color }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge text-xs" style={{
                            background: `${color}15`,
                            color,
                            border: `1px solid ${color}30`,
                          }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></span>
                            {rating}
                          </span>
                        </td>
                        <td className="text-muted text-sm">{r.backlinks?.toLocaleString() ?? '—'}</td>
                        <td className="text-muted text-sm">{r.referring_domains?.toLocaleString() ?? '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="px-6 py-4 border-t border-glass grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Average DR', value: Math.round(results.reduce((s, r) => s + r.dr, 0) / results.length) },
                { label: 'Highest DR', value: Math.max(...results.map(r => r.dr)) },
                { label: 'Lowest DR', value: Math.min(...results.map(r => r.dr)) },
                { label: 'Excellent Sites', value: results.filter(r => r.dr >= 70).length },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-black gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade CTA */}
        <div className="mt-8 glass-card p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.05) 100%)', borderColor: 'rgba(99,102,241,0.25)' }}>
          <h3 className="font-bold mb-2">Need to Check More Domains?</h3>
          <p className="text-muted text-sm mb-4">Sign up free for 100 domains/run or go Pro for 1,000 domains/run with unlimited checks.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn-brand px-6 py-2.5 text-sm text-center">Sign Up Free — 100/run</Link>
            <Link href="/pricing" className="glass-card px-6 py-2.5 text-sm font-semibold hover:border-brand-500/30 transition-all text-center">See Pro Plan</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
