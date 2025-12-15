import { BarChart3, Sparkles, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AnalyticsQuery } from './analytics-query'
import { AnalyticsCharts } from './analytics-charts'

export default async function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Analytics"
        description="Understand your data with natural language queries and visual insights."
      />

      {/* Natural Language Query */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Ask Data</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Ask questions about your business data in natural language
          </p>
        </CardHeader>
        <CardContent>
          <AnalyticsQuery />
        </CardContent>
      </Card>

      {/* Charts */}
      <AnalyticsCharts />
    </div>
  )
}

