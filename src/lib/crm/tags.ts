'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'

// =============================================================================
// QUERIES
// =============================================================================

export async function getTags() {
  const session = await requireAuthWithOrg()

  return db.tag.findMany({
    where: { organizationId: session.activeOrganizationId },
    include: {
      _count: {
        select: {
          contacts: true,
          companies: true,
          deals: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export async function getTag(id: string) {
  const session = await requireAuthWithOrg()

  return db.tag.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      _count: {
        select: {
          contacts: true,
          companies: true,
          deals: true,
        },
      },
    },
  })
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function createTag(input: { name: string; color?: string }) {
  const session = await requireAuthWithOrg()

  const tag = await db.tag.create({
    data: {
      name: input.name,
      color: input.color || '#6B7280',
      organizationId: session.activeOrganizationId,
    },
  })

  revalidatePath('/crm')
  return tag
}

export async function updateTag(id: string, input: { name?: string; color?: string }) {
  const session = await requireAuthWithOrg()

  const existing = await db.tag.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Tag not found')
  }

  const tag = await db.tag.update({
    where: { id },
    data: input,
  })

  revalidatePath('/crm')
  return tag
}

export async function deleteTag(id: string) {
  const session = await requireAuthWithOrg()

  const existing = await db.tag.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Tag not found')
  }

  await db.tag.delete({ where: { id } })
  revalidatePath('/crm')
  return { success: true }
}

// =============================================================================
// DEFAULT TAGS
// =============================================================================

export async function createDefaultTags(organizationId: string) {
  const defaultTags = [
    { name: 'Hot Lead', color: '#EF4444' },
    { name: 'Warm Lead', color: '#F59E0B' },
    { name: 'Cold Lead', color: '#6B7280' },
    { name: 'Enterprise', color: '#8B5CF6' },
    { name: 'SMB', color: '#3B82F6' },
    { name: 'Startup', color: '#10B981' },
    { name: 'Referral', color: '#EC4899' },
    { name: 'Inbound', color: '#06B6D4' },
    { name: 'VIP', color: '#F97316' },
  ]

  return db.tag.createMany({
    data: defaultTags.map((tag) => ({
      ...tag,
      organizationId,
    })),
    skipDuplicates: true,
  })
}



