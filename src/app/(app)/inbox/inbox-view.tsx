'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Reply, Sparkles, User, FileText, DollarSign, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { EmailMessage, getInboxMessage, sendReply } from '@/lib/inbox/actions'

interface InboxViewProps {
  messageId: string
}

export function InboxView({ messageId }: InboxViewProps) {
  const [message, setMessage] = useState<EmailMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [aiDraft, setAiDraft] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadMessage()
  }, [messageId])

  const loadMessage = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/inbox/sync?messageId=${messageId}`)
      const data = await response.json()
      if (data.success && data.email) {
        setMessage(data.email)
      }
    } catch (error) {
      console.error('Failed to load message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAIDraft = () => {
    if (!message) return
    // Simulate AI draft generation based on message content
    const senderName = message.from.name.split(' ')[0]
    setAiDraft(`Hi ${senderName},

Thank you for your message. ${message.subject.includes('proposal') ? 'I\'d be happy to discuss the proposal further.' : 'I\'ll get back to you soon.'}

Best regards`)
  }

  const handleSend = async () => {
    if (!replyText.trim() || !messageId) return
    
    setSending(true)
    try {
      const response = await fetch('/api/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, body: replyText }),
      })
      const result = await response.json()
      if (result.success) {
        setReplyText('')
        setAiDraft(null)
        alert('Reply sent!')
      } else {
        alert(result.error || 'Failed to send reply')
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
      alert('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!message) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">Message not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/inbox">
          <Button variant="ghost" size="sm" className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
        </div>
      </div>

      {/* Message */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={message.from.image || undefined} />
                <AvatarFallback>
                  {message.from.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{message.from.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{message.from.email}</p>
              </div>
            </div>
            <Badge variant="outline">
              {new Date(message.timestamp).toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Subject: {message.subject}</p>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line">{message.body || message.preview}</p>
              </div>
            </div>

            {/* Context Sidebar */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium mb-3">Related Context</p>
              <div className="grid grid-cols-2 gap-3">
                {message.contactId && (
                  <Link href={`/crm/contacts`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">View Contact</span>
                  </Link>
                )}
                {message.dealId && (
                  <Link href={`/crm/deals`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">View Deal</span>
                  </Link>
                )}
                {message.invoiceId && (
                  <Link href={`/payments/invoices`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">View Invoice</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Reply</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIDraft}
              className="rounded-xl"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Draft
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={aiDraft || replyText}
              onChange={(e) => {
                setReplyText(e.target.value)
                setAiDraft(null)
              }}
              placeholder="Type your reply..."
              rows={6}
              className="rounded-xl"
            />
            <div className="flex justify-end">
              <Button onClick={handleSend} disabled={sending || !replyText.trim()} className="rounded-xl">
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Reply className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
