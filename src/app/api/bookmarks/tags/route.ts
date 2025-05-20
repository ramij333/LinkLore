

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/api'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('tags')
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ message: 'Failed to fetch tags', error: error.message }, { status: 500 })
  }

  const allTags =
    data
      ?.flatMap((bookmark) => bookmark.tags ?? [])
      .filter((tag, index, self) => self.indexOf(tag) === index) || []

  return NextResponse.json({ tags: allTags })
}





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

//   // Fetch all tags for this user
//   // Assuming `tags` column is stored as an array in bookmarks table
//   const { data, error } = await supabase
//     .from('bookmarks')
//     .select('tags')
//     .eq('user_id', user.id)

//   if (error) {
//     return res.status(500).json({ message: 'Failed to fetch tags', error: error.message })
//   }

//   // Flatten all tags into a single array, remove duplicates
//   const allTags = data
//     ?.flatMap((bookmark) => bookmark.tags ?? [])
//     .filter((tag, index, self) => self.indexOf(tag) === index) || []

//   return res.status(200).json({ tags: allTags })
// }
