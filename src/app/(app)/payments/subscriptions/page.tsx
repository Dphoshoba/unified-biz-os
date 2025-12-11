import { Search, Filter, MoreHorizontal, RefreshCw, Users, DollarSign, Download } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { KpiCard } from '@/components/dashboard'

const subscriptions = [
  {
    id: '1',
    customer: 'Sarah Johnson',
    email: 'sarah@acme.com',
    plan: 'Enterprise Plan',
    amount: '$299/mo',
    status: 'active',
    nextBilling: 'Jan 1, 2025',
    startedAt: 'Jun 15, 2024',
  },
  {
    id: '2',
    customer: 'Michael Chen',
    email: 'mchen@techstart.io',
    plan: 'Pro Plan',
    amount: '$99/mo',
    status: 'active',
    nextBilling: 'Dec 20, 2024',
    startedAt: 'Sep 20, 2024',
  },
  {
    id: '3',
    customer: 'Emily Davis',
    email: 'emily@globalventures.com',
    plan: 'Enterprise Plan',
    amount: '$299/mo',
    status: 'active',
    nextBilling: 'Dec 25, 2024',
    startedAt: 'Mar 25, 2024',
  },
  {
    id: '4',
    customer: 'James Wilson',
    email: 'jwilson@innovate.co',
    plan: 'Pro Plan',
    amount: '$99/mo',
    status: 'past_due',
    nextBilling: 'Dec 5, 2024',
    startedAt: 'Aug 5, 2024',
  },
  {
    id: '5',
    customer: 'Lisa Anderson',
    email: 'lisa@creativestudio.design',
    plan: 'Starter Plan',
    amount: '$29/mo',
    status: 'active',
    nextBilling: 'Dec 18, 2024',
    startedAt: 'Nov 18, 2024',
  },
  {
    id: '6',
    customer: 'Tom Brown',
    email: 'tom@newco.io',
    plan: 'Pro Plan',
    amount: '$99/mo',
    status: 'canceled',
    nextBilling: '-',
    startedAt: 'Jul 10, 2024',
  },
]

const statusVariants: Record<string, 'success' | 'warning' | 'secondary' | 'destructive'> = {
  active: 'success',
  past_due: 'warning',
  canceled: 'secondary',
  trialing: 'success',
}

export default function SubscriptionsPage() {
  const activeCount = subscriptions.filter(s => s.status === 'active').length
  const pastDueCount = subscriptions.filter(s => s.status === 'past_due').length
  const mrr = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      const amount = parseInt(s.amount.replace(/[^0-9]/g, ''))
      return sum + amount
    }, 0)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Subscriptions"
        description="View and manage active subscriptions."
      >
        <Button variant="outline" className="rounded-xl">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Active Subscriptions"
          value={activeCount}
          icon={RefreshCw}
          iconColor="text-emerald-600"
          change={{ value: 8.5, label: 'vs last month' }}
        />
        <KpiCard
          title="Past Due"
          value={pastDueCount}
          icon={Users}
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Monthly Revenue"
          value={`$${mrr.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-blue-600"
          change={{ value: 12.3, label: 'vs last month' }}
        />
      </div>

      {/* Filters */}
      <Card className="rounded-2xl shadow-card border-border/50">
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                className="pl-10 max-w-md rounded-xl"
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="rounded-2xl shadow-card border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-3 text-right text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-caption">
                            {sub.customer
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-body">{sub.customer}</div>
                          <div className="text-caption text-muted-foreground">
                            {sub.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body">{sub.plan}</td>
                    <td className="px-6 py-4 text-body font-medium tabular-nums">{sub.amount}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[sub.status]}>
                        {sub.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-muted-foreground">
                      {sub.nextBilling}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-muted-foreground">
                      {sub.startedAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
