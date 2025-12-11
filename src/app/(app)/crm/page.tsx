import Link from 'next/link'
import { Users, Building2, Handshake, GitBranch, Upload, TrendingUp, DollarSign } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/dashboard'
import { getContactsCount, getCompaniesCount, getDealsStats } from '@/lib/crm'

export default async function CRMPage() {
  const [contactsCount, companiesCount, dealStats] = await Promise.all([
    getContactsCount(),
    getCompaniesCount(),
    getDealsStats(),
  ])

  const modules = [
    {
      name: 'Contacts',
      description: 'Manage your contacts and leads',
      href: '/crm/contacts',
      icon: Users,
      count: contactsCount.toString(),
      color: 'text-blue-600',
    },
    {
      name: 'Companies',
      description: 'Track organizations and accounts',
      href: '/crm/companies',
      icon: Building2,
      count: companiesCount.toString(),
      color: 'text-violet-600',
    },
    {
      name: 'Deals',
      description: 'Track opportunities and revenue',
      href: '/crm/deals',
      icon: Handshake,
      count: dealStats.total.toString(),
      color: 'text-emerald-600',
    },
    {
      name: 'Pipeline',
      description: 'Visual deal pipeline view',
      href: '/crm/pipeline',
      icon: GitBranch,
      count: `${dealStats.open} open`,
      color: 'text-amber-600',
    },
  ]

  // Calculate pipeline value
  const pipelineValue = dealStats.totalValue || 0

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="CRM"
        description="Manage your contacts, companies, and deals in one place."
      >
        <Button className="rounded-xl">
          <Upload className="h-4 w-4 mr-2" />
          Import Contacts
        </Button>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Contacts"
          value={contactsCount.toLocaleString()}
          icon={Users}
          iconColor="text-blue-600"
          change={{ value: 12.5, label: 'vs last month' }}
        />
        <KpiCard
          title="Companies"
          value={companiesCount.toLocaleString()}
          icon={Building2}
          iconColor="text-violet-600"
          change={{ value: 8.2, label: 'vs last month' }}
        />
        <KpiCard
          title="Open Deals"
          value={dealStats.open}
          icon={Handshake}
          iconColor="text-emerald-600"
          change={{ value: 15.3, label: 'vs last month' }}
        />
        <KpiCard
          title="Pipeline Value"
          value={`$${(pipelineValue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          iconColor="text-amber-600"
          change={{ value: 22.1, label: 'vs last month' }}
        />
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="text-heading font-semibold mb-4">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.name} href={module.href}>
                <Card className="h-full rounded-2xl shadow-card border-border/50 hover:shadow-card-hover hover:border-border transition-all cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-body font-semibold">
                      {module.name}
                    </CardTitle>
                    <div className={`p-2 rounded-xl bg-primary/10`}>
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
    </div>
  )
}
