'use client'

import * as React from 'react'
import { MoreHorizontal, UserMinus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { removeTeamMember } from '@/lib/invitations'

interface TeamMember {
  id: string
  userId: string
  name: string | null
  email: string
  role: string
}

interface TeamMemberActionsProps {
  member: TeamMember
}

export function TeamMemberActions({ member }: TeamMemberActionsProps) {
  const router = useRouter()
  const [isRemoving, setIsRemoving] = React.useState(false)

  async function handleRemove() {
    if (!confirm(`Are you sure you want to remove ${member.name || member.email} from the organization?`)) {
      return
    }

    setIsRemoving(true)
    try {
      const result = await removeTeamMember(member.id)
      if (result.error) {
        alert(result.error)
      } else {
        router.refresh()
      }
    } catch (error) {
      alert('Failed to remove team member')
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" disabled={isRemoving}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleRemove}
          className="text-destructive focus:text-destructive"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Remove from team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


