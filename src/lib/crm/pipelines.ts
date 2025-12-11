'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'

// =============================================================================
// TYPES
// =============================================================================

export type PipelineWithStages = Awaited<ReturnType<typeof getPipelines>>[number]

export type CreatePipelineInput = {
  name: string
  description?: string
  isDefault?: boolean
  stages: { name: string; color?: string; probability?: number }[]
}

// =============================================================================
// QUERIES
// =============================================================================

export async function getPipelines() {
  const session = await requireAuthWithOrg()

  return db.pipeline.findMany({
    where: { organizationId: session.activeOrganizationId },
    include: {
      stages: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { deals: true },
      },
    },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })
}

export async function getPipeline(id: string) {
  const session = await requireAuthWithOrg()

  return db.pipeline.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      stages: {
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { deals: true } },
        },
      },
    },
  })
}

export async function getDefaultPipeline() {
  const session = await requireAuthWithOrg()

  let pipeline = await db.pipeline.findFirst({
    where: {
      organizationId: session.activeOrganizationId,
      isDefault: true,
    },
    include: {
      stages: { orderBy: { order: 'asc' } },
    },
  })

  // If no default, get the first one
  if (!pipeline) {
    pipeline = await db.pipeline.findFirst({
      where: { organizationId: session.activeOrganizationId },
      include: {
        stages: { orderBy: { order: 'asc' } },
      },
    })
  }

  return pipeline
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function createPipeline(input: CreatePipelineInput) {
  const session = await requireAuthWithOrg()
  const { stages, ...data } = input

  // If setting as default, unset others
  if (data.isDefault) {
    await db.pipeline.updateMany({
      where: { organizationId: session.activeOrganizationId },
      data: { isDefault: false },
    })
  }

  const pipeline = await db.pipeline.create({
    data: {
      ...data,
      organizationId: session.activeOrganizationId,
      stages: {
        create: stages.map((stage, index) => ({
          name: stage.name,
          color: stage.color || '#3B82F6',
          probability: stage.probability || 0,
          order: index,
        })),
      },
    },
    include: {
      stages: { orderBy: { order: 'asc' } },
    },
  })

  revalidatePath('/crm/pipeline')
  return pipeline
}

export async function createDefaultPipeline(organizationId: string) {
  // Check if pipeline already exists
  const existing = await db.pipeline.findFirst({
    where: { organizationId },
  })

  if (existing) return existing

  return db.pipeline.create({
    data: {
      name: 'Sales Pipeline',
      description: 'Default sales pipeline',
      isDefault: true,
      organizationId,
      stages: {
        create: [
          { name: 'Discovery', color: '#6B7280', probability: 10, order: 0 },
          { name: 'Qualified', color: '#3B82F6', probability: 25, order: 1 },
          { name: 'Proposal', color: '#F59E0B', probability: 50, order: 2 },
          { name: 'Negotiation', color: '#8B5CF6', probability: 75, order: 3 },
          { name: 'Won', color: '#10B981', probability: 100, order: 4 },
        ],
      },
    },
    include: {
      stages: { orderBy: { order: 'asc' } },
    },
  })
}

/**
 * Server action to get or create a default pipeline for the current organization
 */
export async function ensureDefaultPipeline() {
  const session = await requireAuthWithOrg()

  // First try to get existing pipeline
  let pipeline = await db.pipeline.findFirst({
    where: {
      organizationId: session.activeOrganizationId,
      isDefault: true,
    },
    include: {
      stages: { orderBy: { order: 'asc' } },
    },
  })

  // If no default, get any pipeline
  if (!pipeline) {
    pipeline = await db.pipeline.findFirst({
      where: { organizationId: session.activeOrganizationId },
      include: {
        stages: { orderBy: { order: 'asc' } },
      },
    })
  }

  // If still no pipeline, create default
  if (!pipeline) {
    pipeline = await db.pipeline.create({
      data: {
        name: 'Sales Pipeline',
        description: 'Default sales pipeline',
        isDefault: true,
        organizationId: session.activeOrganizationId,
        stages: {
          create: [
            { name: 'Discovery', color: '#6B7280', probability: 10, order: 0 },
            { name: 'Qualified', color: '#3B82F6', probability: 25, order: 1 },
            { name: 'Proposal', color: '#F59E0B', probability: 50, order: 2 },
            { name: 'Negotiation', color: '#8B5CF6', probability: 75, order: 3 },
            { name: 'Won', color: '#10B981', probability: 100, order: 4 },
          ],
        },
      },
      include: {
        stages: { orderBy: { order: 'asc' } },
      },
    })
    revalidatePath('/crm/pipeline')
  }

  return pipeline
}

export async function deletePipeline(id: string) {
  const session = await requireAuthWithOrg()

  const existing = await db.pipeline.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
    include: { _count: { select: { deals: true } } },
  })

  if (!existing) {
    throw new Error('Pipeline not found')
  }

  if (existing._count.deals > 0) {
    throw new Error('Cannot delete pipeline with existing deals')
  }

  await db.pipeline.delete({ where: { id } })
  revalidatePath('/crm/pipeline')
  return { success: true }
}

