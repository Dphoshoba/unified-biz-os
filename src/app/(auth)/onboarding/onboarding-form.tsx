'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Building2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFirstOrganization } from './actions'

export function OnboardingForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await createFirstOrganization(formData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Create your organization</CardTitle>
        <CardDescription>
          Set up your workspace to get started with UnifiedBizOS
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Acme Inc"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">app.unifiedbizos.com/</span>
              <Input
                id="slug"
                name="slug"
                type="text"
                placeholder="acme"
                required
                pattern="^[a-z0-9-]+$"
                disabled={isLoading}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Only lowercase letters, numbers, and hyphens
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Organization
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}



