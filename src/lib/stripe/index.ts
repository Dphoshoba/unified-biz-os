import Stripe from 'stripe'

// Lazy-loaded Stripe client to avoid build-time errors
let _stripe: Stripe | null = null

export const getStripe = () => {
  if (!_stripe && process.env.STRIPE_SECRET_KEY) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  }
  return _stripe
}

// For backwards compatibility - use getStripe() for null-safe access
export const stripe = {
  get products() { return getStripe()!.products },
  get prices() { return getStripe()!.prices },
  get customers() { return getStripe()!.customers },
  get invoices() { return getStripe()!.invoices },
  get invoiceItems() { return getStripe()!.invoiceItems },
  get checkout() { return getStripe()!.checkout },
  get accounts() { return getStripe()!.accounts },
  get accountLinks() { return getStripe()!.accountLinks },
  get webhooks() { return getStripe()!.webhooks },
}

// Check if Stripe is configured
export const isStripeConfigured = () => {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY)
}

// Get publishable key for client
export const getStripePublishableKey = () => {
  return process.env.STRIPE_PUBLISHABLE_KEY || ''
}


