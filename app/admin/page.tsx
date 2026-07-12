'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Crown, Shield, LogOut, Search, Users, TrendingUp, LayoutDashboard, Check } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const loadUsers = useCallback(async (token: string) => {
    const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
    if (res.status === 403) { router.push('/dashboard'); return }
    const data = await res.json()
    setUsers(data.users || [])
  }, [router])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setSession(session)
      loadUsers(session.access_token).finally(() => setPageLoading(false))
    })
  }, [router, loadUsers])

  const setPlan = async (userId: string, plan: 'free' | 'pro') => {
    setUpdating(userId)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ userId, plan }),
    })
    if (res.ok) {
      setUsers(users.map(u => u.id === userId ? { ...u, plan } : u))
      setToast(`Plan updated to ${plan.toUpperCase()}`)
      setTimeout(() => setToast(''), 2500)
    }
    setUpdating(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filtered = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const proCount = users.filter(u => u.plan === 'pro').length

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,138,30,0.2)', borderTopColor: '#FF8A1E' }}></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Admin nav */}
      <nav className="sticky top-0 z-40" style={{ background: 'rgba(7,11,20,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-nav.png" alt="DR Checker" className="h-10 w-auto" />
            </Link>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black text-white" style={{ background: 'linear-gradient(135deg, #FF8A1E, #FF6A00)' }}>ADMIN</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-outline px-4 py-2 text-xs gap-1.5"><LayoutDashboard className="w-3.5 h-3.5" /> My Dashboard</Link>
            <button onClick={handleLogout} className="btn-outline px-4 py-2 text-xs gap-1.5"><LogOut className="w-3.5 h-3.5" /> Log out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-black text-white">Admin <span className="gradient-text">Panel</span></h1>
          <p className="text-muted text-sm mt-1">Manage users and grant Pro access</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Users className="w-5 h-5" />, label: 'Total Users', value: users.length, color: '#3B82F6' },
            { icon: <Crown className="w-5 h-5" />, label: 'Pro Users', value: proCount, color: '#FF8A1E' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Free Users', value: users.length - proCount, color: '#22C55E' },
          ].map((s, i) => (
            <div key={s.label} className="card p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}35` }}>{s.icon}</div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" placeholder="Search by email or name..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-dark w-full pl-11 pr-4 py-3.5 text-sm" />
        </div>

        {/* Users table */}
        <div className="card overflow-hidden" style={{ background: 'rgba(15,22,41,0.65)' }}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Checks Today</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'right' }}>Pro Access</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-white flex items-center gap-2">
                          {u.full_name || '—'}
                          {u.is_admin && <span className="px-1.5 py-0.5 rounded text-[9px] font-black" style={{ background: 'rgba(255,138,30,0.15)', color: '#FFA94D' }}>ADMIN</span>}
                        </div>
                        <div className="text-xs text-muted break-all">{u.email}</div>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                        style={u.plan === 'pro'
                          ? { background: 'rgba(255,138,30,0.15)', color: '#FFA94D', border: '1px solid rgba(255,138,30,0.35)' }
                          : { background: 'rgba(148,163,184,0.08)', color: '#CBD5E1', border: '1px solid rgba(148,163,184,0.2)' }}>
                        {u.plan === 'pro' ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {u.plan === 'pro' ? 'PRO' : 'FREE'}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{u.last_check_date === new Date().toISOString().slice(0, 10) ? (u.checks_today ?? 0) : 0}</td>
                    <td className="text-sm text-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex justify-end">
                        {u.plan === 'pro' ? (
                          <button onClick={() => setPlan(u.id, 'free')} disabled={updating === u.id}
                            className="btn-outline px-4 py-2 text-xs disabled:opacity-50">
                            {updating === u.id ? '...' : 'Revoke Pro'}
                          </button>
                        ) : (
                          <button onClick={() => setPlan(u.id, 'pro')} disabled={updating === u.id}
                            className="btn-primary px-4 py-2 text-xs gap-1.5 disabled:opacity-50">
                            {updating === u.id ? '...' : <><Crown className="w-3 h-3" /> Grant Pro</>}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-muted text-sm py-8">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white animate-slide-up"
          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', backdropFilter: 'blur(12px)' }}>
          <Check className="w-4 h-4" style={{ color: '#22C55E' }} /> {toast}
        </div>
      )}
    </div>
  )
}
