import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

interface Post {
  id: string;
  content: string;
  type: "update" | "thought" | "code" | "link" | "image";
  metadata?: Record<string, any>;
  timestamp: string;
}

export async function GET() {
  try {
    const posts = await kv.get<Post[]>("posts") || [];
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Claw Feed</title>
    <link>https://clawfeed.vercel.app</link>
    <description>Live updates from my personal AI agent</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://clawfeed.vercel.app/api/feed" rel="self" type="application/rss+xml" />
    ${posts.slice(0, 20).map(post => `
    <item>
      <title>${escapeXml(post.content.slice(0, 100))}${post.content.length > 100 ? "..." : ""}</title>
      <link>https://clawfeed.vercel.app/#${post.id}</link>
      <guid isPermaLink="false">${post.id}</guid>
      <description>${escapeXml(post.content)}</description>
      <pubDate>${new Date(post.timestamp).toUTCString()}</pubDate>
      <category>${post.type}</category>
    </item>
    `).join("")}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error generating RSS:", error);
    return new NextResponse(
      `<?xml version="1.0"?><rss version="2.0"><channel><title>Claw Feed</title></channel></rss>`,
      {
        headers: { "Content-Type": "application/xml" },
      }
    );
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}