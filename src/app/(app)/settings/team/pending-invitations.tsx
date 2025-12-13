'use client'

import * as React from 'react'
import { X, Clock, Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteInvitation, type InvitationWithDetails } from '@/lib/invitations'

interface PendingInvitationsProps {
  invitations: InvitationWithDetails[]
}

export function PendingInvitations({ invitations }: PendingInvitationsProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteInvitation(id)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete invitation:', error)
    } finally {
      setDeletingId(null)
    }
  }

  async function copyInviteLink(id: string, token: string) {
    const url = `${window.location.origin}/invite/${token}`
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
        >
          <div className="flex-1">
            <div className="font-medium">{invitation.email}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Expires {formatDistanceToNow(new Date(invitation.expiresAt), { addSuffix: true })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{invitation.role.toLowerCase()}</Badge>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => copyInviteLink(invitation.id, (invitation as any).token)}
              title="Copy invite link"
            >
              {copiedId === invitation.id ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDelete(invitation.id)}
              disabled={deletingId === invitation.id}
              title="Cancel invitation"
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}



