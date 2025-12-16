'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'

export type EmailMessage = {
  id: string
  from: { name: string; email: string; image?: string | null }
  subject: string
  preview: string
  body?: string
  unread: boolean
  timestamp: Date
  contactId?: string
  dealId?: string
  invoiceId?: string
}

export async function getInboxMessages(options?: {
  unreadOnly?: boolean
  limit?: number
}) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  // TODO: Fetch actual emails from database
  // For now, return mock data that would come from email sync
  const mockMessages: EmailMessage[] = [
    {
      id: '1',
      from: { name: 'John Doe', email: 'john@example.com' },
      subject: 'Project Proposal Discussion',
      preview: 'I wanted to follow up on our conversation about the project proposal...',
      body: `Hi there,

I wanted to follow up on our conversation about the project proposal. I've reviewed the details and I'm very interested in moving forward.

Could we schedule a call to discuss the next steps? I'm available most afternoons this week.

Best regards,
John`,
      unread: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      contactId: 'contact-1',
      dealId: 'deal-1',
    },
    {
      id: '2',
      from: { name: 'Jane Smith', email: 'jane@example.com' },
      subject: 'Invoice Payment Confirmation',
      preview: 'Thank you for the invoice. Payment has been processed...',
      body: `Hello,

Thank you for the invoice. Payment has been processed and should appear in your account within 2-3 business days.

Best regards,
Jane`,
      unread: false,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      contactId: 'contact-2',
      invoiceId: 'invoice-1',
    },
    {
      id: '3',
      from: { name: 'Bob Johnson', email: 'bob@example.com' },
      subject: 'Meeting Request',
      preview: 'Would you be available for a meeting next week to discuss...',
      body: `Hi,

Would you be available for a meeting next week to discuss potential collaboration opportunities?

Best,
Bob`,
      unread: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      contactId: 'contact-3',
    },
  ]

  let filtered = mockMessages
  if (options?.unreadOnly) {
    filtered = filtered.filter(m => m.unread)
  }

  return filtered.slice(0, options?.limit || 50)
}

export async function getInboxMessage(id: string): Promise<EmailMessage | null> {
  const messages = await getInboxMessages()
  return messages.find(m => m.id === id) || null
}

export async function markAsRead(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  // TODO: Update email read status in database
  return { success: true }
}

export async function sendReply(messageId: string, body: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  // TODO: Send actual email reply
  // This would use Gmail API or SMTP to send the reply
  
  return { success: true }
}

