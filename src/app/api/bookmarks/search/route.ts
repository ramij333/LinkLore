import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/api'

export async function GET(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const tag = searchParams.get('tag') || ''

  let query = supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)

  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  const { data: bookmarks, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ message: 'Failed to fetch bookmarks', error: error.message }, { status: 500 })
  }

  return NextResponse.json({ bookmarks })
}







// import { NextApiRequest, NextApiResponse } from 'next'
// import createClient from '@/lib/supabase/api'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method not allowed' })
//   }

//   const supabase = createClient(req, res)
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser()

//   if (authError || !user) {
//     return res.status(401).json({ message: 'Unauthorized' })
//   }

//   const search = (req.query.search as string) || ''
//   const tag = (req.query.tag as string) || ''

//   let query = supabase
//     .from('bookmarks')
//     .select('*')
//     .eq('user_id', user.id)

//   if (search) {
//     query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`)
//   }

//   if (tag) {
//     query = query.contains('tags', [tag])
//   }

//   const { data: bookmarks, error } = await query.order('created_at', { ascending: false })

//   if (error) {
//     return res.status(500).json({ message: 'Failed to fetch bookmarks', error: error.message })
//   }

//   return res.status(200).json({ bookmarks })
// }
