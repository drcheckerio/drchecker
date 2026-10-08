import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

async function requireAdmin(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const admin = createServerSupabaseClient()
  const { data: { user } } = await admin.auth.getUser(auth.slice(7))
  if (!user) return null
  const { data: prof } = await admin.from('profiles').select('*').eq('id', user.id).single()
  if (!prof?.is_admin) return null
  return { admin, adminUser: user }
}

export async function GET(req: NextRequest) {
  const ctx = await requireAdmin(req)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { data: users, error } = await ctx.admin
    .from('profiles')
    .select('id, email, full_name, plan, is_admin, checks_today, last_check_date, created_at')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const ctx = await requireAdmin(req)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { userId, plan } = await req.json()
  if (!userId || !['free', 'pro'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { error } = await ctx.admin.from('profiles').update({ plan }).eq('id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
