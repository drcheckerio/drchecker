import { NextRequest, NextResponse } from 'next/server'
import { cleanDomain } from '@/lib/utils'

// The DR API endpoint is stored server-side ONLY via environment variable.
// It is never exposed to the browser or client source code.
const DR_API = process.env.DR_API_ENDPOINT

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
    if (!DR_API) {
      return NextResponse.json({ error: 'DR API not configured' }, { status: 500 })
    }

    const { domains } = await req.json()
    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const cleaned = Array.from(new Set(domains.slice(0, 1000).map(cleanDomain).filter(Boolean)))

    const results: any[] = []
    for (let i = 0; i < cleaned.length; i += 10) {
      const batch = cleaned.slice(i, i + 10)
      const batchResults = await Promise.all(batch.map(fetchDR))
      results.push(...batchResults)
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('DR Check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
