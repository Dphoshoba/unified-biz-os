import { Sparkles, Mic, MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AIAssistantChat } from './ai-assistant-chat'
import { AIAssistantVoice } from './ai-assistant-voice'

export default async function AIAssistantPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="AI Assistant"
        description="Voice and chat assistant aware of your entire business context."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chat Mode */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>Chat Mode</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Ask questions about your CRM, Calendar, and Invoices
            </p>
          </CardHeader>
          <CardContent>
            <AIAssistantChat />
          </CardContent>
        </Card>

        {/* Voice Mode */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              <CardTitle>Voice Mode</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Have natural, real-time conversations with your business data
            </p>
          </CardHeader>
          <CardContent>
            <AIAssistantVoice />
          </CardContent>
        </Card>
      </div>

      {/* Example Questions */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Example Questions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              'Brief me on my schedule for today',
              'Who are my top paying clients?',
              'What is my total revenue this month?',
              'Show me my upcoming appointments',
              'What deals are closing this week?',
              'Summarize my recent activities',
            ].map((question, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded-lg text-sm">
                {question}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

