'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { AutomationTrigger, AutomationAction, AutomationStatus, Prisma } from '@prisma/client'

export type CreateAutomationInput = {
  name: string
  description?: string
  triggerType: AutomationTrigger
  triggerConfig?: Record<string, unknown>
  actionType: AutomationAction
  actionConfig?: Record<string, unknown>
}

export type UpdateAutomationInput = {
  id: string
  name?: string
  description?: string
  triggerType?: AutomationTrigger
  triggerConfig?: Record<string, unknown>
  actionType?: AutomationAction
  actionConfig?: Record<string, unknown>
  status?: AutomationStatus
}

export async function getAutomations() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  const automations = await db.automation.findMany({
    where: {
      organizationId: session.activeOrganizationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return automations
}

export async function getAutomationStats() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { active: 0, total: 0, executions: 0 }
  }

  const automations = await db.automation.findMany({
    where: {
      organizationId: session.activeOrganizationId,
    },
    select: {
      status: true,
      executions: true,
    },
  })

  return {
    active: automations.filter(a => a.status === 'ACTIVE').length,
    total: automations.length,
    executions: automations.reduce((sum, a) => sum + a.executions, 0),
  }
}

export async function createAutomation(input: CreateAutomationInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const automation = await db.automation.create({
      data: {
        organizationId: session.activeOrganizationId,
        name: input.name,
        description: input.description,
        triggerType: input.triggerType,
        triggerConfig: input.triggerConfig as Prisma.InputJsonValue | undefined,
        actionType: input.actionType,
        actionConfig: input.actionConfig as Prisma.InputJsonValue | undefined,
        status: 'ACTIVE',
      },
    })

    revalidatePath('/automations')
    return { success: true, automation }
  } catch (error) {
    console.error('Failed to create automation:', error)
    return { success: false, error: 'Failed to create automation' }
  }
}

export async function updateAutomation(input: UpdateAutomationInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const automation = await db.automation.update({
      where: {
        id: input.id,
        organizationId: session.activeOrganizationId,
      },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.triggerType && { triggerType: input.triggerType }),
        ...(input.triggerConfig && { triggerConfig: input.triggerConfig as Prisma.InputJsonValue }),
        ...(input.actionType && { actionType: input.actionType }),
        ...(input.actionConfig && { actionConfig: input.actionConfig as Prisma.InputJsonValue }),
        ...(input.status && { status: input.status }),
      },
    })

    revalidatePath('/automations')
    return { success: true, automation }
  } catch (error) {
    console.error('Failed to update automation:', error)
    return { success: false, error: 'Failed to update automation' }
  }
}

export async function toggleAutomationStatus(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const automation = await db.automation.findUnique({
      where: { id, organizationId: session.activeOrganizationId },
    })

    if (!automation) {
      return { success: false, error: 'Automation not found' }
    }

    const newStatus = automation.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'

    await db.automation.update({
      where: { id },
      data: { status: newStatus },
    })

    revalidatePath('/automations')
    return { success: true, status: newStatus }
  } catch (error) {
    console.error('Failed to toggle automation status:', error)
    return { success: false, error: 'Failed to toggle automation status' }
  }
}

export async function deleteAutomation(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.automation.delete({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
    })

    revalidatePath('/automations')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete automation:', error)
    return { success: false, error: 'Failed to delete automation' }
  }
}
