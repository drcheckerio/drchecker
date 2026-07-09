'use client'
import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DRResultCard from '@/components/dr/DRResultCard'
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
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
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
          <article className="seo-content">
            <h2 className="text-white">The Complete Guide to Ahrefs Domain Rating (DR)</h2>
            <p>
              If you work in SEO, buy or sell websites, build links, or run any kind of online business, you have almost certainly come across the term <strong>Domain Rating</strong> — usually shortened to <strong>DR</strong>. It is one of the most widely used authority metrics in the entire SEO industry, and understanding it properly can transform the way you approach link building, content strategy, and website valuation. This guide explains everything you need to know about Ahrefs DR: what it is, how it is calculated, what counts as a good score, how to check it for free using our <Link href="/">Ahrefs DR checker</Link>, and — most importantly — how to increase it.
            </p>

            <h3 className="text-white">What is Ahrefs Domain Rating?</h3>
            <p>
              <strong>Ahrefs Domain Rating (DR)</strong> is a proprietary metric created by Ahrefs, one of the largest and most respected SEO toolsets in the world. DR measures the overall strength of a website's backlink profile on a logarithmic scale from 0 to 100. A brand-new website with no backlinks starts at DR 0, while global giants like Google, YouTube, and Wikipedia sit at or near DR 100.
            </p>
            <p>
              The keyword here is <strong>backlink profile</strong>. DR does not measure traffic, content quality, or how well a site ranks. It measures one thing: how strong and authoritative the links pointing to a website are. Because backlinks remain one of Google's most important ranking factors, DR has become the industry's standard shorthand for "how powerful is this website?"
            </p>

            <h3 className="text-white">How is Domain Rating Calculated?</h3>
            <p>
              Ahrefs has never published its exact formula, but the company has openly explained the core mechanics. The calculation works in three broad steps. First, Ahrefs counts how many <strong>unique domains</strong> link to your website — note that a hundred links from one domain count far less than one link each from a hundred different domains. Second, it evaluates the <strong>DR of each linking domain</strong>: a backlink from a DR 85 website transfers dramatically more "rating juice" than a link from a DR 15 blog. Third, it considers how many other websites each of those linking domains also links out to — the more sites a domain links to, the more its authority is split between them.
            </p>
            <p>
              The results are then plotted on a <strong>logarithmic scale</strong>. This is a crucial detail that many people miss: moving from DR 10 to DR 20 is relatively easy, but moving from DR 70 to DR 80 requires exponentially more link authority. This is exactly why high-DR websites are so valuable and why our <Link href="/increase-dr">Increase DR service</Link> is priced by target tier.
            </p>

            <h3 className="text-white">What is a Good Domain Rating?</h3>
            <p>
              There is no universal "good" DR — it always depends on your niche and your competitors. That said, the SEO industry broadly recognizes four tiers. A DR of <strong>0–29</strong> is considered Poor: these are typically new websites or sites that have never invested in link building. A DR of <strong>30–49</strong> is Fair: the site has a real, growing backlink profile and some competitive presence. A DR of <strong>50–69</strong> is Good: these are strong, established websites that can compete for meaningful keywords in most industries. A DR of <strong>70–100</strong> is Excellent: this is elite territory occupied by major publications, global brands, and authority sites.
            </p>
            <p>
              The smartest way to use these tiers is comparatively. Run your own domain and your top three competitors through our <Link href="/bulk-checker">bulk DR checker</Link> and see where you stand. If your competitors average DR 45 and you sit at DR 22, you have found your gap — and closing it should become a core part of your SEO strategy.
            </p>

            <h3 className="text-white">DR vs DA: What's the Difference?</h3>
            <p>
              People often confuse Ahrefs DR with Moz's <strong>Domain Authority (DA)</strong>. Both metrics attempt to measure website authority on a 0–100 scale, but they come from different companies, use different crawlers, and rely on different link databases. Ahrefs operates one of the largest live backlink indexes in the world, which is why many SEO professionals treat DR as the more responsive and reliable of the two metrics. In the link-buying and website-flipping markets specifically, DR has become the dominant currency — listings on marketplaces almost always quote Ahrefs DR first.
            </p>

            <h3 className="text-white">Why Does Domain Rating Matter So Much?</h3>
            <p>
              First, <strong>rankings</strong>. While DR itself is not a direct Google ranking factor, the thing it measures — backlink authority — absolutely is. Sites with higher DR consistently rank faster and higher for competitive keywords because Google trusts domains with strong link profiles.
            </p>
            <p>
              Second, <strong>monetization</strong>. If you sell guest posts or link placements, your DR directly sets your prices. A DR 50 site can charge several times more per placement than a DR 20 site. Increasing your DR is quite literally increasing your income per link sold.
            </p>
            <p>
              Third, <strong>website value</strong>. When websites are bought and sold, DR is one of the first metrics every buyer checks. Two sites with identical traffic can sell for very different prices purely because of the difference in their Domain Rating.
            </p>
            <p>
              Fourth, <strong>partnerships and outreach</strong>. Brands, sponsors, and PR agencies filter potential partners by DR. A higher DR gets your outreach emails answered and gets your site included in paid campaigns.
            </p>

            <h3 className="text-white">How to Check Ahrefs DR for Free</h3>
            <p>
              Normally, checking DR requires an Ahrefs subscription starting at $99+ per month. Our free <Link href="/">DR checker</Link> pulls the same live Ahrefs data at zero cost. As a guest you can check up to <strong>20 domains per check, 3 times per day</strong> — no account needed. Create a <Link href="/signup">free account</Link> and that jumps to <strong>100 domains per check, 10 times per day</strong>, with CSV export included. Power users, agencies, and link builders can upgrade to <Link href="/#pricing">Pro for just $5/month</Link> and unlock <strong>1,000 domains per check with unlimited checks</strong> — the highest limits of any DR checker available.
            </p>
            <p>
              Every single-domain check also generates a beautiful shareable result card with an animated DR gauge that you can download as a PNG — perfect for client reports, marketplace listings, and social proof.
            </p>

            <h3 className="text-white">How to Increase Your Domain Rating</h3>
            <p>
              Since DR is purely a function of your backlink profile, increasing it comes down to one thing: <strong>earning links from high-DR domains</strong>. The classic organic routes include creating link-worthy content (original research, free tools, in-depth guides), digital PR campaigns, guest posting on authoritative sites, and reclaiming broken or lost links. These methods work, but they are slow — often taking six to twelve months to move DR meaningfully — and they demand significant time, skill, and budget.
            </p>
            <p>
              That is exactly why we built our <Link href="/increase-dr">Increase DR service</Link>. We handle the entire process for you: our team places high-authority backlinks using proven white-hat methodology, and your DR rises to a guaranteed target — <strong>DR 20+, 30+, 40+, 50+, or 70+</strong>. Results typically appear within <strong>2–4 weeks</strong> as Ahrefs recrawls and recalculates. Our DR 20+ through 40+ packages carry a <strong>Lifetime Permanent Guarantee</strong>, and our DR 50+ and 70+ packages include a full <strong>1 Year Guarantee</strong> — if your rating drops below target within the guarantee window, we restore it at no extra cost.
            </p>

            <h3 className="text-white">Common Myths About Domain Rating</h3>
            <p>
              <strong>Myth 1: "DR is a Google ranking factor."</strong> It isn't — Google has its own internal systems. But DR closely mirrors the link authority signals Google does use, which is why the correlation between DR and rankings is so strong.
            </p>
            <p>
              <strong>Myth 2: "More backlinks always means higher DR."</strong> False. A thousand links from weak, spammy domains can do less for your DR than five links from genuinely authoritative websites. Quality beats quantity every time.
            </p>
            <p>
              <strong>Myth 3: "DR updates instantly."</strong> Ahrefs recalculates DR as it recrawls the web, which can take days to weeks. This is why our DR increase campaigns quote a 2–4 week delivery window — the links land quickly, but Ahrefs needs time to register them.
            </p>

            <h3 className="text-white">Start Checking and Growing Your DR Today</h3>
            <p>
              Whether you're auditing your own site, vetting domains before purchase, pricing your link inventory, or researching competitors — knowing your Domain Rating is step one. Use our free <Link href="/">Ahrefs DR checker</Link> above, run your whole portfolio through the <Link href="/bulk-checker">bulk checker</Link>, and when you're ready to level up, our <Link href="/increase-dr">Increase DR packages</Link> will get you there with a guarantee. Questions? <Link href="/contact">Contact us</Link> anytime — we're happy to help.
            </p>
          </article>
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
