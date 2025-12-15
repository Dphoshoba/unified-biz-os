'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { AutomationTrigger, AutomationAction, AutomationStatus } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'

export type CreateAutomationInput = {
  name: string
  description?: string
  triggerType: AutomationTrigger
  triggerConfig?: JsonObject
  actionType: AutomationAction
  actionConfig?: JsonObject
}

export type UpdateAutomationInput = {
  id: string
  name?: string
  description?: string
  triggerType?: AutomationTrigger
  triggerConfig?: JsonObject
  actionType?: AutomationAction
  actionConfig?: JsonObject
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
    orderBy: { createdAt: 'desc' },
  })

  return automations
}

export async function getAutomation(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return null
  }

  const automation = await db.automation.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
  })

  return automation
}

export async function getAutomationStats() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { total: 0, active: 0, executions: 0 }
  }

  const [total, active, executions] = await Promise.all([
    db.automation.count({
      where: { organizationId: session.activeOrganizationId },
    }),
    db.automation.count({
      where: {
        organizationId: session.activeOrganizationId,
        status: 'ACTIVE',
      },
    }),
    db.automation.aggregate({
      where: { organizationId: session.activeOrganizationId },
      _sum: { executions: true },
    }),
  ])

  return {
    total,
    active,
    executions: executions._sum.executions || 0,
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
        triggerConfig: (input.triggerConfig || {}) as JsonObject,
        actionType: input.actionType,
        actionConfig: (input.actionConfig || {}) as JsonObject,
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
        ...(input.triggerConfig !== undefined && { triggerConfig: input.triggerConfig as JsonObject }),
        ...(input.actionType && { actionType: input.actionType }),
        ...(input.actionConfig !== undefined && { actionConfig: input.actionConfig as JsonObject }),
        ...(input.status && { status: input.status }),
      },
    })

    revalidatePath('/automations')
    revalidatePath(`/automations/${input.id}`)
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
    const automation = await db.automation.findFirst({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
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
