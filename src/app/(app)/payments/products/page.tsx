import { Plus, MoreHorizontal, Package, DollarSign, Users, Zap } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/dashboard'

const products = [
  {
    id: '1',
    name: 'Starter Plan',
    description: 'Perfect for individuals and small teams',
    type: 'subscription',
    price: '$29/month',
    customers: 45,
    status: 'active',
  },
  {
    id: '2',
    name: 'Pro Plan',
    description: 'For growing businesses with advanced needs',
    type: 'subscription',
    price: '$99/month',
    customers: 62,
    status: 'active',
  },
  {
    id: '3',
    name: 'Enterprise Plan',
    description: 'Custom solutions for large organizations',
    type: 'subscription',
    price: '$299/month',
    customers: 20,
    status: 'active',
  },
  {
    id: '4',
    name: 'Strategy Consultation',
    description: 'One-time 60-minute strategy session',
    type: 'one-time',
    price: '$150',
    customers: 87,
    status: 'active',
  },
  {
    id: '5',
    name: 'VIP Day Package',
    description: 'Full-day intensive workshop',
    type: 'one-time',
    price: '$2,000',
    customers: 12,
    status: 'active',
  },
  {
    id: '6',
    name: 'Legacy Plan',
    description: 'Discontinued plan for existing customers',
    type: 'subscription',
    price: '$49/month',
    customers: 8,
    status: 'archived',
  },
]

export default function ProductsPage() {
  const activeProducts = products.filter(p => p.status === 'active').length
  const totalCustomers = products.reduce((sum, p) => sum + p.customers, 0)
  const subscriptionProducts = products.filter(p => p.type === 'subscription').length

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Products"
        description="Manage your products and pricing."
      >
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total Products"
          value={products.length}
          icon={Package}
          iconColor="text-blue-600"
        />
        <KpiCard
          title="Active Products"
          value={activeProducts}
          icon={Zap}
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
          iconColor="text-violet-600"
          change={{ value: 12.3, label: 'vs last month' }}
        />
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-heading font-semibold mb-4">Your Products</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="rounded-2xl shadow-card border-border/50 hover:shadow-card-hover hover:border-border transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-body font-semibold">{product.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-caption rounded-lg">
                          {product.type}
                        </Badge>
                        <Badge
                          variant={
                            product.status === 'active' ? 'success' : 'secondary'
                          }
                          className="text-caption"
                        >
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-body-sm">{product.description}</CardDescription>
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="text-display font-bold">{product.price}</div>
                  <div className="text-body-sm text-muted-foreground">
                    {product.customers} customers
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Product Card */}
          <Card className="border-dashed rounded-2xl cursor-pointer hover:bg-accent/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
              <Plus className="h-8 w-8 mb-2" />
              <span className="font-medium">Add New Product</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
