import { NextResponse } from 'next/server'

export const maxDuration = 20

// Open https://drchecker.io/api/supabase-health in a browser.
// Confirms whether the Supabase env vars are set and the project is reachable
// (a paused free project is the most common cause of signup "NetworkError").
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  const site = process.env.NEXT_PUBLIC_SITE_URL

  const diag: any = {
    supabase_url_present: !!url,
    anon_key_present: !!anon,
    service_key_present: !!service,
    site_url: site || '(not set)',
  }

  if (url && anon) {
    try {
      const res = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: anon },
        signal: AbortSignal.timeout(10000),
      })
      diag.supabase_reachable = true
      diag.auth_health_status = res.status
      diag.auth_health_body = (await res.text()).slice(0, 200)
    } catch (e: any) {
      diag.supabase_reachable = false
      diag.error = String(e?.message || e)
      diag.likely_cause = 'Supabase project is paused or unreachable — open your Supabase dashboard to resume it.'
    }
  } else {
    diag.likely_cause = 'Supabase environment variables are missing in Vercel.'
  }

  return NextResponse.json(diag, { headers: { 'Cache-Control': 'no-store' } })
}
