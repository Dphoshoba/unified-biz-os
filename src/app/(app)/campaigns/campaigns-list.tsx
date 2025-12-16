'use client'

import { useState, useEffect } from 'react'
import { Mail, Send, Calendar, Users, Eye, MousePointerClick, MoreVertical, Trash2, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Campaign, CampaignStatus } from '@prisma/client'

export function CampaignsList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns')
      const data = await response.json()
      if (data.success) {
        setCampaigns(data.campaigns || [])
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign?')) return

    try {
      const response = await fetch('/api/campaigns/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      })

      const data = await response.json()
      if (data.success) {
        alert(`Campaign sent! ${data.sent} emails delivered.`)
        fetchCampaigns()
      } else {
        alert(data.error || 'Failed to send campaign')
      }
    } catch (error) {
      console.error('Failed to send campaign:', error)
      alert('Failed to send campaign')
    }
  }

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      const response = await fetch(`/api/campaigns?id=${campaignId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        fetchCampaigns()
      } else {
        alert(data.error || 'Failed to delete campaign')
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error)
      alert('Failed to delete campaign')
    }
  }

  const getStatusBadge = (status: CampaignStatus) => {
    const variants: Record<CampaignStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      DRAFT: { label: 'Draft', variant: 'outline' },
      SCHEDULED: { label: 'Scheduled', variant: 'secondary' },
      SENDING: { label: 'Sending', variant: 'default' },
      SENT: { label: 'Sent', variant: 'default' },
      CANCELLED: { label: 'Cancelled', variant: 'outline' },
    }
    const config = variants[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getOpenRate = (campaign: Campaign) => {
    if (campaign.sentCount === 0) return 0
    return ((campaign.openedCount / campaign.sentCount) * 100).toFixed(1)
  }

  const getClickRate = (campaign: Campaign) => {
    if (campaign.sentCount === 0) return 0
    return ((campaign.clickedCount / campaign.sentCount) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading campaigns...</p>
        </CardContent>
      </Card>
    )
  }

  if (campaigns.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-16 text-center">
          <Mail className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No campaigns yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first email campaign to reach your audience
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="rounded-2xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle>{campaign.name}</CardTitle>
                  {getStatusBadge(campaign.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {campaign.totalRecipients} recipients
                  </div>
                  {campaign.scheduledAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(campaign.scheduledAt).toLocaleDateString()}
                    </div>
                  )}
                  {campaign.sentAt && (
                    <div className="flex items-center gap-1">
                      <Send className="h-4 w-4" />
                      Sent {new Date(campaign.sentAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {campaign.status === 'DRAFT' && (
                    <DropdownMenuItem onClick={() => handleSend(campaign.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Send Now
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleDelete(campaign.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          {campaign.status === 'SENT' && (
            <CardContent>
              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Sent</p>
                  <p className="text-lg font-semibold">{campaign.sentCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Opened
                  </p>
                  <p className="text-lg font-semibold">
                    {campaign.openedCount} ({getOpenRate(campaign)}%)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MousePointerClick className="h-3 w-3" />
                    Clicked
                  </p>
                  <p className="text-lg font-semibold">
                    {campaign.clickedCount} ({getClickRate(campaign)}%)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bounced</p>
                  <p className="text-lg font-semibold text-destructive">{campaign.bouncedCount}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

