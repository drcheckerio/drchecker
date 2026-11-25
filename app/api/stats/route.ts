import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 10

/**
 * Public, aggregate-only stats for the live counter.
 * Cached briefly at the edge so a busy page doesn't hammer Supabase.
 */
export async function GET() {
  try {
    const admin = createServerSupabaseClient()
    const { data, error } = await admin.rpc('public_stats').single()
    if (error) throw error

    const s = data as any
    return NextResponse.json(
      {
        todayDomains: Number(s?.today_domains ?? 0),
        totalDomains: Number(s?.total_domains ?? 0),
        todayVisitors: Number(s?.today_visitors ?? 0),
        totalVisitors: Number(s?.total_visitors ?? 0),
        totalChecks: Number(s?.total_checks ?? 0),
      },
      { headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60' } }
    )
  } catch {
    // Never break the page over a counter.
    return NextResponse.json({ unavailable: true }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
