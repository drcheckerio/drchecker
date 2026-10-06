import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isDisposableEmail } from '@/lib/disposable-domains'

export const maxDuration = 20

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://drchecker.io'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON) {
      return NextResponse.json({ error: 'Authentication is not configured. Please try again later.' }, { status: 500 })
    }

    const { name, email, password } = await req.json()
    const cleanEmail = (email || '').trim().toLowerCase()

    // ---- Validation ----
    if (!name || !cleanEmail || !password) {
      return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 })
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }
    // ---- Block disposable / temporary emails ----
    if (isDisposableEmail(cleanEmail)) {
      return NextResponse.json({
        error: 'Temporary or disposable email addresses are not allowed. Please use a permanent email.',
      }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Sign up — this sends the confirmation email. The account cannot log in
    // until the user clicks the link in that email (email confirmation enforced in Supabase).
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${SITE_URL}/dashboard`,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // If a session came back, email confirmation is OFF in Supabase (instant login).
    // Otherwise a confirmation email was sent and the user must verify first.
    return NextResponse.json({
      ok: true,
      needsConfirm: !data.session,
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Could not reach the authentication service. Please try again.' }, { status: 502 })
  }
}
