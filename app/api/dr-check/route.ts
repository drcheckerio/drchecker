import { NextRequest, NextResponse } from 'next/server'
import { cleanDomain } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { domains } = await req.json()
    if (!domains || !Array.isArray(domains)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const cleanedDomains = domains.slice(0, 1000).map(cleanDomain).filter(Boolean)

    // === AHREFS API INTEGRATION ===
    // When you provide the Ahrefs API key, replace this mock with:
    // const AHREFS_API_KEY = process.env.AHREFS_API_KEY
    // const results = await Promise.all(cleanedDomains.map(async (domain) => {
    //   const res = await fetch(`https://api.ahrefs.com/v3/site-explorer/domain-rating?target=${domain}&mode=domain`, {
    //     headers: { 'Authorization': `Bearer ${AHREFS_API_KEY}` }
    //   })
    //   const data = await res.json()
    //   return { domain, dr: data.domain_rating?.domain_rating ?? 0, ... }
    // }))

    // MOCK DATA for testing (returns realistic scores)
    const results = cleanedDomains.map((domain) => {
      const hash = domain.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      const dr = Math.min(99, Math.max(1, (hash % 85) + 5))
      return {
        domain,
        dr,
        rating: dr >= 70 ? 'Excellent' : dr >= 50 ? 'Good' : dr >= 30 ? 'Fair' : 'Poor',
        backlinks: Math.floor(dr * 1200 + Math.random() * 5000),
        referring_domains: Math.floor(dr * 45 + Math.random() * 200),
      }
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('DR Check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
