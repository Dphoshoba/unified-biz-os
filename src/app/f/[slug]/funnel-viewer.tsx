'use client'

import { useState } from 'react'
import { CheckCircle, ArrowRight, Mail, Calendar, ShoppingCart, Sparkles, Video, Clock } from 'lucide-react'
import { Funnel, FunnelStep } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

type FunnelWithSteps = Funnel & {
  steps: FunnelStep[]
  organization: {
    id: string
    name: string
    logo: string | null
  }
}

const funnelIcons = {
  LEAD_MAGNET: Mail,
  CONSULTATION: Calendar,
  FREE_TRIAL: Sparkles,
  DIRECT_PURCHASE: ShoppingCart,
  WEBINAR: Video,
  WAITLIST: Clock,
}

interface FunnelViewerProps {
  funnel: FunnelWithSteps
}

export function FunnelViewer({ funnel }: FunnelViewerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const currentStep = funnel.steps[currentStepIndex]
  const isLastStep = currentStepIndex === funnel.steps.length - 1
  const Icon = funnelIcons[funnel.type] || CheckCircle

  const handleNext = () => {
    if (isLastStep) {
      // Handle final submission
      handleSubmit()
    } else {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleSubmit = async () => {
    // TODO: Implement form submission logic
    // This would create a contact, send emails, etc.
    setSubmitted(true)
    
    // Increment conversion count
    await fetch(`/api/funnels/${funnel.id}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
  }

  if (submitted && currentStep.type === 'THANK_YOU') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {currentStep.headline || 'Your submission has been received successfully.'}
            </p>
            {currentStep.subheadline && (
              <p className="text-muted-foreground">{currentStep.subheadline}</p>
            )}
            {currentStep.ctaUrl && (
              <Button asChild className="mt-6">
                <a href={currentStep.ctaUrl}>
                  {currentStep.ctaText || 'Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
      style={{ '--primary': funnel.primaryColor } as React.CSSProperties}
    >
      <div className="container max-w-4xl mx-auto py-12 px-4">
        {/* Organization Header */}
        <div className="text-center mb-10">
          {funnel.organization.logo || funnel.logoUrl ? (
            <img 
              src={funnel.logoUrl || funnel.organization.logo || ''} 
              alt={funnel.organization.name}
              className="h-16 w-16 mx-auto mb-4 rounded-xl"
            />
          ) : (
            <div 
              className="h-16 w-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${funnel.primaryColor}20` }}
            >
              <Icon className="h-8 w-8" style={{ color: funnel.primaryColor }} />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {funnel.organization.name}
          </h1>
        </div>

        {/* Progress Indicator */}
        {funnel.steps.length > 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {funnel.steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentStep.name}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${((currentStepIndex + 1) / funnel.steps.length) * 100}%`,
                  backgroundColor: funnel.primaryColor 
                }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="p-8">
            {currentStep.headline && (
              <h2 className="text-3xl font-bold mb-4 text-center">
                {currentStep.headline}
              </h2>
            )}
            {currentStep.subheadline && (
              <p className="text-xl text-muted-foreground mb-8 text-center">
                {currentStep.subheadline}
              </p>
            )}

            {/* Form Fields */}
            {currentStep.type === 'OPT_IN_FORM' && (
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="text-center mt-8">
              <Button
                onClick={handleNext}
                size="lg"
                className="px-8"
                style={{ backgroundColor: funnel.primaryColor }}
              >
                {isLastStep 
                  ? (currentStep.ctaText || 'Submit')
                  : (currentStep.ctaText || 'Continue')
                }
                {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation Dots */}
        {funnel.steps.length > 1 && (
          <div className="flex justify-center gap-2">
            {funnel.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStepIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStepIndex 
                    ? 'w-8' 
                    : 'w-2'
                }`}
                style={{
                  backgroundColor: index === currentStepIndex 
                    ? funnel.primaryColor 
                    : 'var(--muted)'
                }}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

