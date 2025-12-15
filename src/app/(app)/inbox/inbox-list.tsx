'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock messages - in production, this would come from the database
const mockMessages = [
  {
    id: '1',
    from: { name: 'John Doe', email: 'john@example.com', image: null },
    subject: 'Project Proposal Discussion',
    preview: 'I wanted to follow up on our conversation about the project proposal...',
    unread: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    contactId: 'contact-1',
    dealId: 'deal-1',
  },
  {
    id: '2',
    from: { name: 'Jane Smith', email: 'jane@example.com', image: null },
    subject: 'Invoice Payment Confirmation',
    preview: 'Thank you for the invoice. Payment has been processed...',
    unread: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    contactId: 'contact-2',
    invoiceId: 'invoice-1',
  },
  {
    id: '3',
    from: { name: 'Bob Johnson', email: 'bob@example.com', image: null },
    subject: 'Meeting Request',
    preview: 'Would you be available for a meeting next week to discuss...',
    unread: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    contactId: 'contact-3',
  },
]

export function InboxList({ selectedId }: { selectedId?: string }) {
  const searchParams = useSearchParams()

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-0">
        <div className="divide-y">
          {mockMessages.map((message) => {
            const isSelected = selectedId === message.id
            return (
              <Link
                key={message.id}
                href={`/inbox?message=${message.id}`}
                className={cn(
                  'block p-4 hover:bg-muted/50 transition-colors',
                  isSelected && 'bg-muted'
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={message.from.image || undefined} />
                    <AvatarFallback>
                      {message.from.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={cn('text-sm font-medium truncate', message.unread && 'font-semibold')}>
                        {message.from.name}
                      </p>
                      {message.unread && (
                        <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                      )}
                    </div>
                    <p className={cn('text-sm truncate mb-1', message.unread ? 'font-medium' : 'text-muted-foreground')}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {message.preview}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

