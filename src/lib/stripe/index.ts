import Stripe from 'stripe'

// Server-side Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Check if Stripe is configured
export const isStripeConfigured = () => {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY)
}

// Get publishable key for client
export const getStripePublishableKey = () => {
  return process.env.STRIPE_PUBLISHABLE_KEY || ''
}

