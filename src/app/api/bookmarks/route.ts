import { createClient } from '@/lib/supabase/api'
import { NextResponse } from 'next/server'



export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { data: bookmarks, error: fetchError } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('position', { ascending: true })

  if (fetchError) {
    return NextResponse.json(
      { message: 'Failed to fetch bookmarks', error: fetchError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ bookmarks })
}


export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { url, title, summary, favicon_url, tags } = body

  // Validate required fields
  if (!url || !title || !summary || !favicon_url) {
    return NextResponse.json(
      { message: 'Missing required fields: url, title, summary, favicon_url' },
      { status: 400 }
    )
  }

  try {
    const { data, error: insertError } = await supabase.from('bookmarks').insert({
      user_id: user.id,
      url,
      title,
      summary,
      favicon_url,
      tags,
    }).select().single()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ bookmark: data, message: 'Bookmark saved!' }, { status: 200 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: 'Internal Server Error', error: err.message },
      { status: 500 }
    )
  }
}




