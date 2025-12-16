import { Calendar } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { CalendarIntegrations } from '../calendar-integrations'

export default function IntegrationsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Integrations"
        description="Connect third-party services to enhance your workflow."
      />

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Calendar Integrations</h2>
          </div>
          <CalendarIntegrations />
        </div>
      </div>
    </div>
  )
}

