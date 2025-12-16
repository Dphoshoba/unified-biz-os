'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react'
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks, 
  eachDayOfInterval,
  isSameDay,
  isToday,
  parseISO,
  getDay,
  getHours,
  getMinutes,
} from 'date-fns'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const hours = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

interface CalendarViewProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  bookings: any[]
  loading: boolean
}

export function CalendarView({ currentDate, onDateChange, bookings, loading }: CalendarViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd }).slice(0, 5) // Mon-Fri
  
  const goToPreviousWeek = () => onDateChange(subWeeks(currentDate, 1))
  const goToNextWeek = () => onDateChange(addWeeks(currentDate, 1))
  const goToToday = () => onDateChange(new Date())

  // Convert bookings to calendar format
  const calendarBookings = bookings.map((booking) => {
    const startTime = new Date(booking.startTime)
    const dayIndex = getDay(startTime) - 1 // Convert Sunday=0 to Monday=0
    const hour = getHours(startTime)
    const minute = getMinutes(startTime)
    
    // Find closest hour slot
    const hourIndex = hours.findIndex((h, i) => {
      const slotHour = i + 9 // 9 AM = index 0
      return hour < slotHour || (hour === slotHour && minute < 30)
    }) - 1
    
    return {
      ...booking,
      day: dayIndex >= 0 && dayIndex < 5 ? dayIndex : null,
      startHour: hourIndex >= 0 ? hourIndex : 0,
      duration: Math.ceil((new Date(booking.endTime).getTime() - startTime.getTime()) / (60 * 60 * 1000)),
    }
  }).filter(b => b.day !== null && b.day >= 0 && b.day < 5)

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Calendar"
        description="View and manage your appointments"
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousWeek}
                className="rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                </h2>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextWeek}
                className="rounded-xl"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={goToToday} variant="outline" className="rounded-xl">
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading calendar...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <div className="p-2 text-sm font-medium text-muted-foreground">Time</div>
                  {weekDays.map((day, index) => (
                    <div
                      key={index}
                      className={`p-2 text-center text-sm font-medium ${
                        isToday(day) ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <div>{format(day, 'EEE')}</div>
                      <div className={`text-lg ${isToday(day) ? 'font-bold' : ''}`}>
                        {format(day, 'd')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="space-y-1">
                  {hours.map((hour, hourIndex) => (
                    <div key={hourIndex} className="grid grid-cols-6 gap-2">
                      <div className="p-2 text-xs text-muted-foreground">{hour}</div>
                      {weekDays.map((day, dayIndex) => {
                        const dayBookings = calendarBookings.filter(
                          (b) => b.day === dayIndex && b.startHour === hourIndex
                        )
                        return (
                          <div
                            key={dayIndex}
                            className="min-h-[60px] border border-muted rounded-lg p-1 relative"
                          >
                            {dayBookings.map((booking, idx) => (
                              <div
                                key={booking.id || idx}
                                className="absolute inset-x-1 rounded p-1 text-xs bg-blue-500/20 text-blue-700 border border-blue-500/30 cursor-pointer hover:bg-blue-500/30 transition-colors"
                                style={{
                                  top: `${idx * 60}px`,
                                  height: `${(booking.duration || 1) * 60 - 2}px`,
                                  zIndex: idx + 1,
                                }}
                                title={`${booking.service?.name || 'Appointment'} - ${booking.contact?.firstName || booking.guestName}`}
                              >
                                <div className="font-medium truncate">
                                  {booking.service?.name || 'Appointment'}
                                </div>
                                <div className="text-xs opacity-75 truncate">
                                  {booking.contact?.firstName || booking.guestName}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

