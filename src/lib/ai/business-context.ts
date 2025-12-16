'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'

export interface BusinessContext {
  contacts: number
  deals: number
  revenue: string
  appointments: number
  activeDeals: { name: string; value: number }[]
  upcomingAppointments: { time: string; client: string }[]
  topClients: { name: string; revenue: string }[]
}

/**
 * Fetch business context for AI assistant
 */
export async function getBusinessContext(): Promise<BusinessContext> {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return {
      contacts: 0,
      deals: 0,
      revenue: '$0',
      appointments: 0,
      activeDeals: [],
      upcomingAppointments: [],
      topClients: [],
    }
  }

  try {
    // Fetch contacts count
    const contactsCount = await db.contact.count({
      where: { organizationId: session.activeOrganizationId },
    })

    // Fetch active deals
    const activeDeals = await db.deal.findMany({
      where: {
        organizationId: session.activeOrganizationId,
        status: { not: 'LOST' },
      },
      take: 5,
      orderBy: { value: 'desc' },
      include: {
        contact: true,
      },
    })

    // Fetch upcoming appointments (bookings)
    const upcomingBookings = await db.booking.findMany({
      where: {
        organizationId: session.activeOrganizationId,
        startTime: { gte: new Date() },
      },
      take: 5,
      orderBy: { startTime: 'asc' },
      include: {
        contact: true,
      },
    })

    // Calculate revenue (from invoices)
    const invoices = await db.invoice.findMany({
      where: {
        organizationId: session.activeOrganizationId,
        status: 'PAID',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    })

    const revenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)

    // Get top clients (from invoices)
    const clientRevenue = await db.invoice.groupBy({
      by: ['contactId'],
      where: {
        organizationId: session.activeOrganizationId,
        status: 'PAID',
      },
      _sum: {
        total: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 5,
    })

    const topClientsData = await Promise.all(
      clientRevenue.map(async (item) => {
        if (!item.contactId) return null
        const contact = await db.contact.findUnique({
          where: { id: item.contactId },
        })
        return {
          name: contact 
            ? `${contact.firstName} ${contact.lastName}`.trim() || 'Unknown'
            : 'Unknown',
          revenue: `$${((item._sum.total || 0) / 100).toFixed(2)}`,
        }
      })
    )

    return {
      contacts: contactsCount,
      deals: activeDeals.length,
      revenue: `$${(revenue / 100).toFixed(2)}`,
      appointments: upcomingBookings.length,
      activeDeals: activeDeals.map((deal) => ({
        name: deal.contact 
          ? `${deal.contact.firstName} ${deal.contact.lastName}`.trim() || 'Unnamed Deal'
          : deal.name || 'Unnamed Deal',
        value: typeof deal.value === 'object' && 'toNumber' in deal.value 
          ? deal.value.toNumber() 
          : (typeof deal.value === 'number' ? deal.value : 0),
      })),
      upcomingAppointments: upcomingBookings.map((booking) => ({
        time: booking.startTime.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        client: booking.contact 
          ? `${booking.contact.firstName} ${booking.contact.lastName}`.trim() || 'Unknown'
          : 'Unknown',
      })),
      topClients: topClientsData.filter((c): c is { name: string; revenue: string } => c !== null),
    }
  } catch (error) {
    console.error('Failed to fetch business context:', error)
    return {
      contacts: 0,
      deals: 0,
      revenue: '$0',
      appointments: 0,
      activeDeals: [],
      upcomingAppointments: [],
      topClients: [],
    }
  }
}

