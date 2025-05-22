

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





