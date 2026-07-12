import { NextRequest, NextResponse } from 'next/server'
import { cleanDomain } from '@/lib/utils'
import { createServerSupabaseClient } from '@/lib/supabase'

const DR_API = process.env.DR_API_ENDPOINT

const LIMITS = {
  guest: { perCheck: 20, perDay: null as number | null },
  free: { perCheck: 100, perDay: 10 },
  pro: { perCheck: 1000, perDay: null as number | null },
}

async function fetchDR(domain: string) {
  try {
    const res = await fetch(`${DR_API}/?target=${encodeURIComponent(domain)}`, {
      next: { revalidate: 21600 },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data = await res.json()
    const dr = Math.round(data?.domain_rating?.domain_rating ?? 0)
    return {
      domain,
      dr,
      rating: dr >= 70 ? 'Excellent' : dr >= 50 ? 'Good' : dr >= 30 ? 'Fair' : 'Poor',
    }
  } catch {
    return { domain, dr: 0, rating: 'Poor', error: 'Could not fetch DR for this domain' }
  }
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

    const cleaned = Array.from(new Set(domains.slice(0, limits.perCheck).map(cleanDomain).filter(Boolean)))

    const results: any[] = []
    for (let i = 0; i < cleaned.length; i += 10) {
      const batch = cleaned.slice(i, i + 10)
      const batchResults = await Promise.all(batch.map(fetchDR))
      results.push(...batchResults)
    }

    return NextResponse.json({ results, tier, capApplied: limits.perCheck })
  } catch (error) {
    console.error('DR Check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
