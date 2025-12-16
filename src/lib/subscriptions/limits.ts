import { db } from '@/lib/db'
import { PlanType } from '@prisma/client'

/**
 * Plan limits configuration
 */
export const PLAN_LIMITS: Record<PlanType, {
  maxContacts: number
  maxDeals: number
  maxProjects: number
  maxDocuments: number
  maxAutomations: number
  maxAICredits: number
  maxStorageMB: number
  maxUsers: number
}> = {
  FREE: {
    maxContacts: 50,
    maxDeals: 10,
    maxProjects: 3,
    maxDocuments: 10,
    maxAutomations: 2,
    maxAICredits: 10,
    maxStorageMB: 100,
    maxUsers: 1,
  },
  STARTER: {
    maxContacts: 500,
    maxDeals: 100,
    maxProjects: 50,
    maxDocuments: 200,
    maxAutomations: 10,
    maxAICredits: 50,
    maxStorageMB: 1000,
    maxUsers: 1,
  },
  PRO: {
    maxContacts: 5000,
    maxDeals: 1000,
    maxProjects: 500,
    maxDocuments: 2000,
    maxAutomations: 100,
    maxAICredits: -1, // Unlimited
    maxStorageMB: 10000,
    maxUsers: 5,
  },
  ENTERPRISE: {
    maxContacts: -1, // Unlimited
    maxDeals: -1, // Unlimited
    maxProjects: -1, // Unlimited
    maxDocuments: -1, // Unlimited
    maxAutomations: -1, // Unlimited
    maxAICredits: -1, // Unlimited
    maxStorageMB: -1, // Unlimited
    maxUsers: -1, // Unlimited
  },
}

/**
 * Get subscription for an organization
 */
export async function getSubscription(organizationId: string) {
  let subscription = await db.subscription.findUnique({
    where: { organizationId },
  })

  // Create free subscription if it doesn't exist
  if (!subscription) {
    subscription = await db.subscription.create({
      data: {
        organizationId,
        plan: PlanType.FREE,
        ...PLAN_LIMITS.FREE,
      },
    })
  }

  return subscription
}

/**
 * Check if organization can perform an action based on usage limits
 */
export async function checkUsageLimit(
  organizationId: string,
  resource: 'contacts' | 'deals' | 'projects' | 'documents' | 'automations' | 'aiCredits' | 'storage' | 'users',
  currentCount?: number
): Promise<{ allowed: boolean; limit: number; used: number; remaining: number }> {
  const subscription = await getSubscription(organizationId)
  const plan = subscription.plan

  const limits = PLAN_LIMITS[plan]
  const limitKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}` as keyof typeof limits
  const limit = limits[limitKey]

  // Unlimited plans
  if (limit === -1) {
    return {
      allowed: true,
      limit: -1,
      used: 0,
      remaining: -1,
    }
  }

  // Get current usage
  let used = 0
  if (currentCount !== undefined) {
    used = currentCount
  } else {
    // Count from database
    switch (resource) {
      case 'contacts':
        used = await db.contact.count({ where: { organizationId } })
        break
      case 'deals':
        used = await db.deal.count({ where: { organizationId } })
        break
      case 'projects':
        used = await db.project.count({ where: { organizationId } })
        break
      case 'documents':
        used = await db.document.count({ where: { organizationId } })
        break
      case 'automations':
        used = await db.automation.count({ where: { organizationId } })
        break
      case 'users':
        used = await db.membership.count({ where: { organizationId } })
        break
      case 'aiCredits':
        // AI credits are tracked in the subscription
        used = subscription.aiCreditsUsed
        break
      case 'storage':
        // Storage is tracked in the subscription
        used = subscription.storageUsedMB
        break
    }
  }

  const remaining = limit - used
  const allowed = remaining > 0

  return {
    allowed,
    limit,
    used,
    remaining: Math.max(0, remaining),
  }
}

/**
 * Increment usage counter for a resource
 */
export async function incrementUsage(
  organizationId: string,
  resource: 'contacts' | 'deals' | 'projects' | 'documents' | 'automations' | 'aiCredits' | 'storage',
  amount: number = 1
) {
  const fieldMap: Record<string, string> = {
    contacts: 'contactsUsed',
    deals: 'dealsUsed',
    projects: 'projectsUsed',
    documents: 'documentsUsed',
    automations: 'automationsUsed',
    aiCredits: 'aiCreditsUsed',
    storage: 'storageUsedMB',
  }

  const field = fieldMap[resource]
  if (!field) return

  await db.subscription.update({
    where: { organizationId },
    data: {
      [field]: { increment: amount },
    },
  })
}

/**
 * Decrement usage counter for a resource
 */
export async function decrementUsage(
  organizationId: string,
  resource: 'contacts' | 'deals' | 'projects' | 'documents' | 'automations' | 'aiCredits' | 'storage',
  amount: number = 1
) {
  const fieldMap: Record<string, string> = {
    contacts: 'contactsUsed',
    deals: 'dealsUsed',
    projects: 'projectsUsed',
    documents: 'documentsUsed',
    automations: 'automationsUsed',
    aiCredits: 'aiCreditsUsed',
    storage: 'storageUsedMB',
  }

  const field = fieldMap[resource]
  if (!field) return

  await db.subscription.update({
    where: { organizationId },
    data: {
      [field]: { decrement: amount },
    },
  })
}

/**
 * Reset monthly usage (should be called by a cron job)
 */
export async function resetMonthlyUsage(organizationId: string) {
  await db.subscription.update({
    where: { organizationId },
    data: {
      aiCreditsUsed: 0,
      // Note: contacts, deals, projects, documents, automations are cumulative, not monthly
      // Only AI credits reset monthly
    },
  })
}

