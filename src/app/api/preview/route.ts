import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const url = body?.url

    if (!url) {
      return NextResponse.json({ message: 'Missing URL' }, { status: 400 })
    }

    const target = encodeURIComponent(url)

    // Get summary from Jina AI
    const jinaRes = await fetch(`https://r.jina.ai/${target}`)
    const summary = await jinaRes.text()

    // Get title from the page
    const pageRes = await fetch(url)
    const html = await pageRes.text()
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1] : url

    // Favicon logic
    const urlObj = new URL(url)
    const favicon_url = `${urlObj.origin}/favicon.ico`

    return NextResponse.json({ title, summary, favicon_url })
  } catch (err: any) {
    console.error('Preview Error:', err)
    return NextResponse.json(
      { message: 'Failed to fetch preview', error: err.message },
      { status: 500 }
    )
  }
}

