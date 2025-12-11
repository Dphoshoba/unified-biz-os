import Link from 'next/link'
import { Plus, Clock, DollarSign, MoreHorizontal, ExternalLink, Users, Zap } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { KpiCard } from '@/components/dashboard'
import { getServices } from '@/lib/bookings'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

function formatPrice(price: number, currency: string): string {
  if (price === 0) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export default async function ServicesPage() {
  const session = await requireAuthWithOrg()
  
  const [services, org] = await Promise.all([
    getServices(),
    db.organization.findUnique({
      where: { id: session.activeOrganizationId },
      select: { slug: true },
    }),
  ])

  const activeServices = services.filter(s => s.isActive).length
  const totalBookings = services.reduce((sum, s) => sum + s._count.bookings, 0)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Services"
        description="Configure your bookable services and pricing."
      >
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total Services"
          value={services.length}
          icon={Clock}
          iconColor="text-blue-600"
        />
        <KpiCard
          title="Active Services"
          value={activeServices}
          icon={Zap}
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Total Bookings"
          value={totalBookings}
          icon={Users}
          iconColor="text-violet-600"
          change={{ value: 18.5, label: 'vs last month' }}
        />
      </div>

      {/* Services Grid */}
      <div>
        <h2 className="text-heading font-semibold mb-4">Your Services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="rounded-2xl shadow-card border-border/50 hover:shadow-card-hover hover:border-border transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <CardTitle className="text-body font-semibold">{service.name}</CardTitle>
                    </div>
                    <Badge
                      variant={service.isActive ? 'success' : 'secondary'}
                      className="mt-2"
                    >
                      {service.isActive ? 'active' : 'inactive'}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2 text-body-sm">
                  {service.description || 'No description'}
                </CardDescription>

                <div className="flex items-center justify-between text-body-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(service.durationMinutes)}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatPrice(service.price, service.currency)}</span>
                  </div>
                </div>

                {/* Providers */}
                {service.providers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex -space-x-2">
                      {service.providers.slice(0, 3).map((provider) => (
                        <Avatar key={provider.id} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={provider.image || undefined} />
                          <AvatarFallback className="text-[10px]">
                            {provider.name?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {service.providers.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                          +{service.providers.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-caption text-muted-foreground">
                    {service._count.bookings} bookings
                  </span>
                  <Link href={`/book/${org?.slug}?service=${service.id}`} target="_blank">
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      View Page
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Service Card */}
          <Card className="border-dashed rounded-2xl cursor-pointer hover:bg-accent/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[250px] text-muted-foreground">
              <Plus className="h-8 w-8 mb-2" />
              <span className="font-medium">Add New Service</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-heading-sm font-medium mb-2">No services yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first bookable service to start accepting appointments.
          </p>
          <Button className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      )}
    </div>
  )
}
