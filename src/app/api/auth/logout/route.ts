import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/api'

export async function POST() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ message: 'Failed to logout', error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Logged out successfully' })
}
