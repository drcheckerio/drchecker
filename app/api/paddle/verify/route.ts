import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { hasActiveSubscription, paddleConfigured } from '@/lib/paddle'

export const maxDuration = 20

/**
 * Authoritative plan check: asks Paddle directly whether the logged-in user
 * has an active subscription, then syncs profiles.plan to match.
 *
 * This is what makes upgrades reliable — it works even if a webhook was
 * missed, delayed, or rejected, and it also downgrades users whose
 * subscription has lapsed.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createServerSupabaseClient()
  const { data: { user } } = await admin.auth.getUser(auth.slice(7))
  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Without an API key we can't verify — report the current stored plan.
  if (!paddleConfigured()) {
    const { data: prof } = await admin.from('profiles').select('plan').eq('id', user.id).single()
    return NextResponse.json({ plan: prof?.plan === 'pro' ? 'pro' : 'free', verified: false, reason: 'PADDLE_API_KEY not configured' })
  }

  try {
    const active = await hasActiveSubscription(user.email)
    const plan = active ? 'pro' : 'free'

    const { data: prof } = await admin.from('profiles').select('plan, is_admin').eq('id', user.id).single()
    const current = prof?.plan === 'pro' ? 'pro' : 'free'

    // Never downgrade an admin-granted Pro account that has no Paddle subscription
    // (you grant Pro manually from the admin panel for comped users).
    const shouldWrite = active && current !== 'pro'

    if (shouldWrite) {
      await admin.from('profiles').update({ plan }).eq('id', user.id)
    }

    return NextResponse.json({
      plan: active ? 'pro' : current,
      verified: true,
      changed: shouldWrite,
    })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e), verified: false }, { status: 502 })
  }
}
