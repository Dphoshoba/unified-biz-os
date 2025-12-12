'use client'

import * as React from 'react'
import { Loader2, Plus, X, UserPlus, Mail, Check, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createInvitation } from '@/lib/invitations'
import { MembershipRole } from '@prisma/client'

const roles: { value: MembershipRole; label: string; description: string }[] = [
  { value: 'MEMBER', label: 'Member', description: 'Can view and edit CRM data' },
  { value: 'ADMIN', label: 'Admin', description: 'Can manage team and settings' },
  { value: 'OWNER', label: 'Owner', description: 'Full access to everything' },
]

export function InviteTeamMemberDialog() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<{ email: string; token: string } | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<MembershipRole>('MEMBER')
  const [copied, setCopied] = React.useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    try {
      const result = await createInvitation({
        email,
        role: selectedRole,
      })

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      // Show success with invite link
      setSuccess({
        email,
        token: result.invitation!.token,
      })
      router.refresh()
    } catch (err) {
      setError('Failed to send invitation')
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    setOpen(false)
    setError(null)
    setSuccess(null)
    setSelectedRole('MEMBER')
    setCopied(false)
  }

  function getInviteUrl(token: string) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/invite/${token}`
    }
    return `/invite/${token}`
  }

  async function copyInviteLink() {
    if (success?.token) {
      await navigator.clipboard.writeText(getInviteUrl(success.token))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4 mr-2" />
        Invite Team Member
      </Button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Dialog */}
          <div className="relative z-50 w-full max-w-md mx-4 bg-background rounded-2xl shadow-xl border">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Invite Team Member</h2>
                  <p className="text-sm text-muted-foreground">
                    Send an invitation to join your organization
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              /* Success State */
              <div className="px-6 py-8">
                <div className="text-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-lg">Invitation Sent!</h3>
                  <p className="text-muted-foreground mt-1">
                    An invitation has been created for <strong>{success.email}</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Share this invitation link:</Label>
                  <div className="flex gap-2">
                    <Input
                      value={getInviteUrl(success.token)}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyInviteLink}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This link expires in 7 days
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={handleClose}>
                    Done
                  </Button>
                  <Button onClick={() => {
                    setSuccess(null)
                    setError(null)
                  }}>
                    Invite Another
                  </Button>
                </div>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4 space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="colleague@example.com"
                        required
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            selectedRole === role.value
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {role.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Send Invitation
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}


