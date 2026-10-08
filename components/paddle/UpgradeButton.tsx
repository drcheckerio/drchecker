'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { supabase } from '@/lib/supabase'

const CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
const PRICE_PRO = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO
const PADDLE_ENV = (process.env.NEXT_PUBLIC_PADDLE_ENV as 'sandbox' | 'production') || 'sandbox'

export default function UpgradeButton({
  className = 'btn-primary px-5 py-2.5 text-sm',
  label = 'Upgrade to Pro',
}: { className?: string; label?: string }) {
  const router = useRouter()
  const [paddle, setPaddle] = useState<Paddle>()
  const [loading, setLoading] = useState(false)

  const configured = !!CLIENT_TOKEN && !!PRICE_PRO

  useEffect(() => {
    if (!configured) return
    initializePaddle({ environment: PADDLE_ENV, token: CLIENT_TOKEN! })
      .then((p) => p && setPaddle(p))
      .catch(() => {})
  }, [configured])

  const handleClick = async () => {
    // Payments not wired yet → send to signup funnel
    if (!configured || !paddle) {
      router.push('/signup?plan=pro')
      return
    }
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login?next=upgrade')
      return
    }

    paddle.Checkout.open({
      items: [{ priceId: PRICE_PRO!, quantity: 1 }],
      customer: { email: session.user.email! },
      customData: { user_id: session.user.id },
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        successUrl: `${window.location.origin}/dashboard?upgraded=1`,
      },
    })
    setLoading(false)
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? 'Opening checkout…' : label}
    </button>
  )
}
