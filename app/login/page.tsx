'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true); setError('')
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    if (data.session) {
      const { data: prof } = await supabase.from('profiles').select('is_admin').eq('id', data.session.user.id).single()
      router.push(prof?.is_admin ? '/admin' : '/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="hero-grid" />
      <div className="hero-spotlight" />

      <div className="w-full max-w-md relative animate-slide-up">
        <Link href="/" className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-nav.png" alt="DR Checker" className="h-14 w-auto" />
        </Link>

        <div className="card-glow p-8">
          <h1 className="text-2xl font-black text-white text-center mb-1">Welcome <span className="gradient-text">Back</span></h1>
          <p className="text-muted text-sm text-center mb-7">Log in to access your dashboard</p>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-dark w-full pl-11 pr-4 py-3.5 text-sm" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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

            <button onClick={handleLogin} disabled={loading} className="btn-primary w-full py-3.5 text-sm gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Logging in...</>
                : <>Log In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>

          <p className="text-center text-sm text-muted mt-7">
            New here? <Link href="/signup" className="font-bold" style={{ color: '#FFA94D' }}>Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
