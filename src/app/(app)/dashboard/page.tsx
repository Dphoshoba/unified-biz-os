import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  UserPlus,
  FileText,
  Mail,
  Phone,
  CheckCircle,
  Download,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiCard, ActivityItem } from '@/components/dashboard'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

// Get dashboard data
async function getDashboardData(organizationId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1)
  const startOfLastWeek = new Date(startOfWeek)
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)
  const endOfLastWeek = new Date(startOfWeek)
  endOfLastWeek.setDate(endOfLastWeek.getDate() - 1)

  // Parallel queries for better performance
  const [
    totalContacts,
    contactsLastMonth,
    revenueThisMonth,
    revenueLastMonth,
    bookingsThisWeek,
    bookingsLastWeek,
    dealsWon,
    dealsTotal,
    recentActivities,
  ] = await Promise.all([
    // Total contacts
    db.contact.count({
      where: { organizationId },
    }),
    // Contacts last month
    db.contact.count({
      where: {
        organizationId,
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
    // Revenue this month (won deals)
    db.deal.aggregate({
      where: {
        organizationId,
        status: 'WON',
        actualCloseDate: { gte: startOfMonth },
      },
      _sum: { value: true },
    }),
    // Revenue last month
    db.deal.aggregate({
      where: {
        organizationId,
        status: 'WON',
        actualCloseDate: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { value: true },
    }),
    // Bookings this week
    db.booking.count({
      where: {
        organizationId,
        startTime: { gte: startOfWeek },
        status: { not: 'CANCELLED' },
      },
    }),
    // Bookings last week
    db.booking.count({
      where: {
        organizationId,
        startTime: { gte: startOfLastWeek, lte: endOfLastWeek },
        status: { not: 'CANCELLED' },
      },
    }),
    // Deals won this month
    db.deal.count({
      where: {
        organizationId,
        status: 'WON',
        actualCloseDate: { gte: startOfMonth },
      },
    }),
    // Total deals this month
    db.deal.count({
      where: {
        organizationId,
        createdAt: { gte: startOfMonth },
      },
    }),
    // Recent activities
    db.activity.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        contact: { select: { firstName: true, lastName: true } },
        deal: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    }),
  ])

  // Calculate changes
  const contactsThisMonth = await db.contact.count({
    where: {
      organizationId,
      createdAt: { gte: startOfMonth },
    },
  })

  const contactChange = contactsLastMonth > 0 
    ? ((contactsThisMonth - contactsLastMonth) / contactsLastMonth) * 100 
    : 0

  const revenueNow = Number(revenueThisMonth._sum.value || 0)
  const revenueLast = Number(revenueLastMonth._sum.value || 0)
  const revenueChange = revenueLast > 0 
    ? ((revenueNow - revenueLast) / revenueLast) * 100 
    : 0

  const bookingsChange = bookingsLastWeek > 0 
    ? ((bookingsThisWeek - bookingsLastWeek) / bookingsLastWeek) * 100 
    : 0

  const conversionRate = dealsTotal > 0 ? (dealsWon / dealsTotal) * 100 : 0

  return {
    totalContacts,
    contactChange: Math.round(contactChange * 10) / 10,
    revenue: revenueNow,
    revenueChange: Math.round(revenueChange * 10) / 10,
    bookingsThisWeek,
    bookingsChange: Math.round(bookingsChange * 10) / 10,
    conversionRate: Math.round(conversionRate * 10) / 10,
    recentActivities,
  }
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'NOTE':
      return FileText
    case 'CALL':
      return Phone
    case 'EMAIL':
      return Mail
    case 'MEETING':
      return Calendar
    case 'TASK':
      return CheckCircle
    default:
      return UserPlus
  }
}

function formatActivityTitle(activity: {
  type: string
  title: string
  contact?: { firstName: string; lastName: string } | null
}) {
  if (activity.contact) {
    return `${activity.title} - ${activity.contact.firstName} ${activity.contact.lastName}`
  }
  return activity.title
}

export default async function DashboardPage() {
  const session = await requireAuthWithOrg()
  const data = await getDashboardData(session.activeOrganizationId)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-foreground">Dashboard</h1>
          <p className="text-body text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <ComingSoonButton featureName="Download Report" className="w-fit rounded-xl">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </ComingSoonButton>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Contacts"
          value={data.totalContacts.toLocaleString()}
          icon={Users}
          iconColor="text-blue-600"
          change={{
            value: data.contactChange,
            label: 'vs last month',
          }}
        />
        <KpiCard
          title="Revenue (MTD)"
          value={formatCurrency(data.revenue)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          change={{
            value: data.revenueChange,
            label: 'vs last month',
          }}
        />
        <KpiCard
          title="Bookings This Week"
          value={data.bookingsThisWeek}
          icon={Calendar}
          iconColor="text-violet-600"
          change={{
            value: data.bookingsChange,
            label: 'vs last week',
          }}
        />
        <KpiCard
          title="Conversion Rate"
          value={`${data.conversionRate}%`}
          icon={TrendingUp}
          iconColor="text-amber-600"
          change={{
            value: 5.2,
            label: 'vs last month',
          }}
        />
      </div>

      {/* Recent Activity */}
      <Card className="rounded-2xl shadow-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-heading">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {data.recentActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground mt-1">
                Activities will appear here as you use the CRM.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {data.recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <ActivityItem
                    key={activity.id}
                    title={formatActivityTitle(activity)}
                    description={
                      activity.description || 
                      `${activity.type.toLowerCase()} by ${activity.createdBy.name}`
                    }
                    timestamp={formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                    icon={Icon}
                  />
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
