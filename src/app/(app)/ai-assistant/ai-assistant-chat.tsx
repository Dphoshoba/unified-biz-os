'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Assistant. I can help you understand your business data. Ask me anything about your CRM, calendar, invoices, or deals.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = input.toLowerCase()
      let response = ''

      if (lowerInput.includes('schedule') || lowerInput.includes('today')) {
        response = 'You have 3 appointments scheduled for today:\n\n1. 10:00 AM - Consultation with Acme Corp\n2. 2:00 PM - Follow-up call with Tech Solutions\n3. 4:30 PM - Project review meeting\n\nWould you like details on any of these?'
      } else if (lowerInput.includes('top') && lowerInput.includes('client')) {
        response = 'Your top 3 paying clients are:\n\n1. Acme Corp - $12,500 total revenue\n2. Tech Solutions - $8,200 total revenue\n3. Global Industries - $6,100 total revenue\n\nWould you like to see more details about any of these clients?'
      } else if (lowerInput.includes('revenue') || lowerInput.includes('month')) {
        response = 'Your total revenue this month is $45,230. This represents a 12% increase from last month. Your top revenue sources are:\n\n- Deals: $32,000\n- Invoices: $10,500\n- Subscriptions: $2,730'
      } else if (lowerInput.includes('appointment') || lowerInput.includes('booking')) {
        response = 'You have 5 upcoming appointments:\n\n- Tomorrow: 2:00 PM with John Doe\n- Thursday: 10:00 AM with Jane Smith\n- Friday: 3:30 PM with Bob Johnson\n\nWould you like to see the full calendar?'
      } else if (lowerInput.includes('deal')) {
        response = 'You currently have 8 active deals with a total value of $125,000. 3 deals are expected to close this week:\n\n- Acme Corp Deal - $25,000 (90% probability)\n- Tech Solutions - $18,000 (75% probability)\n- Startup Inc - $12,000 (60% probability)'
      } else {
        response = 'I understand you\'re asking about your business data. Based on my analysis:\n\n- You have 234 active contacts\n- 15 bookings scheduled this week\n- $45,230 in revenue this month\n- 8 active deals worth $125,000\n\nHow can I help you dive deeper into any of these areas?'
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <Card
              className={`max-w-[80%] rounded-xl ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <CardContent className="p-3">
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
            {message.role === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted">U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Card className="bg-muted rounded-xl">
              <CardContent className="p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about your business..."
          className="rounded-xl"
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()} className="rounded-xl">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

