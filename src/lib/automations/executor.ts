'use server'

import { db } from '@/lib/db'
import { AutomationTrigger, AutomationStatus } from '@prisma/client'
import { sendEmail } from '@/lib/email'
import { bookingConfirmationTemplate } from '@/lib/email/templates'

/**
 * Trigger automations for a specific trigger type
 */
export async function triggerAutomations(
  organizationId: string,
  triggerType: AutomationTrigger,
  context: Record<string, unknown> = {}
) {
  // Find all active automations for this trigger
  const automations = await db.automation.findMany({
    where: {
      organizationId,
      triggerType,
      status: AutomationStatus.ACTIVE,
    },
  })

  // Execute each automation
  const results = await Promise.allSettled(
    automations.map(async (automation) => {
      try {
        await executeAutomation(automation.id, triggerType, context)
        
        // Update execution count
        await db.automation.update({
          where: { id: automation.id },
          data: {
            executions: { increment: 1 },
            lastRunAt: new Date(),
          },
        })

        return { automationId: automation.id, success: true }
      } catch (error) {
        console.error(`Failed to execute automation ${automation.id}:`, error)
        return { automationId: automation.id, success: false, error }
      }
    })
  )

  return results
}

/**
 * Execute a single automation action
 */
async function executeAutomation(
  automationId: string,
  triggerType: AutomationTrigger,
  context: Record<string, unknown>
) {
  const automation = await db.automation.findUnique({
    where: { id: automationId },
  })

  if (!automation) {
    throw new Error('Automation not found')
  }

  const actionConfig = automation.actionConfig as Record<string, unknown> || {}

  switch (automation.actionType) {
    case 'SEND_EMAIL':
      await executeSendEmail(automation, context, actionConfig)
      break

    case 'ADD_TAG':
      await executeAddTag(automation, context, actionConfig)
      break

    case 'REMOVE_TAG':
      await executeRemoveTag(automation, context, actionConfig)
      break

    case 'UPDATE_CONTACT_STATUS':
      await executeUpdateContactStatus(automation, context, actionConfig)
      break

    case 'CREATE_TASK':
      // TODO: Implement task creation
      console.log('CREATE_TASK not yet implemented')
      break

    case 'SEND_NOTIFICATION':
      // TODO: Implement notification sending
      console.log('SEND_NOTIFICATION not yet implemented')
      break

    case 'WEBHOOK':
      await executeWebhook(automation, triggerType, context, actionConfig)
      break

    case 'DELAY':
      // TODO: Implement delay (would need queue system)
      console.log('DELAY not yet implemented')
      break

    default:
      console.warn(`Unknown action type: ${automation.actionType}`)
  }
}

/**
 * Execute SEND_EMAIL action
 */
async function executeSendEmail(
  automation: { actionConfig: unknown },
  context: Record<string, unknown>,
  actionConfig: Record<string, unknown>
) {
  const to = context.email as string
  const subject = (actionConfig.subject as string) || 'Notification from UnifiedBizOS'
  const body = (actionConfig.body as string) || 'You have a new notification.'

  if (!to) {
    throw new Error('Email address required for SEND_EMAIL action')
  }

  await sendEmail({
    to,
    subject,
    html: body,
    text: body.replace(/<[^>]*>/g, ''), // Strip HTML for text version
  })
}

/**
 * Execute ADD_TAG action
 */
async function executeAddTag(
  automation: { organizationId: string },
  context: Record<string, unknown>,
  actionConfig: Record<string, unknown>
) {
  const contactId = context.contactId as string
  const tagName = (actionConfig.tagName as string) || 'Funnel Lead'

  if (!contactId) {
    throw new Error('Contact ID required for ADD_TAG action')
  }

  // Find or create tag
  let tag = await db.tag.findFirst({
    where: {
      organizationId: automation.organizationId,
      name: tagName,
    },
  })

  if (!tag) {
    tag = await db.tag.create({
      data: {
        organizationId: automation.organizationId,
        name: tagName,
        color: '#3B82F6',
      },
    })
  }

  // Add tag to contact (if not already added)
  await db.tagsOnContacts.upsert({
    where: {
      contactId_tagId: {
        contactId,
        tagId: tag.id,
      },
    },
    create: {
      contactId,
      tagId: tag.id,
    },
    update: {},
  })
}

/**
 * Execute REMOVE_TAG action
 */
async function executeRemoveTag(
  automation: { organizationId: string },
  context: Record<string, unknown>,
  actionConfig: Record<string, unknown>
) {
  const contactId = context.contactId as string
  const tagName = actionConfig.tagName as string

  if (!contactId || !tagName) {
    return // Silently fail if missing data
  }

  const tag = await db.tag.findFirst({
    where: {
      organizationId: automation.organizationId,
      name: tagName,
    },
  })

  if (tag) {
    await db.tagsOnContacts.deleteMany({
      where: {
        contactId,
        tagId: tag.id,
      },
    })
  }
}

/**
 * Execute UPDATE_CONTACT_STATUS action
 */
async function executeUpdateContactStatus(
  automation: unknown,
  context: Record<string, unknown>,
  actionConfig: Record<string, unknown>
) {
  const contactId = context.contactId as string
  const status = actionConfig.status as string

  if (!contactId || !status) {
    return
  }

  await db.contact.update({
    where: { id: contactId },
    data: { status: status as any }, // Type assertion needed
  })
}

/**
 * Execute WEBHOOK action
 */
async function executeWebhook(
  automation: { organizationId: string },
  triggerType: AutomationTrigger,
  context: Record<string, unknown>,
  actionConfig: Record<string, unknown>
) {
  const webhookUrl = actionConfig.url as string

  if (!webhookUrl) {
    throw new Error('Webhook URL required for WEBHOOK action')
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trigger: triggerType,
        data: context,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Webhook execution failed:', error)
    throw error
  }
}

