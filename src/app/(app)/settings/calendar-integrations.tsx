'use client'

import { useState, useEffect } from 'react'
import { Calendar, CheckCircle2, X, Loader2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface CalendarIntegration {
  id: string
  provider: 'GOOGLE' | 'OUTLOOK' | 'APPLE'
  isActive: boolean
  syncEnabled: boolean
  createdAt: Date
}

export function CalendarIntegrations() {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/calendar/integrations')
      const data = await response.json()
      if (data.success) {
        setIntegrations(data.integrations || [])
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (provider: 'GOOGLE' | 'OUTLOOK') => {
    setConnecting(provider)
    try {
      if (provider === 'GOOGLE') {
        const response = await fetch('/api/calendar/google/auth')
        const data = await response.json()
        if (data.success && data.authUrl) {
          window.location.href = data.authUrl
        } else {
          alert(data.error || 'Failed to get authorization URL')
        }
      } else {
        // TODO: Implement Outlook OAuth
        alert('Outlook integration coming soon!')
      }
    } catch (error) {
      console.error('Failed to connect calendar:', error)
      alert('Failed to connect calendar')
    } finally {
      setConnecting(null)
    }
  }

  const handleToggleSync = async (integrationId: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/calendar/integrations/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId, enabled }),
      })

      const data = await response.json()
      if (data.success) {
        fetchIntegrations()
      } else {
        alert(data.error || 'Failed to update sync settings')
      }
    } catch (error) {
      console.error('Failed to toggle sync:', error)
      alert('Failed to update sync settings')
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm('Are you sure you want to disconnect this calendar?')) return

    try {
      const response = await fetch(`/api/calendar/integrations?id=${integrationId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        fetchIntegrations()
      } else {
        alert(data.error || 'Failed to disconnect calendar')
      }
    } catch (error) {
      console.error('Failed to disconnect calendar:', error)
      alert('Failed to disconnect calendar')
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'GOOGLE':
        return 'Google Calendar'
      case 'OUTLOOK':
        return 'Microsoft Outlook'
      case 'APPLE':
        return 'Apple Calendar'
      default:
        return provider
    }
  }

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading calendar integrations...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Available Integrations */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Google Calendar */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Google Calendar</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sync bookings with Google Calendar
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {integrations.find(i => i.provider === 'GOOGLE') ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="google-sync" className="text-sm">
                    Sync Enabled
                  </Label>
                  <Switch
                    id="google-sync"
                    checked={integrations.find(i => i.provider === 'GOOGLE')?.syncEnabled || false}
                    onCheckedChange={(checked) => {
                      const integration = integrations.find(i => i.provider === 'GOOGLE')
                      if (integration) {
                        handleToggleSync(integration.id, checked)
                      }
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const integration = integrations.find(i => i.provider === 'GOOGLE')
                    if (integration) {
                      handleDisconnect(integration.id)
                    }
                  }}
                  className="w-full rounded-xl"
                >
                  <X className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => handleConnect('GOOGLE')}
                disabled={connecting === 'GOOGLE'}
                className="w-full rounded-xl"
              >
                {connecting === 'GOOGLE' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Google Calendar
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Outlook Calendar */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Microsoft Outlook</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sync bookings with Outlook Calendar
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {integrations.find(i => i.provider === 'OUTLOOK') ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="outlook-sync" className="text-sm">
                    Sync Enabled
                  </Label>
                  <Switch
                    id="outlook-sync"
                    checked={integrations.find(i => i.provider === 'OUTLOOK')?.syncEnabled || false}
                    onCheckedChange={(checked) => {
                      const integration = integrations.find(i => i.provider === 'OUTLOOK')
                      if (integration) {
                        handleToggleSync(integration.id, checked)
                      }
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const integration = integrations.find(i => i.provider === 'OUTLOOK')
                    if (integration) {
                      handleDisconnect(integration.id)
                    }
                  }}
                  className="w-full rounded-xl"
                >
                  <X className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => handleConnect('OUTLOOK')}
                disabled={connecting === 'OUTLOOK'}
                className="w-full rounded-xl"
              >
                {connecting === 'OUTLOOK' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Outlook (Coming Soon)
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            When enabled, your bookings will automatically sync to your connected calendar. 
            New bookings created in the system will appear in your calendar, and you can view 
            external calendar events in your booking calendar view.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

