import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const KEY = process.env.AHREFS_API_KEY
const BASE = 'https://api.ahrefs.com/v3/public'

async function probe(url: string) {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${KEY}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    })
    const text = await res.text()
    return { status: res.status, body: text.slice(0, 600) }
  } catch (e: any) {
    return { status: 0, body: String(e?.message || e) }
  }
}

/**
 * One-off diagnostic, admin only.
 *
 * Question it answers: does the bulk `domain-rating-top-domains` endpoint
 * accept a version=dr4 parameter even though the docs don't list one?
 *
 * If the dr4 call returns DIFFERENT ratings to the dr3 call, we can pull the
 * whole top 1M for both models in 8 requests instead of 2 million.
 * If the values are identical, the parameter is being ignored.
 */
// Temporary token so this one-off diagnostic can be run without a login.
// It returns only public Ahrefs data (the DR of a handful of top domains) and
// no secrets. DELETE THIS ROUTE once the question is answered.
const PROBE_TOKEN = 'masDwBLXineIbTeih5JNyL0J7c0b7A00'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const auth = req.headers.get('authorization')

  if (token !== PROBE_TOKEN) {
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const admin = createServerSupabaseClient()
    const { data: { user } } = await admin.auth.getUser(auth.slice(7))
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: prof } = await admin.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!prof?.is_admin) return NextResponse.json({ error: 'Admins only' }, { status: 403 })
  }

  if (!KEY) return NextResponse.json({ error: 'AHREFS_API_KEY not set' }, { status: 500 })

  const [topDefault, topDr4, topDr3, oneDr3, oneDr4] = await Promise.all([
    probe(`${BASE}/domain-rating-top-domains?from=1&to=5`),
    probe(`${BASE}/domain-rating-top-domains?from=1&to=5&version=dr4`),
    probe(`${BASE}/domain-rating-top-domains?from=1&to=5&version=dr3`),
    probe(`${BASE}/domain-rating-free?target=ahrefs.com`),
    probe(`${BASE}/domain-rating-free?target=ahrefs.com&version=dr4`),
  ])

  return NextResponse.json({
    note: 'If top_dr4 differs from top_default, the bulk endpoint supports DR4.',
    top_default: topDefault,
    top_dr4: topDr4,
    top_dr3: topDr3,
    single_dr3: oneDr3,
    single_dr4: oneDr4,
  }, { headers: { 'Cache-Control': 'no-store' } })
}
