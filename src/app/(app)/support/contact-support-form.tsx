'use client'

'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ContactSupportForm() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in both subject and message fields.')
      return
    }

    setError(null)
    setSuccess(false)

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setError(null)
        setSubject('')
        setMessage('')
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(data.error || 'Failed to send message. Please try again.')
        setSuccess(false)
      }
    } catch (error) {
      console.error('Failed to send support message:', error)
      setError('Failed to send message. Please try again.')
      setSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
        <CardDescription>
          Can't find what you're looking for? Send us a message.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm">
            Message sent! We'll get back to you as soon as possible.
          </div>
        )}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief description..."
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                setError(null)
              }}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <div className="relative">
              <Textarea
                id="message"
                rows={4}
                placeholder="Describe your issue or question..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setError(null)
                }}
                disabled={isSubmitting}
                required
                className="pr-10"
              />
              <div className="absolute bottom-3 right-3">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !subject.trim() || !message.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

