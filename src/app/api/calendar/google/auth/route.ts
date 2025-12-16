import { NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { getGoogleAuthUrl } from '@/lib/calendar/google'

export const dynamic = 'force-dynamic'

/**
 * Get Google Calendar authorization URL
 */
export async function GET() {
  try {
    await requireAuthWithOrg()
    
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Google Calendar is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.' },
        { status: 500 }
      )
    }

    const authUrl = getGoogleAuthUrl()
    return NextResponse.json({
      success: true,
      authUrl,
    })
  } catch (error) {
    console.error('Failed to get Google auth URL:', error)
    return NextResponse.json(
      { error: 'Failed to get authorization URL' },
      { status: 500 }
    )
  }
}

