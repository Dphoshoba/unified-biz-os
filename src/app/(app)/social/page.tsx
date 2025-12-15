import { Share2, Twitter, Linkedin, Instagram } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'

export default async function SocialPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Social"
        description="Plan and publish content to Twitter, LinkedIn, and Instagram."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
          { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
          { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
        ].map((platform) => (
          <Card key={platform.name} className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <platform.icon className={`h-5 w-5 ${platform.color}`} />
                <CardTitle>{platform.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">{platform.name} integration coming soon</p>
                <ComingSoonButton featureName={`${platform.name} Integration`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <CardTitle>AI Assist</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Generate viral-ready posts with emojis and hashtags
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">AI content generation coming soon</p>
            <ComingSoonButton featureName="AI Social Content" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

