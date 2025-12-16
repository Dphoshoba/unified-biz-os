import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { exchangeGoogleCode } from '@/lib/calendar/google'
import { createCalendarIntegration } from '@/lib/calendar/actions'

export const dynamic = 'force-dynamic'

/**
 * Handle Google Calendar OAuth callback
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/settings?error=calendar_auth_failed`
      )
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/settings?error=no_code`
      )
    }

    // Exchange code for tokens
    const tokens = await exchangeGoogleCode(code)

    if (!tokens.access_token) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/settings?error=no_token`
      )
    }

    // Save integration
    await createCalendarIntegration(
      'GOOGLE',
      tokens.access_token,
      tokens.refresh_token || undefined,
      tokens.expiry_date ? new Date(tokens.expiry_date) : undefined
    )

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/settings?success=calendar_connected`
    )
  } catch (error) {
    console.error('Google Calendar callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/settings?error=calendar_auth_failed`
    )
  }
}

