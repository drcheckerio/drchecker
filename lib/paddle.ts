// Server-side Paddle API helper. Used to verify subscriptions directly with
// Paddle so a user's plan is correct even if a webhook is missed or delayed.

const PADDLE_API_KEY = process.env.PADDLE_API_KEY
const PADDLE_ENV = (process.env.PADDLE_ENV || process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox').toLowerCase()

export const PADDLE_API_BASE =
  PADDLE_ENV === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com'

export const paddleConfigured = () => !!PADDLE_API_KEY

async function paddleGet(path: string) {
  if (!PADDLE_API_KEY) throw new Error('PADDLE_API_KEY not configured')
  const res = await fetch(`${PADDLE_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = body?.error?.detail || body?.error?.code || `Paddle API ${res.status}`
    throw new Error(msg)
  }
  return body
}

/** Find Paddle customer IDs for an email address. */
export async function findCustomerIds(email: string): Promise<string[]> {
  const body = await paddleGet(`/customers?email=${encodeURIComponent(email)}&per_page=50`)
  return (body?.data || []).map((c: any) => c.id).filter(Boolean)
}

/** Look up a single customer's email by ID (used by the webhook). */
export async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const body = await paddleGet(`/customers/${encodeURIComponent(customerId)}`)
    return body?.data?.email || null
  } catch {
    return null
  }
}

/** Statuses that should grant Pro access. */
const ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due'])

/**
 * Returns true if the email has any subscription with Paddle that should
 * grant Pro access right now.
 */
export async function hasActiveSubscription(email: string): Promise<boolean> {
  const customerIds = await findCustomerIds(email)
  if (!customerIds.length) return false

  const body = await paddleGet(
    `/subscriptions?customer_id=${customerIds.map(encodeURIComponent).join(',')}&per_page=100`
  )
  const subs = body?.data || []
  return subs.some((s: any) => ACTIVE_STATUSES.has(String(s?.status || '').toLowerCase()))
}
