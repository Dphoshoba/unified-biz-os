import { NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { getCalendarIntegrations } from '@/lib/calendar/actions'

export const dynamic = 'force-dynamic'

/**
 * Get calendar integrations
 */
export async function GET() {
  try {
    const session = await requireAuthWithOrg()
    const integrations = await getCalendarIntegrations()
    
    // Don't expose access tokens
    const safeIntegrations = integrations.map(integration => ({
      id: integration.id,
      provider: integration.provider,
      isActive: integration.isActive,
      syncEnabled: integration.syncEnabled,
      createdAt: integration.createdAt,
    }))

    return NextResponse.json({
      success: true,
      integrations: safeIntegrations,
    })
  } catch (error) {
    console.error('Failed to fetch calendar integrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    )
  }
}

/**
 * Delete calendar integration
 */
export async function DELETE(req: Request) {
  try {
    const session = await requireAuthWithOrg()
    const { searchParams } = new URL(req.url)
    const integrationId = searchParams.get('id')

    if (!integrationId) {
      return NextResponse.json(
        { error: 'Integration ID is required' },
        { status: 400 }
      )
    }

    const { deleteCalendarIntegration } = await import('@/lib/calendar/actions')
    const result = await deleteCalendarIntegration(integrationId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete calendar integration:', error)
    return NextResponse.json(
      { error: 'Failed to delete integration' },
      { status: 500 }
    )
  }
}

