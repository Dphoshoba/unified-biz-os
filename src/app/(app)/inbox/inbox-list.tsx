'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EmailMessage } from '@/lib/inbox/actions'

export function InboxList({ selectedId }: { selectedId?: string }) {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<EmailMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/inbox/sync')
      const data = await response.json()
      if (data.success) {
        setMessages(data.emails || [])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/inbox/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'gmail' }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to sync:', error)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Inbox</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSync}
            disabled={syncing}
            className="h-8 w-8 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet</p>
            <p className="text-sm mt-2">Connect your email to sync messages</p>
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => {
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
        )}
      </CardContent>
    </Card>
  )
}
