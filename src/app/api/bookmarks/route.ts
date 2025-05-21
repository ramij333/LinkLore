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
    .order('created_at', { ascending: false })

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

// export async function POST(req: Request) {
//   const supabase = await createClient()

//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser()

//   if (error || !user) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
//   }

//   const body = await req.json()
//   const { url, title, summary, favicon_url, tags } = body

//   if (!url || !title || !summary || !favicon_url) {
//     return NextResponse.json({
//       message: 'Missing required fields: url, title, summary, favicon'
//     }, { status: 400 })
//   }

//   try {
//     const target = encodeURIComponent(url)

//     const jinaRes = await fetch(`https://r.jina.ai/http://${target}`)
//     const summary = await jinaRes.text()

//     const pageRes = await fetch(url)
//     const html = await pageRes.text()
//     const titleMatch = html.match(/<title>(.*?)<\/title>/i)
//     const title = titleMatch ? titleMatch[1] : url
//     const urlObj = new URL(url)
//     const favicon_url = `${urlObj.origin}/favicon.ico`

//     const { error: insertError } = await supabase.from('bookmarks').insert({
//       user_id: user.id,
//       url,
//       title,
//       favicon_url,
//       summary,
//       tags,
//     })

//     if (insertError) {
//       throw insertError
//     }

//     return NextResponse.json({ message: 'Bookmark saved!' }, { status: 200 })
//   } catch (err: any) {
//     console.error(err)
//     return NextResponse.json(
//       { message: 'Internal Server Error', error: err.message },
//       { status: 500 }
//     )
//   }
// }











// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const supabase = createClient(req, res)
//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser()

//   if (error || !user) {
//     console.log('Unauthorized access - no user found')
//     return res.status(401).json({ message: 'Unauthorized' })
//   }

//   if (req.method === 'GET') {
//     const { data: bookmarks, error: fetchError } = await supabase
//       .from('bookmarks')
//       .select('*')
//       .eq('user_id', user.id)
//       .order('created_at', { ascending: false })

//     if (fetchError) {
//       return res
//         .status(500)
//         .json({ message: 'Failed to fetch bookmarks', error: fetchError.message })
//     }

//     return res.status(200).json({ bookmarks })
//   }

//   if (req.method === 'POST') {
//     const { url, tags } = req.body
//     if (!url) {
//       return res.status(400).json({ message: 'URL is required' })
//     }

//     try {
//       const target = encodeURIComponent(url)
//       const jinaRes = await fetch(`https://r.jina.ai/http://${target}`)
//       const summary = await jinaRes.text()

//       const pageRes = await fetch(url)
//       const html = await pageRes.text()
//       const titleMatch = html.match(/<title>(.*?)<\/title>/i)
//       const title = titleMatch ? titleMatch[1] : url
//       const urlObj = new URL(url)
//       const favicon = `${urlObj.origin}/favicon.ico`

//       const { error: insertError } = await supabase.from('bookmarks').insert({
//         user_id: user.id,
//         url,
//         title,
//         favicon,
//         summary,
//         tags,
//       })

//       if (insertError) throw insertError

//       return res.status(200).json({ message: 'Bookmark saved!' })
//     } catch (err: any) {
//       console.error(err)
//       return res.status(500).json({ message: 'Internal Server Error', error: err.message })
//     }
//   }

//   return res.status(405).json({ message: 'Method not allowed' })
// }

// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//     const supabase = createClient(req, res)
//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser()

//   if (error || !user) {
//     console.log('Unauthorized access - no user found')
//     return res.status(401).json({ message: 'Unauthorized' })
//   }
//   const { data: bookmarks, error: fetchError } = await supabase
//       .from('bookmarks')
//       .select('*')
//       .eq('user_id', user.id)
//       .order('created_at', { ascending: false })

//     if (fetchError) {
//       return res
//         .status(500)
//         .json({ message: 'Failed to fetch bookmarks', error: fetchError.message })
//     }
//      return res.status(200).json({ bookmarks })
// }








// import { NextApiRequest, NextApiResponse } from 'next'
// import createClient from '@/lib/supabase/api'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const supabase = createClient(req, res)
//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser()

//   if (error || !user) {
//     console.log('Unauthorized access - no user found');
//     return res.status(401).json({ message: 'Unauthorized' })
//   }

//   if (req.method === 'GET') {
    
//     const { data: bookmarks, error: fetchError } = await supabase
//       .from('bookmarks')
//       .select('*')
//       .eq('user_id', user.id)
//       .order('created_at', { ascending: false })

//     if (fetchError) {
//       return res
//         .status(500)
//         .json({ message: 'Failed to fetch bookmarks', error: fetchError.message })
//     }

//     return res.status(200).json({ bookmarks })
//   }

//   if (req.method === 'POST') {
    
//     const { url, tags } = req.body
//     if (!url) {
//       return res.status(400).json({ message: 'URL is required' })
//     }

//     try {
//       const target = encodeURIComponent(url)
//       const jinaRes = await fetch(`https://r.jina.ai/http://${target}`)
//       const summary = await jinaRes.text()

//       const pageRes = await fetch(url)
//       const html = await pageRes.text()
//       const titleMatch = html.match(/<title>(.*?)<\/title>/i)
//       const title = titleMatch ? titleMatch[1] : url
//       const urlObj = new URL(url)
//       const favicon = `${urlObj.origin}/favicon.ico`

//       const { error: insertError } = await supabase.from('bookmarks').insert({
//         user_id: user.id,
//         url,
//         title,
//         favicon,
//         summary,
//         tags,
//       })

//       if (insertError) throw insertError

//       return res.status(200).json({ message: 'Bookmark saved!' })
//     } catch (err: any) {
//       console.error(err)
//       return res.status(500).json({ message: 'Internal Server Error', error: err.message })
//     }
//   }

//   return res.status(405).json({ message: 'Method not allowed' })
// }



