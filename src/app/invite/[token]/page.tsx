import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, CheckCircle, XCircle, LogIn } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getInvitationByToken, acceptInvitation } from '@/lib/invitations'
import { getSession } from '@/lib/auth-helpers'
import { AcceptInvitationButton } from './accept-button'

interface InvitePageProps {
  params: { token: string }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = params
  const session = await getSession()
  const result = await getInvitationByToken(token)

  // If invitation not found or expired
  if (result.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { invitation } = result

  // If not signed in, show sign-in prompt
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>You're Invited!</CardTitle>
            <CardDescription>
              <strong>{invitation.invitedBy.name || invitation.invitedBy.email}</strong> has invited you to join{' '}
              <strong>{invitation.organization.name}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-sm text-muted-foreground">
                This invitation was sent to:
              </p>
              <p className="font-semibold mt-1">{invitation.email}</p>
            </div>
            
            <div className="space-y-2">
              <Link href={`/auth/sign-in?callbackUrl=/invite/${token}`} className="block">
                <Button className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Accept
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link href={`/auth/sign-up?callbackUrl=/invite/${token}`} className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if email matches
  const emailMatches = session.user.email?.toLowerCase() === invitation.email.toLowerCase()

  if (!emailMatches) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 mb-4">
              <XCircle className="h-6 w-6 text-warning" />
            </div>
            <CardTitle>Email Mismatch</CardTitle>
            <CardDescription>
              This invitation was sent to <strong>{invitation.email}</strong>, but you're signed in as{' '}
              <strong>{session.user.email}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Please sign in with the correct email address to accept this invitation.
            </p>
            <Link href={`/auth/sign-in?callbackUrl=/invite/${token}`}>
              <Button variant="outline" className="w-full">
                Sign in with different account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show acceptance UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Join {invitation.organization.name}</CardTitle>
          <CardDescription>
            <strong>{invitation.invitedBy.name || invitation.invitedBy.email}</strong> has invited you to join their organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Organization</span>
              <span className="font-medium">{invitation.organization.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Your Role</span>
              <span className="font-medium capitalize">{invitation.role.toLowerCase()}</span>
            </div>
          </div>

          <AcceptInvitationButton token={token} organizationName={invitation.organization.name} />
        </CardContent>
      </Card>
    </div>
  )
}

