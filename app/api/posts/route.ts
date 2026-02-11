import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'

export const runtime = 'nodejs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders })
}

export async function GET() {
  try {
    const db = await connectToDatabase()
    const posts = await db
      .collection('portfolio_posts')
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json(
      { posts: posts.map((p: any) => ({
        id: p.id,
        content: p.content,
        type: p.type,
        metadata: p.metadata || {},
        timestamp: p.timestamp,
      })) },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, posts: [] },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, type = 'update', metadata } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const newPost = {
      id: randomUUID(),
      content,
      type,
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
    }

    const db = await connectToDatabase()
    await db.collection('portfolio_posts').insertOne(newPost)

    return NextResponse.json(
      { success: true, post: newPost },
      { status: 201, headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const db = await connectToDatabase()
    await db.collection('portfolio_posts').deleteOne({ id })

    return NextResponse.json({ success: true }, { headers: corsHeaders })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
