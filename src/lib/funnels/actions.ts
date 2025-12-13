'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { FunnelType, FunnelStatus } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'
import { FUNNEL_TEMPLATES } from './utils'

export type CreateFunnelInput = {
  name: string
  type: FunnelType
  description?: string
  primaryColor?: string
}

export type UpdateFunnelInput = {
  id: string
  name?: string
  description?: string
  status?: FunnelStatus
  primaryColor?: string
  logoUrl?: string
  customDomain?: string
}

export type UpdateFunnelStepInput = {
  id: string
  headline?: string
  subheadline?: string
  ctaText?: string
  ctaUrl?: string
  content?: JsonObject
  formFields?: JsonObject
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function getFunnels() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  const funnels = await db.funnel.findMany({
    where: {
      organizationId: session.activeOrganizationId,
    },
    include: {
      steps: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return funnels
}

export async function getFunnelStats() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { visitors: 0, conversions: 0, avgRate: 0 }
  }

  const funnels = await db.funnel.findMany({
    where: {
      organizationId: session.activeOrganizationId,
    },
    select: {
      visitors: true,
      conversions: true,
    },
  })

  const totalVisitors = funnels.reduce((sum, f) => sum + f.visitors, 0)
  const totalConversions = funnels.reduce((sum, f) => sum + f.conversions, 0)
  const avgRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0

  return {
    visitors: totalVisitors,
    conversions: totalConversions,
    avgRate: Math.round(avgRate * 10) / 10,
  }
}

export async function createFunnel(input: CreateFunnelInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Generate unique slug
    let baseSlug = generateSlug(input.name)
    let slug = baseSlug
    let counter = 1

    while (true) {
      const existing = await db.funnel.findUnique({
        where: {
          organizationId_slug: {
            organizationId: session.activeOrganizationId,
            slug,
          },
        },
      })
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Get template steps
    const template = FUNNEL_TEMPLATES[input.type]
    const steps = template?.steps || []

    // Create funnel with steps
    const funnel = await db.funnel.create({
      data: {
        organizationId: session.activeOrganizationId,
        name: input.name,
        slug,
        type: input.type,
        description: input.description || template?.description,
        primaryColor: input.primaryColor || '#3B82F6',
        status: 'DRAFT',
        steps: {
          create: steps.map(step => ({
            name: step.name,
            type: step.type,
            order: step.order,
          })),
        },
      },
      include: {
        steps: true,
      },
    })

    revalidatePath('/funnels')
    return { success: true, funnel }
  } catch (error) {
    console.error('Failed to create funnel:', error)
    return { success: false, error: 'Failed to create funnel' }
  }
}

export async function updateFunnel(input: UpdateFunnelInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const funnel = await db.funnel.update({
      where: {
        id: input.id,
        organizationId: session.activeOrganizationId,
      },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status && { status: input.status }),
        ...(input.primaryColor && { primaryColor: input.primaryColor }),
        ...(input.logoUrl !== undefined && { logoUrl: input.logoUrl || null }),
        ...(input.customDomain !== undefined && { customDomain: input.customDomain }),
      },
    })

    revalidatePath('/funnels')
    return { success: true, funnel }
  } catch (error) {
    console.error('Failed to update funnel:', error)
    return { success: false, error: 'Failed to update funnel' }
  }
}

export async function getFunnel(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return null
  }

  const funnel = await db.funnel.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      steps: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  return funnel
}

export async function updateFunnelStep(input: UpdateFunnelStepInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Verify step belongs to user's organization
    const step = await db.funnelStep.findFirst({
      where: {
        id: input.id,
        funnel: {
          organizationId: session.activeOrganizationId,
        },
      },
    })

    if (!step) {
      return { success: false, error: 'Step not found' }
    }

    const updatedStep = await db.funnelStep.update({
      where: { id: input.id },
      data: {
        ...(input.headline !== undefined && { headline: input.headline }),
        ...(input.subheadline !== undefined && { subheadline: input.subheadline }),
        ...(input.ctaText !== undefined && { ctaText: input.ctaText }),
        ...(input.ctaUrl !== undefined && { ctaUrl: input.ctaUrl }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.formFields !== undefined && { formFields: input.formFields }),
      },
    })

    revalidatePath('/funnels')
    revalidatePath(`/funnels/${step.funnelId}/edit`)
    return { success: true, step: updatedStep }
  } catch (error) {
    console.error('Failed to update funnel step:', error)
    return { success: false, error: 'Failed to update funnel step' }
  }
}

export async function toggleFunnelStatus(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const funnel = await db.funnel.findUnique({
      where: { id, organizationId: session.activeOrganizationId },
    })

    if (!funnel) {
      return { success: false, error: 'Funnel not found' }
    }

    const newStatus = funnel.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'

    await db.funnel.update({
      where: { id },
      data: { status: newStatus },
    })

    revalidatePath('/funnels')
    return { success: true, status: newStatus }
  } catch (error) {
    console.error('Failed to toggle funnel status:', error)
    return { success: false, error: 'Failed to toggle funnel status' }
  }
}

export async function deleteFunnel(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.funnel.delete({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
    })

    revalidatePath('/funnels')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete funnel:', error)
    return { success: false, error: 'Failed to delete funnel' }
  }
}
