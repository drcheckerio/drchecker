'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, MessageCircle, Clock, Send, TrendingUp, HelpCircle, CreditCard } from 'lucide-react'

const SUPPORT_EMAIL = 'support@drchecker.io'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General question')
  const [message, setMessage] = useState('')

  const subjects = ['General question', 'Increase DR enquiry', 'Billing / subscription', 'Bug report', 'Custom package quote']

  const handleSend = () => {
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`[${subject}] drchecker.io`)}&body=${encodeURIComponent(body)}`
  }

  const canSend = name.trim() && email.trim() && message.trim()

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative pt-36 pb-10 overflow-hidden">
        <div className="hero-grid" />
        <div className="hero-spotlight" />
        <div className="hero-beam" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-primary mb-5 inline-flex"><Mail className="w-3.5 h-3.5" /> Contact</div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-4 text-white">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Questions about bulk DR checking, your subscription, or a custom Increase DR package? We reply fast.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Form */}
          <div className="lg:col-span-3 card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-white mb-1">Send us a message</h2>
            <p className="text-muted text-sm mb-6">Fill this in and your email app will open with everything ready to send.</p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-white mb-1.5">Your name</label>
                  <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe" className="input-dark w-full px-4 py-3 text-sm" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-white mb-1.5">Your email</label>
                  <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com" className="input-dark w-full px-4 py-3 text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-white mb-1.5">What is it about?</label>
                <select id="contact-subject" value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="input-dark w-full px-4 py-3 text-sm">
                  {subjects.map((s) => <option key={s} value={s} style={{ background: '#0A0F1E' }}>{s}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-white mb-1.5">Message</label>
                <textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6}
                  placeholder="Tell us what you need — include your domain if it's about a DR campaign."
                  className="input-dark w-full px-4 py-3 text-sm resize-none" />
              </div>

              <button onClick={handleSend} disabled={!canSend} className="btn-primary w-full py-3.5 text-sm gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>

              <p className="text-xs text-muted text-center">
                Prefer your own email client? Write to{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="underline font-semibold" style={{ color: '#FFA94D' }}>{SUPPORT_EMAIL}</a>
              </p>
            </div>
          </div>

          {/* Side info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,138,30,0.13)', border: '1px solid rgba(255,138,30,0.25)' }}>
                <Mail className="w-5 h-5" style={{ color: '#FFA94D' }} />
              </div>
              <h3 className="font-extrabold text-white mb-1">Email us</h3>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm underline break-all" style={{ color: '#FFA94D' }}>{SUPPORT_EMAIL}</a>
            </div>

            <div className="card p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(34,197,94,0.13)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <Clock className="w-5 h-5" style={{ color: '#22C55E' }} />
              </div>
              <h3 className="font-extrabold text-white mb-1">Response time</h3>
              <p className="text-sm text-muted">Usually within 24 hours, 7 days a week.</p>
            </div>

            <div className="card p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)' }}>
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-white mb-1">WhatsApp</h3>
              <p className="text-sm text-muted">Coming soon — email is the fastest route right now.</p>
            </div>

            <div className="card p-6">
              <h3 className="font-extrabold text-white mb-3 text-sm">Quick answers</h3>
              <div className="space-y-2.5">
                <Link href="/#faq" className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" /> DR checker FAQ
                </Link>
                <Link href="/increase-dr" className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors">
                  <TrendingUp className="w-4 h-4 flex-shrink-0" /> Increase DR packages
                </Link>
                <Link href="/refund-policy" className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors">
                  <CreditCard className="w-4 h-4 flex-shrink-0" /> Refund policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
