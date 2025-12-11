import Link from 'next/link'
import {
  User,
  Building2,
  Palette,
  CreditCard,
  Bell,
  Shield,
  Puzzle,
  Users,
} from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const settingsGroups = [
  {
    title: 'Account',
    items: [
      {
        name: 'Profile',
        description: 'Manage your personal information',
        href: '/settings/profile',
        icon: User,
      },
      {
        name: 'Organization',
        description: 'Manage your organization settings',
        href: '/settings/organization',
        icon: Building2,
      },
      {
        name: 'Team Members',
        description: 'Invite and manage team members',
        href: '/settings/team',
        icon: Users,
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        name: 'Branding',
        description: 'Customize your brand appearance',
        href: '/settings/branding',
        icon: Palette,
      },
      {
        name: 'Notifications',
        description: 'Configure notification preferences',
        href: '/settings/notifications',
        icon: Bell,
      },
    ],
  },
  {
    title: 'Business',
    items: [
      {
        name: 'Billing',
        description: 'Manage your subscription and billing',
        href: '/settings/billing',
        icon: CreditCard,
      },
      {
        name: 'Integrations',
        description: 'Connect third-party services',
        href: '/settings/integrations',
        icon: Puzzle,
      },
      {
        name: 'Security',
        description: 'Security settings and 2FA',
        href: '/settings/security',
        icon: Shield,
      },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Settings"
        description="Manage your account and organization settings."
      />

      <div className="space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-lg font-semibold mb-4">{group.title}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href}>
                    <Card className="h-full card-hover cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-base">{item.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

