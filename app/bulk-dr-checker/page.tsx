'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { DRResult } from '@/types'
import { cleanDomain, getDRColor, getDRRating } from '@/lib/utils'
import { ArrowUpDown, Download, Copy, Check, ChevronUp, ChevronDown, Layers, Globe, AlertCircle, Crown } from 'lucide-react'
import Reveal from '@/components/layout/Reveal'
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
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [checksUsed, setChecksUsed] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleCheck = async () => {
    const used = getGuestChecksToday()
    setChecksUsed(used)
    if (used >= GUEST_CHECKS_PER_DAY) {
      setError(`You've used all ${GUEST_CHECKS_PER_DAY} free checks for today. Sign up free for 10 checks/day with 100 domains each — or go Pro for unlimited.`)
      return
    }

    const domains = input.split('\n').map(d => d.trim()).filter(Boolean).slice(0, GUEST_DOMAINS_PER_CHECK)
    if (!domains.length) return
    setLoading(true); setError(''); setResults([]); setSortKey(null); setProgress(0)
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

  const sortedResults = sortKey === null ? [...results] : [...results].sort((a, b) => {
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
          <h1 className="text-3xl sm:text-4xl font-black mb-4 text-white">Bulk DR <span className="gradient-text">Checker</span></h1>
          <p className="text-muted max-w-xl mx-auto">Check Ahrefs Domain Rating for up to 1,000 domains at once — the most powerful bulk DR checker available online. Paste one domain per line.</p>
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

        {/* Upgrade banner above content */}
        <div className="mt-8 card-glow p-6 text-center">
          <Crown className="w-8 h-8 mx-auto mb-3" style={{ color: '#FF8A1E' }} />
          <h3 className="font-extrabold text-white mb-2">Unlock the Full Power of Bulk DR Checking</h3>
          <p className="text-muted text-sm mb-5 max-w-md mx-auto">Free account: 100 domains × 10 checks/day. Pro: 1,000 domains per check with unlimited checks — just $5/month. No other bulk DR checker comes close.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn-primary px-6 py-2.5 text-sm">Sign Up Free</Link>
            <Link href="/#pricing" className="btn-outline px-6 py-2.5 text-sm">Go Pro — $5/mo</Link>
          </div>
        </div>

        {/* ===== 2000+ WORD SEO CONTENT — single card ===== */}
        <Reveal>
        <article className="legal-content card p-6 sm:p-9 mt-10">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2" style={{ marginTop: 0 }}>Bulk DR Checker — The Complete Guide to Checking Domain Rating at Scale</h1>
          <p>If you work with more than a handful of websites, checking Domain Rating one domain at a time is simply not an option. Whether you are an SEO agency managing dozens of client sites, a link builder vetting hundreds of prospects, a domain investor evaluating an entire portfolio, or a digital marketing specialist auditing competitors — you need a <strong>bulk DR checker</strong> that can process large lists of domains quickly, accurately, and affordably. That is exactly what this tool was built for, and on this page we explain everything you need to know about bulk Domain Rating checking: what it is, why it matters, who needs it, and why no other website currently offers bulk checking at the scale we do.</p>

          <h2>What is a Bulk DR Checker?</h2>
          <p>A <strong>bulk DR checker</strong> is a tool that retrieves the Ahrefs Domain Rating for many domains simultaneously, instead of forcing you to look them up one by one. Domain Rating — usually shortened to DR — is Ahrefs' authority metric, scoring every website's backlink strength on a logarithmic scale from 0 to 100. It has become the universal shorthand for website authority across the entire SEO industry: link marketplaces list inventory by DR, agencies report client progress in DR, and website buyers filter acquisition targets by DR before anything else.</p>
          <p>The problem is access. Checking DR normally requires an Ahrefs subscription starting at $99+ per month, and even inside Ahrefs, checking large lists means using Batch Analysis with its own limits and workflow friction. Free single-domain checkers exist across the web, but they force you into a painful copy-paste loop: one domain in, one result out, repeat two hundred times. A proper bulk domain rating checker eliminates all of that — you paste your entire list, click once, and receive every DR score in a sortable, exportable table within seconds.</p>

          <h2>Why Bulk DR Checking is a Must-Have for SEO Agencies</h2>
          <p>For SEO agencies and digital marketing specialists, bulk DR checking is not a convenience — it is core infrastructure. Consider the daily reality of agency work. A single link building campaign might involve screening 300 prospect domains gathered from outreach lists, competitor backlink exports, and marketplace inventories. Before a single email is sent, every one of those domains needs an authority check, because pitching or purchasing placements on weak domains wastes budget and can even harm client sites. Checking 300 domains manually at even 20 seconds per lookup is nearly two hours of mindless copy-paste work. Our bulk DR checker does it in one click.</p>
          <p>The same applies to reporting and monitoring. Agencies managing 30, 50, or 100 client websites need regular DR updates to demonstrate progress, catch sudden drops, and spot opportunities. Running the full client roster through a bulk checker weekly takes under a minute and produces a clean CSV that drops straight into reports and dashboards. Digital marketing teams use the identical workflow for competitor tracking — maintaining a watchlist of rival domains and monitoring how their authority evolves month over month.</p>
          <p>Link builders and blogger outreach specialists arguably benefit most of all. The link economy runs on DR: placement prices, prospect prioritization, and inventory valuation are all DR-driven. Anyone selling links needs current DR figures for their entire inventory at all times, and anyone buying links needs to verify claimed DR values before paying. A bulk domain rating checker turns both tasks from an afternoon of work into a coffee-break job.</p>

          <h2>No Other Website Offers This Much Bulk Checking</h2>
          <p>Here is the honest state of the market: most free DR checkers allow exactly one domain at a time. The handful that support bulk input typically cap you at 5, 10, or at best 20 domains per run, often behind aggressive captchas, and frequently serve cached or outdated scores. For anyone doing serious volume, those limits make the tools effectively useless.</p>
          <p>Our bulk DR checker was built specifically to break that ceiling. As a <strong>guest with no account</strong>, you can already check 20 domains per run, 3 times per day — matching or beating the best free tools available. Create a <strong>free account</strong> and your capacity jumps to 100 domains per check, 10 times per day: that is up to 1,000 DR lookups daily at zero cost, more than most professionals will ever need. And for agencies and power users, our <strong>Pro plan at just $5/month</strong> unlocks 1,000 domains in a single check with unlimited checks — a scale of bulk DR checking that, to our knowledge, no other website on the internet currently offers at any price, let alone at the cost of a coffee.</p>
          <p>Every result is pulled from <strong>live Ahrefs data</strong> — the same figures you would see inside Ahrefs Site Explorer at that moment, not stale snapshots from a months-old database. When you are pricing a link placement or approving a domain purchase, that freshness is the difference between a good decision and an expensive mistake.</p>

          <h2>Who Needs a Bulk Domain Rating Checker?</h2>
          <p><strong>SEO agencies</strong> use bulk DR checks for client reporting, prospect vetting, competitor monitoring, and monthly authority audits across their entire portfolio. <strong>Link builders and outreach specialists</strong> screen hundreds of prospects before campaigns and re-verify inventory before every sale. <strong>Domain investors and website flippers</strong> evaluate acquisition lists in seconds — DR is the first filter applied to any list of domains for sale, and checking a 500-domain auction list by hand is unthinkable. <strong>Affiliate marketers and niche site builders</strong> track their own site networks and benchmark against competitors. <strong>Digital PR teams</strong> qualify media targets by authority before pitching. <strong>Publishers selling guest posts</strong> keep their rate cards current by monitoring their own DR regularly. If your work touches more than ten domains, a bulk checker pays for itself the first time you use it.</p>

          <h2>Checking DR of Large Lists — How It Works</h2>
          <p>Using the tool could not be simpler. Paste your domain list into the box above, one domain per line — full URLs, bare domains, with or without www, in any mix. Our system automatically cleans and normalizes every entry, strips protocols and paths, removes duplicates, and queries live Ahrefs data for each unique domain. Within seconds you receive a complete results table showing every domain alongside its current DR score and quality rating: Poor (0–29), Fair (30–49), Good (50–69), or Excellent (70–100).</p>
          <p>The results table is built for real work. <strong>Sort</strong> by domain name, DR score, or rating with a single tap on any column header — instantly surface your strongest domains or isolate the weak ones. <strong>Download the full results as CSV</strong> for spreadsheets, client reports, or your own databases. <strong>Copy to clipboard</strong> in a tab-separated format that pastes perfectly into Google Sheets and Excel. Below the table, summary statistics show your list's average DR, highest and lowest scores, and how many domains reach Excellent status — an instant health snapshot of any portfolio.</p>

          <h2>Regular DR Monitoring — Why Checking Once is Never Enough</h2>
          <p>Domain Rating is not static. Ahrefs continuously recrawls the web, and DR scores shift as backlinks are gained, lost, or revalued. A domain that scored DR 45 in January might be DR 38 by June if key links dropped, or DR 55 if a campaign landed. This is why professionals treat DR checking as an ongoing process — <strong>regular DR updates on large lists</strong> — rather than a one-off lookup.</p>
          <p>Practical monitoring workflows our users run: agencies re-check their full client list every Monday and log the CSV, creating a week-by-week authority timeline. Link sellers re-verify inventory before each price update. Investors re-scan watchlists monthly to catch domains whose authority is rising before the market prices it in. Site owners who purchased our <a href="/increase-dr">Increase DR service</a> track their climb toward the guaranteed target in real time. With free accounts allowing 10 bulk checks daily, this kind of routine monitoring costs nothing — and Pro's unlimited checks remove the ceiling entirely for agencies running many lists per day.</p>

          <h2>Bulk DR Checker vs. Ahrefs Batch Analysis</h2>
          <p>Ahrefs' own Batch Analysis is excellent, but it requires a paid Ahrefs subscription starting at $99+/month, consumes your plan's credits, and is one more interface inside an already dense toolset. If DR lookups are the specific job you need done, paying $99+ for it makes no sense. Our tool delivers the same live DR figures — because the data comes from Ahrefs — through a purpose-built, lightning-fast interface at a fraction of the cost: free for most users, $5/month for unlimited agency-scale volume. Many of our users run full Ahrefs subscriptions for deep research and still use our bulk checker daily simply because it is faster for the DR-list workflow.</p>

          <h2>Tips for Getting the Most From Bulk DR Checks</h2>
          <p>A few practices that separate professionals: <strong>Deduplicate at the source</strong> — our tool removes duplicates automatically, but clean lists keep your check limits efficient. <strong>Sort by DR descending</strong> immediately after each check to prioritize outreach from the top down. <strong>Keep dated CSV exports</strong> — a folder of weekly exports becomes a longitudinal authority database that reveals trends no single check can show. <strong>Cross-reference before purchases</strong> — when buying domains or placements, always run your own fresh bulk check rather than trusting seller-provided screenshots; scores change and screenshots get doctored. <strong>Benchmark in context</strong> — a DR 35 domain is weak in the finance niche but potentially strong in a narrow local niche; always compare against direct competitors, which is exactly what checking them all in one bulk run makes effortless.</p>

          <h2>Start Bulk Checking Now — Free</h2>
          <p>The tool at the top of this page is live and ready. Paste your list, hit check, and get every Ahrefs DR score in seconds — no signup required for your first checks. When you hit the guest limits, a <a href="/signup">free account</a> takes ten seconds to create and multiplies your capacity five-fold. And when you are ready for true agency scale, <a href="/#pricing">Pro at $5/month</a> gives you the largest bulk DR checking capacity available anywhere online: 1,000 domains per check, unlimited checks, forever. Found domains with disappointing scores? Our <a href="/increase-dr">Increase DR service</a> raises any website to a guaranteed DR target of 20+ up to 80+ within 2–4 weeks, backed by permanent guarantees. Questions? <a href="/contact">Contact us</a> — we respond fast.</p>
        </article>
        </Reveal>

        {/* ===== Q&A ===== */}
        <div className="mt-10">
          <Reveal>
            <div className="text-center mb-8">
              <div className="badge-primary mb-4 inline-flex">Q&A</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Bulk DR Checker — <span className="gradient-text">Questions & Answers</span></h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {[
              { q: 'How many domains can I check at once with the bulk DR checker?', a: 'Guests can check 20 domains per run, 3 times per day with no account. A free account unlocks 100 domains per check, 10 times daily. Pro users ($5/month) can check up to 1,000 domains in a single run with unlimited runs — the highest bulk DR checking capacity available on any website.' },
              { q: 'Is the DR data accurate and up to date?', a: 'Yes. Every score is pulled from live Ahrefs data at the moment you run the check — the same figures shown inside Ahrefs Site Explorer. We never serve months-old cached databases.' },
              { q: 'Can I export my bulk results?', a: 'Absolutely. Every results table includes one-click CSV download and a copy-to-clipboard option in tab-separated format that pastes perfectly into Excel and Google Sheets.' },
              { q: 'Do I need an Ahrefs subscription to use this?', a: 'No. That is the whole point — you get live Ahrefs DR figures without paying $99+/month for an Ahrefs plan. Our tool is free for most users and $5/month for unlimited agency-scale checking.' },
              { q: 'What format should my domain list be in?', a: 'Anything goes: bare domains, full URLs, with or without www or https. Paste one per line and our system automatically cleans, normalizes, and deduplicates every entry before checking.' },
              { q: 'How often should I re-check DR for my domain lists?', a: 'DR changes as Ahrefs recrawls the web. Agencies typically re-check client and inventory lists weekly; investors re-scan watchlists monthly. With 10 free checks daily on a free account, routine monitoring costs nothing.' },
              { q: 'Why do some domains return a DR of 0?', a: 'A DR of 0 usually means the domain is brand new, has virtually no backlinks known to Ahrefs, or was entered with a typo. Double-check spelling first; if the domain is genuinely new, DR 0 is its real current score.' },
              { q: 'Can you increase the DR of domains from my list?', a: 'Yes — that is our specialty. Our Increase DR service raises any website to a guaranteed target (DR 20+ up to DR 80+) within 2–4 weeks, with Lifetime guarantees on DR 20–40 packages and 1 Year guarantees on DR 50–80. See the Increase DR page for pricing.' },
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="card overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]">
                    <span className="font-semibold text-sm pr-4 text-white">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-muted flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className="grid transition-all duration-300" style={{ gridTemplateRows: openFaq === i ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1">
                        <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
