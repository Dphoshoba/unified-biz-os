import { Target, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'

export default async function StrategyPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Strategy"
        description="Align your team with Objectives and Key Results (OKRs)."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>OKRs</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Set and track Objectives and Key Results
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">OKR management coming soon</p>
              <ComingSoonButton featureName="OKR Management" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Goals</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Track progress on your business goals
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Goal tracking coming soon</p>
              <ComingSoonButton featureName="Goal Tracking" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

