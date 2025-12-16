import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { toggleCalendarSync } from '@/lib/calendar/actions'

export const dynamic = 'force-dynamic'

/**
 * Toggle calendar sync
 */
export async function POST(req: NextRequest) {
  try {
    await requireAuthWithOrg()
    const { integrationId, enabled } = await req.json()

    if (!integrationId || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Integration ID and enabled status are required' },
        { status: 400 }
      )
    }

    const result = await toggleCalendarSync(integrationId, enabled)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to toggle calendar sync:', error)
    return NextResponse.json(
      { error: 'Failed to update sync settings' },
      { status: 500 }
    )
  }
}

