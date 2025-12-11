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
  parseISO 
} from 'date-fns'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Note: In a real implementation, this would fetch from the server
// For now, keeping the client component with static demo data
// The getBookingsForCalendar function can be used in a server component wrapper

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

const colorClasses = [
  'bg-blue-500/20 text-blue-700 border-blue-500/30',
  'bg-purple-500/20 text-purple-700 border-purple-500/30',
  'bg-green-500/20 text-green-700 border-green-500/30',
  'bg-orange-500/20 text-orange-700 border-orange-500/30',
  'bg-pink-500/20 text-pink-700 border-pink-500/30',
  'bg-cyan-500/20 text-cyan-700 border-cyan-500/30',
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd }).slice(0, 5) // Mon-Fri
  
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  // Demo appointments - in production, these would come from the database
  const demoAppointments = [
    {
      id: '1',
      title: 'Strategy Call',
      client: 'Sarah J.',
      day: 0,
      startHour: 1,
      duration: 1,
    },
    {
      id: '2',
      title: 'Discovery Call',
      client: 'Michael C.',
      day: 0,
      startHour: 4,
      duration: 1,
    },
    {
      id: '3',
      title: 'Coaching Session',
      client: 'Emily D.',
      day: 1,
      startHour: 1,
      duration: 1,
    },
    {
      id: '4',
      title: 'Team Workshop',
      client: 'Acme Corp',
      day: 2,
      startHour: 0,
      duration: 2,
    },
    {
      id: '5',
      title: 'Consultation',
      client: 'James W.',
      day: 3,
      startHour: 3,
      duration: 1,
    },
    {
      id: '6',
      title: 'Follow-up Call',
      client: 'Lisa A.',
      day: 4,
      startHour: 2,
      duration: 1,
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Calendar" description="View and manage your appointments.">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon-sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">
              {format(weekStart, 'MMMM yyyy')}
            </CardTitle>
            <Button variant="outline" size="icon-sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm">
              Week
            </Button>
            <Button variant="secondary" size="sm">
              Day
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* Header */}
            <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b">
              <div className="p-3 text-center text-xs font-medium text-muted-foreground">
                Time
              </div>
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className="p-3 text-center border-l"
                >
                  <div className="text-xs text-muted-foreground">
                    {format(day, 'EEE')}
                  </div>
                  <div
                    className={`text-lg font-semibold mt-1 ${
                      isToday(day) ? 'text-primary' : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-[80px_repeat(5,1fr)]">
              {/* Time column */}
              <div className="border-r">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-20 border-b px-2 py-1 text-right text-xs text-muted-foreground"
                  >
                    {hour}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((day, dayIndex) => (
                <div key={day.toISOString()} className="relative border-l">
                  {hours.map((_, hourIndex) => (
                    <div
                      key={hourIndex}
                      className={`h-20 border-b hover:bg-accent/30 transition-colors cursor-pointer ${
                        isToday(day) ? 'bg-primary/5' : ''
                      }`}
                    />
                  ))}

                  {/* Appointments */}
                  {demoAppointments
                    .filter((apt) => apt.day === dayIndex)
                    .map((apt, index) => (
                      <div
                        key={apt.id}
                        className={`absolute left-1 right-1 rounded-md border p-2 cursor-pointer transition-all hover:shadow-md ${colorClasses[index % colorClasses.length]}`}
                        style={{
                          top: `${apt.startHour * 80 + 4}px`,
                          height: `${apt.duration * 80 - 8}px`,
                        }}
                      >
                        <div className="text-xs font-medium truncate">
                          {apt.title}
                        </div>
                        <div className="text-xs opacity-80 truncate">
                          {apt.client}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state hint */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <CalendarIcon className="h-5 w-5 inline mr-2" />
        Click on any time slot to create a new appointment
      </div>
    </div>
  )
}
