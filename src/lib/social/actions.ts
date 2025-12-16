'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { SocialPlatform, PostStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export interface CreateSocialPostInput {
  platform: SocialPlatform
  content: string
  mediaUrls?: string[]
  scheduledAt?: Date
}

export interface UpdateSocialPostInput {
  id: string
  content?: string
  mediaUrls?: string[]
  status?: PostStatus
  scheduledAt?: Date
}

export async function getSocialPosts(platform?: SocialPlatform) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  try {
    const posts = await db.socialPost.findMany({
      where: {
        organizationId: session.activeOrganizationId,
        ...(platform && { platform }),
      },
      orderBy: { scheduledAt: 'desc' },
    })
    return posts
  } catch (error) {
    console.error('Failed to fetch social posts:', error)
    return []
  }
}

export async function createSocialPost(input: CreateSocialPostInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const post = await db.socialPost.create({
      data: {
        organizationId: session.activeOrganizationId,
        platform: input.platform,
        content: input.content,
        mediaUrls: input.mediaUrls || [],
        status: input.scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
        scheduledAt: input.scheduledAt,
      },
    })

    revalidatePath('/social')
    return { success: true, post }
  } catch (error) {
    console.error('Failed to create social post:', error)
    return { success: false, error: 'Failed to create post' }
  }
}

export async function updateSocialPost(input: UpdateSocialPostInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.socialPost.updateMany({
      where: {
        id: input.id,
        organizationId: session.activeOrganizationId,
      },
      data: {
        ...(input.content && { content: input.content }),
        ...(input.mediaUrls && { mediaUrls: input.mediaUrls }),
        ...(input.status && { status: input.status }),
        ...(input.scheduledAt !== undefined && { scheduledAt: input.scheduledAt }),
      },
    })

    revalidatePath('/social')
    return { success: true }
  } catch (error) {
    console.error('Failed to update social post:', error)
    return { success: false, error: 'Failed to update post' }
  }
}

export async function deleteSocialPost(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.socialPost.deleteMany({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
    })

    revalidatePath('/social')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete social post:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}

