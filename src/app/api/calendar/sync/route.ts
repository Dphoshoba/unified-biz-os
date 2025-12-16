import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { syncBookingToGoogle, getGoogleCalendarEvents } from '@/lib/calendar/google'

export const dynamic = 'force-dynamic'

/**
 * Sync bookings to/from calendar
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { bookingId, direction } = await req.json()

    // Get active calendar integration
    const integration = await db.calendarIntegration.findFirst({
      where: {
        organizationId: session.activeOrganizationId,
        isActive: true,
        syncEnabled: true,
        provider: 'GOOGLE',
      },
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'No active calendar integration found' },
        { status: 400 }
      )
    }

    if (direction === 'to_calendar' && bookingId) {
      // Sync booking to Google Calendar
      const booking = await db.booking.findFirst({
        where: {
          id: bookingId,
          organizationId: session.activeOrganizationId,
        },
        include: {
          service: true,
          contact: true,
        },
      })

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }

      const event = await syncBookingToGoogle(integration.accessToken, {
        title: `${booking.service.name} - ${booking.contact?.firstName || booking.guestName}`,
        startTime: booking.startTime,
        endTime: booking.endTime,
        description: booking.notes || undefined,
        location: booking.location || undefined,
        attendeeEmails: booking.contact?.email ? [booking.contact.email] : [booking.guestEmail],
      })

      return NextResponse.json({
        success: true,
        eventId: event.id,
      })
    } else if (direction === 'from_calendar') {
      // Sync events from Google Calendar
      const now = new Date()
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      const events = await getGoogleCalendarEvents(
        integration.accessToken,
        now,
        nextWeek
      )

      return NextResponse.json({
        success: true,
        events: events.map(event => ({
          id: event.id,
          title: event.summary,
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          location: event.location,
        })),
      })
    }

    return NextResponse.json(
      { error: 'Invalid direction' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync calendar' },
      { status: 500 }
    )
  }
}

