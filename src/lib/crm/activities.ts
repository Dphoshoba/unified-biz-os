'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { ActivityType } from '@prisma/client'

// =============================================================================
// TYPES
// =============================================================================

export type ActivityWithRelations = Awaited<ReturnType<typeof getActivities>>[number]

export type CreateActivityInput = {
  type: ActivityType
  title: string
  description?: string
  contactId?: string
  companyId?: string
  dealId?: string
  scheduledAt?: Date
  completedAt?: Date
  durationMinutes?: number
  outcome?: string
}

// =============================================================================
// QUERIES
// =============================================================================

export async function getActivities(options?: {
  contactId?: string
  companyId?: string
  dealId?: string
  type?: ActivityType
  limit?: number
  offset?: number
}) {
  const session = await requireAuthWithOrg()
  const { contactId, companyId, dealId, type, limit = 50, offset = 0 } = options || {}

  return db.activity.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(contactId && { contactId }),
      ...(companyId && { companyId }),
      ...(dealId && { dealId }),
      ...(type && { type }),
    },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      deal: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
}

export async function getRecentActivities(limit = 10) {
  const session = await requireAuthWithOrg()

  return db.activity.findMany({
    where: { organizationId: session.activeOrganizationId },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      deal: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function createActivity(input: CreateActivityInput) {
  const session = await requireAuthWithOrg()

  const activity = await db.activity.create({
    data: {
      ...input,
      organizationId: session.activeOrganizationId,
      createdById: session.user.id,
    },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      deal: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true, image: true } },
    },
  })

  // Revalidate relevant paths
  if (input.contactId) revalidatePath(`/crm/contacts/${input.contactId}`)
  if (input.companyId) revalidatePath(`/crm/companies/${input.companyId}`)
  if (input.dealId) revalidatePath(`/crm/deals/${input.dealId}`)
  revalidatePath('/dashboard')

  return activity
}

export async function updateActivity(id: string, input: Partial<CreateActivityInput>) {
  const session = await requireAuthWithOrg()

  const existing = await db.activity.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Activity not found')
  }

  return db.activity.update({
    where: { id },
    data: input,
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      deal: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true, image: true } },
    },
  })
}

export async function deleteActivity(id: string) {
  const session = await requireAuthWithOrg()

  const existing = await db.activity.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Activity not found')
  }

  await db.activity.delete({ where: { id } })
  return { success: true }
}

