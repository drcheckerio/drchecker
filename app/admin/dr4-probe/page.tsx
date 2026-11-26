'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FlaskConical, ArrowLeft, Loader2 } from 'lucide-react'

export default function Dr4ProbePage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string>('')
  const [verdict, setVerdict] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setSession(session)
      setPageLoading(false)
    })
  }, [router])

  const run = async () => {
    if (!session) return
    setRunning(true); setResult(''); setVerdict(null)
    try {
      const res = await fetch('/api/admin/dr4-probe', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.status === 403) {
        setResult('Your account is not marked as an admin. Set is_admin = true on your row in the Supabase profiles table, then reload.')
        setRunning(false); return
      }
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))

      // Decide the answer for you rather than making you read raw JSON.
      const a = data?.top_default?.body || ''
      const b = data?.top_dr4?.body || ''
      if (data?.top_dr4?.status !== 200) {
        setVerdict({ ok: false, text: 'The bulk endpoint rejected version=dr4. DR4 is per-domain only.' })
      } else if (a && b && a === b) {
        setVerdict({ ok: false, text: 'The bulk endpoint ignored version=dr4 — identical results. DR4 is per-domain only.' })
      } else if (a && b) {
        setVerdict({ ok: true, text: 'The bulk endpoint returned DIFFERENT data for DR4. The top 1M can be pulled for both models in 8 requests.' })
      }
    } catch (e: any) {
      setResult(String(e?.message || e))
    }
    setRunning(false)
  }

  if (pageLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#FF8A1E' }} /></div>
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to admin
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,138,30,0.15)' }}>
          <FlaskConical className="w-5 h-5" style={{ color: '#FF8A1E' }} />
        </div>
        <h1 className="text-2xl font-black text-white">DR4 bulk endpoint probe</h1>
      </div>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        Tests whether Ahrefs&apos; bulk <code>domain-rating-top-domains</code> endpoint accepts an
        undocumented <code>version=dr4</code> parameter. If it does, the full top 1M can be pulled
        for both DR3 and DR4 in eight requests instead of two million.
      </p>

      <button onClick={run} disabled={running} className="btn-primary px-6 py-3 text-sm gap-2 disabled:opacity-60">
        {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Running…</> : <>Run probe</>}
      </button>

      {verdict && (
        <div className="mt-6 rounded-xl p-4" style={{
          background: verdict.ok ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)',
          border: `1px solid ${verdict.ok ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
        }}>
          <p className="font-bold text-white mb-1">{verdict.ok ? 'DR4 is supported in bulk' : 'DR4 is not supported in bulk'}</p>
          <p className="text-sm text-muted">{verdict.text}</p>
        </div>
      )}

      {result && (
        <>
          <p className="text-xs text-muted mt-6 mb-2">Full output — copy this and paste it back to Claude:</p>
          <pre className="rounded-xl p-4 text-[11px] overflow-auto max-h-[420px]"
            style={{ background: 'rgba(7,11,20,0.8)', border: '1px solid rgba(148,163,184,0.12)', color: '#C9D2E3' }}>{result}</pre>
        </>
      )}
    </div>
  )
}
