'use client'

import { useState } from 'react'
import { Plus, Users, Target, Sparkles, ShoppingCart, Video, Clock } from 'lucide-react'
import { FunnelType } from '@prisma/client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createFunnel } from '@/lib/funnels/actions'
import { FUNNEL_TEMPLATES } from '@/lib/funnels/utils'

const TEMPLATE_OPTIONS = [
  { 
    value: 'LEAD_MAGNET' as FunnelType, 
    label: 'Lead Magnet', 
    icon: Users, 
    description: 'Capture leads with a free resource',
    color: 'text-blue-600 bg-blue-500/10'
  },
  { 
    value: 'CONSULTATION' as FunnelType, 
    label: 'Consultation Booking', 
    icon: Target, 
    description: 'Book discovery calls',
    color: 'text-emerald-600 bg-emerald-500/10'
  },
  { 
    value: 'FREE_TRIAL' as FunnelType, 
    label: 'Free Trial', 
    icon: Sparkles, 
    description: 'Offer a free trial to convert prospects',
    color: 'text-violet-600 bg-violet-500/10'
  },
  { 
    value: 'DIRECT_PURCHASE' as FunnelType, 
    label: 'Direct Purchase', 
    icon: ShoppingCart, 
    description: 'Sell products or services directly',
    color: 'text-amber-600 bg-amber-500/10'
  },
  { 
    value: 'WEBINAR' as FunnelType, 
    label: 'Webinar Registration', 
    icon: Video, 
    description: 'Register attendees for your webinar',
    color: 'text-rose-600 bg-rose-500/10'
  },
  { 
    value: 'WAITLIST' as FunnelType, 
    label: 'Waitlist', 
    icon: Clock, 
    description: 'Build anticipation with a waitlist',
    color: 'text-cyan-600 bg-cyan-500/10'
  },
] as const

export function CreateFunnelDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'template' | 'details'>('template')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    type: '' as FunnelType | '',
  })

  const resetForm = () => {
    setStep('template')
    setFormData({ name: '', type: '' })
    setError(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) resetForm()
  }

  const selectedTemplate = TEMPLATE_OPTIONS.find(t => t.value === formData.type)
  const templateSteps = formData.type ? FUNNEL_TEMPLATES[formData.type]?.steps : []

  const handleCreate = async () => {
    if (!formData.name || !formData.type) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    const result = await createFunnel({
      name: formData.name,
      type: formData.type as FunnelType,
    })

    setLoading(false)

    if (result.success) {
      handleOpenChange(false)
    } else {
      setError(result.error || 'Failed to create funnel')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Create Funnel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'template' && 'Choose a Template'}
            {step === 'details' && 'Name Your Funnel'}
          </DialogTitle>
          <DialogDescription>
            {step === 'template' && 'Select a template to get started quickly.'}
            {step === 'details' && 'Give your funnel a memorable name.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'template' && (
          <div className="grid gap-3 py-4 sm:grid-cols-2 max-h-[450px] overflow-y-auto">
            {TEMPLATE_OPTIONS.map((template) => {
              const Icon = template.icon
              const steps = FUNNEL_TEMPLATES[template.value]?.steps || []
              return (
                <button
                  key={template.value}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, type: template.value }))
                    setStep('details')
                  }}
                  className={`flex flex-col gap-3 p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                    formData.type === template.value ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${template.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{template.label}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {steps.map((s, i) => (
                      <Badge key={s.name} variant="outline" className="text-[10px] rounded-md">
                        {i + 1}. {s.name}
                      </Badge>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {step === 'details' && (
          <div className="grid gap-4 py-4">
            {selectedTemplate && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${selectedTemplate.color}`}>
                  <selectedTemplate.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{selectedTemplate.label}</div>
                  <div className="text-xs text-muted-foreground">{selectedTemplate.description}</div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {templateSteps.map((s, i) => (
                <Badge key={s.name} variant="secondary" className="rounded-lg">
                  {i + 1}. {s.name}
                </Badge>
              ))}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Funnel Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Free Strategy Guide, Book a Call"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-xl"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
        )}

        <DialogFooter>
          {step !== 'template' && (
            <Button
              variant="outline"
              onClick={() => setStep('template')}
              className="rounded-xl"
            >
              Back
            </Button>
          )}
          {step === 'details' && (
            <Button onClick={handleCreate} disabled={loading} className="rounded-xl">
              {loading ? 'Creating...' : 'Create Funnel'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

