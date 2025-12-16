'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

export interface RevenueData {
  date: string
  revenue: number
  deals: number
}

export interface ContactGrowthData {
  date: string
  contacts: number
}

export interface DealPipelineData {
  stage: string
  count: number
  value: number
}

/**
 * Get revenue data for the last 6 months
 */
export async function getRevenueData(): Promise<RevenueData[]> {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  try {
    const data: RevenueData[] = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i))
      const monthEnd = endOfMonth(subMonths(now, i))

      const invoices = await db.invoice.findMany({
        where: {
          organizationId: session.activeOrganizationId,
          status: 'PAID',
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })

      const revenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0) / 100

      const deals = await db.deal.findMany({
        where: {
          organizationId: session.activeOrganizationId,
          status: 'WON',
          actualCloseDate: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })

      data.push({
        date: format(monthStart, 'MMM yyyy'),
        revenue,
        deals: deals.length,
      })
    }

    return data
  } catch (error) {
    console.error('Failed to fetch revenue data:', error)
    return []
  }
}

/**
 * Get contact growth data
 */
export async function getContactGrowthData(): Promise<ContactGrowthData[]> {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  try {
    const data: ContactGrowthData[] = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i))
      const monthEnd = endOfMonth(subMonths(now, i))

      const contacts = await db.contact.count({
        where: {
          organizationId: session.activeOrganizationId,
          createdAt: {
            lte: monthEnd,
          },
        },
      })

      data.push({
        date: format(monthStart, 'MMM yyyy'),
        contacts,
      })
    }

    return data
  } catch (error) {
    console.error('Failed to fetch contact growth data:', error)
    return []
  }
}

/**
 * Get deal pipeline data
 */
export async function getDealPipelineData(): Promise<DealPipelineData[]> {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  try {
    const deals = await db.deal.findMany({
      where: {
        organizationId: session.activeOrganizationId,
        status: { not: 'LOST' },
      },
      include: {
        stage: true,
      },
    })

    const stageMap = new Map<string, { count: number; value: number }>()

    deals.forEach((deal) => {
      const stageName = deal.stage.name
      const current = stageMap.get(stageName) || { count: 0, value: 0 }
      const dealValue = typeof deal.value === 'object' && 'toNumber' in deal.value
        ? deal.value.toNumber()
        : (typeof deal.value === 'number' ? deal.value : 0)

      stageMap.set(stageName, {
        count: current.count + 1,
        value: current.value + dealValue,
      })
    })

    return Array.from(stageMap.entries()).map(([stage, data]) => ({
      stage,
      count: data.count,
      value: data.value,
    }))
  } catch (error) {
    console.error('Failed to fetch deal pipeline data:', error)
    return []
  }
}

/**
 * Get top performing metrics
 */
export async function getTopMetrics() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return {
      totalRevenue: 0,
      activeDeals: 0,
      totalContacts: 0,
      conversionRate: 0,
    }
  }

  try {
    const [invoices, deals, contacts, wonDeals] = await Promise.all([
      db.invoice.findMany({
        where: {
          organizationId: session.activeOrganizationId,
          status: 'PAID',
        },
      }),
      db.deal.findMany({
        where: {
          organizationId: session.activeOrganizationId,
          status: { not: 'LOST' },
        },
      }),
      db.contact.count({
        where: {
          organizationId: session.activeOrganizationId,
        },
      }),
      db.deal.findMany({
        where: {
          organizationId: session.activeOrganizationId,
          status: 'WON',
        },
      }),
    ])

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0) / 100
    const totalDeals = deals.length + wonDeals.length
    const conversionRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0

    return {
      totalRevenue,
      activeDeals: deals.length,
      totalContacts: contacts,
      conversionRate: Math.round(conversionRate * 10) / 10,
    }
  } catch (error) {
    console.error('Failed to fetch top metrics:', error)
    return {
      totalRevenue: 0,
      activeDeals: 0,
      totalContacts: 0,
      conversionRate: 0,
    }
  }
}

