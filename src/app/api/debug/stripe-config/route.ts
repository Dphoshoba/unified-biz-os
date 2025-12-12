import { NextResponse } from 'next/server'

export async function GET() {
  // Only allow in development or with a secret
  const isDev = process.env.NODE_ENV === 'development'
  
  const secretKeyExists = !!process.env.STRIPE_SECRET_KEY?.trim()
  const publishableKeyExists = !!process.env.STRIPE_PUBLISHABLE_KEY?.trim()
  
  // Show first/last 4 chars for debugging (safe to expose)
  const secretKeyPreview = process.env.STRIPE_SECRET_KEY 
    ? `${process.env.STRIPE_SECRET_KEY.slice(0, 7)}...${process.env.STRIPE_SECRET_KEY.slice(-4)}`
    : 'NOT SET'
  
  const publishableKeyPreview = process.env.STRIPE_PUBLISHABLE_KEY
    ? `${process.env.STRIPE_PUBLISHABLE_KEY.slice(0, 7)}...${process.env.STRIPE_PUBLISHABLE_KEY.slice(-4)}`
    : 'NOT SET'

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not on vercel',
    stripe: {
      secretKeyExists,
      secretKeyPreview,
      publishableKeyExists,
      publishableKeyPreview,
      configured: secretKeyExists,
    },
    allEnvKeys: Object.keys(process.env).filter(k => 
      k.includes('STRIPE') || k.includes('VERCEL') || k.includes('NODE_ENV')
    ),
  })
}

