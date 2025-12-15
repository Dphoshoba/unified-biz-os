import { Inbox, Mail, MessageSquare, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InboxList } from './inbox-list'
import { InboxView } from './inbox-view'

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams
  const selectedMessageId = params.message

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Inbox"
        description="Unified communication hub for all client messages."
      />

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <InboxList selectedId={selectedMessageId} />
        </div>

        {/* Message View */}
        <div className="lg:col-span-2">
          {selectedMessageId ? (
            <InboxView messageId={selectedMessageId} />
          ) : (
            <Card className="rounded-2xl">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a message</h3>
                <p className="text-muted-foreground text-center">
                  Choose a message from the list to view its contents and reply.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
