import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 10

/**
 * Counts one unique visitor per day.
 *
 * Privacy: the IP address is never stored. It is combined with the user agent,
 * the date and a server-side salt, hashed, and only the hash is written. The
 * hash changes every day, so it cannot be used to follow anyone over time.
 */
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    const ua = req.headers.get('user-agent') || ''
    const salt = process.env.VISITOR_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || 'drchecker'
    const day = new Date().toISOString().slice(0, 10)

    const hash = crypto.createHash('sha256').update(`${day}:${ip}:${ua}:${salt}`).digest('hex')

    const admin = createServerSupabaseClient()
    await admin.rpc('bump_visitor', { p_hash: hash })

    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ ok: false }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
