import Link from 'next/link'
import {
  DollarSign,
  CreditCard,
  AlertCircle,
  Package,
  Receipt,
  RefreshCw,
} from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/dashboard'
import { ConnectStripeButton } from './connect-stripe-button'
import { getStripeConnectStatus } from '@/lib/stripe/payments'

const recentPayments = [
  {
    id: '1',
    customer: 'Sarah Johnson',
    email: 'sarah@acme.com',
    amount: '$299',
    type: 'Subscription',
    status: 'succeeded',
    date: '2 hours ago',
  },
  {
    id: '2',
    customer: 'Michael Chen',
    email: 'mchen@techstart.io',
    amount: '$150',
    type: 'One-time',
    status: 'succeeded',
    date: '5 hours ago',
  },
  {
    id: '3',
    customer: 'Emily Davis',
    email: 'emily@globalventures.com',
    amount: '$499',
    type: 'Subscription',
    status: 'succeeded',
    date: '1 day ago',
  },
  {
    id: '4',
    customer: 'James Wilson',
    email: 'jwilson@innovate.co',
    amount: '$99',
    type: 'Subscription',
    status: 'failed',
    date: '1 day ago',
  },
]

const modules = [
  {
    name: 'Products',
    description: 'Manage your products and pricing',
    href: '/payments/products',
    icon: Package,
    count: '8 products',
    color: 'text-blue-600',
  },
  {
    name: 'Subscriptions',
    description: 'View active subscriptions',
    href: '/payments/subscriptions',
    icon: RefreshCw,
    count: '127 active',
    color: 'text-violet-600',
  },
  {
    name: 'Invoices',
    description: 'Manage invoices and receipts',
    href: '/payments/invoices',
    icon: Receipt,
    count: '342 total',
    color: 'text-emerald-600',
  },
]

export default async function PaymentsPage() {
  const stripeStatus = await getStripeConnectStatus()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Payments"
        description="Track revenue, manage products, and view transactions."
      >
        <ConnectStripeButton initialStatus={stripeStatus} />
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Monthly Recurring Revenue"
          value="$12,450"
          icon={RefreshCw}
          iconColor="text-blue-600"
          change={{ value: 8.2, label: 'vs last month' }}
        />
        <KpiCard
          title="One-time Revenue (MTD)"
          value="$8,320"
          icon={DollarSign}
          iconColor="text-emerald-600"
          change={{ value: 15.3, label: 'vs last month' }}
        />
        <KpiCard
          title="Active Subscriptions"
          value="127"
          icon={CreditCard}
          iconColor="text-violet-600"
          change={{ value: 3.2, label: 'vs last month' }}
        />
        <KpiCard
          title="Failed Payments"
          value="3"
          icon={AlertCircle}
          iconColor="text-amber-600"
          change={{ value: -40, label: 'vs last month' }}
        />
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="text-heading font-semibold mb-4">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.name} href={module.href}>
                <Card className="h-full rounded-2xl shadow-card border-border/50 hover:shadow-card-hover hover:border-border transition-all cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-body font-semibold">
                      {module.name}
                    </CardTitle>
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Icon className={`h-5 w-5 ${module.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-display font-bold mb-1">{module.count}</div>
                    <CardDescription className="text-body-sm">{module.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Payments */}
      <Card className="rounded-2xl shadow-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-heading">Recent Payments</CardTitle>
          <CardDescription>Latest transactions from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      payment.status === 'succeeded'
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-body">{payment.customer}</div>
                    <div className="text-body-sm text-muted-foreground">
                      {payment.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="rounded-lg">{payment.type}</Badge>
                  <div className="text-right">
                    <div className="font-semibold tabular-nums">{payment.amount}</div>
                    <div className="text-caption text-muted-foreground">
                      {payment.date}
                    </div>
                  </div>
                  <Badge
                    variant={
                      payment.status === 'succeeded' ? 'success' : 'destructive'
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
