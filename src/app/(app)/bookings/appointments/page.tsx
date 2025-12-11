import Link from 'next/link'
import { Search, Filter, MoreHorizontal, Calendar, Download } from 'lucide-react'
import { format } from 'date-fns'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { getBookings } from '@/lib/bookings'

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'secondary' | 'destructive'> = {
  PENDING: 'warning',
  CONFIRMED: 'default',
  COMPLETED: 'success',
  CANCELLED: 'secondary',
  NO_SHOW: 'destructive',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
}

export default async function AppointmentsPage() {
  const bookings = await getBookings({ limit: 50 })

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Appointments"
        description="View and manage all your bookings."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/bookings/calendar">
            <Button className="rounded-xl">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* Filters */}
      <Card className="rounded-2xl shadow-card border-border/50">
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-10 max-w-md rounded-xl"
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="rounded-2xl shadow-card border-border/50">
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-heading-sm font-medium mb-2">No appointments yet</h3>
              <p className="text-muted-foreground">
                Appointments will appear here when clients book with you.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-caption font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-caption">
                              {booking.guestName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-body">{booking.guestName}</div>
                            <div className="text-caption text-muted-foreground">
                              {booking.guestEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: booking.service.color }}
                          />
                          <span className="text-body">{booking.service.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body">
                        {booking.provider.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-body">
                          {format(booking.startTime, 'MMM d, yyyy')}
                        </div>
                        <div className="text-caption text-muted-foreground">
                          {format(booking.startTime, 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body">
                        {booking.service.durationMinutes} min
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariants[booking.status]}>
                          {statusLabels[booking.status]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
