import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not set' })
  }

  try {
    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
    })

    // Try to create a test account
    const account = await stripe.accounts.create({
      type: 'standard',
      metadata: {
        test: 'true',
      },
    })

    // Clean up - delete the test account
    await stripe.accounts.del(account.id)

    return NextResponse.json({
      success: true,
      message: 'Stripe Connect is working!',
      accountCreated: account.id,
      vercelUrl: process.env.VERCEL_URL,
      nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      raw: error.raw?.message,
    })
  }
}

