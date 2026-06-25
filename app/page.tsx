'use client'
import { useState } from 'react'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DRResultCard from '@/components/dr/DRResultCard'
import { DRResult } from '@/types'
import { cleanDomain } from '@/lib/utils'
import Link from 'next/link'
import {
  Search, Zap, Shield, BarChart3, Globe, Link2, Award,
  ChevronRight, CheckCircle, TrendingUp, Target, Layers,
  ChevronDown, ArrowRight
} from 'lucide-react'

function DownloadIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export default function HomePage() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DRResult | null>(null)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleCheck = async () => {
    if (!domain.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const clean = cleanDomain(domain)
      const res = await fetch('/api/dr-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains: [clean] }),
      })
      const data = await res.json()
      if (data.results?.[0] && !data.results[0].error) {
        setResult(data.results[0])
      } else {
        setError(data.results?.[0]?.error || 'Could not fetch DR data. Please try again.')
      }
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const faqs = [
    { q: "What is Ahrefs Domain Rating (DR)?", a: "Ahrefs Domain Rating (DR) is a metric that shows the strength of a website's backlink profile on a scale from 0 to 100. The higher the DR, the stronger and more authoritative the website is. It's calculated based on the number of unique websites linking to your domain and their own DR scores." },
    { q: "How is Domain Rating calculated?", a: "Ahrefs calculates DR by analyzing the number of unique domains linking to a website, the DR scores of those linking domains, and how many unique domains each linker also links to. It uses a logarithmic scale, making it progressively harder to increase your DR as it gets higher." },
    { q: "What is a good Domain Rating score?", a: "Generally: 0–29 is Poor (new or low-authority sites), 30–49 is Fair (decent authority), 50–69 is Good (strong authority), and 70–100 is Excellent (top-tier websites). Always compare your DR against direct competitors in your niche." },
    { q: "How often is DR data updated?", a: "Our DR data is pulled directly from the Ahrefs API, which updates its data as Ahrefs crawls the web. Most established domains have their data refreshed regularly." },
    { q: "How can I improve my Domain Rating?", a: "The most effective ways: earn backlinks from high-DR websites, create link-worthy content, guest post on authoritative sites, build relationships with site owners, and remove toxic backlinks. Our DR improvement services can accelerate this process significantly." },
    { q: "What's the difference between DR and DA?", a: "DR (Domain Rating) is Ahrefs' metric. DA (Domain Authority) is Moz's metric. Both measure website authority based on backlinks but use different algorithms and data. DR is generally preferred as Ahrefs has one of the largest backlink databases available." },
    { q: "How many domains can I check at once?", a: "Without an account: 3 domains per bulk run. Free account: 100 domains per run, 10 times per day. Pro plan ($9.99/month): 1,000 domains per run, unlimited runs." },
    { q: "Is DR Checker free to use?", a: "Yes! Single domain checks are always free with no account needed. For bulk checks you get 3 domains/run as a guest, 100/run with a free account, or 1,000/run with Pro." },
  ]

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.4) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="badge badge-brand"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>Live Data from Ahrefs API</div>
          </div>
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
              Check Any Domain's <span className="gradient-text">Rating Instantly</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">The fastest, most accurate Ahrefs DR checker. Check single or bulk domains in seconds. Free to use — no sign-up required for quick checks.</p>
          </div>

          {/* Search */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="glass-card p-2 flex flex-col sm:flex-row gap-2" style={{ borderRadius: '16px' }}>
              <div className="flex-1 flex items-center gap-3 px-4">
                <Globe className="w-4 h-4 text-muted flex-shrink-0" />
                <input type="text" placeholder="Enter domain or URL (e.g. example.com)" value={domain}
                  onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted" />
              </div>
              <button onClick={handleCheck} disabled={loading || !domain.trim()}
                className="btn-brand px-6 py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Checking...</> : <><Search className="w-4 h-4" />Check DR</>}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-3 px-1 gap-2">
              <p className="text-xs text-muted">Single check always free · No sign-up required</p>
              <Link href="/bulk-checker" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                <Layers className="w-4 h-4" />Bulk DR Check<ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {error && <div className="max-w-3xl mx-auto mb-6 px-4 py-3 rounded-xl text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>{error}</div>}

          {result && <div className="max-w-5xl mx-auto mt-8"><DRResultCard result={result} domain={cleanDomain(domain)} /></div>}

          {!result && !loading && (
            <div className="max-w-3xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '👤', title: 'Guest', limit: '3 domains/run', sub: 'No account needed', bg: 'rgba(255,255,255,0.03)' },
                { icon: '✅', title: 'Free Account', limit: '100 domains/run', sub: '10 runs per day', bg: 'rgba(99,102,241,0.06)' },
                { icon: '💎', title: 'Pro — $9.99/mo', limit: '1,000 domains/run', sub: 'Unlimited runs', bg: 'rgba(34,197,94,0.06)' },
              ].map((item) => (
                <div key={item.title} className="glass-card p-4 text-center" style={{ background: item.bg }}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs font-semibold text-muted mb-1">{item.title}</div>
                  <div className="text-sm font-bold">{item.limit}</div>
                  <div className="text-xs text-muted mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-brand mb-4">Features</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to <span className="gradient-text">Check & Grow DR</span></h2>
            <p className="text-muted max-w-xl mx-auto">Professional-grade tools to check, analyze, and improve your Domain Rating.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Zap className="w-5 h-5 text-brand-400" />, title: 'Lightning Fast', desc: 'Results in under 2 seconds with real-time Ahrefs data. No waiting, no delays.' },
              { icon: <Shield className="w-5 h-5 text-green-400" />, title: '100% Accurate', desc: 'Direct Ahrefs API integration ensures you always get precise, up-to-date DR scores.' },
              { icon: <Layers className="w-5 h-5 text-blue-400" />, title: 'Bulk Checking', desc: 'Check up to 1,000 domains at once. Perfect for agencies and power users.' },
              { icon: <DownloadIcon className="w-5 h-5 text-amber-400" />, title: 'Export Results', desc: 'Download individual DR cards as PNG or bulk results as CSV for reports.' },
              { icon: <Target className="w-5 h-5 text-red-400" />, title: 'DR Improvement', desc: 'Professional link building services to boost your DR with white-hat methods.' },
              { icon: <Globe className="w-5 h-5 text-purple-400" />, title: 'Any Domain', desc: 'Check DR for any website on the internet — no restrictions, no limits on domains.' },
            ].map((f) => (
              <div key={f.title} className="glass-card p-6 hover:border-brand-500/30 group">
                <div className="w-11 h-11 rounded-xl glass-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-brand mb-4">Learn</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What is <span className="gradient-text">Domain Rating (DR)?</span></h2>
          </div>
          <div className="glass-card p-8 mb-8">
            <p className="leading-relaxed mb-4"><strong>Domain Rating (DR)</strong> is a proprietary metric developed by <strong>Ahrefs</strong> that measures the strength of a website's backlink profile on a logarithmic scale from <strong>0 to 100</strong>.</p>
            <p className="text-muted leading-relaxed mb-4">Unlike simple link counts, DR considers the quality of linking domains. One backlink from a DR 80 site carries far more weight than hundreds of links from DR 10 sites.</p>
            <p className="text-muted leading-relaxed">DR is the industry standard used by SEO professionals, link builders, and website buyers to quickly assess domain authority.</p>
          </div>
          <h3 className="text-2xl font-bold mb-6 text-center">Why Does <span className="gradient-text">Domain Rating Matter?</span></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              { icon: <TrendingUp className="w-5 h-5 text-brand-400" />, title: 'Ranking Power', desc: 'Higher DR correlates with better Google rankings. Search engines trust high-authority domains more.' },
              { icon: <Link2 className="w-5 h-5 text-green-400" />, title: 'Link Value', desc: 'High-DR sites pass more link equity. A single link from DR 70+ can transform your SEO profile.' },
              { icon: <Award className="w-5 h-5 text-amber-400" />, title: 'Competitive Edge', desc: 'Knowing your DR vs competitors helps identify gaps and prioritize link building efforts.' },
              { icon: <Target className="w-5 h-5 text-red-400" />, title: 'Content Authority', desc: 'High-DR sites attract more organic traffic and new backlinks — a compounding growth effect.' },
              { icon: <Globe className="w-5 h-5 text-blue-400" />, title: 'Partnership Vetting', desc: 'DR is the standard metric used to price and evaluate guest posting and link opportunities.' },
              { icon: <Shield className="w-5 h-5 text-purple-400" />, title: 'Site Valuation', desc: 'Buyers use DR as a primary metric when purchasing websites, directly affecting sale price.' },
            ].map((item) => (
              <div key={item.title} className="glass-card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0">{item.icon}</div>
                <div><h4 className="font-semibold mb-1 text-sm">{item.title}</h4><p className="text-muted text-xs leading-relaxed">{item.desc}</p></div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-6 text-center">Understanding <span className="gradient-text">DR Score Ranges</span></h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { range: '0–29', label: 'Poor', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', desc: 'New sites with few backlinks. Focus on building your link profile.' },
              { range: '30–49', label: 'Fair', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', desc: 'Growing authority with room to improve. Good foundation to build on.' },
              { range: '50–69', label: 'Good', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', desc: 'Strong established websites. Competitive in most niches.' },
              { range: '70–100', label: 'Excellent', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', desc: 'Top-tier authority. Think Wikipedia and major news sites.' },
            ].map((item) => (
              <div key={item.label} className="glass-card p-5 text-center" style={{ background: item.bg, borderColor: item.border }}>
                <div className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.range}</div>
                <div className="font-bold mb-2 text-sm" style={{ color: item.color }}>{item.label}</div>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-brand mb-4">Simple Process</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It <span className="gradient-text">Works</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: <Globe className="w-6 h-6" />, title: 'Enter Your Domain', desc: 'Type or paste any domain or URL. We automatically clean and normalize the input for accurate results.' },
              { step: '02', icon: <Zap className="w-6 h-6" />, title: 'Instant Analysis', desc: 'Our tool queries the Ahrefs API in real-time and retrieves the latest Domain Rating data instantly.' },
              { step: '03', icon: <BarChart3 className="w-6 h-6" />, title: 'Get Detailed Results', desc: 'View your DR on a beautiful visual gauge, download as PNG, and get actionable insights.' },
            ].map((step, i) => (
              <div key={step.step} className="glass-card p-6 relative group">
                <div className="absolute top-4 right-4 text-6xl font-black opacity-5">{step.step}</div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white mb-4 group-hover:shadow-brand-glow transition-shadow">{step.icon}</div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                {i < 2 && <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10"><ArrowRight className="w-6 h-6 text-brand-400" /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Placeholder */}
      <section className="section" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-brand mb-4">Link Building</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Improve Your <span className="gradient-text">Domain Rating</span></h2>
            <p className="text-muted max-w-xl mx-auto">Professional link building services to boost your DR and grow your website's authority.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Starter Package', icon: '🚀', desc: 'Perfect for new websites building initial domain authority.', features: ['Quality backlinks', 'From DR 30+ sites', 'Niche relevant', 'Detailed report'], highlight: false },
              { title: 'Growth Package', icon: '📈', desc: 'Scale your DR with a comprehensive link building campaign.', features: ['Premium backlinks', 'From DR 50+ sites', 'Manual outreach', 'Full analytics'], highlight: true },
              { title: 'Authority Package', icon: '👑', desc: 'Dominate your niche with high-authority backlinks.', features: ['Elite backlinks', 'From DR 70+ sites', 'White-hat only', 'Priority support'], highlight: false },
            ].map((pkg) => (
              <div key={pkg.title} className={`glass-card p-6 ${pkg.highlight ? 'border-brand-500/40' : ''}`} style={pkg.highlight ? { background: 'rgba(99,102,241,0.05)' } : {}}>
                {pkg.highlight && <div className="badge badge-brand mb-4">Most Popular</div>}
                <div className="text-3xl mb-3">{pkg.icon}</div>
                <h3 className="font-bold text-lg mb-1">{pkg.title}</h3>
                <p className="text-muted text-sm mb-4">{pkg.desc}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /><span className="text-muted">{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl text-sm font-semibold ${pkg.highlight ? 'btn-brand' : 'glass-card hover:border-brand-500/30 transition-all'}`}>Coming Soon</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-brand mb-4">Pricing</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, <span className="gradient-text">Transparent Pricing</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Guest', price: 'Free', desc: 'No account needed', features: ['3 domains/bulk run', 'Single domain checks', 'DR result card', 'PNG download'], cta: 'Start Checking', href: '/', highlight: false },
              { name: 'Free Account', price: '$0', desc: 'Create a free account', features: ['100 domains/run', '10 runs per day', 'Bulk CSV export', 'Order dashboard', 'Email support'], cta: 'Sign Up Free', href: '/signup', highlight: false },
              { name: 'Pro', price: '$9.99', desc: 'per month', features: ['1,000 domains/run', 'Unlimited runs', 'Priority API access', 'Advanced analytics', 'Priority support', 'Cancel anytime'], cta: 'Get Pro', href: '/pricing', highlight: true },
            ].map((plan) => (
              <div key={plan.name} className={`glass-card p-6 relative ${plan.highlight ? 'border-brand-500/40' : ''}`} style={plan.highlight ? { background: 'rgba(99,102,241,0.05)' } : {}}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><div className="badge badge-brand px-4 py-1">Best Value</div></div>}
                <h3 className="font-bold mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1"><span className={`text-3xl font-black ${plan.highlight ? 'gradient-text' : ''}`}>{plan.price}</span></div>
                <p className="text-xs text-muted mb-5">{plan.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /><span className="text-muted">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.highlight ? 'btn-brand' : 'glass-card hover:border-brand-500/30'}`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-brand mb-4">FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-glass-hover transition-all">
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5"><div className="border-t border-glass pt-4"><p className="text-muted text-sm leading-relaxed">{faq.a}</p></div></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-10 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.05) 100%)', borderColor: 'rgba(99,102,241,0.25)' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.6) 0%, transparent 70%)', filter: 'blur(30px)' }} />
            </div>
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Check Your <span className="gradient-text">Domain Rating?</span></h2>
              <p className="text-muted mb-8 max-w-lg mx-auto">Join thousands of SEO professionals who use DR Checker daily to monitor and improve domain authority.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup" className="btn-brand px-8 py-3 text-sm text-center">Create Free Account</Link>
                <Link href="/bulk-checker" className="glass-card px-8 py-3 text-sm font-semibold hover:border-brand-500/30 transition-all text-center">Try Bulk Checker</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
