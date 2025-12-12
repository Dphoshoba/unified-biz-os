'use server'

import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { stripe, isStripeConfigured } from './index'

// =============================================================================
// TYPES
// =============================================================================

export type CreateProductInput = {
  name: string
  description?: string
  price: number // in cents
  currency?: string
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year'
    intervalCount?: number
  }
}

export type CreateInvoiceInput = {
  contactId: string
  items: {
    description: string
    quantity: number
    unitAmount: number // in cents
  }[]
  dueDate?: Date
  notes?: string
}

// =============================================================================
// PRODUCTS
// =============================================================================

/**
 * Get all products for the organization
 */
export async function getProducts() {
  const session = await requireAuthWithOrg()

  const products = await db.product.findMany({
    where: { organizationId: session.activeOrganizationId },
    orderBy: { createdAt: 'desc' },
  })

  return products
}

/**
 * Create a new product (and sync to Stripe if configured)
 */
export async function createProduct(input: CreateProductInput) {
  const session = await requireAuthWithOrg()
  const { name, description, price, currency = 'usd', recurring } = input

  let stripeProductId: string | null = null
  let stripePriceId: string | null = null

  // If Stripe is configured, create product in Stripe
  if (isStripeConfigured()) {
    try {
      const stripeProduct = await stripe.products.create({
        name,
        description: description || undefined,
        metadata: {
          organizationId: session.activeOrganizationId,
        },
      })
      stripeProductId = stripeProduct.id

      const priceData: Stripe.PriceCreateParams = {
        product: stripeProduct.id,
        unit_amount: price,
        currency,
      }

      if (recurring) {
        priceData.recurring = {
          interval: recurring.interval,
          interval_count: recurring.intervalCount || 1,
        }
      }

      const stripePrice = await stripe.prices.create(priceData)
      stripePriceId = stripePrice.id
    } catch (error) {
      console.error('Failed to create Stripe product:', error)
      // Continue without Stripe - product will be local only
    }
  }

  const product = await db.product.create({
    data: {
      organizationId: session.activeOrganizationId,
      name,
      description,
      price,
      currency,
      stripeProductId,
      stripePriceId,
      isRecurring: !!recurring,
      recurringInterval: recurring?.interval,
    },
  })

  revalidatePath('/payments/products')
  return { success: true, product }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
  const session = await requireAuthWithOrg()

  const product = await db.product.findFirst({
    where: {
      id: productId,
      organizationId: session.activeOrganizationId,
    },
  })

  if (!product) {
    return { error: 'Product not found' }
  }

  // Archive in Stripe if exists
  if (product.stripeProductId && isStripeConfigured()) {
    try {
      await stripe.products.update(product.stripeProductId, { active: false })
    } catch (error) {
      console.error('Failed to archive Stripe product:', error)
    }
  }

  await db.product.delete({ where: { id: productId } })

  revalidatePath('/payments/products')
  return { success: true }
}

// =============================================================================
// INVOICES
// =============================================================================

/**
 * Get all invoices for the organization
 */
export async function getInvoices() {
  const session = await requireAuthWithOrg()

  const invoices = await db.invoice.findMany({
    where: { organizationId: session.activeOrganizationId },
    include: {
      contact: {
        select: { firstName: true, lastName: true, email: true },
      },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return invoices
}

/**
 * Create a new invoice
 */
export async function createInvoice(input: CreateInvoiceInput) {
  const session = await requireAuthWithOrg()
  const { contactId, items, dueDate, notes } = input

  // Verify contact belongs to org
  const contact = await db.contact.findFirst({
    where: {
      id: contactId,
      organizationId: session.activeOrganizationId,
    },
  })

  if (!contact) {
    return { error: 'Contact not found' }
  }

  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.quantity * item.unitAmount), 0)

  // Generate invoice number
  const invoiceCount = await db.invoice.count({
    where: { organizationId: session.activeOrganizationId },
  })
  const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(5, '0')}`

  const invoice = await db.invoice.create({
    data: {
      organizationId: session.activeOrganizationId,
      contactId,
      invoiceNumber,
      status: 'DRAFT',
      total,
      currency: 'usd',
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      notes,
      items: {
        create: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitAmount: item.unitAmount,
          total: item.quantity * item.unitAmount,
        })),
      },
    },
    include: {
      items: true,
    },
  })

  revalidatePath('/payments/invoices')
  return { success: true, invoice }
}

/**
 * Send an invoice (creates Stripe invoice if configured)
 */
export async function sendInvoice(invoiceId: string) {
  const session = await requireAuthWithOrg()

  const invoice = await db.invoice.findFirst({
    where: {
      id: invoiceId,
      organizationId: session.activeOrganizationId,
    },
    include: {
      contact: true,
      items: true,
    },
  })

  if (!invoice) {
    return { error: 'Invoice not found' }
  }

  if (invoice.status !== 'DRAFT') {
    return { error: 'Invoice has already been sent' }
  }

  let stripeInvoiceId: string | null = null
  let paymentUrl: string | null = null

  // Create Stripe invoice if configured and contact has email
  if (isStripeConfigured() && invoice.contact.email) {
    try {
      // Get or create Stripe customer
      let stripeCustomerId = invoice.contact.stripeCustomerId

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: invoice.contact.email,
          name: `${invoice.contact.firstName} ${invoice.contact.lastName}`.trim() || undefined,
          metadata: {
            contactId: invoice.contact.id,
            organizationId: session.activeOrganizationId,
          },
        })
        stripeCustomerId = customer.id

        // Save Stripe customer ID to contact
        await db.contact.update({
          where: { id: invoice.contact.id },
          data: { stripeCustomerId },
        })
      }

      // Create Stripe invoice
      const stripeInvoice = await stripe.invoices.create({
        customer: stripeCustomerId,
        collection_method: 'send_invoice',
        days_until_due: Math.ceil((invoice.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        metadata: {
          invoiceId: invoice.id,
          organizationId: session.activeOrganizationId,
        },
      })

      // Add line items
      for (const item of invoice.items) {
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          invoice: stripeInvoice.id,
          description: item.description,
          amount: item.quantity * item.unitAmount,
          currency: invoice.currency,
        })
      }

      // Finalize and send
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id)
      await stripe.invoices.sendInvoice(stripeInvoice.id)

      stripeInvoiceId = stripeInvoice.id
      paymentUrl = finalizedInvoice.hosted_invoice_url ?? null
    } catch (error) {
      console.error('Failed to create Stripe invoice:', error)
      // Continue without Stripe
    }
  }

  // Update invoice status
  await db.invoice.update({
    where: { id: invoiceId },
    data: {
      status: 'SENT',
      sentAt: new Date(),
      stripeInvoiceId,
      paymentUrl,
    },
  })

  revalidatePath('/payments/invoices')
  return { success: true, paymentUrl }
}

/**
 * Mark invoice as paid
 */
export async function markInvoiceAsPaid(invoiceId: string) {
  const session = await requireAuthWithOrg()

  const invoice = await db.invoice.findFirst({
    where: {
      id: invoiceId,
      organizationId: session.activeOrganizationId,
    },
  })

  if (!invoice) {
    return { error: 'Invoice not found' }
  }

  await db.invoice.update({
    where: { id: invoiceId },
    data: {
      status: 'PAID',
      paidAt: new Date(),
    },
  })

  revalidatePath('/payments/invoices')
  return { success: true }
}

// =============================================================================
// CHECKOUT
// =============================================================================

/**
 * Create a checkout session for a product
 */
export async function createCheckoutSession(productId: string, successUrl: string, cancelUrl: string) {
  const session = await requireAuthWithOrg()

  if (!isStripeConfigured()) {
    return { error: 'Stripe is not configured' }
  }

  const product = await db.product.findFirst({
    where: {
      id: productId,
      organizationId: session.activeOrganizationId,
    },
  })

  if (!product) {
    return { error: 'Product not found' }
  }

  if (!product.stripePriceId) {
    return { error: 'Product is not available for purchase' }
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: product.isRecurring ? 'subscription' : 'payment',
      line_items: [
        {
          price: product.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        productId: product.id,
        organizationId: session.activeOrganizationId,
      },
    })

    return { success: true, url: checkoutSession.url }
  } catch (error) {
    console.error('Failed to create checkout session:', error)
    return { error: 'Failed to create checkout session' }
  }
}

// =============================================================================
// STRIPE CONNECT (for receiving payments)
// =============================================================================

/**
 * Create a Stripe Connect account link for onboarding
 */
export async function createStripeConnectLink() {
  const session = await requireAuthWithOrg()

  if (!isStripeConfigured()) {
    return { error: 'Stripe is not configured' }
  }

  const organization = await db.organization.findUnique({
    where: { id: session.activeOrganizationId },
  })

  if (!organization) {
    return { error: 'Organization not found' }
  }

  try {
    let stripeAccountId = organization.stripeAccountId

    // Create Stripe Connect account if doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'standard',
        metadata: {
          organizationId: session.activeOrganizationId,
        },
      })
      stripeAccountId = account.id

      await db.organization.update({
        where: { id: session.activeOrganizationId },
        data: { stripeAccountId },
      })
    }

    // Create account link for onboarding
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/settings/payments`,
      return_url: `${baseUrl}/settings/payments?success=true`,
      type: 'account_onboarding',
    })

    return { success: true, url: accountLink.url }
  } catch (error) {
    console.error('Failed to create Stripe Connect link:', error)
    return { error: 'Failed to create Stripe Connect link' }
  }
}

/**
 * Check Stripe Connect account status
 */
export async function getStripeConnectStatus() {
  const session = await requireAuthWithOrg()

  if (!isStripeConfigured()) {
    return { configured: false, connected: false }
  }

  const organization = await db.organization.findUnique({
    where: { id: session.activeOrganizationId },
  })

  if (!organization?.stripeAccountId) {
    return { configured: true, connected: false }
  }

  try {
    const account = await stripe.accounts.retrieve(organization.stripeAccountId)
    return {
      configured: true,
      connected: true,
      accountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    }
  } catch (error) {
    console.error('Failed to get Stripe account:', error)
    return { configured: true, connected: false }
  }
}


