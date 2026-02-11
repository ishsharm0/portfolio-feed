import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = await connectToDatabase()
    const posts = await db.collection('portfolio_posts')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    const rssItems = posts.map(post => `
    <item>
      <title>${escapeXml(post.content.split('\\n')[0].substring(0, 100))}</title>
      <description>${escapeXml(post.content.substring(0, 500))}</description>
      <link>https://portfolio-feed.vercel.app/post/${post.id}</link>
      <pubDate>${new Date(post.timestamp).toUTCString()}</pubDate>
      <guid isPermaLink="true">https://portfolio-feed.vercel.app/post/${post.id}</guid>
      <category>${escapeXml(post.type || 'uncategorized')}</category>
    </item>
    `).join('')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Portfolio Feed v2</title>
    <link>https://portfolio-feed.vercel.app</link>
    <description>Personal portfolio feed powered by Next.js and MongoDB</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://portfolio-feed.vercel.app/api/feed" rel="self" type="application/rss+xml"/>
    ${rssItems || '<item><title>No posts yet</title><description>Feed is empty</description><link>https://portfolio-feed.vercel.app</link></item>'}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=60, stale-while-revalidate'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate feed' },
      { status: 500 }
    )
  }
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
