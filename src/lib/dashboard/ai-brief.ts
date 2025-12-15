'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'

export async function generateAIBrief(organizationId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1)

  // Get key metrics
  const [
    newContacts,
    newDeals,
    revenue,
    bookings,
    recentActivities,
    upcomingBookings,
  ] = await Promise.all([
    db.contact.count({
      where: {
        organizationId,
        createdAt: { gte: startOfWeek },
      },
    }),
    db.deal.count({
      where: {
        organizationId,
        createdAt: { gte: startOfWeek },
      },
    }),
    db.deal.aggregate({
      where: {
        organizationId,
        status: 'WON',
        actualCloseDate: { gte: startOfMonth },
      },
      _sum: { value: true },
    }),
    db.booking.count({
      where: {
        organizationId,
        startTime: { gte: startOfWeek },
        status: { not: 'CANCELLED' },
      },
    }),
    db.activity.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        contact: { select: { firstName: true, lastName: true } },
      },
    }),
    db.booking.findMany({
      where: {
        organizationId,
        startTime: { gte: now },
        status: { not: 'CANCELLED' },
      },
      orderBy: { startTime: 'asc' },
      take: 3,
      include: {
        service: { select: { name: true } },
        contact: { select: { firstName: true, lastName: true } },
      },
    }),
  ])

  const revenueValue = Number(revenue._sum.value || 0)

  // Generate brief text
  const brief = [
    `This week, you've added ${newContacts} new contact${newContacts !== 1 ? 's' : ''} and created ${newDeals} new deal${newDeals !== 1 ? 's' : ''}.`,
    revenueValue > 0 && `Your revenue this month is ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(revenueValue)}.`,
    bookings > 0 && `You have ${bookings} booking${bookings !== 1 ? 's' : ''} scheduled this week.`,
    upcomingBookings.length > 0 && `Your next appointment is ${upcomingBookings[0]?.service.name} with ${upcomingBookings[0]?.contact?.firstName || 'a client'} ${upcomingBookings[0]?.startTime ? `on ${new Date(upcomingBookings[0].startTime).toLocaleDateString()}` : ''}.`,
  ].filter(Boolean).join(' ')

  return {
    brief,
    upcomingBookings,
    recentActivities: recentActivities.slice(0, 3),
  }
}

