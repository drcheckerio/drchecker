import { NextRequest, NextResponse } from 'next/server'
import { cleanDomain } from '@/lib/utils'
import { createServerSupabaseClient } from '@/lib/supabase'

// Allow long-running bulk checks (Vercel max for this plan)
export const maxDuration = 60

const DR_API = process.env.DR_API_ENDPOINT

const LIMITS = {
  guest: { perCheck: 20, perDay: null as number | null },
  free: { perCheck: 100, perDay: 10 },
  pro: { perCheck: 1000, perDay: null as number | null },
}

const BATCH_SIZE = 25
const BATCH_DELAY_MS = 120
const MAX_ATTEMPTS = 3

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function toResult(domain: string, dr: number) {
  return {
    domain,
    dr,
    rating: dr >= 70 ? 'Excellent' : dr >= 50 ? 'Good' : dr >= 30 ? 'Fair' : 'Poor',
  }
}

// Fetch DR with automatic retries + backoff to survive upstream rate limiting
async function fetchDR(domain: string): Promise<{ domain: string; dr: number; rating: string; error?: string }> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${DR_API}/?target=${encodeURIComponent(domain)}`, {
        next: { revalidate: 21600 },
        signal: AbortSignal.timeout(8000),
      })
      if (res.status === 429 || res.status >= 500) throw new Error(`upstream ${res.status}`)
      if (!res.ok) throw new Error(`API ${res.status}`)
      const data = await res.json()
      const raw = data?.domain_rating?.domain_rating
      if (raw === undefined || raw === null) throw new Error('empty payload')
      return toResult(domain, Math.round(raw))
    } catch {
      if (attempt < MAX_ATTEMPTS) {
        // Backoff grows per attempt: 400ms, 900ms
        await sleep(400 * attempt + 100)
      }
    }
  }
  return { ...toResult(domain, 0), error: 'Could not fetch DR for this domain' }
}

export async function POST(req: NextRequest) {
  try {
    if (!DR_API) return NextResponse.json({ error: 'DR API not configured' }, { status: 500 })

    const { domains } = await req.json()
    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // ===== Identify user & plan =====
    let tier: 'guest' | 'free' | 'pro' = 'guest'
    let profile: any = null
    const admin = createServerSupabaseClient()

    const auth = req.headers.get('authorization')
    if (auth?.startsWith('Bearer ')) {
      const token = auth.slice(7)
      const { data: { user } } = await admin.auth.getUser(token)
      if (user) {
        const { data: prof } = await admin.from('profiles').select('*').eq('id', user.id).single()
        if (prof) {
          profile = prof
          tier = prof.plan === 'pro' ? 'pro' : 'free'
        }
      }
    }

    const limits = LIMITS[tier]

    // ===== Daily check limit for free users =====
    if (profile && limits.perDay !== null) {
      const today = new Date().toISOString().slice(0, 10)
      let checksToday = profile.checks_today ?? 0
      if (profile.last_check_date !== today) checksToday = 0
      if (checksToday >= limits.perDay) {
        return NextResponse.json({
          error: `Daily limit reached (${limits.perDay} checks/day on Free). Upgrade to Pro for unlimited checks.`,
          limitReached: true,
        }, { status: 429 })
      }
      await admin.from('profiles').update({
        checks_today: checksToday + 1,
        last_check_date: today,
      }).eq('id', profile.id)
    }

    const cleaned = Array.from(new Set(domains.slice(0, limits.perCheck).map(cleanDomain).filter(Boolean))) as string[]

    // ===== Batched fetching with order preserved =====
    const results: any[] = new Array(cleaned.length)
    const failedIdx: number[] = []

    for (let i = 0; i < cleaned.length; i += BATCH_SIZE) {
      const batch = cleaned.slice(i, i + BATCH_SIZE)
      const batchResults = await Promise.all(batch.map(fetchDR))
      batchResults.forEach((r, j) => {
        results[i + j] = r
        if (r.error) failedIdx.push(i + j)
      })
      if (i + BATCH_SIZE < cleaned.length) await sleep(BATCH_DELAY_MS)
    }

    // ===== Final salvage pass: retry failures gently in small batches =====
    if (failedIdx.length > 0 && failedIdx.length <= 200) {
      for (let i = 0; i < failedIdx.length; i += 10) {
        const slice = failedIdx.slice(i, i + 10)
        const retried = await Promise.all(slice.map((idx) => fetchDR(cleaned[idx])))
        retried.forEach((r, j) => { if (!r.error) results[slice[j]] = r })
        await sleep(200)
      }
    }

    return NextResponse.json({ results, tier, capApplied: limits.perCheck })
  } catch (error) {
    console.error('DR Check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
