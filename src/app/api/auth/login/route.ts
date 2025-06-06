
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/api'


export async function POST(request: Request) {
  const supabase = await createClient()

  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({
    user: data.user,
    message: 'Login successful',
  })
}



