import { NextRequest, NextResponse } from 'next/server'
import { cleanDomain } from '@/lib/utils'
import { createServerSupabaseClient } from '@/lib/supabase'

// Allow long-running bulk checks (Vercel max for this plan)
export const maxDuration = 60

const DR_API = process.env.DR_API_ENDPOINT
// Official Ahrefs free Domain Rating API key. When set, we call Ahrefs directly
// (no Cloudflare Worker needed). Falls back to DR_API_ENDPOINT if the key is absent.
const AHREFS_KEY = process.env.AHREFS_API_KEY

// Ahrefs serves two Domain Rating models. dr3 is the long-standing score and
// stays the default; dr4 is the newer model, requested with &version=dr4.
export type DRVersion = 'dr3' | 'dr4'

function drRequest(domain: string, version: DRVersion = 'dr3'): { url: string; init: RequestInit } {
  const target = encodeURIComponent(domain)
  if (AHREFS_KEY) {
    // Omit the param for dr3 so behaviour is byte-identical to before.
    const versionParam = version === 'dr4' ? '&version=dr4' : ''
    return {
      url: `https://api.ahrefs.com/v3/public/domain-rating-free?target=${target}${versionParam}`,
      init: {
        headers: { Accept: 'application/json', Authorization: `Bearer ${AHREFS_KEY}` },
        next: { revalidate: 21600 },
        signal: AbortSignal.timeout(8000),
      },
    }
  }
  // Legacy Worker fallback: it only knows dr3.
  return {
    url: `${DR_API}/?target=${target}`,
    init: { next: { revalidate: 21600 }, signal: AbortSignal.timeout(8000) },
  }
}

// dr4 can only be served by the official API, not the legacy Worker.
const DR4_AVAILABLE = !!AHREFS_KEY

const LIMITS = {
  guest: { perCheck: 20, perDay: 10 as number | null },
  free: { perCheck: 50, perDay: 10 as number | null },
  pro: { perCheck: 1000, perDay: null as number | null },
}

// ===== Priority lanes =====
// Pro traffic must never queue behind free traffic. Same API key, but Pro runs
// at full concurrency with almost no gap between batches, while free and guest
// traffic runs narrower and slower so it consumes less of the shared Ahrefs
// rate budget. Free checks are small (<=50 domains), so the slowdown is a
// second or two; Pro checks are large, so they get the headroom.
const LANES = {
  guest: { batch: 8, delay: 450 },
  free: { batch: 10, delay: 350 },
  pro: { batch: 25, delay: 50 },
} as const

const MAX_ATTEMPTS = 3

// Counts upstream 429s for one request so we can see whether we are actually
// hitting Ahrefs' rate ceiling rather than guessing.
type RateStats = { rateLimited: number; failed: number }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function toResult(domain: string, dr: number) {
  return {
    domain,
    dr,
    rating: dr >= 70 ? 'Excellent' : dr >= 50 ? 'Good' : dr >= 30 ? 'Fair' : 'Poor',
  }
}

// Fetch DR with automatic retries + backoff to survive upstream rate limiting.
// Domains Ahrefs has no data for (brand-new/unindexed) are a VALID result: DR 0 — not an error.
async function fetchDR(domain: string, version: DRVersion = 'dr3', stats?: RateStats): Promise<{ domain: string; dr: number; rating: string; error?: string }> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { url, init } = drRequest(domain, version)
      const res = await fetch(url, init)

      // Transient upstream problems → retry
      if (res.status === 429) { if (stats) stats.rateLimited++; throw new Error('upstream 429') }
      if (res.status >= 500) throw new Error(`upstream ${res.status}`)

      // 4xx (except 429) = the API understood us but has nothing for this domain → DR 0
      if (!res.ok) return toResult(domain, 0)

      let data: any = null
      try { data = await res.json() } catch { return toResult(domain, 0) }

      const raw = data?.domain_rating?.domain_rating
      // Response OK but no DR data → Ahrefs doesn't know this domain → DR 0
      if (raw === undefined || raw === null) return toResult(domain, 0)

      return toResult(domain, Math.round(Number(raw) || 0))
    } catch {
      if (attempt < MAX_ATTEMPTS) {
        // Backoff grows per attempt: 500ms, 1100ms
        await sleep(400 * attempt + 100)
      }
    }
  }
  if (stats) stats.failed++
  return { ...toResult(domain, 0), error: 'Could not fetch DR for this domain' }
}

// Pro compare mode: pull both models for one domain in parallel.
// DR3 stays the primary `dr` so ratings, colours, sorting and CSV keep working
// unchanged; DR4 rides along as an extra field.
async function fetchBothVersions(domain: string, stats?: RateStats) {
  const [three, four] = await Promise.all([fetchDR(domain, 'dr3', stats), fetchDR(domain, 'dr4', stats)])
  return { ...three, dr4: four.dr }
}

export async function POST(req: NextRequest) {
  try {
    if (!AHREFS_KEY && !DR_API) return NextResponse.json({ error: 'DR API not configured' }, { status: 500 })

    const { domains, dr4: dr4Requested } = await req.json()
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
        const upgradeMsg = tier === 'free'
          ? `Daily limit reached (${limits.perDay} checks/day on Free). Upgrade to Pro ($19/mo) for 1,000 domains per check with unlimited checks.`
          : `Daily limit reached (${limits.perDay} checks/day). Upgrade to Pro for unlimited checks.`
        return NextResponse.json({ error: upgradeMsg, limitReached: true }, { status: 429 })
      }
      await admin.from('profiles').update({
        checks_today: checksToday + 1,
        last_check_date: today,
      }).eq('id', profile.id)
    }

    const cleaned = Array.from(new Set(domains.slice(0, limits.perCheck).map(cleanDomain).filter(Boolean))) as string[]

    // ===== DR4 comparison — Pro only =====
    // Each domain costs two upstream calls in this mode, so halve the batch size
    // to keep outbound concurrency (and Ahrefs rate limiting) where it was.
    const withDr4 = dr4Requested === true && tier === 'pro' && DR4_AVAILABLE
    const stats: RateStats = { rateLimited: 0, failed: 0 }
    const fetchOne = withDr4
      ? (d: string) => fetchBothVersions(d, stats)
      : (d: string) => fetchDR(d, 'dr3', stats)

    // Lane decides how hard this request is allowed to push Ahrefs.
    const lane = LANES[tier as keyof typeof LANES] ?? LANES.guest
    const batchSize = withDr4 ? Math.ceil(lane.batch / 2) : lane.batch
    const batchDelay = lane.delay

    // ===== Batched fetching with order preserved =====
    const results: any[] = new Array(cleaned.length)
    const failedIdx: number[] = []

    for (let i = 0; i < cleaned.length; i += batchSize) {
      const batch = cleaned.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map((d) => fetchOne(d)))
      batchResults.forEach((r, j) => {
        results[i + j] = r
        if (r.error) failedIdx.push(i + j)
      })
      if (i + batchSize < cleaned.length) await sleep(batchDelay)
    }

    // ===== Final salvage pass: retry failures gently in small batches =====
    if (failedIdx.length > 0 && failedIdx.length <= 200) {
      for (let i = 0; i < failedIdx.length; i += 10) {
        const slice = failedIdx.slice(i, i + 10)
        const retried = await Promise.all(slice.map((idx) => fetchOne(cleaned[idx])))
        retried.forEach((r, j) => { if (!r.error) results[slice[j]] = r })
        await sleep(200)
      }
    }

    // Public counter: record the work actually done. Fire-and-forget — a stats
    // failure must never affect the user's results.
    try {
      const admin = createServerSupabaseClient()
      void admin.rpc('bump_stats', { p_domains: cleaned.length, p_checks: 1 })
    } catch { /* counters are best-effort */ }

    // Visible in Vercel logs — tells us whether the rate ceiling is the problem.
    if (stats.rateLimited > 0 || stats.failed > 0) {
      console.log(`[dr-check] tier=${tier} domains=${cleaned.length} dr4=${withDr4} 429s=${stats.rateLimited} failed=${stats.failed}`)
    }

    return NextResponse.json({
      results,
      tier,
      rateLimited: stats.rateLimited,
      capApplied: limits.perCheck,
      dr4: withDr4,
      // Tells the client why DR4 was ignored, if it asked for it.
      dr4Unavailable: dr4Requested === true && !withDr4
        ? (tier !== 'pro' ? 'Pro plan required' : 'DR4 is not available right now')
        : undefined,
    })
  } catch (error) {
    console.error('DR Check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
