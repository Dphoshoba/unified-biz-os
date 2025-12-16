'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { revalidatePath } from 'next/cache'
import { CalendarProvider } from '@prisma/client'

export async function getCalendarIntegrations() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  try {
    const integrations = await db.calendarIntegration.findMany({
      where: {
        organizationId: session.activeOrganizationId,
      },
      orderBy: { createdAt: 'desc' },
    })
    return integrations
  } catch (error) {
    console.error('Failed to fetch calendar integrations:', error)
    return []
  }
}

export async function createCalendarIntegration(
  provider: CalendarProvider,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: Date
) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const integration = await db.calendarIntegration.upsert({
      where: {
        organizationId_provider: {
          organizationId: session.activeOrganizationId,
          provider,
        },
      },
      create: {
        organizationId: session.activeOrganizationId,
        provider,
        accessToken,
        refreshToken,
        expiresAt,
      },
      update: {
        accessToken,
        refreshToken,
        expiresAt,
        isActive: true,
      },
    })

    revalidatePath('/settings')
    return { success: true, integration }
  } catch (error) {
    console.error('Failed to create calendar integration:', error)
    return { success: false, error: 'Failed to create calendar integration' }
  }
}

export async function toggleCalendarSync(integrationId: string, enabled: boolean) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.calendarIntegration.updateMany({
      where: {
        id: integrationId,
        organizationId: session.activeOrganizationId,
      },
      data: {
        syncEnabled: enabled,
      },
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle calendar sync:', error)
    return { success: false, error: 'Failed to update sync settings' }
  }
}

export async function deleteCalendarIntegration(integrationId: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.calendarIntegration.deleteMany({
      where: {
        id: integrationId,
        organizationId: session.activeOrganizationId,
      },
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete calendar integration:', error)
    return { success: false, error: 'Failed to delete integration' }
  }
}

