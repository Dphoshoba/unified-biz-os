'use client'

import { useState } from 'react'
import { Plus, Zap, Mail, Tag, Bell, Webhook, Clock, UserPlus, ShoppingCart, Calendar, FileText } from 'lucide-react'
import { AutomationTrigger, AutomationAction } from '@prisma/client'

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
import { Textarea } from '@/components/ui/textarea'
import { createAutomation } from '@/lib/automations/actions'

const TRIGGERS = [
  { value: 'CONTACT_CREATED', label: 'New contact created', icon: UserPlus, description: 'When a new contact is added' },
  { value: 'CONTACT_TAG_ADDED', label: 'Tag added to contact', icon: Tag, description: 'When a tag is applied to a contact' },
  { value: 'DEAL_CREATED', label: 'New deal created', icon: Zap, description: 'When a new deal is created' },
  { value: 'DEAL_STAGE_CHANGED', label: 'Deal stage changed', icon: Zap, description: 'When a deal moves to a different stage' },
  { value: 'DEAL_WON', label: 'Deal won', icon: Zap, description: 'When a deal is marked as won' },
  { value: 'BOOKING_CREATED', label: 'New booking', icon: Calendar, description: 'When a new booking is made' },
  { value: 'BOOKING_CONFIRMED', label: 'Booking confirmed', icon: Calendar, description: 'When a booking is confirmed' },
  { value: 'PAYMENT_RECEIVED', label: 'Payment received', icon: ShoppingCart, description: 'When a payment is completed' },
  { value: 'FORM_SUBMITTED', label: 'Form submitted', icon: FileText, description: 'When a form submission is received' },
] as const

const ACTIONS = [
  { value: 'SEND_EMAIL', label: 'Send email', icon: Mail, description: 'Send an automated email' },
  { value: 'ADD_TAG', label: 'Add tag', icon: Tag, description: 'Add a tag to the contact' },
  { value: 'REMOVE_TAG', label: 'Remove tag', icon: Tag, description: 'Remove a tag from the contact' },
  { value: 'SEND_NOTIFICATION', label: 'Send notification', icon: Bell, description: 'Send an in-app notification' },
  { value: 'CREATE_TASK', label: 'Create task', icon: FileText, description: 'Create a follow-up task' },
  { value: 'WEBHOOK', label: 'Call webhook', icon: Webhook, description: 'Send data to an external URL' },
  { value: 'DELAY', label: 'Wait/Delay', icon: Clock, description: 'Wait before next action' },
] as const

export function CreateAutomationDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'trigger' | 'action' | 'details'>('trigger')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: '' as AutomationTrigger | '',
    actionType: '' as AutomationAction | '',
  })

  const resetForm = () => {
    setStep('trigger')
    setFormData({ name: '', description: '', triggerType: '', actionType: '' })
    setError(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) resetForm()
  }

  const selectedTrigger = TRIGGERS.find(t => t.value === formData.triggerType)
  const selectedAction = ACTIONS.find(a => a.value === formData.actionType)

  const handleCreate = async () => {
    if (!formData.name || !formData.triggerType || !formData.actionType) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    const result = await createAutomation({
      name: formData.name,
      description: formData.description || undefined,
      triggerType: formData.triggerType as AutomationTrigger,
      actionType: formData.actionType as AutomationAction,
    })

    setLoading(false)

    if (result.success) {
      handleOpenChange(false)
    } else {
      setError(result.error || 'Failed to create automation')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'trigger' && 'Choose a Trigger'}
            {step === 'action' && 'Choose an Action'}
            {step === 'details' && 'Automation Details'}
          </DialogTitle>
          <DialogDescription>
            {step === 'trigger' && 'What should start this automation?'}
            {step === 'action' && 'What should happen when the trigger fires?'}
            {step === 'details' && 'Give your automation a name and description.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'trigger' && (
          <div className="grid gap-2 py-4 max-h-[400px] overflow-y-auto">
            {TRIGGERS.map((trigger) => {
              const Icon = trigger.icon
              return (
                <button
                  key={trigger.value}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, triggerType: trigger.value }))
                    setStep('action')
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors hover:bg-accent ${
                    formData.triggerType === trigger.value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{trigger.label}</div>
                    <div className="text-sm text-muted-foreground">{trigger.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {step === 'action' && (
          <div className="grid gap-2 py-4 max-h-[400px] overflow-y-auto">
            {selectedTrigger && (
              <div className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-muted/50 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span>When: <strong>{selectedTrigger.label}</strong></span>
              </div>
            )}
            {ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.value}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, actionType: action.value }))
                    setStep('details')
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors hover:bg-accent ${
                    formData.actionType === action.value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{action.label}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {step === 'details' && (
          <div className="grid gap-4 py-4">
            {selectedTrigger && selectedAction && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>{selectedTrigger.label}</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="flex items-center gap-2">
                  <selectedAction.icon className="h-4 w-4 text-emerald-600" />
                  <span>{selectedAction.label}</span>
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Welcome Email Sequence"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What does this automation do?"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
        )}

        <DialogFooter>
          {step !== 'trigger' && (
            <Button
              variant="outline"
              onClick={() => setStep(step === 'details' ? 'action' : 'trigger')}
              className="rounded-xl"
            >
              Back
            </Button>
          )}
          {step === 'details' && (
            <Button onClick={handleCreate} disabled={loading} className="rounded-xl">
              {loading ? 'Creating...' : 'Create Automation'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

