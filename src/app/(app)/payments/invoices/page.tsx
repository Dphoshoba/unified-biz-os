import { Search, Filter, MoreHorizontal, Download, Send, Plus, Receipt, DollarSign, Clock } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { KpiCard } from '@/components/dashboard'

const invoices = [
  {
    id: 'INV-001',
    customer: 'Sarah Johnson',
    email: 'sarah@acme.com',
    amount: '$299.00',
    status: 'paid',
    dueDate: 'Dec 1, 2024',
    paidDate: 'Nov 28, 2024',
  },
  {
    id: 'INV-002',
    customer: 'Michael Chen',
    email: 'mchen@techstart.io',
    amount: '$99.00',
    status: 'paid',
    dueDate: 'Dec 5, 2024',
    paidDate: 'Dec 3, 2024',
  },
  {
    id: 'INV-003',
    customer: 'Emily Davis',
    email: 'emily@globalventures.com',
    amount: '$299.00',
    status: 'pending',
    dueDate: 'Dec 15, 2024',
    paidDate: null,
  },
  {
    id: 'INV-004',
    customer: 'James Wilson',
    email: 'jwilson@innovate.co',
    amount: '$99.00',
    status: 'overdue',
    dueDate: 'Dec 5, 2024',
    paidDate: null,
  },
  {
    id: 'INV-005',
    customer: 'Lisa Anderson',
    email: 'lisa@creativestudio.design',
    amount: '$150.00',
    status: 'paid',
    dueDate: 'Dec 10, 2024',
    paidDate: 'Dec 8, 2024',
  },
  {
    id: 'INV-006',
    customer: 'Tom Brown',
    email: 'tom@newco.io',
    amount: '$29.00',
    status: 'draft',
    dueDate: 'Dec 20, 2024',
    paidDate: null,
  },
]

const statusVariants: Record<string, 'success' | 'warning' | 'secondary' | 'destructive'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'destructive',
  draft: 'secondary',
}

export default function InvoicesPage() {
  const paidCount = invoices.filter(i => i.status === 'paid').length
  const pendingCount = invoices.filter(i => i.status === 'pending').length
  const overdueCount = invoices.filter(i => i.status === 'overdue').length

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader title="Invoices" description="Manage invoices and receipts.">
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total Invoices"
          value={invoices.length}
          icon={Receipt}
          iconColor="text-blue-600"
        />
        <KpiCard
          title="Paid"
          value={paidCount}
          icon={DollarSign}
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Pending / Overdue"
          value={`${pendingCount} / ${overdueCount}`}
          icon={Clock}
          iconColor="text-amber-600"
        />
      </div>

      {/* Filters */}
      <Card className="rounded-2xl shadow-card border-border/50">
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-10 max-w-md rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="rounded-2xl shadow-card border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Paid Date
                  </th>
                  <th className="px-6 py-3 text-right text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-body font-medium">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-body">{invoice.customer}</div>
                        <div className="text-caption text-muted-foreground">
                          {invoice.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body font-semibold tabular-nums">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[invoice.status]}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-muted-foreground">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-muted-foreground">
                      {invoice.paidDate || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="rounded-xl" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl" title="Send">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
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
