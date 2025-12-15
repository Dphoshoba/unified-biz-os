'use client'

import { useState } from 'react'
import { ArrowLeft, Reply, Sparkles, User, FileText, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface InboxViewProps {
  messageId: string
}

// Mock message data
const mockMessage = {
  id: '1',
  from: { name: 'John Doe', email: 'john@example.com', image: null },
  subject: 'Project Proposal Discussion',
  body: `Hi there,

I wanted to follow up on our conversation about the project proposal. I've reviewed the details and I'm very interested in moving forward.

Could we schedule a call to discuss the next steps? I'm available most afternoons this week.

Best regards,
John`,
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  contactId: 'contact-1',
  dealId: 'deal-1',
  invoiceId: null,
}

export function InboxView({ messageId }: InboxViewProps) {
  const [replyText, setReplyText] = useState('')
  const [aiDraft, setAiDraft] = useState<string | null>(null)

  const handleAIDraft = () => {
    // Simulate AI draft generation
    setAiDraft(`Hi John,

Thank you for your interest in moving forward with the project proposal. I'd be happy to schedule a call to discuss the next steps.

I'm available on [date/time]. Please let me know if this works for you, or suggest an alternative time.

Looking forward to our conversation.

Best regards`)
  }

  const handleSend = () => {
    // TODO: Implement send functionality
    alert('Message sent!')
    setReplyText('')
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
                <AvatarImage src={mockMessage.from.image || undefined} />
                <AvatarFallback>
                  {mockMessage.from.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{mockMessage.from.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{mockMessage.from.email}</p>
              </div>
            </div>
            <Badge variant="outline">
              {mockMessage.timestamp.toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Subject: {mockMessage.subject}</p>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line">{mockMessage.body}</p>
              </div>
            </div>

            {/* Context Sidebar */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium mb-3">Related Context</p>
              <div className="grid grid-cols-2 gap-3">
                {mockMessage.contactId && (
                  <Link href={`/crm/contacts`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">View Contact</span>
                  </Link>
                )}
                {mockMessage.dealId && (
                  <Link href={`/crm/deals`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">View Deal</span>
                  </Link>
                )}
                {mockMessage.invoiceId && (
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
              <Button onClick={handleSend} className="rounded-xl">
                Send Reply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
