'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth-helpers'
import { NotificationType } from '@prisma/client'

// =============================================================================
// TYPES
// =============================================================================

export type NotificationWithDetails = {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  read: boolean
  readAt: Date | null
  createdAt: Date
}

export type CreateNotificationInput = {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
}

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get notifications for the current user
 */
export async function getNotifications(limit = 20): Promise<NotificationWithDetails[]> {
  const session = await requireAuth()

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return notifications
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  const session = await requireAuth()

  const count = await db.notification.count({
    where: {
      userId: session.user.id,
      read: false,
    },
  })

  return count
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a notification for a user
 */
export async function createNotification(input: CreateNotificationInput) {
  const { userId, type, title, message, link } = input

  const notification = await db.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
    },
  })

  return notification
}

/**
 * Create notifications for multiple users
 */
export async function createNotificationsForUsers(
  userIds: string[],
  data: Omit<CreateNotificationInput, 'userId'>
) {
  const notifications = await db.notification.createMany({
    data: userIds.map((userId) => ({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
    })),
  })

  return notifications
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string) {
  const session = await requireAuth()

  await db.notification.updateMany({
    where: {
      id: notificationId,
      userId: session.user.id,
    },
    data: {
      read: true,
      readAt: new Date(),
    },
  })

  revalidatePath('/')
  return { success: true }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead() {
  const session = await requireAuth()

  await db.notification.updateMany({
    where: {
      userId: session.user.id,
      read: false,
    },
    data: {
      read: true,
      readAt: new Date(),
    },
  })

  revalidatePath('/')
  return { success: true }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  const session = await requireAuth()

  await db.notification.deleteMany({
    where: {
      id: notificationId,
      userId: session.user.id,
    },
  })

  revalidatePath('/')
  return { success: true }
}

/**
 * Delete all read notifications
 */
export async function deleteReadNotifications() {
  const session = await requireAuth()

  await db.notification.deleteMany({
    where: {
      userId: session.user.id,
      read: true,
    },
  })

  revalidatePath('/')
  return { success: true }
}

// =============================================================================
// NOTIFICATION HELPERS (for creating notifications from other parts of the app)
// =============================================================================

/**
 * Notify about a new team invitation
 */
export async function notifyTeamInvite(userId: string, organizationName: string, inviterName: string) {
  return createNotification({
    userId,
    type: 'TEAM_INVITE',
    title: 'Team Invitation',
    message: `${inviterName} invited you to join ${organizationName}`,
    link: '/settings/team',
  })
}

/**
 * Notify about a new booking
 */
export async function notifyNewBooking(userId: string, serviceName: string, guestName: string, dateTime: Date) {
  return createNotification({
    userId,
    type: 'BOOKING_NEW',
    title: 'New Booking',
    message: `${guestName} booked ${serviceName} for ${dateTime.toLocaleDateString()}`,
    link: '/bookings/appointments',
  })
}

/**
 * Notify about a cancelled booking
 */
export async function notifyCancelledBooking(userId: string, serviceName: string, guestName: string) {
  return createNotification({
    userId,
    type: 'BOOKING_CANCELLED',
    title: 'Booking Cancelled',
    message: `${guestName} cancelled their ${serviceName} booking`,
    link: '/bookings/appointments',
  })
}

/**
 * Notify about a deal update
 */
export async function notifyDealUpdate(userId: string, dealName: string, update: string) {
  return createNotification({
    userId,
    type: 'DEAL_UPDATE',
    title: 'Deal Update',
    message: `${dealName}: ${update}`,
    link: '/crm/deals',
  })
}

/**
 * Notify about a payment received
 */
export async function notifyPaymentReceived(userId: string, amount: number, currency: string, customerName: string) {
  const formattedAmount = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(amount / 100)

  return createNotification({
    userId,
    type: 'PAYMENT_RECEIVED',
    title: 'Payment Received',
    message: `${customerName} paid ${formattedAmount}`,
    link: '/payments/invoices',
  })
}

