'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { acceptInvitation } from '@/lib/invitations'

interface AcceptInvitationButtonProps {
  token: string
  organizationName: string
}

export function AcceptInvitationButton({ token, organizationName }: AcceptInvitationButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  async function handleAccept() {
    setIsLoading(true)
    setError(null)

    try {
      const result = await acceptInvitation(token)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      setSuccess(true)
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError('Failed to accept invitation')
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-6 w-6 text-success" />
        </div>
        <div>
          <p className="font-semibold">Welcome to {organizationName}!</p>
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}
      <Button onClick={handleAccept} disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Accept Invitation
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        By accepting, you'll be added as a team member
      </p>
    </div>
  )
}


