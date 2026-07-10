import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Reveal from '@/components/layout/Reveal'
import Link from 'next/link'
import { TrendingUp, CheckCircle, Award, Clock, Shield, MessageCircle, Mail, Search, Link2, BarChart3, ChevronRight, Star, Users, Zap, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Increase Domain Rating — Guaranteed Ahrefs DR 20+ to 80+ | 50% OFF',
  description: 'Professional Ahrefs DR increase service with permanent guarantee. Boost your Domain Rating to DR 20, 30, 40, 50, 70, 75 or 80+ using white-hat high-authority backlinks. Delivered in 2-4 weeks. 50% launch discount.',
  keywords: ['increase domain rating', 'increase ahrefs dr', 'buy domain rating', 'dr increase service', 'boost domain rating', 'increase dr fast', 'guaranteed dr increase', 'raise website authority'],
}

const packages = [
  { target: 'DR 20+', price: 39, original: 78, guarantee: 'Lifetime Permanent Guarantee', popular: false, rating: 4.9, reviews: 214 },
  { target: 'DR 30+', price: 69, original: 138, guarantee: 'Lifetime Permanent Guarantee', popular: false, rating: 5.0, reviews: 187 },
  { target: 'DR 40+', price: 129, original: 258, guarantee: 'Lifetime Permanent Guarantee', popular: true, rating: 4.9, reviews: 342 },
  { target: 'DR 50+', price: 99, original: 198, guarantee: '1 Year Permanent Guarantee', popular: false, rating: 5.0, reviews: 156 },
  { target: 'DR 70+', price: 249, original: 498, guarantee: '1 Year Permanent Guarantee', popular: false, rating: 4.9, reviews: 128 },
  { target: 'DR 75+', price: 499, original: 998, guarantee: '1 Year Permanent Guarantee', popular: false, rating: 5.0, reviews: 64 },
  { target: 'DR 80+', price: 1999, original: 3998, guarantee: '1 Year Permanent Guarantee', popular: false, rating: 5.0, reviews: 31 },
]

const steps = [
  { icon: <Search className="w-5 h-5" />, title: 'Order Your Target DR', desc: 'Choose your package and share your domain. We audit your current backlink profile within 24 hours.' },
  { icon: <Link2 className="w-5 h-5" />, title: 'Authority Link Placement', desc: 'Our team places high-authority backlinks from strong, established domains using white-hat methodology.' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Ahrefs Recalculates', desc: 'Ahrefs crawls the new links and recalculates your DR. This naturally takes 2–4 weeks to fully reflect.' },
  { icon: <Award className="w-5 h-5" />, title: 'Target Reached — Guaranteed', desc: 'Your DR hits the target. If it ever drops within your guarantee window, we restore it completely free.' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#FBBF24' : 'rgba(148,163,184,0.25)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function IncreaseDRPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-12 overflow-hidden">
        <div className="hero-grid" />
        <div className="hero-spotlight" />
        <div className="hero-beam" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-primary mb-5 inline-flex"><Zap className="w-3.5 h-3.5" /> Limited Launch Offer — 50% OFF All Packages</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-5 text-white">
            Increase Your <span className="gradient-text">Domain Rating</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed mb-6">
            We raise your website's Ahrefs DR to a guaranteed target — from DR 20+ all the way to DR 80+ —
            using high-authority, white-hat backlinks. Delivered in 2–4 weeks with a permanent guarantee.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: <Clock className="w-4 h-4" />, text: '2–4 Week Delivery' },
              { icon: <Shield className="w-4 h-4" />, text: '100% White-Hat' },
              { icon: <Award className="w-4 h-4" />, text: 'Permanent Guarantee' },
              { icon: <Star className="w-4 h-4" />, text: '4.9★ Avg Rating' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold card" style={{ borderRadius: '999px' }}>
                <span style={{ color: '#FFA94D' }}>{b.icon}</span>
                <span className="text-white">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.target} delay={i * 70}>
                <div className={`relative p-6 rounded-2xl h-full transition-transform duration-300 hover:-translate-y-1.5 ${pkg.popular ? 'card-glow' : 'card'}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF8A1E, #FF6A00)' }}>Most Popular</div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,138,30,0.13)', border: '1px solid rgba(255,138,30,0.3)' }}>
                      <TrendingUp className="w-5 h-5" style={{ color: '#FFA94D' }} />
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
                  <div className="flex items-center gap-1.5 mb-3">
                    <Stars rating={pkg.rating} />
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
                  <Link href="/signup" className={`w-full py-3 rounded-xl text-sm font-bold text-center block ${pkg.popular ? 'btn-primary' : 'btn-outline'}`}>
                    Order Now
                  </Link>
                </div>
              </Reveal>
            ))}

            {/* Custom */}
            <Reveal delay={490}>
              <div className="p-6 rounded-2xl card h-full flex flex-col justify-between" style={{ borderStyle: 'dashed', borderColor: 'rgba(255,138,30,0.4)' }}>
                <div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(30,41,66,0.6)', border: '1px solid rgba(148,163,184,0.15)' }}>
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-2">Custom Package</h3>
                  <p className="text-sm text-muted leading-relaxed mb-5">
                    Need a specific DR target, multiple websites, or an agency deal? Contact us and we'll prepare a custom quote for your exact requirement.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/contact" className="btn-primary py-3 text-sm gap-2">
                    <Mail className="w-4 h-4" /> Contact via Email
                  </Link>
                  <button className="btn-outline py-3 text-sm gap-2 opacity-60 cursor-not-allowed" title="WhatsApp coming soon">
                    <MessageCircle className="w-4 h-4" /> WhatsApp (Coming Soon)
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="section pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Users className="w-5 h-5" />, num: '1,100+', label: 'Campaigns Delivered' },
                { icon: <Star className="w-5 h-5" />, num: '4.9/5', label: 'Average Rating' },
                { icon: <Clock className="w-5 h-5" />, num: '2–4 wks', label: 'Typical Delivery' },
                { icon: <Shield className="w-5 h-5" />, num: '100%', label: 'Guarantee Honored' },
              ].map((s) => (
                <div key={s.label} className="card p-5 text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,138,30,0.13)', color: '#FFA94D' }}>{s.icon}</div>
                  <div className="text-2xl font-black gradient-text">{s.num}</div>
                  <div className="text-xs text-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="section pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="badge-primary mb-4 inline-flex">The Process</div>
              <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">How We Increase Your <span className="gradient-text">DR</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="card p-6 h-full flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                      style={{ background: 'linear-gradient(135deg, #FF8A1E, #FF6A00)', boxShadow: '0 0 18px rgba(255,138,30,0.3)' }}>
                      {s.icon}
                    </div>
                    <div className="text-xs font-black text-muted mt-2">0{i + 1}</div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white mb-1.5">{s.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="section pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="card-glow p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(34,197,94,0.13)', border: '1px solid rgba(34,197,94,0.35)' }}>
                  <Shield className="w-7 h-7" style={{ color: '#22C55E' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-3">Our Guarantee — In Plain Words</h2>
                  <p className="text-muted text-sm leading-relaxed mb-3">
                    <strong className="text-white">DR 20+, 30+ and 40+ packages:</strong> Lifetime Permanent Guarantee. If your Domain Rating ever drops below the target — even years later — we restore it at zero cost.
                  </p>
                  <p className="text-muted text-sm leading-relaxed mb-3">
                    <strong className="text-white">DR 50+, 70+, 75+ and 80+ packages:</strong> Full 1 Year Permanent Guarantee. Any drop below target within 12 months is fixed free of charge.
                  </p>
                  <p className="text-muted text-sm leading-relaxed">
                    <strong className="text-white">Delivery:</strong> All campaigns complete within 2–4 weeks — the natural time Ahrefs takes to crawl new links and recalculate your rating. Verify progress anytime with our <Link href="/" className="underline" style={{ color: '#FFA94D' }}>free DR checker</Link>.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <Reveal>
              <div className="text-center mb-10">
                <div className="badge-primary mb-4 inline-flex">Definitive Guide</div>
                <h2 className="text-3xl sm:text-4xl font-black text-white">How to Increase <span className="gradient-text">Domain Rating</span></h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🚀', title: 'Why Increase Your DR?', body: 'A higher DR raises your Google ranking potential, multiplies what you charge for guest posts and link placements, increases your website resale value, and opens premium partnerships. A DR 50 site commands several times the per-placement price of a DR 20 site — one DR investment pays for itself with a handful of link sales.' },
                { icon: '⚙️', title: 'How Our Service Works', body: 'Ahrefs calculates DR purely from the strength of unique domains linking to you. We audit your profile, then place high-authority backlinks from strong, established domains. As Ahrefs recrawls over 2–4 weeks, your DR climbs to the guaranteed target — verifiable in real time with our free checker or your own Ahrefs account.' },
                { icon: '🎯', title: 'Choosing Your Package', body: 'DR 20+ ($39) and 30+ ($69) give new sites instant baseline credibility. DR 40+ ($129), our most popular, qualifies you for most paid link marketplaces. DR 50+ ($99) makes you genuinely strong in competitive niches. DR 70+ ($249), 75+ ($499) and elite 80+ ($1,999) put you in major-publication territory — all currently 50% off.' },
                { icon: '🛡️', title: 'Is It Safe?', body: 'Yes — we never use spam networks, hacked domains, or manipulative anchor schemes. Placements come from real, established, high-authority domains — exactly the profile Google rewards. That is why we can offer Lifetime Guarantees on DR 20/30/40 and full 1 Year Guarantees on DR 50 through 80.' },
                { icon: '⏱️', title: 'Honest Timelines', body: 'Campaigns complete in 2–4 weeks. Links are placed fast, but Ahrefs needs time to crawl, index, and recalculate — the same cycle for everyone. Anyone promising legitimate DR jumps in 24 hours is using manipulations that collapse. Miss your guaranteed target in the window? Full refund.' },
                { icon: '✅', title: 'Start Today', body: 'Check your current rating with our free DR checker, run your portfolio through the bulk checker, then pick your target package above. Custom multi-site and agency quotes are always available — contact us anytime.' },
              ].map((sec, i) => (
                <Reveal key={sec.title} delay={i * 70}>
                  <div className="card p-6 h-full hover:-translate-y-0.5 transition-transform">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4" style={{ background: 'rgba(255,138,30,0.12)', border: '1px solid rgba(255,138,30,0.25)' }}>{sec.icon}</div>
                    <h3 className="font-extrabold text-white text-lg mb-2">{sec.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{sec.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p className="text-center text-sm text-muted mt-8">
                Check your rating first with our <Link href="/" className="underline" style={{ color: '#FFA94D' }}>free DR checker</Link> · bulk audit at the <Link href="/bulk-checker" className="underline" style={{ color: '#FFA94D' }}>bulk checker</Link> · full terms in our <Link href="/refund-policy" className="underline" style={{ color: '#FFA94D' }}>refund policy</Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-black mb-4 text-white">Ready to Boost Your <span className="gradient-text">Authority?</span></h2>
            <p className="text-muted mb-7 max-w-lg mx-auto">Pick your target DR above, or check your current rating first — it takes 5 seconds.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn-primary px-8 py-3 text-sm">Check My Current DR <ChevronRight className="w-4 h-4 ml-1" /></Link>
              <Link href="/contact" className="btn-outline px-8 py-3 text-sm">Ask a Question</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
