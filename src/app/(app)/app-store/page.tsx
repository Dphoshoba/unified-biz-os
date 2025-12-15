import { Store, Zap, Mail, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'

const integrations = [
  { name: 'Slack', icon: Zap, description: 'Receive notifications for new leads and payments', status: 'coming-soon' },
  { name: 'Gmail', icon: Mail, description: 'Sync emails to the Inbox', status: 'coming-soon' },
  { name: 'Zoom', icon: Calendar, description: 'Auto-transcribe meetings', status: 'coming-soon' },
]

export default async function AppStorePage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="App Store"
        description="Connect Nexus to your favorite tools and services."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => {
          const Icon = integration.icon
          return (
            <Card key={integration.name} className="rounded-2xl hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {integration.status === 'coming-soon' ? 'Coming Soon' : 'Available'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {integration.description}
                </p>
                <ComingSoonButton featureName={`${integration.name} Integration`}>
                  <Button variant="outline" className="w-full rounded-xl" disabled>
                    {integration.status === 'coming-soon' ? 'Coming Soon' : 'Connect'}
                  </Button>
                </ComingSoonButton>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

