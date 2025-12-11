import Link from 'next/link'
import { Calendar, Clock, Users, ExternalLink, CheckCircle } from 'lucide-react'
import { format, isToday, isTomorrow } from 'date-fns'

import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/dashboard'
import { getServicesCount, getUpcomingBookings, getBookingsStats } from '@/lib/bookings'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

function formatBookingDate(date: Date): string {
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'MMM d')
}

export default async function BookingsPage() {
  const session = await requireAuthWithOrg()
  
  const org = await db.organization.findUnique({
    where: { id: session.activeOrganizationId },
    select: { slug: true },
  })
  
  const [stats, servicesCount, upcomingBookings] = await Promise.all([
    getBookingsStats(),
    getServicesCount(),
    getUpcomingBookings(6),
  ])

  const modules = [
    {
      name: 'Calendar',
      description: 'View and manage all appointments',
      href: '/bookings/calendar',
      icon: Calendar,
      count: `${stats.thisWeek} this week`,
      color: 'text-blue-600',
    },
    {
      name: 'Services',
      description: 'Configure your bookable services',
      href: '/bookings/services',
      icon: Clock,
      count: `${servicesCount} services`,
      color: 'text-violet-600',
    },
    {
      name: 'Appointments',
      description: 'List of all bookings',
      href: '/bookings/appointments',
      icon: Users,
      count: `${stats.total} total`,
      color: 'text-emerald-600',
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Bookings"
        description="Manage your appointments and services."
      >
        <Link href={`/book/${org?.slug}`} target="_blank">
          <Button className="rounded-xl">
            <ExternalLink className="h-4 w-4 mr-2" />
            Booking Page
          </Button>
        </Link>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Today's Bookings"
          value={stats.today}
          icon={Calendar}
          iconColor="text-blue-600"
          change={{ value: 15, label: 'vs yesterday' }}
        />
        <KpiCard
          title="This Week"
          value={stats.thisWeek}
          icon={Clock}
          iconColor="text-violet-600"
          change={{ value: 22.3, label: 'vs last week' }}
        />
        <KpiCard
          title="Pending"
          value={stats.pending}
          icon={Users}
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          iconColor="text-emerald-600"
          change={{ value: 8.5, label: 'vs last month' }}
        />
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-heading font-semibold mb-4">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.name} href={module.href}>
                <Card className="h-full rounded-2xl shadow-card border-border/50 hover:shadow-card-hover hover:border-border transition-all cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-body font-semibold">
                      {module.name}
                    </CardTitle>
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Icon className={`h-5 w-5 ${module.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-display font-bold mb-1">{module.count}</div>
                    <CardDescription className="text-body-sm">{module.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <Card className="rounded-2xl shadow-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-heading">Upcoming Appointments</CardTitle>
          <CardDescription>Your next scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No upcoming appointments</p>
              <p className="text-body-sm text-muted-foreground mt-1">
                Appointments will appear here when clients book with you.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: booking.service.color }}
                    >
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium">{booking.service.name}</h4>
                      <p className="text-body-sm text-muted-foreground">
                        {booking.guestName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-medium">
                        {formatBookingDate(booking.startTime)}
                      </div>
                      <div className="text-body-sm text-muted-foreground">
                        {format(booking.startTime, 'h:mm a')} • {booking.service.durationMinutes} min
                      </div>
                    </div>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-success'
                          : 'bg-warning'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
