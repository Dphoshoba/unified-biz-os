import { Plus, Zap, Play, Pause, MoreHorizontal, Clock, Mail, Users, TrendingUp } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/dashboard'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'

const automations = [
  {
    id: '1',
    name: 'Welcome Email Sequence',
    description: 'Send welcome emails to new contacts',
    trigger: 'New form submission',
    action: 'Send email',
    status: 'active',
    executions: 234,
    lastRun: '2 hours ago',
  },
  {
    id: '2',
    name: 'Appointment Reminder',
    description: 'Send reminder 24h before appointment',
    trigger: 'New appointment booked',
    action: 'Schedule reminder email',
    status: 'active',
    executions: 89,
    lastRun: '30 minutes ago',
  },
  {
    id: '3',
    name: 'Deal Stage Notification',
    description: 'Notify team when deal moves to proposal',
    trigger: 'Deal stage changed',
    action: 'Send email',
    status: 'active',
    executions: 45,
    lastRun: '1 day ago',
  },
  {
    id: '4',
    name: 'Payment Follow-up',
    description: 'Tag contact after successful payment',
    trigger: 'Payment completed',
    action: 'Update contact tags',
    status: 'paused',
    executions: 156,
    lastRun: '3 days ago',
  },
]

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

export default function AutomationsPage() {
  const totalExecutions = automations.reduce((sum, a) => sum + a.executions, 0)
  const activeCount = automations.filter(a => a.status === 'active').length

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Automations"
        description="Create workflows to automate repetitive tasks."
      >
        <ComingSoonButton featureName="Create Automation" className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </ComingSoonButton>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Active Automations"
          value={activeCount}
          icon={Zap}
          iconColor="text-emerald-600"
          change={{ value: 50, label: 'vs last month' }}
        />
        <KpiCard
          title="Total Executions"
          value={totalExecutions.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-blue-600"
          change={{ value: 23.5, label: 'vs last month' }}
        />
        <KpiCard
          title="Time Saved"
          value="87h"
          icon={Clock}
          iconColor="text-violet-600"
          change={{ value: 18.2, label: 'vs last month' }}
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
        <div className="space-y-4">
          {automations.map((automation) => (
            <Card key={automation.id} className="rounded-2xl shadow-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        automation.status === 'active'
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
                            automation.status === 'active' ? 'success' : 'secondary'
                          }
                        >
                          {automation.status}
                        </Badge>
                      </div>
                      <p className="text-body-sm text-muted-foreground mb-2">
                        {automation.description}
                      </p>
                      <div className="flex items-center gap-4 text-caption text-muted-foreground">
                        <span>
                          <strong>Trigger:</strong> {automation.trigger}
                        </span>
                        <span>
                          <strong>Action:</strong> {automation.action}
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
                        Last run {automation.lastRun}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        {automation.status === 'active' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
