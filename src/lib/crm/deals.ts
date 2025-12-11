'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { DealStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

// =============================================================================
// TYPES
// =============================================================================

export type DealWithRelations = Awaited<ReturnType<typeof getDeals>>[number]

export type CreateDealInput = {
  name: string
  pipelineId: string
  stageId: string
  contactId?: string
  companyId?: string
  assignedToId?: string
  value?: number
  currency?: string
  expectedCloseDate?: Date
  notes?: string
  tagIds?: string[]
}

export type UpdateDealInput = Partial<CreateDealInput> & {
  status?: DealStatus
  actualCloseDate?: Date
  lostReason?: string
}

// =============================================================================
// QUERIES
// =============================================================================

export async function getDeals(options?: {
  search?: string
  status?: DealStatus
  pipelineId?: string
  stageId?: string
  contactId?: string
  companyId?: string
  assignedToId?: string
  limit?: number
  offset?: number
}) {
  const session = await requireAuthWithOrg()
  const {
    search,
    status,
    pipelineId,
    stageId,
    contactId,
    companyId,
    assignedToId,
    limit = 50,
    offset = 0,
  } = options || {}

  const deals = await db.deal.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(status && { status }),
      ...(pipelineId && { pipelineId }),
      ...(stageId && { stageId }),
      ...(contactId && { contactId }),
      ...(companyId && { companyId }),
      ...(assignedToId && { assignedToId }),
    },
    include: {
      pipeline: { select: { id: true, name: true } },
      stage: { select: { id: true, name: true, color: true, probability: true } },
      contact: { select: { id: true, firstName: true, lastName: true, email: true } },
      company: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip: offset,
  })

  return deals.map((deal) => ({
    ...deal,
    value: deal.value.toNumber(),
    tags: deal.tags.map((t) => t.tag),
  }))
}

export async function getDeal(id: string) {
  const session = await requireAuthWithOrg()

  const deal = await db.deal.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      pipeline: true,
      stage: true,
      contact: true,
      company: true,
      assignedTo: { select: { id: true, name: true, email: true, image: true } },
      tags: { include: { tag: true } },
      activities: {
        include: { createdBy: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!deal) return null

  return {
    ...deal,
    value: deal.value.toNumber(),
    tags: deal.tags.map((t) => t.tag),
  }
}

export async function getDealsByStage(pipelineId: string) {
  const session = await requireAuthWithOrg()

  const stages = await db.pipelineStage.findMany({
    where: {
      pipelineId,
      pipeline: { organizationId: session.activeOrganizationId },
    },
    include: {
      deals: {
        where: { status: 'OPEN' },
        include: {
          contact: { select: { id: true, firstName: true, lastName: true } },
          company: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true, image: true } },
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
    orderBy: { order: 'asc' },
  })

  return stages.map((stage) => ({
    ...stage,
    deals: stage.deals.map((deal) => ({
      ...deal,
      value: deal.value.toNumber(),
    })),
    totalValue: stage.deals.reduce((sum, d) => sum + d.value.toNumber(), 0),
  }))
}

export async function getDealsStats() {
  const session = await requireAuthWithOrg()

  const [total, open, won, lost, totalValue, wonValue] = await Promise.all([
    db.deal.count({
      where: { organizationId: session.activeOrganizationId },
    }),
    db.deal.count({
      where: { organizationId: session.activeOrganizationId, status: 'OPEN' },
    }),
    db.deal.count({
      where: { organizationId: session.activeOrganizationId, status: 'WON' },
    }),
    db.deal.count({
      where: { organizationId: session.activeOrganizationId, status: 'LOST' },
    }),
    db.deal.aggregate({
      where: { organizationId: session.activeOrganizationId },
      _sum: { value: true },
    }),
    db.deal.aggregate({
      where: { organizationId: session.activeOrganizationId, status: 'WON' },
      _sum: { value: true },
    }),
  ])

  return {
    total,
    open,
    won,
    lost,
    totalValue: totalValue._sum.value?.toNumber() || 0,
    wonValue: wonValue._sum.value?.toNumber() || 0,
    conversionRate: total > 0 ? Math.round((won / total) * 100) : 0,
  }
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function createDeal(input: CreateDealInput) {
  const session = await requireAuthWithOrg()
  const { tagIds, value, ...data } = input

  const deal = await db.deal.create({
    data: {
      ...data,
      value: value || 0,
      organizationId: session.activeOrganizationId,
      ...(tagIds?.length && {
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      }),
    },
    include: {
      pipeline: { select: { id: true, name: true } },
      stage: { select: { id: true, name: true, color: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
  })

  revalidatePath('/crm/deals')
  revalidatePath('/crm/pipeline')
  return { ...deal, value: deal.value.toNumber(), tags: deal.tags.map((t) => t.tag) }
}

export async function updateDeal(id: string, input: UpdateDealInput) {
  const session = await requireAuthWithOrg()
  const { tagIds, value, ...data } = input

  const existing = await db.deal.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Deal not found')
  }

  const deal = await db.deal.update({
    where: { id },
    data: {
      ...data,
      ...(value !== undefined && { value }),
      ...(tagIds && {
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId) => ({ tagId })),
        },
      }),
    },
    include: {
      pipeline: { select: { id: true, name: true } },
      stage: { select: { id: true, name: true, color: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
      company: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
  })

  revalidatePath('/crm/deals')
  revalidatePath('/crm/pipeline')
  revalidatePath(`/crm/deals/${id}`)
  return { ...deal, value: deal.value.toNumber(), tags: deal.tags.map((t) => t.tag) }
}

export async function moveDealToStage(dealId: string, stageId: string) {
  const session = await requireAuthWithOrg()

  const existing = await db.deal.findFirst({
    where: { id: dealId, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Deal not found')
  }

  const deal = await db.deal.update({
    where: { id: dealId },
    data: { stageId },
  })

  revalidatePath('/crm/pipeline')
  return deal
}

export async function deleteDeal(id: string) {
  const session = await requireAuthWithOrg()

  const existing = await db.deal.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Deal not found')
  }

  await db.deal.delete({ where: { id } })
  revalidatePath('/crm/deals')
  revalidatePath('/crm/pipeline')
  return { success: true }
}

