'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth/session'
import { AutomationTrigger, AutomationAction, AutomationStatus } from '@prisma/client'

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
  const session = await getServerSession()
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
  const session = await getServerSession()
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
  const session = await getServerSession()
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
        triggerConfig: input.triggerConfig,
        actionType: input.actionType,
        actionConfig: input.actionConfig,
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
  const session = await getServerSession()
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
        ...(input.triggerConfig && { triggerConfig: input.triggerConfig }),
        ...(input.actionType && { actionType: input.actionType }),
        ...(input.actionConfig && { actionConfig: input.actionConfig }),
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
  const session = await getServerSession()
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
  const session = await getServerSession()
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

// Helper to format trigger type for display
export function formatTriggerType(trigger: AutomationTrigger): string {
  const labels: Record<AutomationTrigger, string> = {
    CONTACT_CREATED: 'New contact created',
    CONTACT_TAG_ADDED: 'Tag added to contact',
    DEAL_CREATED: 'New deal created',
    DEAL_STAGE_CHANGED: 'Deal stage changed',
    DEAL_WON: 'Deal won',
    DEAL_LOST: 'Deal lost',
    BOOKING_CREATED: 'New booking created',
    BOOKING_CONFIRMED: 'Booking confirmed',
    BOOKING_CANCELLED: 'Booking cancelled',
    PAYMENT_RECEIVED: 'Payment received',
    FORM_SUBMITTED: 'Form submitted',
  }
  return labels[trigger] || trigger
}

// Helper to format action type for display
export function formatActionType(action: AutomationAction): string {
  const labels: Record<AutomationAction, string> = {
    SEND_EMAIL: 'Send email',
    ADD_TAG: 'Add tag',
    REMOVE_TAG: 'Remove tag',
    UPDATE_CONTACT_STATUS: 'Update contact status',
    CREATE_TASK: 'Create task',
    SEND_NOTIFICATION: 'Send notification',
    WEBHOOK: 'Call webhook',
    DELAY: 'Wait/Delay',
  }
  return labels[action] || action
}

