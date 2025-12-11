'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { BookingStatus } from '@prisma/client'
import { addMinutes, startOfDay, endOfDay, startOfWeek, endOfWeek, format } from 'date-fns'

// =============================================================================
// TYPES
// =============================================================================

export type BookingWithRelations = Awaited<ReturnType<typeof getBookings>>[number]

export type CreateBookingInput = {
  serviceId: string
  providerId: string
  startTime: Date
  timezone?: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  notes?: string
  customResponses?: Record<string, unknown>
  contactId?: string
}

export type UpdateBookingInput = {
  status?: BookingStatus
  startTime?: Date
  notes?: string
  internalNotes?: string
  meetingUrl?: string
  location?: string
}

// =============================================================================
// QUERIES
// =============================================================================

export async function getBookings(options?: {
  status?: BookingStatus
  providerId?: string
  serviceId?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const session = await requireAuthWithOrg()
  const {
    status,
    providerId,
    serviceId,
    startDate,
    endDate,
    limit = 50,
    offset = 0,
  } = options || {}

  return db.booking.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(status && { status }),
      ...(providerId && { providerId }),
      ...(serviceId && { serviceId }),
      ...(startDate && endDate && {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      }),
    },
    include: {
      service: {
        select: { id: true, name: true, durationMinutes: true, color: true },
      },
      provider: {
        select: { id: true, name: true, email: true, image: true },
      },
      contact: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { startTime: 'asc' },
    take: limit,
    skip: offset,
  })
}

export async function getBooking(id: string) {
  const session = await requireAuthWithOrg()

  return db.booking.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      service: true,
      provider: {
        select: { id: true, name: true, email: true, image: true },
      },
      contact: true,
    },
  })
}

export async function getUpcomingBookings(limit = 10) {
  const session = await requireAuthWithOrg()

  return db.booking.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      startTime: { gte: new Date() },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    include: {
      service: {
        select: { id: true, name: true, durationMinutes: true, color: true },
      },
      provider: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { startTime: 'asc' },
    take: limit,
  })
}

export async function getBookingsForCalendar(date: Date) {
  const session = await requireAuthWithOrg()
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })

  return db.booking.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      startTime: { gte: weekStart, lte: weekEnd },
      status: { not: 'CANCELLED' },
    },
    include: {
      service: {
        select: { id: true, name: true, color: true },
      },
      provider: {
        select: { id: true, name: true },
      },
    },
    orderBy: { startTime: 'asc' },
  })
}

export async function getBookingsStats() {
  const session = await requireAuthWithOrg()
  const now = new Date()
  const startOfToday = startOfDay(now)
  const endOfToday = endOfDay(now)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const [total, thisWeek, today, pending, completed] = await Promise.all([
    db.booking.count({
      where: { organizationId: session.activeOrganizationId },
    }),
    db.booking.count({
      where: {
        organizationId: session.activeOrganizationId,
        startTime: { gte: weekStart, lte: weekEnd },
      },
    }),
    db.booking.count({
      where: {
        organizationId: session.activeOrganizationId,
        startTime: { gte: startOfToday, lte: endOfToday },
      },
    }),
    db.booking.count({
      where: {
        organizationId: session.activeOrganizationId,
        status: 'PENDING',
      },
    }),
    db.booking.count({
      where: {
        organizationId: session.activeOrganizationId,
        status: 'COMPLETED',
      },
    }),
  ])

  return { total, thisWeek, today, pending, completed }
}

// =============================================================================
// PUBLIC BOOKING FUNCTIONS
// =============================================================================

export async function getAvailableSlots(
  orgSlug: string,
  serviceId: string,
  providerId: string,
  date: Date
) {
  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
  })

  if (!org) return []

  const service = await db.service.findFirst({
    where: { id: serviceId, organizationId: org.id, isActive: true },
  })

  if (!service) return []

  // Get provider's availability for this day
  const dayOfWeek = date.getDay()
  const availability = await db.availability.findFirst({
    where: { userId: providerId, dayOfWeek, isActive: true },
  })

  if (!availability) return []

  // Get existing bookings for this day
  const dayStart = startOfDay(date)
  const dayEnd = endOfDay(date)

  const existingBookings = await db.booking.findMany({
    where: {
      providerId,
      status: { not: 'CANCELLED' },
      startTime: { gte: dayStart, lte: dayEnd },
    },
    select: { startTime: true, endTime: true },
  })

  // Generate available slots
  const slots: { time: Date; available: boolean }[] = []
  const [startHour, startMin] = availability.startTime.split(':').map(Number)
  const [endHour, endMin] = availability.endTime.split(':').map(Number)

  let slotTime = new Date(date)
  slotTime.setHours(startHour, startMin, 0, 0)

  const endTime = new Date(date)
  endTime.setHours(endHour, endMin, 0, 0)

  const slotDuration = service.durationMinutes + service.bufferBefore + service.bufferAfter

  while (slotTime < endTime) {
    const slotEnd = addMinutes(slotTime, service.durationMinutes)

    // Check if slot conflicts with existing bookings
    const isConflict = existingBookings.some((booking) => {
      return slotTime < booking.endTime && slotEnd > booking.startTime
    })

    // Check minimum notice
    const minNotice = addMinutes(new Date(), service.minNoticeMins)
    const isValidNotice = slotTime >= minNotice

    slots.push({
      time: new Date(slotTime),
      available: !isConflict && isValidNotice,
    })

    slotTime = addMinutes(slotTime, 30) // 30-minute intervals
  }

  return slots.filter((s) => s.available).map((s) => s.time)
}

export async function createPublicBooking(
  orgSlug: string,
  input: CreateBookingInput
) {
  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
  })

  if (!org) {
    throw new Error('Organization not found')
  }

  const service = await db.service.findFirst({
    where: { id: input.serviceId, organizationId: org.id, isActive: true },
  })

  if (!service) {
    throw new Error('Service not found')
  }

  // Calculate end time
  const endTime = addMinutes(input.startTime, service.durationMinutes)

  // Check for conflicts
  const conflict = await db.booking.findFirst({
    where: {
      providerId: input.providerId,
      status: { not: 'CANCELLED' },
      OR: [
        {
          startTime: { lte: input.startTime },
          endTime: { gt: input.startTime },
        },
        {
          startTime: { lt: endTime },
          endTime: { gte: endTime },
        },
      ],
    },
  })

  if (conflict) {
    throw new Error('This time slot is no longer available')
  }

  // Create or find contact
  let contactId = input.contactId
  if (!contactId && input.guestEmail) {
    const existingContact = await db.contact.findFirst({
      where: {
        organizationId: org.id,
        email: input.guestEmail.toLowerCase(),
      },
    })

    if (existingContact) {
      contactId = existingContact.id
    } else {
      const nameParts = input.guestName.split(' ')
      const newContact = await db.contact.create({
        data: {
          organizationId: org.id,
          firstName: nameParts[0] || input.guestName,
          lastName: nameParts.slice(1).join(' ') || '',
          email: input.guestEmail.toLowerCase(),
          phone: input.guestPhone,
          status: 'LEAD',
          source: 'booking',
        },
      })
      contactId = newContact.id
    }
  }

  const booking = await db.booking.create({
    data: {
      organizationId: org.id,
      serviceId: input.serviceId,
      providerId: input.providerId,
      contactId,
      startTime: input.startTime,
      endTime,
      timezone: input.timezone || 'UTC',
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      notes: input.notes,
      customResponses: input.customResponses as object | undefined,
      status: 'PENDING',
    },
    include: {
      service: { select: { name: true, durationMinutes: true } },
      provider: { select: { name: true, email: true } },
    },
  })

  return booking
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function updateBooking(id: string, input: UpdateBookingInput) {
  const session = await requireAuthWithOrg()

  const existing = await db.booking.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
    include: { service: true },
  })

  if (!existing) {
    throw new Error('Booking not found')
  }

  let endTime = existing.endTime
  if (input.startTime) {
    endTime = addMinutes(input.startTime, existing.service.durationMinutes)
  }

  const booking = await db.booking.update({
    where: { id },
    data: {
      ...input,
      ...(input.startTime && { endTime }),
    },
    include: {
      service: { select: { id: true, name: true, durationMinutes: true } },
      provider: { select: { id: true, name: true, email: true } },
    },
  })

  revalidatePath('/bookings')
  revalidatePath('/bookings/appointments')
  revalidatePath('/bookings/calendar')
  return booking
}

export async function confirmBooking(id: string) {
  return updateBooking(id, { status: 'CONFIRMED' })
}

export async function cancelBooking(id: string, reason?: string) {
  const session = await requireAuthWithOrg()

  const existing = await db.booking.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Booking not found')
  }

  const booking = await db.booking.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
      cancelReason: reason,
      cancelledBy: 'provider',
    },
  })

  revalidatePath('/bookings')
  revalidatePath('/bookings/appointments')
  revalidatePath('/bookings/calendar')
  return booking
}

export async function completeBooking(id: string) {
  return updateBooking(id, { status: 'COMPLETED' })
}

export async function markNoShow(id: string) {
  return updateBooking(id, { status: 'NO_SHOW' })
}

