'use client'

import { useState, useEffect } from 'react'
import { getBookingsForCalendar } from '@/lib/bookings/bookings'
import { CalendarView } from './calendar-view'

export function CalendarPageWrapper() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [currentDate])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/bookings/calendar?date=${currentDate.toISOString()}`)
      const data = await response.json()
      if (data.success) {
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CalendarView
      currentDate={currentDate}
      onDateChange={setCurrentDate}
      bookings={bookings}
      loading={loading}
    />
  )
}

