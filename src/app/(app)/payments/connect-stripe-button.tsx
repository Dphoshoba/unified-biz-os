'use client'

import { useState } from 'react'
import { Link2, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createStripeConnectLink } from '@/lib/stripe/payments'

interface ConnectStripeButtonProps {
  initialStatus?: {
    configured: boolean
    connected: boolean
    chargesEnabled?: boolean
    detailsSubmitted?: boolean
  }
}

export function ConnectStripeButton({ initialStatus }: ConnectStripeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createStripeConnectLink()

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.url) {
        // Redirect to Stripe Connect onboarding
        window.location.href = result.url
      }
    } catch (err) {
      setError('Failed to connect to Stripe. Please try again.')
      console.error('Stripe connect error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // If Stripe is not configured (missing env vars)
  if (!initialStatus?.configured) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button className="rounded-xl" variant="outline" disabled>
          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
          Stripe Not Configured
        </Button>
        <p className="text-xs text-muted-foreground">
          Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to Vercel
        </p>
      </div>
    )
  }

  // If already connected and setup complete
  if (initialStatus?.connected && initialStatus?.chargesEnabled) {
    return (
      <Button className="rounded-xl" variant="outline" disabled>
        <CheckCircle className="h-4 w-4 mr-2 text-success" />
        Stripe Connected
      </Button>
    )
  }

  // If connected but setup incomplete
  if (initialStatus?.connected && !initialStatus?.chargesEnabled) {
    return (
      <Button 
        className="rounded-xl" 
        onClick={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Link2 className="h-4 w-4 mr-2" />
        )}
        Complete Stripe Setup
      </Button>
    )
  }

  // Configured but not connected yet
  return (
    <div className="flex flex-col items-end gap-1">
      <Button 
        className="rounded-xl" 
        onClick={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Link2 className="h-4 w-4 mr-2" />
        )}
        Connect Stripe
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

