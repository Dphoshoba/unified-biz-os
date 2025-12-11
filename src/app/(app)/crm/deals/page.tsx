import { Search, Filter, MoreHorizontal } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getDeals, getDealsStats } from '@/lib/crm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AddDealDialog } from './add-deal-dialog'

const statusColors: Record<string, 'default' | 'success' | 'secondary' | 'warning' | 'destructive'> = {
  OPEN: 'default',
  WON: 'success',
  LOST: 'destructive',
}

export default async function DealsPage() {
  const [deals, stats] = await Promise.all([
    getDeals({ limit: 50 }),
    getDealsStats(),
  ])

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Deals"
        description={`${stats.total} total deals • ${formatCurrency(stats.wonValue)} won`}
      >
        <AddDealDialog />
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Open Deals</div>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Won</div>
            <div className="text-2xl font-bold text-success">{stats.won}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Lost</div>
            <div className="text-2xl font-bold text-destructive">{stats.lost}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search deals..." className="pl-10 max-w-md" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Close Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {deals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No deals found. Create your first deal to get started.
                    </td>
                  </tr>
                ) : (
                  deals.map((deal) => (
                    <tr
                      key={deal.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">{deal.name}</div>
                        {deal.company && (
                          <div className="text-sm text-muted-foreground">
                            {deal.company.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {formatCurrency(deal.value, deal.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: deal.stage.color,
                            color: deal.stage.color,
                          }}
                        >
                          {deal.stage.name}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColors[deal.status]}>
                          {deal.status.toLowerCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {deal.contact
                          ? `${deal.contact.firstName} ${deal.contact.lastName}`
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {deal.expectedCloseDate
                          ? formatDate(deal.expectedCloseDate)
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
