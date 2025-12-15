'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Revenue Chart */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {[32000, 38000, 42000, 45230, 48000, 51000].map((value, i) => {
              const max = 51000
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(value / max) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Visitors', value: 1000, color: 'bg-blue-500' },
              { name: 'Landing Page', value: 450, color: 'bg-purple-500' },
              { name: 'Opt-in Form', value: 320, color: 'bg-violet-500' },
              { name: 'Checkout', value: 180, color: 'bg-emerald-500' },
            ].map((step, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{step.name}</span>
                  <span className="font-medium">{step.value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${step.color} transition-all`}
                    style={{ width: `${(step.value / 1000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Clients */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Top Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Acme Corp', value: 12500 },
              { name: 'Tech Solutions', value: 8200 },
              { name: 'Global Industries', value: 6100 },
              { name: 'Startup Inc', value: 4500 },
            ].map((client, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{client.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(client.value / 12500) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">${client.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Active Leads</span>
              </div>
              <p className="text-2xl font-bold">234</p>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Avg Deal Value</span>
              </div>
              <p className="text-2xl font-bold">$3,240</p>
              <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-violet-500" />
                <span className="text-sm text-muted-foreground">Bookings</span>
              </div>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Conversion</span>
              </div>
              <p className="text-2xl font-bold">2.6%</p>
              <p className="text-xs text-muted-foreground mt-1">Overall rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
