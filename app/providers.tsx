'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Supabase returns from Google OAuth or an email-confirmation link with
    // #access_token=... in the URL hash (sometimes on the homepage if it fell
    // back to the Site URL). The supabase client auto-detects the token and
    // creates the session; we then forward the user to their dashboard.
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (hash.includes('access_token')) {
      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          window.history.replaceState(null, '', window.location.pathname)
          router.push('/dashboard')
        }
      })
      // Also check immediately in case the session is already parsed
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          window.history.replaceState(null, '', window.location.pathname)
          router.push('/dashboard')
        }
      })
      return () => sub.subscription.unsubscribe()
    }
  }, [router])

  return <>{children}</>
}
