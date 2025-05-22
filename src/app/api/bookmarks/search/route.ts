
// pages/api/bookmarks/search/route.ts (or wherever you defined GET)

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
  const matchType = searchParams.get('match') || 'any' // default to "any"
  const tagsParam = searchParams.get('tags') || ''

  const tags = tagsParam
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  let query = supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)

  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`)
  }

  if (tags.length > 0) {
    query = matchType === 'all'
      ? query.contains('tags', tags)    // AND: must contain all tags
      : query.overlaps('tags', tags)    // OR: any matching tag
  }

  const { data: bookmarks, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ message: 'Failed to fetch bookmarks', error: error.message }, { status: 500 })
  }

  return NextResponse.json({ bookmarks })
}



