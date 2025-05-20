
// app/api/auth/signup/route.ts
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

  const { data, error } = await supabase.auth.signUp({
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
    message: 'Signup successful, check your email to confirm.',
  })
}







// import type { NextApiRequest, NextApiResponse } from 'next'
// import createClient from '../../../lib/supabase/api'

// export default async function signupHandler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }

//   const { email, password } = req.body

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' })
//   }

//   const supabase = createClient(req, res)

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   })

//   if (error) {
//     return res.status(400).json({ error: error.message })
//   }

//   return res.status(200).json({ user: data.user, message: 'Signup successful, check your email to confirm.' })
// }