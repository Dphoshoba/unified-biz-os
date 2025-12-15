import { Mail, Sparkles, Send } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'

export default async function CampaignsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Campaigns"
        description="Send newsletters and product updates via email broadcasts."
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Email Campaigns</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Create and send email broadcasts to your contacts
              </p>
            </div>
            <ComingSoonButton featureName="New Campaign">
              <Button className="rounded-xl">
                <Send className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </ComingSoonButton>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <Mail className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No campaigns yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first email campaign to reach your audience
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Magic Writer</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-generate email content based on your subject line
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">AI content generation coming soon</p>
            <ComingSoonButton featureName="AI Email Writer">
              <Button variant="outline" className="rounded-xl">Learn More</Button>
            </ComingSoonButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

