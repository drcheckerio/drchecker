import { NextResponse } from 'next/server'

export const maxDuration = 30

// Diagnostic endpoint — open https://drchecker.io/api/dr-health in a browser.
// It reveals whether the Ahrefs key is configured and what Ahrefs actually returns,
// without leaking the key itself.
export async function GET() {
  const AHREFS_KEY = process.env.AHREFS_API_KEY
  const DR_API = process.env.DR_API_ENDPOINT

  const diag: any = {
    ahrefs_key_present: !!AHREFS_KEY,
    ahrefs_key_length: AHREFS_KEY ? AHREFS_KEY.length : 0,
    dr_api_endpoint_present: !!DR_API,
    mode: AHREFS_KEY ? 'direct-ahrefs' : DR_API ? 'worker-fallback' : 'none',
  }

  const target = 'google.com'

  try {
    if (AHREFS_KEY) {
      const res = await fetch(
        `https://api.ahrefs.com/v3/public/domain-rating-free?target=${target}`,
        { headers: { Accept: 'application/json', Authorization: `Bearer ${AHREFS_KEY}` }, signal: AbortSignal.timeout(12000) }
      )
      const text = await res.text()
      diag.ahrefs_status = res.status
      diag.ahrefs_ok = res.ok
      diag.ahrefs_body_preview = text.slice(0, 300)
      try {
        const j = JSON.parse(text)
        diag.parsed_dr = j?.domain_rating?.domain_rating ?? null
      } catch {
        diag.parsed_dr = null
        diag.note = 'Response was not JSON (likely an HTML error/challenge page)'
      }
    } else if (DR_API) {
      const res = await fetch(`${DR_API}/?target=${target}`, { signal: AbortSignal.timeout(12000) })
      const text = await res.text()
      diag.worker_status = res.status
      diag.worker_body_preview = text.slice(0, 300)
    }
  } catch (e: any) {
    diag.fetch_error = String(e?.message || e)
  }

  return NextResponse.json(diag, { headers: { 'Cache-Control': 'no-store' } })
}
