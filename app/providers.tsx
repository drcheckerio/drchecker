'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Handle email-confirmation links: Supabase redirects with #access_token in the URL.
    // The supabase client auto-detects it and creates the session — we then route to the dashboard.
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (hash.includes('access_token') && hash.includes('type=signup')) {
      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          window.history.replaceState(null, '', window.location.pathname)
          router.push('/dashboard')
        }
      })
      return () => sub.subscription.unsubscribe()
    }
  }, [router])

  return <>{children}</>
}
