import { Plus, Target, Users, Sparkles, ShoppingCart, ExternalLink, MoreHorizontal, TrendingUp, Eye } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/dashboard'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'

const templates = [
  {
    id: '1',
    name: 'Lead Magnet',
    description: 'Capture leads with a free resource download',
    icon: Users,
    steps: ['Landing Page', 'Opt-in Form', 'Thank You Page'],
  },
  {
    id: '2',
    name: 'Consultation Booking',
    description: 'Book discovery calls or consultations',
    icon: Target,
    steps: ['Landing Page', 'Calendar Booking', 'Confirmation'],
  },
  {
    id: '3',
    name: 'Free Trial',
    description: 'Offer a free trial to convert prospects',
    icon: Sparkles,
    steps: ['Landing Page', 'Sign Up Form', 'Onboarding'],
  },
  {
    id: '4',
    name: 'Direct Purchase',
    description: 'Sell products or services directly',
    icon: ShoppingCart,
    steps: ['Sales Page', 'Checkout', 'Thank You'],
  },
]

const funnels = [
  {
    id: '1',
    name: 'Free Strategy Guide',
    type: 'Lead Magnet',
    status: 'active',
    visitors: 1247,
    conversions: 312,
    conversionRate: '25%',
    revenue: '$0',
  },
  {
    id: '2',
    name: 'Book a Discovery Call',
    type: 'Consultation Booking',
    status: 'active',
    visitors: 856,
    conversions: 89,
    conversionRate: '10.4%',
    revenue: '$13,350',
  },
  {
    id: '3',
    name: 'Pro Plan Launch',
    type: 'Direct Purchase',
    status: 'draft',
    visitors: 0,
    conversions: 0,
    conversionRate: '0%',
    revenue: '$0',
  },
]

export default function FunnelsPage() {
  const totalVisitors = funnels.reduce((sum, f) => sum + f.visitors, 0)
  const totalConversions = funnels.reduce((sum, f) => sum + f.conversions, 0)
  const avgConversionRate = totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(1) : '0'

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Funnels"
        description="Create high-converting landing pages and funnels."
      >
        <ComingSoonButton featureName="Create Funnel" className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Create Funnel
        </ComingSoonButton>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total Visitors"
          value={totalVisitors.toLocaleString()}
          icon={Eye}
          iconColor="text-blue-600"
          change={{ value: 34.2, label: 'vs last month' }}
        />
        <KpiCard
          title="Total Conversions"
          value={totalConversions}
          icon={Users}
          iconColor="text-emerald-600"
          change={{ value: 28.5, label: 'vs last month' }}
        />
        <KpiCard
          title="Avg. Conversion Rate"
          value={`${avgConversionRate}%`}
          icon={TrendingUp}
          iconColor="text-violet-600"
          change={{ value: 5.2, label: 'vs last month' }}
        />
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-heading font-semibold mb-4">Funnel Templates</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => {
            const Icon = template.icon
            return (
              <Card
                key={template.id}
                className="rounded-2xl shadow-card border-border/50 hover:shadow-card-hover hover:border-border transition-all cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-body font-semibold">{template.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-body-sm">{template.description}</CardDescription>
                  <div className="flex flex-wrap gap-1">
                    {template.steps.map((step, i) => (
                      <Badge key={step} variant="outline" className="text-caption rounded-lg">
                        {i + 1}. {step}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Your Funnels */}
      <div>
        <h2 className="text-heading font-semibold mb-4">Your Funnels</h2>
        <div className="space-y-4">
          {funnels.map((funnel) => (
            <Card key={funnel.id} className="rounded-2xl shadow-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{funnel.name}</h3>
                        <Badge
                          variant={funnel.status === 'active' ? 'success' : 'secondary'}
                        >
                          {funnel.status}
                        </Badge>
                      </div>
                      <p className="text-body-sm text-muted-foreground">
                        {funnel.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 lg:gap-8">
                    <div className="text-center">
                      <div className="text-heading-sm font-semibold tabular-nums">
                        {funnel.visitors.toLocaleString()}
                      </div>
                      <div className="text-caption text-muted-foreground">Visitors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-heading-sm font-semibold tabular-nums">
                        {funnel.conversions}
                      </div>
                      <div className="text-caption text-muted-foreground">
                        Conversions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-heading-sm font-semibold text-success tabular-nums">
                        {funnel.conversionRate}
                      </div>
                      <div className="text-caption text-muted-foreground">Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-heading-sm font-semibold tabular-nums">{funnel.revenue}</div>
                      <div className="text-caption text-muted-foreground">Revenue</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
