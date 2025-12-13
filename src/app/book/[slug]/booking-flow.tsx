'use client'

import { useState } from 'react'
import { format, addDays, startOfDay, isSameDay } from 'date-fns'
import { 
  Clock, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  User,
  Calendar,
  Loader2
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getAvailableSlots, createPublicBooking } from '@/lib/bookings'

interface BookingFlowProps {
  organization: {
    id: string
    name: string
    slug: string
    logo: string | null
    timezone: string
  }
  services: Array<{
    id: string
    name: string
    description: string | null
    durationMinutes: number
    price: number
    currency: string
    color: string
    providers: Array<{
      id: string
      name: string | null
      image: string | null
    }>
  }>
  preselectedServiceId?: string
  preselectedProviderId?: string
}

type Step = 'service' | 'provider' | 'datetime' | 'details' | 'confirmation'

function formatPrice(price: number, currency: string): string {
  if (price === 0) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function BookingFlow({ 
  organization, 
  services,
  preselectedServiceId,
  preselectedProviderId
}: BookingFlowProps) {
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(
    preselectedServiceId ? services.find(s => s.id === preselectedServiceId) || null : null
  )
  const [selectedProvider, setSelectedProvider] = useState<typeof services[0]['providers'][0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)
  const [availableSlots, setAvailableSlots] = useState<Date[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState<{ id: string } | null>(null)
  
  // Form fields
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [notes, setNotes] = useState('')

  // Date selection state
  const [weekStart, setWeekStart] = useState(startOfDay(new Date()))
  const dates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const handleServiceSelect = (service: typeof services[0]) => {
    setSelectedService(service)
    if (service.providers.length === 1) {
      setSelectedProvider(service.providers[0])
      setStep('datetime')
    } else {
      setStep('provider')
    }
  }

  const handleProviderSelect = (provider: typeof services[0]['providers'][0]) => {
    setSelectedProvider(provider)
    setStep('datetime')
  }

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setLoadingSlots(true)
    
    try {
      const slots = await getAvailableSlots(
        organization.slug,
        selectedService!.id,
        selectedProvider!.id,
        date
      )
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Failed to fetch slots:', error)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time)
    setStep('details')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !selectedProvider || !selectedTime) return
    
    setSubmitting(true)
    
    try {
      const result = await createPublicBooking(organization.slug, {
        serviceId: selectedService.id,
        providerId: selectedProvider.id,
        startTime: selectedTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        guestName,
        guestEmail,
        guestPhone: guestPhone || undefined,
        notes: notes || undefined,
      })
      
      setBooking(result)
      setStep('confirmation')
    } catch (error) {
      console.error('Failed to create booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const goBack = () => {
    switch (step) {
      case 'provider':
        setStep('service')
        break
      case 'datetime':
        if (selectedService?.providers.length === 1) {
          setStep('service')
        } else {
          setStep('provider')
        }
        break
      case 'details':
        setStep('datetime')
        break
    }
  }

  // Render based on current step
  if (step === 'confirmation' && booking) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a confirmation email to {guestEmail}
          </p>
          
          <div className="text-left bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {selectedTime && format(selectedTime, 'EEEE, MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">
                {selectedTime && format(selectedTime, 'h:mm a')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{selectedService?.durationMinutes} minutes</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            Please check your email for further instructions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {['service', 'provider', 'datetime', 'details'].map((s, i) => {
          const steps = ['service', 'provider', 'datetime', 'details']
          const currentIndex = steps.indexOf(step)
          const isCompleted = i < currentIndex
          const isCurrent = s === step
          
          // Skip provider step indicator if only one provider
          if (s === 'provider' && selectedService?.providers.length === 1) return null
          
          return (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-colors ${
                isCompleted ? 'bg-primary' : isCurrent ? 'bg-primary/60' : 'bg-muted'
              }`}
            />
          )
        })}
      </div>

      {/* Back button */}
      {step !== 'service' && step !== 'confirmation' && (
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      )}

      {/* Step: Select Service */}
      {step === 'service' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Choose a Service</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleServiceSelect(service)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div 
                      className="h-4 w-4 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: service.color }}
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      {service.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {service.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                      {formatPrice(service.price, service.currency)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {services.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No services available for booking at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Step: Select Provider */}
      {step === 'provider' && selectedService && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Choose a Provider</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {selectedService.providers.map((provider) => (
              <Card 
                key={provider.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleProviderSelect(provider)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={provider.image || undefined} />
                      <AvatarFallback>
                        {provider.name?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{provider.name || 'Team Member'}</h3>
                      <p className="text-sm text-muted-foreground">Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step: Select Date & Time */}
      {step === 'datetime' && selectedService && selectedProvider && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Select Date & Time</h2>
            <p className="text-muted-foreground text-sm">
              {selectedService.name} with {selectedProvider.name}
            </p>
          </div>

          {/* Date selector */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={() => setWeekStart(addDays(weekStart, -7))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">{format(weekStart, 'MMMM yyyy')}</span>
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={() => setWeekStart(addDays(weekStart, 7))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-7 gap-2">
                {dates.map((date) => {
                  const isSelected = selectedDate && isSameDay(date, selectedDate)
                  const isPast = date < startOfDay(new Date())
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => !isPast && handleDateSelect(date)}
                      disabled={isPast}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : isPast
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="text-xs text-muted-foreground mb-1">
                        {format(date, 'EEE')}
                      </div>
                      <div className="text-lg font-medium">{format(date, 'd')}</div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Time slots */}
          {selectedDate && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Available times on {format(selectedDate, 'EEEE, MMMM d')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No available times on this date. Please select another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.toISOString()}
                        variant="outline"
                        size="sm"
                        onClick={() => handleTimeSelect(slot)}
                        className="w-full"
                      >
                        {format(slot, 'h:mm a')}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Step: Enter Details */}
      {step === 'details' && selectedService && selectedTime && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Your Details</h2>
            <p className="text-muted-foreground text-sm">
              {selectedService.name} on {format(selectedTime, 'EEEE, MMMM d')} at {format(selectedTime, 'h:mm a')}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything you'd like us to know?"
                  />
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service</span>
                    <span>{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{selectedService.durationMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(selectedService.price, selectedService.currency)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={submitting || !guestName || !guestEmail}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}



