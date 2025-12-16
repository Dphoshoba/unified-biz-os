import { Mail, Send, Calendar, Users, Eye, MousePointerClick } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CampaignsList } from './campaigns-list'
import { CreateCampaignButton } from './create-campaign-button'

export default async function CampaignsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Campaigns"
        description="Send newsletters and product updates via email broadcasts."
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Campaigns</h2>
          <p className="text-muted-foreground">
            Create and send email broadcasts to your contacts
          </p>
        </div>
        <CreateCampaignButton />
      </div>

      <CampaignsList />
    </div>
  )
}

