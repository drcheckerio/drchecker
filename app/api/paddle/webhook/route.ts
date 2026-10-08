import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabase'

export const maxDuration = 20

const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET

// Verify Paddle Billing webhook signature (format: "ts=...;h1=...").
function verify(rawBody: string, sigHeader: string | null): boolean {
  if (!WEBHOOK_SECRET || !sigHeader) return false
  try {
    const parts = Object.fromEntries(sigHeader.split(';').map((kv) => kv.split('=')))
    const ts = parts['ts']
    const h1 = parts['h1']
    if (!ts || !h1) return false
    const signed = `${ts}:${rawBody}`
    const digest = crypto.createHmac('sha256', WEBHOOK_SECRET).update(signed).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(h1))
  } catch {
    return false
  }
}

async function setPlan(userId: string | undefined, email: string | undefined, plan: 'free' | 'pro') {
  const admin = createServerSupabaseClient()
  if (userId) {
    await admin.from('profiles').update({ plan }).eq('id', userId)
  } else if (email) {
    await admin.from('profiles').update({ plan }).eq('email', email)
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const sig = req.headers.get('paddle-signature')

  if (!verify(raw, sig)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: any
  try { event = JSON.parse(raw) } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }) }

  const type = event?.event_type as string
  const data = event?.data || {}
  const userId = data?.custom_data?.user_id
  const email = data?.customer?.email || data?.billing_details?.email

  try {
    switch (type) {
      case 'subscription.created':
      case 'subscription.activated':
      case 'transaction.completed':
        await setPlan(userId, email, 'pro')
        break
      case 'subscription.canceled':
      case 'subscription.paused':
        await setPlan(userId, email, 'free')
        break
      default:
        // ignore other events
        break
    }
  } catch (e) {
    // Never fail the webhook hard — Paddle retries; log and 200 to avoid duplicate storms
    console.error('Paddle webhook handler error:', e)
  }

  return NextResponse.json({ received: true })
}
