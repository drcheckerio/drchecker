'use client'
import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DRResultCard from '@/components/dr/DRResultCard'
import Reveal from '@/components/layout/Reveal'
import { DRResult } from '@/types'
import { cleanDomain } from '@/lib/utils'
import Link from 'next/link'
import {
  Search, Zap, Shield, BarChart3, Globe, CheckCircle, TrendingUp,
  ChevronRight, ChevronDown, ArrowRight, Layers, Clock, Award,
  MessageCircle, Mail, Crown, Users
} from 'lucide-react'

export default function HomePage() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DRResult | null>(null)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        const el = resultRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const fits = rect.height < window.innerHeight - 100
        // Scroll so the FULL card is visible; speedometer starts only after it's in view
        el.scrollIntoView({ behavior: 'smooth', block: fits ? 'center' : 'start' })
      }, 120)
    }
  }, [result])

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

  const drPackages = [
    { target: 'DR 20+', price: 39, original: 78, guarantee: 'Lifetime Permanent Guarantee', popular: false, rating: 4.9, reviews: 214 },
    { target: 'DR 30+', price: 69, original: 138, guarantee: 'Lifetime Permanent Guarantee', popular: false, rating: 5.0, reviews: 187 },
    { target: 'DR 40+', price: 129, original: 258, guarantee: 'Lifetime Permanent Guarantee', popular: true, rating: 4.9, reviews: 342 },
    { target: 'DR 50+', price: 99, original: 198, guarantee: '1 Year Permanent Guarantee', popular: false, rating: 5.0, reviews: 156 },
    { target: 'DR 70+', price: 249, original: 498, guarantee: '1 Year Permanent Guarantee', popular: false, rating: 4.9, reviews: 128 },
    { target: 'DR 75+', price: 499, original: 998, guarantee: '1 Year Permanent Guarantee', popular: false, rating: 5.0, reviews: 64 },
    { target: 'DR 80+', price: 1999, original: 3998, guarantee: '1 Year Permanent Guarantee', popular: false, rating: 5.0, reviews: 31 },
  ]

  const plans = [
    {
      name: 'Guest', icon: <Users className="w-5 h-5" />, price: 'Free', period: 'no account needed',
      features: ['20 domains per check', '3 checks per day', 'Single DR checks', 'PNG download of results', 'Full DR result card'],
      cta: 'Start Checking', href: '#top', highlight: false,
    },
    {
      name: 'Free Account', icon: <Shield className="w-5 h-5" />, price: '$0', period: 'forever free',
      features: ['100 domains per check', '10 checks per day', 'CSV export of bulk results', 'Order tracking dashboard', 'Email support'],
      cta: 'Create Free Account', href: '/signup', highlight: false,
    },
    {
      name: 'Pro', icon: <Crown className="w-5 h-5" />, price: '$5', period: 'per month',
      features: ['1,000 domains per check', 'Unlimited checks', 'Priority processing speed', 'Bulk CSV + copy export', 'Priority support', 'Cancel anytime'],
      cta: 'Go Pro Now', href: '/signup?plan=pro', highlight: true,
    },
  ]

  const faqs = [
    { q: 'What is Ahrefs Domain Rating (DR)?', a: "Ahrefs Domain Rating (DR) is a metric that shows the strength of a website's backlink profile on a logarithmic scale from 0 to 100. The higher the DR, the stronger and more authoritative the website is considered by SEO professionals worldwide." },
    { q: 'Is this DR checker really free?', a: 'Yes. Guests can check up to 20 domains per check, 3 times per day — completely free with no account. A free account raises that to 100 domains per check, 10 times daily. Pro users get 1,000 domains per check with unlimited checks for just $5/month.' },
    { q: 'How do you increase Domain Rating?', a: 'We increase DR through high-authority backlink placement using proven white-hat methodologies. Your website gains links from strong, established domains which raises your Ahrefs DR. The process typically takes 2–4 weeks to complete.' },
    { q: 'Is the DR increase permanent?', a: 'Yes — our DR 20+, 30+ and 40+ packages come with a Lifetime Permanent Guarantee. The DR 50+ and DR 70+ packages include a full 1 Year Permanent Guarantee. If your DR drops below the target within the guarantee period, we restore it free of charge.' },
    { q: 'How long does it take to increase DR?', a: 'DR increase campaigns typically take 2–4 weeks to fully reflect in Ahrefs. This is the natural time Ahrefs takes to crawl, index, and recalculate ratings after new authority links are established.' },
    { q: 'How accurate is your DR data?', a: 'Our results come directly from live Ahrefs data — the same figures you would see inside Ahrefs Site Explorer. Data is refreshed continuously as Ahrefs recrawls the web.' },
    { q: 'What is a good DR score?', a: '0–29 is Poor (new/weak sites), 30–49 is Fair (growing authority), 50–69 is Good (strong, competitive sites), and 70–100 is Excellent (top-tier authority like major publications). Always benchmark against competitors in your specific niche.' },
    { q: 'Can I order a custom DR target?', a: 'Absolutely. If you need a specific DR target not listed in our packages, contact us via email or WhatsApp and we will prepare a custom quote for your exact requirement.' },
  ]

  return (
    <div className="min-h-screen" id="top">
      <Navbar />

      {/* HERO + CHECKER */}
      <section className="relative pt-32 sm:pt-36 pb-12 overflow-hidden">
        <div className="hero-grid" />
        <div className="hero-spotlight" />
        <div className="hero-beam" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="badge-primary">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: '#FF8A1E' }}></span>
              Live Data from Ahrefs
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto mb-9">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-5 text-white">
              Ahrefs Domain Rating <span className="gradient-text">Checker</span>
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Check the Ahrefs DR of any website instantly — free, accurate, and no sign-up required.
              Bulk check up to 1,000 domains in one go.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="card p-2 flex flex-col sm:flex-row gap-2" style={{ background: 'rgba(15,22,41,0.65)' }}>
              <div className="flex-1 flex items-center gap-3 px-4">
                <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#FF8A1E' }} />
                <input
                  type="text"
                  placeholder="Enter domain (e.g. example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                  className="flex-1 bg-transparent py-3 text-sm outline-none text-white placeholder:text-neutral-500 min-w-0"
                />
              </div>
              <button onClick={handleCheck} disabled={loading || !domain.trim()}
                className="btn-primary px-6 py-3 text-sm gap-2 flex-shrink-0">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Checking...</>
                  : <><Search className="w-4 h-4" />Check DR</>}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-3 px-1 gap-2">
              <p className="text-xs text-muted">Free · 20 domains per check · 3 checks/day for guests</p>
              <Link href="/bulk-checker"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: 'rgba(255,138,30,0.14)', border: '1px solid rgba(255,138,30,0.35)', color: '#FFA94D' }}>
                <Layers className="w-4 h-4" /> Bulk DR Check <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {error && (
            <div className="max-w-3xl mx-auto mt-5 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
              {error}
            </div>
          )}

          {result && (
            <div className="max-w-5xl mx-auto mt-8" ref={resultRef} style={{ scrollMarginTop: '90px' }}>
              <div className="card-glow px-5 py-4 mb-5 flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 flex-shrink-0" style={{ color: '#FF8A1E' }} />
                  <p className="text-sm text-white font-semibold">
                    Checking many sites? <span className="text-muted font-normal">Pro gives you 1,000 domains per check, unlimited — just $5/month.</span>
                  </p>
                </div>
                <Link href="/#pricing" className="btn-primary px-5 py-2 text-xs flex-shrink-0">Upgrade to Pro</Link>
              </div>
              <DRResultCard result={result} domain={cleanDomain(domain)} />
            </div>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge-primary mb-4">Pricing</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Simple, <span className="gradient-text">Honest Pricing</span></h2>
            <p className="text-muted max-w-xl mx-auto">Start checking for free. Upgrade only when you need serious volume.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <div key={plan.name}
                className={`relative p-6 flex flex-col rounded-2xl transition-transform duration-300 hover:-translate-y-1 ${plan.highlight ? 'card-glow' : 'card'}`}
                style={plan.highlight ? { border: '1px solid rgba(255,138,30,0.5)', boxShadow: '0 0 40px rgba(255,138,30,0.15)' } : {}}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="badge-primary px-4 py-1" style={{ background: '#FF8A1E', color: '#fff', border: 'none' }}>Best Value</div>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: plan.highlight ? 'rgba(255,138,30,0.2)' : 'rgba(255,255,255,0.06)', color: plan.highlight ? '#FF8A1E' : '#A3A3A3' }}>
                    {plan.icon}
                  </div>
                  <h3 className="font-extrabold text-white">{plan.name}</h3>
                </div>
                <div className="mb-5">
                  <span className={`text-4xl font-black ${plan.highlight ? 'gradient-text' : 'text-white'}`}>{plan.price}</span>
                  <span className="text-sm text-muted ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#22C55E' }} />
                      <span className="text-muted">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className={`text-center py-3 rounded-xl text-sm font-bold transition-all ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INCREASE DR */}
      <section className="section" id="increase-dr">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge-primary mb-4">Our #1 Service</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Increase Your <span className="gradient-text">Domain Rating</span></h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed">
              We increase your website's Ahrefs DR to guaranteed targets using high-authority backlinks.
              Every package includes a permanent guarantee — if your DR drops within the guarantee window, we restore it free.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: 'rgba(30,41,66,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              <Clock className="w-4 h-4" style={{ color: '#FF8A1E' }} />
              Delivery time: 2–4 weeks
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {drPackages.map((pkg) => (
              <div key={pkg.target}
                className={`relative p-6 rounded-2xl transition-transform duration-300 hover:-translate-y-1 ${pkg.popular ? 'card-glow' : 'card'}`}
                style={pkg.popular ? { border: '1px solid rgba(255,138,30,0.5)', boxShadow: '0 0 36px rgba(255,138,30,0.15)' } : {}}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="badge-primary px-4 py-1" style={{ background: '#FF8A1E', color: '#fff', border: 'none' }}>Most Popular</div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,138,30,0.15)', border: '1px solid rgba(255,138,30,0.3)' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: '#FF8A1E' }} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-sm font-bold line-through" style={{ color: '#5A657E' }}>${pkg.original}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}>50% OFF</span>
                    </div>
                    <div className="text-3xl font-black text-white">${pkg.price}</div>
                    <div className="text-xs text-muted">one-time</div>
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-white mb-1">Increase to {pkg.target}</h3>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={s <= Math.round(pkg.rating) ? '#FBBF24' : 'rgba(148,163,184,0.25)'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">{pkg.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted">({pkg.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 flex-shrink-0" style={{ color: '#22C55E' }} />
                  <span className="text-xs font-bold" style={{ color: '#22C55E' }}>{pkg.guarantee}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {['High-authority backlinks', 'White-hat methodology', 'Live Ahrefs verification', '2–4 week delivery'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#22C55E' }} />
                      <span className="text-muted">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`w-full py-3 rounded-xl text-sm font-bold text-center block transition-all ${pkg.popular ? 'btn-primary' : 'btn-outline'}`}>
                  Order Now
                </Link>
              </div>
            ))}

            <div className="p-6 rounded-2xl card flex flex-col justify-between" style={{ borderStyle: 'dashed', borderColor: 'rgba(255,138,30,0.4)' }}>
              <div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(30,41,66,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Custom Package</h3>
                <p className="text-sm text-muted leading-relaxed mb-5">
                  Need a specific DR target, multiple websites, or an agency deal? Contact us directly and we'll build a custom quote for you.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/contact" className="btn-primary py-3 text-sm gap-2">
                  <Mail className="w-4 h-4" /> Contact via Email
                </Link>
                <button className="btn-outline py-3 text-sm gap-2" disabled title="WhatsApp coming soon">
                  <MessageCircle className="w-4 h-4" /> WhatsApp (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge-primary mb-4">Simple Process</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">How It <span className="gradient-text">Works</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: <Globe className="w-6 h-6" />, title: 'Enter Your Domain', desc: 'Type any domain or URL into the checker above. We clean and normalize it automatically — no formatting needed.' },
              { step: '02', icon: <Zap className="w-6 h-6" />, title: 'Instant Live Lookup', desc: 'We query live Ahrefs data in real-time and pull the current Domain Rating for your website in seconds.' },
              { step: '03', icon: <BarChart3 className="w-6 h-6" />, title: 'Get Your DR Card', desc: 'See your score on our animated 3D gauge, download it as a PNG, and explore how to increase it further.' },
            ].map((s, i) => (
              <div key={s.step} className="card p-6 relative group">
                <div className="absolute top-4 right-4 text-6xl font-black" style={{ color: 'rgba(255,255,255,0.04)' }}>{s.step}</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:shadow-primary-glow transition-shadow"
                  style={{ background: 'linear-gradient(135deg, #FF8A1E 0%, #FF6A00 100%)' }}>
                  {s.icon}
                </div>
                <h3 className="font-extrabold text-white mb-2">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                {i < 2 && <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10"><ArrowRight className="w-6 h-6" style={{ color: '#FF8A1E' }} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DR MATTERS */}
      <section className="section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge-primary mb-4">Why It Matters</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Why Domain Rating <span className="gradient-text">Matters</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <TrendingUp className="w-5 h-5" />, title: 'Higher Rankings', desc: 'Sites with stronger backlink profiles consistently rank higher in Google. DR is the fastest way to measure that strength.' },
              { icon: <Award className="w-5 h-5" />, title: 'Link Selling Value', desc: 'Higher DR means your site commands premium prices for guest posts and link placements — DR directly sets your rates.' },
              { icon: <Shield className="w-5 h-5" />, title: 'Buyer Trust', desc: 'When buying or selling websites, DR is the #1 authority metric buyers check. Higher DR = higher site valuation.' },
              { icon: <Users className="w-5 h-5" />, title: 'Partnership Vetting', desc: 'Brands and agencies use DR to decide which sites to partner with. A strong DR opens doors to better collaborations.' },
              { icon: <Zap className="w-5 h-5" />, title: 'Faster Indexing', desc: 'High-authority sites get crawled more frequently by Google, meaning your new content gets discovered and ranked faster.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Competitive Benchmark', desc: 'Compare your DR against competitors to know exactly where you stand and how much link building you need.' },
            ].map((f) => (
              <div key={f.title} className="card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,138,30,0.13)', color: '#FF8A1E', border: '1px solid rgba(255,138,30,0.25)' }}>
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1 text-sm">{f.title}</h4>
                  <p className="text-muted text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { range: '0–29', label: 'Poor', color: '#EF4444', desc: 'New or weak sites. Time to build authority.' },
              { range: '30–49', label: 'Fair', color: '#F59E0B', desc: 'Growing profile with real potential.' },
              { range: '50–69', label: 'Good', color: '#3B82F6', desc: 'Strong sites, competitive in most niches.' },
              { range: '70–100', label: 'Excellent', color: '#22C55E', desc: 'Top-tier authority. Elite territory.' },
            ].map((item) => (
              <div key={item.label} className="card p-5 text-center" style={{ background: `${item.color}0D`, borderColor: `${item.color}35` }}>
                <div className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.range}</div>
                <div className="font-extrabold mb-2 text-sm" style={{ color: item.color }}>{item.label}</div>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge-primary mb-4">FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
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
            ))}
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <Reveal>
              <div className="text-center mb-10">
                <div className="badge-primary mb-4 inline-flex">Complete Guide</div>
                <h2 className="text-3xl sm:text-4xl font-black text-white">The Complete Guide to <span className="gradient-text">Ahrefs Domain Rating</span></h2>
              </div>
            </Reveal>

            <div className="space-y-4">
              {[
                { icon: '📖', title: 'What is Ahrefs Domain Rating?', body: <>
                  <p className="text-muted text-sm leading-relaxed mb-3"><strong className="text-white">Ahrefs Domain Rating (DR)</strong> is a proprietary metric created by Ahrefs that measures the overall strength of a website's backlink profile on a logarithmic scale from 0 to 100. A brand-new website starts at DR 0, while global giants like Google and Wikipedia sit at or near DR 100.</p>
                  <p className="text-muted text-sm leading-relaxed">DR does not measure traffic or content quality — it measures one thing: how strong and authoritative the links pointing to a website are. Because backlinks remain one of Google's most important ranking factors, DR has become the industry's standard shorthand for website authority.</p>
                </> },
                { icon: '🧮', title: 'How is Domain Rating Calculated?', body: <>
                  <p className="text-muted text-sm leading-relaxed mb-3">Ahrefs counts how many <strong className="text-white">unique domains</strong> link to your website, evaluates the <strong className="text-white">DR of each linking domain</strong> (a link from DR 85 transfers far more authority than one from DR 15), and considers how many other sites each linker also links to.</p>
                  <p className="text-muted text-sm leading-relaxed">Results sit on a <strong className="text-white">logarithmic scale</strong> — moving from DR 10 to 20 is easy, but DR 70 to 80 requires exponentially more link authority. This is why high-DR sites are so valuable and why our <Link href="/increase-dr" className="underline" style={{ color: '#FFA94D' }}>Increase DR service</Link> is priced by target tier.</p>
                </> },
                { icon: '🎯', title: 'What is a Good Domain Rating?', body: <>
                  <p className="text-muted text-sm leading-relaxed mb-3">The industry recognizes four tiers: <strong style={{ color: '#EF4444' }}>0–29 Poor</strong> (new sites), <strong style={{ color: '#F59E0B' }}>30–49 Fair</strong> (growing authority), <strong style={{ color: '#3B82F6' }}>50–69 Good</strong> (strong, competitive sites), and <strong style={{ color: '#22C55E' }}>70–100 Excellent</strong> (elite authority).</p>
                  <p className="text-muted text-sm leading-relaxed">The smartest use is comparative: run your domain and your top competitors through our <Link href="/bulk-checker" className="underline" style={{ color: '#FFA94D' }}>bulk DR checker</Link>. If competitors average DR 45 and you sit at DR 22, closing that gap should become a core part of your SEO strategy.</p>
                </> },
                { icon: '⚖️', title: 'DR vs DA — What is the Difference?', body: <>
                  <p className="text-muted text-sm leading-relaxed">DR is Ahrefs' metric; DA (Domain Authority) is Moz's. Both measure authority on a 0–100 scale but use different crawlers and databases. Ahrefs operates one of the largest live backlink indexes in the world, which is why most SEO professionals — and virtually all link marketplaces — treat DR as the primary currency of website authority.</p>
                </> },
                { icon: '🚀', title: 'Why Does Domain Rating Matter?', body: <>
                  <p className="text-muted text-sm leading-relaxed mb-3"><strong className="text-white">Rankings:</strong> sites with higher DR consistently rank faster and higher. <strong className="text-white">Monetization:</strong> your DR directly sets your guest post and link placement prices — a DR 50 site charges several times more than a DR 20 site.</p>
                  <p className="text-muted text-sm leading-relaxed"><strong className="text-white">Website value:</strong> DR is the first metric every website buyer checks. <strong className="text-white">Partnerships:</strong> brands and agencies filter outreach targets by DR — a strong rating gets your emails answered.</p>
                </> },
                { icon: '🆓', title: 'How to Check Ahrefs DR for Free', body: <>
                  <p className="text-muted text-sm leading-relaxed">Checking DR normally requires a $99+/month Ahrefs subscription. Our <Link href="/" className="underline" style={{ color: '#FFA94D' }}>free DR checker</Link> pulls the same live data at zero cost — guests get 20 domains per check 3 times daily, a <Link href="/signup" className="underline" style={{ color: '#FFA94D' }}>free account</Link> unlocks 100 domains 10 times daily, and <Link href="/#pricing" className="underline" style={{ color: '#FFA94D' }}>Pro at $5/month</Link> gives you 1,000 domains per check with unlimited runs. Every single check produces a shareable result card downloadable as PNG.</p>
                </> },
                { icon: '📈', title: 'How to Increase Your Domain Rating', body: <>
                  <p className="text-muted text-sm leading-relaxed mb-3">Organic routes — link-worthy content, digital PR, guest posting — work but often take 6–12 months. Our <Link href="/increase-dr" className="underline" style={{ color: '#FFA94D' }}>Increase DR service</Link> handles everything: high-authority white-hat backlinks raise your DR to a guaranteed target of <strong className="text-white">20+, 30+, 40+, 50+, 70+, 75+ or 80+</strong> within 2–4 weeks.</p>
                  <p className="text-muted text-sm leading-relaxed">DR 20–40 packages carry a <strong style={{ color: '#22C55E' }}>Lifetime Permanent Guarantee</strong>; DR 50–80 packages include a full <strong style={{ color: '#22C55E' }}>1 Year Guarantee</strong>. If your rating drops below target inside the window, we restore it free.</p>
                </> },
                { icon: '💡', title: 'Common Myths About DR', body: <>
                  <p className="text-muted text-sm leading-relaxed mb-3"><strong className="text-white">"DR is a Google ranking factor"</strong> — it isn't, but it closely mirrors the link signals Google does use. <strong className="text-white">"More backlinks always means higher DR"</strong> — false; five links from authoritative domains beat a thousand spammy ones.</p>
                  <p className="text-muted text-sm leading-relaxed"><strong className="text-white">"DR updates instantly"</strong> — Ahrefs recalculates as it recrawls the web, taking days to weeks. That's exactly why honest DR campaigns quote 2–4 week timelines.</p>
                </> },
              ].map((sec, i) => (
                <Reveal key={sec.title} delay={i * 60}>
                  <div className="card p-6 hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(255,138,30,0.12)', border: '1px solid rgba(255,138,30,0.25)' }}>{sec.icon}</div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-white text-lg mb-2">{sec.title}</h3>
                        {sec.body}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glow p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-black mb-4 text-white">Ready to Grow Your <span className="gradient-text">Domain Rating?</span></h2>
              <p className="text-muted mb-8 max-w-lg mx-auto">Check any domain free right now — or let us increase your DR with a guaranteed result in 2–4 weeks.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="#top" className="btn-primary px-8 py-3 text-sm">Check DR Free</a>
                <Link href="/increase-dr" className="btn-outline px-8 py-3 text-sm">See Increase DR Packages</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
