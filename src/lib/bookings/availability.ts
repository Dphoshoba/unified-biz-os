'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'

// =============================================================================
// TYPES
// =============================================================================

export type AvailabilitySlot = {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

// =============================================================================
// QUERIES
// =============================================================================

export async function getUserAvailability(userId?: string) {
  const session = await requireAuthWithOrg()
  const targetUserId = userId || session.user.id

  return db.availability.findMany({
    where: { userId: targetUserId },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  })
}

export async function getProviderAvailability(providerId: string) {
  return db.availability.findMany({
    where: { userId: providerId, isActive: true },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  })
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function setAvailability(
  slots: { dayOfWeek: number; startTime: string; endTime: string }[]
) {
  const session = await requireAuthWithOrg()
  const userId = session.user.id

  // Delete existing availability
  await db.availability.deleteMany({
    where: { userId },
  })

  // Create new availability
  if (slots.length > 0) {
    await db.availability.createMany({
      data: slots.map((slot) => ({
        userId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: true,
      })),
    })
  }

  revalidatePath('/settings/availability')
  return { success: true }
}

export async function createDefaultAvailability(userId: string) {
  // Check if availability already exists
  const existing = await db.availability.findFirst({
    where: { userId },
  })

  if (existing) return

  // Create default 9-5 Mon-Fri availability
  const defaultSlots = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
    userId,
    dayOfWeek,
    startTime: '09:00',
    endTime: '17:00',
    isActive: true,
  }))

  await db.availability.createMany({
    data: defaultSlots,
  })
}

export async function updateAvailabilitySlot(
  id: string,
  data: { startTime?: string; endTime?: string; isActive?: boolean }
) {
  const session = await requireAuthWithOrg()

  const existing = await db.availability.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!existing) {
    throw new Error('Availability slot not found')
  }

  const slot = await db.availability.update({
    where: { id },
    data,
  })

  revalidatePath('/settings/availability')
  return slot
}

export async function deleteAvailabilitySlot(id: string) {
  const session = await requireAuthWithOrg()

  const existing = await db.availability.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!existing) {
    throw new Error('Availability slot not found')
  }

  await db.availability.delete({ where: { id } })
  revalidatePath('/settings/availability')
  return { success: true }
}



