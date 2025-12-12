import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceId = invoice.metadata?.invoiceId

        if (invoiceId) {
          await db.invoice.update({
            where: { id: invoiceId },
            data: {
              status: 'PAID',
              paidAt: new Date(),
            },
          })
          console.log(`Invoice ${invoiceId} marked as paid`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceId = invoice.metadata?.invoiceId

        if (invoiceId) {
          console.log(`Payment failed for invoice ${invoiceId}`)
          // Could update status or send notification
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const productId = session.metadata?.productId
        const organizationId = session.metadata?.organizationId

        if (productId && organizationId) {
          console.log(`Checkout completed for product ${productId}`)
          // Could create an order record, send confirmation email, etc.
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log(`Subscription ${subscription.id} ${event.type.split('.').pop()}`)
        // Handle subscription creation/update
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log(`Subscription ${subscription.id} cancelled`)
        // Handle subscription cancellation
        break
      }

      case 'account.updated': {
        // Stripe Connect account updated
        const account = event.data.object as Stripe.Account
        const organizationId = account.metadata?.organizationId

        if (organizationId) {
          console.log(`Stripe Connect account updated for org ${organizationId}`)
          // Could update organization settings based on account status
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}


