import { Target, Users, Sparkles, ShoppingCart, ExternalLink, MoreHorizontal, TrendingUp, Eye, Video, Clock } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/dashboard'
import { CreateFunnelDialog } from './create-funnel-dialog'
import { FunnelActions } from './funnel-actions'
import { getFunnels, getFunnelStats } from '@/lib/funnels/actions'
import { formatFunnelType, FUNNEL_TEMPLATES } from '@/lib/funnels/utils'

const templateIcons = {
  LEAD_MAGNET: Users,
  CONSULTATION: Target,
  FREE_TRIAL: Sparkles,
  DIRECT_PURCHASE: ShoppingCart,
  WEBINAR: Video,
  WAITLIST: Clock,
}

const templateColors = {
  LEAD_MAGNET: 'text-blue-600 bg-blue-500/10',
  CONSULTATION: 'text-emerald-600 bg-emerald-500/10',
  FREE_TRIAL: 'text-violet-600 bg-violet-500/10',
  DIRECT_PURCHASE: 'text-amber-600 bg-amber-500/10',
  WEBINAR: 'text-rose-600 bg-rose-500/10',
  WAITLIST: 'text-cyan-600 bg-cyan-500/10',
}

const templates = [
  {
    id: '1',
    name: 'Lead Magnet',
    description: 'Capture leads with a free resource download',
    icon: Users,
    type: 'LEAD_MAGNET',
    steps: ['Landing Page', 'Opt-in Form', 'Thank You Page'],
  },
  {
    id: '2',
    name: 'Consultation Booking',
    description: 'Book discovery calls or consultations',
    icon: Target,
    type: 'CONSULTATION',
    steps: ['Landing Page', 'Calendar Booking', 'Confirmation'],
  },
  {
    id: '3',
    name: 'Free Trial',
    description: 'Offer a free trial to convert prospects',
    icon: Sparkles,
    type: 'FREE_TRIAL',
    steps: ['Landing Page', 'Sign Up Form', 'Onboarding'],
  },
  {
    id: '4',
    name: 'Direct Purchase',
    description: 'Sell products or services directly',
    icon: ShoppingCart,
    type: 'DIRECT_PURCHASE',
    steps: ['Sales Page', 'Checkout', 'Thank You'],
  },
]

function formatRevenue(cents: number): string {
  if (cents === 0) return '$0'
  return `$${(cents / 100).toLocaleString()}`
}

function getConversionRate(visitors: number, conversions: number): string {
  if (visitors === 0) return '0%'
  return `${((conversions / visitors) * 100).toFixed(1)}%`
}

export default async function FunnelsPage() {
  const [funnels, stats] = await Promise.all([
    getFunnels(),
    getFunnelStats(),
  ])

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Funnels"
        description="Create high-converting landing pages and funnels."
      >
        <CreateFunnelDialog />
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total Visitors"
          value={stats.visitors.toLocaleString()}
          icon={Eye}
          iconColor="text-blue-600"
          change={{ value: stats.visitors > 0 ? 100 : 0, label: 'all time' }}
        />
        <KpiCard
          title="Total Conversions"
          value={stats.conversions}
          icon={Users}
          iconColor="text-emerald-600"
          change={{ value: stats.conversions > 0 ? 100 : 0, label: 'all time' }}
        />
        <KpiCard
          title="Avg. Conversion Rate"
          value={`${stats.avgRate}%`}
          icon={TrendingUp}
          iconColor="text-violet-600"
          change={{ value: stats.avgRate > 0 ? stats.avgRate : 0, label: 'overall' }}
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
        {funnels.length === 0 ? (
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No funnels yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first funnel to start capturing leads and converting visitors.
              </p>
              <CreateFunnelDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {funnels.map((funnel) => {
              const Icon = templateIcons[funnel.type] || Target
              const colorClass = templateColors[funnel.type] || 'text-primary bg-primary/10'
              
              return (
                <Card key={funnel.id} className="rounded-2xl shadow-card border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{funnel.name}</h3>
                            <Badge
                              variant={funnel.status === 'ACTIVE' ? 'success' : 'secondary'}
                            >
                              {funnel.status.toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-body-sm text-muted-foreground">
                            {formatFunnelType(funnel.type)}
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
                            {getConversionRate(funnel.visitors, funnel.conversions)}
                          </div>
                          <div className="text-caption text-muted-foreground">Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-heading-sm font-semibold tabular-nums">
                            {formatRevenue(funnel.revenue)}
                          </div>
                          <div className="text-caption text-muted-foreground">Revenue</div>
                        </div>
                        <FunnelActions 
                          id={funnel.id} 
                          slug={funnel.slug}
                          status={funnel.status} 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
