'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth/session'
import { FunnelType, FunnelStatus, FunnelStepType } from '@prisma/client'

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

// Template definitions for funnel creation
export const FUNNEL_TEMPLATES = {
  LEAD_MAGNET: {
    name: 'Lead Magnet',
    description: 'Capture leads with a free resource download',
    steps: [
      { name: 'Landing Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Opt-in Form', type: 'OPT_IN_FORM' as FunnelStepType, order: 2 },
      { name: 'Thank You', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  CONSULTATION: {
    name: 'Consultation Booking',
    description: 'Book discovery calls or consultations',
    steps: [
      { name: 'Landing Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Calendar Booking', type: 'CALENDAR' as FunnelStepType, order: 2 },
      { name: 'Confirmation', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  FREE_TRIAL: {
    name: 'Free Trial',
    description: 'Offer a free trial to convert prospects',
    steps: [
      { name: 'Landing Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Sign Up Form', type: 'OPT_IN_FORM' as FunnelStepType, order: 2 },
      { name: 'Onboarding', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  DIRECT_PURCHASE: {
    name: 'Direct Purchase',
    description: 'Sell products or services directly',
    steps: [
      { name: 'Sales Page', type: 'SALES_PAGE' as FunnelStepType, order: 1 },
      { name: 'Checkout', type: 'CHECKOUT' as FunnelStepType, order: 2 },
      { name: 'Thank You', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  WEBINAR: {
    name: 'Webinar Registration',
    description: 'Register attendees for your webinar',
    steps: [
      { name: 'Registration Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Sign Up Form', type: 'OPT_IN_FORM' as FunnelStepType, order: 2 },
      { name: 'Confirmation', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  WAITLIST: {
    name: 'Waitlist',
    description: 'Build anticipation with a waitlist',
    steps: [
      { name: 'Coming Soon Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Join Waitlist', type: 'OPT_IN_FORM' as FunnelStepType, order: 2 },
      { name: 'Confirmation', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function getFunnels() {
  const session = await getServerSession()
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
  const session = await getServerSession()
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
  const session = await getServerSession()
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
  const session = await getServerSession()
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
        ...(input.logoUrl !== undefined && { logoUrl: input.logoUrl }),
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

export async function toggleFunnelStatus(id: string) {
  const session = await getServerSession()
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
  const session = await getServerSession()
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

// Helper to format funnel type for display
export function formatFunnelType(type: FunnelType): string {
  const labels: Record<FunnelType, string> = {
    LEAD_MAGNET: 'Lead Magnet',
    CONSULTATION: 'Consultation Booking',
    FREE_TRIAL: 'Free Trial',
    DIRECT_PURCHASE: 'Direct Purchase',
    WEBINAR: 'Webinar Registration',
    WAITLIST: 'Waitlist',
  }
  return labels[type] || type
}

