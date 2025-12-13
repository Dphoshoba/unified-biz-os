import { Zap, Play, Pause, MoreHorizontal, Clock, Mail, Users, TrendingUp, Trash2 } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/dashboard'
import { CreateAutomationDialog } from './create-automation-dialog'
import { AutomationActions } from './automation-actions'
import { getAutomations, getAutomationStats } from '@/lib/automations/actions'
import { formatTriggerType, formatActionType } from '@/lib/automations/utils'

const templates = [
  {
    id: '1',
    name: 'Welcome Sequence',
    description: 'Onboard new contacts with a series of emails',
    icon: Mail,
  },
  {
    id: '2',
    name: 'Appointment Reminders',
    description: 'Automatically remind clients before appointments',
    icon: Clock,
  },
  {
    id: '3',
    name: 'Lead Nurturing',
    description: 'Follow up with leads who haven\'t converted',
    icon: Users,
  },
]

function formatLastRun(date: Date | null): string {
  if (!date) return 'Never'
  
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  return `${days} days ago`
}

export default async function AutomationsPage() {
  const [automations, stats] = await Promise.all([
    getAutomations(),
    getAutomationStats(),
  ])

  // Calculate estimated time saved (assume 5 min saved per execution)
  const timeSaved = Math.round((stats.executions * 5) / 60)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Automations"
        description="Create workflows to automate repetitive tasks."
      >
        <CreateAutomationDialog />
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Active Automations"
          value={stats.active}
          icon={Zap}
          iconColor="text-emerald-600"
          change={{ value: stats.active > 0 ? 100 : 0, label: 'total active' }}
        />
        <KpiCard
          title="Total Executions"
          value={stats.executions.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-blue-600"
          change={{ value: stats.executions > 0 ? 100 : 0, label: 'all time' }}
        />
        <KpiCard
          title="Time Saved"
          value={`${timeSaved}h`}
          icon={Clock}
          iconColor="text-violet-600"
          change={{ value: timeSaved > 0 ? 100 : 0, label: 'estimated' }}
        />
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-heading font-semibold mb-4">Quick Start Templates</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {templates.map((template) => {
            const Icon = template.icon
            return (
              <Card key={template.id} className="rounded-2xl shadow-card border-border/50 hover:shadow-card-hover hover:border-border transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-body font-semibold">{template.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-body-sm">{template.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Automations List */}
      <div>
        <h2 className="text-heading font-semibold mb-4">Your Automations</h2>
        {automations.length === 0 ? (
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-12 text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No automations yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first automation to save time on repetitive tasks.
              </p>
              <CreateAutomationDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {automations.map((automation) => (
              <Card key={automation.id} className="rounded-2xl shadow-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          automation.status === 'ACTIVE'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{automation.name}</h3>
                          <Badge
                            variant={
                              automation.status === 'ACTIVE' ? 'success' : 'secondary'
                            }
                          >
                            {automation.status.toLowerCase()}
                          </Badge>
                        </div>
                        {automation.description && (
                          <p className="text-body-sm text-muted-foreground mb-2">
                            {automation.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-caption text-muted-foreground">
                          <span>
                            <strong>Trigger:</strong> {formatTriggerType(automation.triggerType)}
                          </span>
                          <span>
                            <strong>Action:</strong> {formatActionType(automation.actionType)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-body font-medium">
                          {automation.executions} runs
                        </div>
                        <div className="text-caption text-muted-foreground">
                          Last run {formatLastRun(automation.lastRunAt)}
                        </div>
                      </div>
                      <AutomationActions 
                        id={automation.id} 
                        status={automation.status} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
