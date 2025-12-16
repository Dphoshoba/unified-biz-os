'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { EMAIL_TEMPLATES } from '@/lib/campaigns/templates'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CreateCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    recipientType: 'ALL_CONTACTS' as 'ALL_CONTACTS' | 'SEGMENT' | 'MANUAL',
    scheduledAt: '',
  })

  const handleAIGenerate = async () => {
    if (!formData.subject.trim()) {
      alert('Please enter a subject line first')
      return
    }

    setAiGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Write a professional email campaign body for the subject: "${formData.subject}". Make it engaging, clear, and include a call-to-action.`,
          documentType: 'Email Campaign',
        }),
      })

      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, content: data.content }))
      } else {
        alert(data.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('Failed to generate AI content:', error)
      alert('Failed to generate content')
    } finally {
      setAiGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.subject || !formData.content) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
        }),
      })

      const data = await response.json()
      if (data.success) {
        router.refresh()
        onOpenChange(false)
        setFormData({
          name: '',
          subject: '',
          content: '',
          recipientType: 'ALL_CONTACTS',
          scheduledAt: '',
        })
      } else {
        alert(data.error || 'Failed to create campaign')
      }
    } catch (error) {
      console.error('Failed to create campaign:', error)
      alert('Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Email Campaign</DialogTitle>
          <DialogDescription>
            Create and send email broadcasts to your contacts
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Campaign Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Monthly Newsletter"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Subject Line</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="h-8 rounded-xl"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Templates
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAIGenerate}
                  disabled={aiGenerating || !formData.subject.trim()}
                  className="h-8 rounded-xl"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generate Body
                    </>
                  )}
                </Button>
              </div>
            </div>
            {showTemplates && (
              <div className="mb-4 p-4 border rounded-xl bg-muted/50">
                <Label className="mb-2 block">Choose a Template</Label>
                <div className="grid grid-cols-2 gap-2">
                  {EMAIL_TEMPLATES.map((template) => (
                    <Button
                      key={template.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          name: template.name,
                          subject: template.subject,
                          content: template.content,
                        }))
                        setShowTemplates(false)
                      }}
                      className="h-auto p-3 flex-col items-start text-left rounded-xl"
                    >
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{template.description}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Input
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Email subject line"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label>Email Content</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your email content here... Use {{Contact.Name}} for personalization"
              className="rounded-xl min-h-[200px]"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available variables: {`{{Contact.Name}}`}, {`{{Contact.FirstName}}`}, {`{{Contact.Email}}`}
            </p>
          </div>

          <div>
            <Label>Recipients</Label>
            <Select
              value={formData.recipientType}
              onValueChange={(value: 'ALL_CONTACTS' | 'SEGMENT' | 'MANUAL') =>
                setFormData(prev => ({ ...prev, recipientType: value }))
              }
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_CONTACTS">All Contacts</SelectItem>
                <SelectItem value="SEGMENT">Segment (Coming Soon)</SelectItem>
                <SelectItem value="MANUAL">Manual List (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Schedule (Optional)</Label>
            <Input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to save as draft
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Campaign'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

