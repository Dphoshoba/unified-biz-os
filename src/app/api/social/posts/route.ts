import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

/**
 * Get social media posts
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    // TODO: In production, fetch from SocialPost model
    // For now, return mock data
    const mockPosts = [
      {
        id: '1',
        content: 'Excited to announce our new product launch! 🚀 #innovation',
        platform: 'TWITTER',
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: '2',
        content: 'Thank you to all our amazing customers! 🙏 #grateful',
        platform: 'LINKEDIN',
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 23,
        shares: 5,
        comments: 3,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ]

    let filtered = mockPosts
    if (status) {
      filtered = filtered.filter(p => p.status === status)
    }

    return NextResponse.json({
      success: true,
      posts: filtered,
    })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

/**
 * Create a new social media post
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { content, platforms, scheduledAt } = await req.json()

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Content and platforms are required' },
        { status: 400 }
      )
    }

    // TODO: In production, save to SocialPost model
    // For now, return success
    
    return NextResponse.json({
      success: true,
      post: {
        id: Date.now().toString(),
        content,
        platforms,
        status: scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt || null,
        createdAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
