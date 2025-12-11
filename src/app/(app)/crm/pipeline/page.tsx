import { Plus, MoreHorizontal } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getDefaultPipeline, getDealsByStage, getDealsStats } from '@/lib/crm'
import { formatCurrency } from '@/lib/utils'
import { redirect } from 'next/navigation'

export default async function PipelinePage() {
  const pipeline = await getDefaultPipeline()

  if (!pipeline) {
    redirect('/crm/deals')
  }

  const [stages, stats] = await Promise.all([
    getDealsByStage(pipeline.id),
    getDealsStats(),
  ])

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Pipeline"
        description={`${stats.open} open deals • ${formatCurrency(stats.totalValue)} total value`}
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </PageHeader>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {stages.map((stage) => (
          <Card key={stage.id}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-sm text-muted-foreground">{stage.name}</span>
              </div>
              <div className="text-xl font-bold">{formatCurrency(stage.totalValue)}</div>
              <div className="text-xs text-muted-foreground">
                {stage.deals.length} deal{stage.deals.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-[320px]">
              <Card className="h-full bg-muted/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      {stage.name}
                      <Badge variant="secondary" className="text-xs">
                        {stage.deals.length}
                      </Badge>
                    </CardTitle>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(stage.totalValue)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stage.deals.map((deal) => (
                    <Card
                      key={deal.id}
                      className="cursor-pointer card-hover bg-card"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-sm leading-tight line-clamp-2">
                            {deal.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-6 w-6 shrink-0"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-lg font-bold text-primary mb-3">
                          {formatCurrency(deal.value, deal.currency)}
                        </div>
                        <div className="flex items-center justify-between">
                          {deal.contact ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {deal.contact.firstName[0]}
                                  {deal.contact.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                                {deal.contact.firstName} {deal.contact.lastName}
                              </span>
                            </div>
                          ) : deal.company ? (
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {deal.company.name}
                            </span>
                          ) : (
                            <span />
                          )}
                          {deal.assignedTo && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {deal.assignedTo.name
                                  ?.split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2) || '?'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add deal
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
