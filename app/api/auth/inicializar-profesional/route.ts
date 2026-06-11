import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Called from auth/confirm right after a fresh professional registration.
// Uses service role to bypass RLS and set account_status = 'registered'.
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role, account_status')
      .eq('id', user.id)
      .single()

    // Only touch professionals whose status hasn't been manually set by an admin
    if (
      profile?.role === 'professional' &&
      (!profile.account_status || profile.account_status === 'review')
    ) {
      await adminSupabase
        .from('profiles')
        .update({ account_status: 'registered' })
        .eq('id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Error interno' }, { status: 500 })
  }
}
