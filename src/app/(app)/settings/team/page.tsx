import { Users, Mail, Shield, Crown, UserMinus } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getTeamMembers, getInvitations } from '@/lib/invitations'
import { InviteTeamMemberDialog } from './invite-dialog'
import { PendingInvitations } from './pending-invitations'
import { TeamMemberActions } from './team-member-actions'

const roleColors: Record<string, 'default' | 'secondary' | 'warning'> = {
  OWNER: 'warning',
  ADMIN: 'secondary',
  MEMBER: 'default',
}

const roleIcons: Record<string, typeof Crown> = {
  OWNER: Crown,
  ADMIN: Shield,
  MEMBER: Users,
}

export default async function TeamSettingsPage() {
  const [members, invitations] = await Promise.all([
    getTeamMembers(),
    getInvitations(),
  ])

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Team"
        description="Manage your team members and invitations"
      >
        <InviteTeamMemberDialog />
      </PageHeader>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
            <CardDescription>
              {invitations.length} pending invitation{invitations.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PendingInvitations invitations={invitations} />
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            {members.length} member{members.length !== 1 ? 's' : ''} in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {members.map((member) => {
              const RoleIcon = roleIcons[member.role]
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {member.name || 'No name'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={roleColors[member.role]} className="gap-1">
                      <RoleIcon className="h-3 w-3" />
                      {member.role.toLowerCase()}
                    </Badge>
                    <TeamMemberActions member={member} />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


