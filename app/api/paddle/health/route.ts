import { NextResponse } from 'next/server'
import { PADDLE_API_BASE, paddleConfigured } from '@/lib/paddle'

export const maxDuration = 20

/**
 * Open https://drchecker.io/api/paddle/health in a browser.
 * Shows which Paddle settings are configured (never the values) and whether
 * the API key actually works.
 */
export async function GET() {
  const diag: any = {
    environment: (process.env.PADDLE_ENV || process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox'),
    api_base: PADDLE_API_BASE,
    api_key_present: paddleConfigured(),
    webhook_secret_present: !!process.env.PADDLE_WEBHOOK_SECRET,
    client_token_present: !!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    price_id_present: !!process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO,
  }

  if (paddleConfigured()) {
    try {
      const res = await fetch(`${PADDLE_API_BASE}/event-types`, {
        headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}` },
        signal: AbortSignal.timeout(10000),
        cache: 'no-store',
      })
      diag.api_key_works = res.ok
      diag.api_status = res.status
      if (!res.ok) diag.api_hint = 'Key rejected — check it matches this environment (sandbox vs production).'
    } catch (e: any) {
      diag.api_key_works = false
      diag.api_error = String(e?.message || e)
    }
  } else {
    diag.next_step = 'Add PADDLE_API_KEY in Vercel to enable automatic subscription verification.'
  }

  if (!diag.webhook_secret_present) {
    diag.webhook_hint = 'PADDLE_WEBHOOK_SECRET is missing — webhook upgrades will be rejected with 401.'
  }

  return NextResponse.json(diag, { headers: { 'Cache-Control': 'no-store' } })
}
