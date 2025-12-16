import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { getBookingsForCalendar } from '@/lib/bookings/bookings'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get('date')
    
    const date = dateParam ? new Date(dateParam) : new Date()
    const bookings = await getBookingsForCalendar(date)

    return NextResponse.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        service: booking.service,
        provider: booking.provider,
        contact: booking.contact,
        guestName: booking.guestName,
        notes: booking.notes,
        location: booking.location,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch calendar bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

