import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getCustomerEmail, paddleConfigured } from '@/lib/paddle'

export const maxDuration = 25

const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET

/**
 * Verify a Paddle Billing signature.
 * Header format: "ts=<unix>;h1=<hex>" — h1 can appear more than once during
 * secret rotation, so every h1 is checked.
 */
function verify(rawBody: string, sigHeader: string | null): boolean {
  if (!WEBHOOK_SECRET || !sigHeader) return false
  try {
    let ts = ''
    const hashes: string[] = []
    for (const part of sigHeader.split(';')) {
      const idx = part.indexOf('=')
      if (idx === -1) continue
      const key = part.slice(0, idx).trim()
      const value = part.slice(idx + 1).trim()
      if (key === 'ts') ts = value
      else if (key === 'h1') hashes.push(value)
    }
    if (!ts || !hashes.length) return false

    const digest = crypto.createHmac('sha256', WEBHOOK_SECRET).update(`${ts}:${rawBody}`).digest('hex')
    const digestBuf = Buffer.from(digest, 'utf8')

    return hashes.some((h) => {
      const hBuf = Buffer.from(h, 'utf8')
      if (hBuf.length !== digestBuf.length) return false
      return crypto.timingSafeEqual(digestBuf, hBuf)
    })
  } catch {
    return false
  }
}

/** Pull a user id out of wherever Paddle may have put our custom data. */
function extractUserId(data: any): string | undefined {
  return (
    data?.custom_data?.user_id ||
    data?.subscription?.custom_data?.user_id ||
    data?.transaction?.custom_data?.user_id ||
    undefined
  )
}

/** Pull an email out of the various payload shapes Paddle sends. */
function extractEmail(data: any): string | undefined {
  return (
    data?.customer?.email ||
    data?.billing_details?.email ||
    data?.custom_data?.email ||
    undefined
  )
}

async function setPlan(
  identifiers: { userId?: string; email?: string },
  plan: 'free' | 'pro'
): Promise<string> {
  const admin = createServerSupabaseClient()
  if (identifiers.userId) {
    const { error } = await admin.from('profiles').update({ plan }).eq('id', identifiers.userId)
    if (!error) return `matched by user_id ${identifiers.userId}`
  }
  if (identifiers.email) {
    const { error } = await admin
      .from('profiles')
      .update({ plan })
      .ilike('email', identifiers.email)
    if (!error) return `matched by email ${identifiers.email}`
  }
  return 'no matching profile'
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const sig = req.headers.get('paddle-signature')

  if (!WEBHOOK_SECRET) {
    console.error('[paddle-webhook] PADDLE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }
  if (!verify(raw, sig)) {
    console.error('[paddle-webhook] signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: any
  try { event = JSON.parse(raw) } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }

  const type: string = event?.event_type || ''
  const data = event?.data || {}

  let userId = extractUserId(data)
  let email = extractEmail(data)

  // If Paddle gave us neither, resolve the email from the customer id via the API.
  if (!userId && !email && data?.customer_id && paddleConfigured()) {
    email = (await getCustomerEmail(data.customer_id)) || undefined
  }

  let outcome = 'ignored'
  try {
    if (['subscription.created', 'subscription.activated', 'subscription.resumed', 'transaction.completed'].includes(type)) {
      outcome = await setPlan({ userId, email }, 'pro')
    } else if (['subscription.canceled', 'subscription.paused'].includes(type)) {
      outcome = await setPlan({ userId, email }, 'free')
    }
  } catch (e) {
    console.error('[paddle-webhook] handler error:', e)
    outcome = 'error'
  }

  // Always 200 so Paddle doesn't retry-storm; the log line tells us what happened.
  console.log(`[paddle-webhook] ${type} · user_id=${userId || '-'} email=${email || '-'} → ${outcome}`)
  return NextResponse.json({ received: true, event: type, outcome })
}
