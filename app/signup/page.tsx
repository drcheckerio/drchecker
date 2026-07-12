'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, User, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsConfirm, setNeedsConfirm] = useState(false)

  const handleSignup = async () => {
    if (!email || !password || !name) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError('')
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    if (data.session) {
      router.push('/dashboard')
    } else {
      setNeedsConfirm(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="hero-grid" />
      <div className="hero-spotlight" />

      <div className="w-full max-w-md relative animate-slide-up">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-nav.png" alt="DR Checker" className="h-14 w-auto" />
        </Link>

        {needsConfirm ? (
          <div className="card-glow p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(34,197,94,0.13)', border: '1px solid rgba(34,197,94,0.35)' }}>
              <Mail className="w-7 h-7" style={{ color: '#22C55E' }} />
            </div>
            <h1 className="text-xl font-black text-white mb-2">Check Your Email</h1>
            <p className="text-muted text-sm leading-relaxed mb-6">We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your account, then log in.</p>
            <Link href="/login" className="btn-primary w-full py-3 text-sm">Go to Login</Link>
          </div>
        ) : (
          <div className="card-glow p-8">
            <h1 className="text-2xl font-black text-white text-center mb-1">Create Your <span className="gradient-text">Free Account</span></h1>
            <p className="text-muted text-sm text-center mb-7">100 domains per check · 10 checks per day · free forever</p>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
                  className="input-dark w-full pl-11 pr-4 py-3.5 text-sm" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-dark w-full pl-11 pr-4 py-3.5 text-sm" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type={showPw ? 'text' : 'password'} placeholder="Password (min 6 characters)" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                  className="input-dark w-full pl-11 pr-11 py-3.5 text-sm" />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
                  {error}
                </div>
              )}

              <button onClick={handleSignup} disabled={loading} className="btn-primary w-full py-3.5 text-sm gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Creating account...</>
                  : <>Create Free Account <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>

            <div className="mt-6 space-y-2.5">
              {['100 domains per bulk check', '10 checks every day', 'CSV export & sorting', 'Upgrade to Pro anytime — $5/mo'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-muted">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#22C55E' }} />
                  {f}
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-muted mt-7">
              Already have an account? <Link href="/login" className="font-bold" style={{ color: '#FFA94D' }}>Log in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
