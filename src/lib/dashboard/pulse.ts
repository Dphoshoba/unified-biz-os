'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'

export type PulseEvent = {
  id: string
  type: 'invoice_paid' | 'new_lead' | 'deal_won' | 'booking_confirmed' | 'payment_received' | 'document_signed'
  title: string
  description: string
  timestamp: Date
  link?: string
}

export async function getPulseEvents(organizationId: string, limit = 10): Promise<PulseEvent[]> {
  const events: PulseEvent[] = []

  // Get recent invoices paid
  const paidInvoices = await db.invoice.findMany({
    where: {
      organizationId,
      status: 'PAID',
      paidAt: { not: null },
    },
    orderBy: { paidAt: 'desc' },
    take: 5,
    include: {
      contact: { select: { firstName: true, lastName: true } },
    },
  })

  paidInvoices.forEach(invoice => {
    events.push({
      id: `invoice-${invoice.id}`,
      type: 'invoice_paid',
      title: 'Invoice Paid',
      description: `${invoice.contact.firstName} ${invoice.contact.lastName} paid invoice ${invoice.invoiceNumber}`,
      timestamp: invoice.paidAt!,
      link: `/payments/invoices`,
    })
  })

  // Get recent contacts (leads)
  const newLeads = await db.contact.findMany({
    where: {
      organizationId,
      status: 'LEAD',
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  newLeads.forEach(contact => {
    events.push({
      id: `lead-${contact.id}`,
      type: 'new_lead',
      title: 'New Lead',
      description: `${contact.firstName} ${contact.lastName} was added as a lead`,
      timestamp: contact.createdAt,
      link: `/crm/contacts`,
    })
  })

  // Get deals won
  const dealsWon = await db.deal.findMany({
    where: {
      organizationId,
      status: 'WON',
      actualCloseDate: { not: null },
    },
    orderBy: { actualCloseDate: 'desc' },
    take: 5,
    include: {
      contact: { select: { firstName: true, lastName: true } },
    },
  })

  dealsWon.forEach(deal => {
    events.push({
      id: `deal-${deal.id}`,
      type: 'deal_won',
      title: 'Deal Won',
      description: `Won deal "${deal.name}"${deal.contact ? ` with ${deal.contact.firstName} ${deal.contact.lastName}` : ''}`,
      timestamp: deal.actualCloseDate!,
      link: `/crm/deals`,
    })
  })

  // Get confirmed bookings
  const confirmedBookings = await db.booking.findMany({
    where: {
      organizationId,
      status: 'CONFIRMED',
      updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      service: { select: { name: true } },
      contact: { select: { firstName: true, lastName: true } },
    },
  })

  confirmedBookings.forEach(booking => {
    events.push({
      id: `booking-${booking.id}`,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      description: `${booking.service.name} with ${booking.contact?.firstName || booking.guestName} confirmed`,
      timestamp: booking.updatedAt,
      link: `/bookings`,
    })
  })

  // Sort by timestamp and return most recent
  return events
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

