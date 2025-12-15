import { Palette, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'

export default async function CanvasPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Canvas"
        description="An infinite whiteboard for ideas and brainstorming."
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Whiteboard</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Create and collaborate on visual ideas
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <Palette className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Interactive whiteboard coming soon</p>
            <ComingSoonButton featureName="Canvas Whiteboard" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Brainstorm</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Enter a topic and AI will generate a mind map
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">AI brainstorming coming soon</p>
            <ComingSoonButton featureName="AI Brainstorm" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

