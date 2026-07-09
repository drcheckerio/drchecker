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
          <article className="seo-content">
            <Reveal>
              <h2>How to Increase Domain Rating (DR) — The Definitive Guide</h2>
              <p>
                <strong>Increasing your Ahrefs Domain Rating</strong> is one of the highest-leverage moves you can make for any website. A higher DR raises your Google ranking potential, multiplies what you can charge for guest posts and link placements, increases your website's resale value, and opens doors to premium partnerships. On this page we explain exactly how DR increases work, why our service is trusted by over a thousand website owners, and how to choose the right package for your goals.
              </p>
            </Reveal>

            <Reveal>
              <h3>Why Increase Your Domain Rating?</h3>
              <p>
                Domain Rating is the SEO industry's standard shorthand for website authority. When you <strong>increase DR</strong>, everything downstream gets easier: your content ranks faster because Google trusts authoritative link profiles, outreach targets reply because your metrics pass their filters, and marketplaces value your site higher because DR is the first number every buyer checks. For sites that monetize through link selling, the effect is direct and immediate — a DR 50 website commands several times the per-placement price of a DR 20 website. In practical terms, a one-time investment in raising your DR pays for itself with just a handful of link sales.
              </p>
            </Reveal>

            <Reveal>
              <h3>How Our DR Increase Service Works</h3>
              <p>
                Ahrefs calculates DR from one thing only: the strength of the unique domains linking to your website. Our methodology works directly with that mechanism. After you order, we audit your current backlink profile, then place <strong>high-authority backlinks from strong, established domains</strong> pointing to your site. As Ahrefs recrawls the web over the following 2–4 weeks, it registers these new authority signals and recalculates your Domain Rating upward to your guaranteed target. Everything we do is white-hat and verifiable — you can watch your DR climb in real time using our <Link href="/">free Ahrefs DR checker</Link> or your own Ahrefs account.
              </p>
            </Reveal>

            <Reveal>
              <h3>Which DR Package Should You Choose?</h3>
              <p>
                <strong>DR 20+ ($39)</strong> and <strong>DR 30+ ($69)</strong> are perfect for brand-new websites that need baseline credibility fast — ideal before pitching guest posts or applying to ad networks. <strong>DR 40+ ($129)</strong>, our most popular package, hits the sweet spot where sites qualify for the majority of paid link-placement marketplaces. <strong>DR 50+ ($99)</strong> positions you as a genuinely strong domain in competitive niches. For premium plays — flipping high-value sites, dominating tough SERPs, or building an authority brand — <strong>DR 70+ ($249)</strong>, <strong>DR 75+ ($499)</strong> and our elite <strong>DR 80+ ($1,999)</strong> packages put you in the same authority tier as major publications. Every package is currently <strong>50% off</strong> as part of our launch offer.
              </p>
            </Reveal>

            <Reveal>
              <h3>Is Increasing DR Safe for My Website?</h3>
              <p>
                Yes — when it's done the way we do it. We never use spam networks, hacked domains, or manipulative anchor schemes that could trigger penalties. Our placements come from real, established, high-authority domains, which is precisely the kind of link profile Google's algorithms are designed to reward. That's also why we can offer guarantees no one else matches: <strong>Lifetime Permanent Guarantees</strong> on DR 20/30/40 packages and full <strong>1 Year Guarantees</strong> on DR 50/70/75/80. If your rating drops below target inside the guarantee window, we restore it free — no arguments, no fine print.
              </p>
            </Reveal>

            <Reveal>
              <h3>How Long Does It Take to Increase DR?</h3>
              <p>
                Our campaigns complete in <strong>2–4 weeks</strong>. The links themselves are placed quickly, but Ahrefs needs time to crawl them, index them, and recalculate your score — that recalculation cycle is what sets the timeline, and it's the same for everyone in the industry. Anyone promising a legitimate DR jump in "24 hours" is either using manipulations that will collapse (and possibly get flagged) or simply not telling the truth. We quote honest timelines and back them with our refund policy: if we miss your guaranteed target within the promised window, you get <Link href="/refund-policy">your money back</Link>.
              </p>
            </Reveal>

            <Reveal>
              <h3>Start Today</h3>
              <p>
                First, check your current rating with our <Link href="/">free DR checker</Link> — or run your whole portfolio through the <Link href="/bulk-checker">bulk checker</Link>. Then pick your target package above and place your order. Questions before you buy? <Link href="/contact">Contact us</Link> — we respond fast, and custom multi-site or agency quotes are always available.
              </p>
            </Reveal>
          </article>
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
