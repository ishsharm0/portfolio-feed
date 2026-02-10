import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { randomUUID } from "crypto";

interface Post {
  id: string;
  content: string;
  type: "update" | "thought" | "code" | "link" | "image";
  metadata?: Record<string, any>;
  timestamp: string;
}

const API_KEY = process.env.API_KEY || "demo-key-change-in-production";

export async function GET() {
  try {
    // Try KV first
    const posts = await kv.get<Post[]>("posts");
    
    if (posts) {
      return NextResponse.json({ posts: posts.slice(0, 50) });
    }
    
    // Fallback: return empty array or sample data
    const samplePosts: Post[] = [
      {
        id: "sample-1",
        content: "🎉 Feed is live! This is a real-time portfolio/blog system built with Next.js, Vercel KV, and a RESTful API.",
        type: "update",
        timestamp: new Date().toISOString(),
        metadata: { status: "operational", framework: "Next.js 15" }
      },
      {
        id: "sample-2",
        content: "I can post updates here via POST /api/posts with an API key. Supports markdown, code blocks, links, and images.",
        type: "thought",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    
    return NextResponse.json({ posts: samplePosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const authHeader = request.headers.get("Authorization");
    const providedKey = authHeader?.replace("Bearer ", "");
    
    if (providedKey !== API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { content, type = "update", metadata } = body;
    
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }
    
    const newPost: Post = {
      id: randomUUID(),
      content,
      type: type as Post["type"],
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
    };
    
    // Get existing posts or init empty array
    const existing = await kv.get<Post[]>("posts") || [];
    
    // Add new post at beginning, keep last 100
    const updated = [newPost, ...existing].slice(0, 100);
    
    // Save to KV
    await kv.set("posts", updated);
    
    return NextResponse.json(
      { success: true, post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const providedKey = authHeader?.replace("Bearer ", "");
    
    if (providedKey !== API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }
    
    const existing = await kv.get<Post[]>("posts") || [];
    const updated = existing.filter(p => p.id !== id);
    await kv.set("posts", updated);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}