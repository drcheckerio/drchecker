import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Reveal from '@/components/layout/Reveal'
import Link from 'next/link'
import { TrendingUp, CheckCircle, Award, Clock, Shield, MessageCircle, Mail, Search, Link2, BarChart3, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Increase Domain Rating — Guaranteed DR 20+ to 70+ in 2-4 Weeks',
  description: 'Professional Ahrefs DR increase service with permanent guarantee. Boost your Domain Rating to 20+, 30+, 40+, 50+ or 70+ using white-hat high-authority backlinks. Delivered in 2-4 weeks.',
}

const packages = [
  { target: 'DR 20+', price: 40, guarantee: 'Lifetime Permanent Guarantee', popular: false },
  { target: 'DR 30+', price: 70, guarantee: 'Lifetime Permanent Guarantee', popular: false },
  { target: 'DR 40+', price: 130, guarantee: 'Lifetime Permanent Guarantee', popular: true },
  { target: 'DR 50+', price: 100, guarantee: '1 Year Permanent Guarantee', popular: false },
  { target: 'DR 70+', price: 220, guarantee: '1 Year Permanent Guarantee', popular: false },
]

const steps = [
  { icon: <Search className="w-5 h-5" />, title: 'Order Your Target DR', desc: 'Choose your package and share your domain. We audit your current backlink profile within 24 hours.' },
  { icon: <Link2 className="w-5 h-5" />, title: 'Authority Link Placement', desc: 'Our team places high-authority backlinks from strong, established domains using white-hat methodology.' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Ahrefs Recalculates', desc: 'Ahrefs crawls the new links and recalculates your DR. This naturally takes 2–4 weeks to fully reflect.' },
  { icon: <Award className="w-5 h-5" />, title: 'Target Reached — Guaranteed', desc: 'Your DR hits the target. If it ever drops within your guarantee window, we restore it completely free.' },
]

export default function IncreaseDRPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-14 overflow-hidden">
        <div className="orb w-72 h-72 top-10 -left-20" style={{ background: 'rgba(255,138,30,0.18)' }} />
        <div className="orb w-80 h-80 top-24 -right-24" style={{ background: 'rgba(255,106,0,0.14)', animationDelay: '2s' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-primary mb-5 inline-flex"><TrendingUp className="w-3.5 h-3.5" /> Our #1 Service</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-5 text-white">
            Increase Your <span className="gradient-text">Domain Rating</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed mb-6">
            We raise your website's Ahrefs DR to a guaranteed target — DR 20+, 30+, 40+, 50+ or 70+ —
            using high-authority, white-hat backlinks. Delivered in 2–4 weeks with a permanent guarantee.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: <Clock className="w-4 h-4" />, text: '2–4 Week Delivery' },
              { icon: <Shield className="w-4 h-4" />, text: '100% White-Hat' },
              { icon: <Award className="w-4 h-4" />, text: 'Permanent Guarantee' },
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
      <section className="section pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.target} delay={i * 80}>
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
                      <div className="text-3xl font-black text-white">${pkg.price}</div>
                      <div className="text-xs text-muted">one-time</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-2">Increase to {pkg.target}</h3>
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
            <Reveal delay={400}>
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

      {/* Process */}
      <section className="section">
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

      {/* Guarantee explainer */}
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
                    <strong className="text-white">DR 50+ and 70+ packages:</strong> Full 1 Year Permanent Guarantee. Any drop below target within 12 months is fixed free of charge.
                  </p>
                  <p className="text-muted text-sm leading-relaxed">
                    <strong className="text-white">Delivery:</strong> All campaigns complete within 2–4 weeks — the natural time Ahrefs takes to crawl new links and recalculate your rating. You can verify progress anytime using our <Link href="/" className="underline" style={{ color: '#FFA94D' }}>free DR checker</Link>.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
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
