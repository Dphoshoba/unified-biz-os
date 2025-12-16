import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { createCampaign, getCampaigns, updateCampaign, deleteCampaign } from '@/lib/campaigns/actions'

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const campaigns = await getCampaigns()
    return NextResponse.json({ success: true, campaigns })
  } catch (error) {
    console.error('Failed to fetch campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const body = await req.json()
    
    const result = await createCampaign({
      name: body.name,
      subject: body.subject,
      content: body.content,
      recipientType: body.recipientType || 'ALL_CONTACTS',
      segmentIds: body.segmentIds,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, campaign: result.campaign })
  } catch (error) {
    console.error('Failed to create campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const body = await req.json()
    
    const result = await updateCampaign({
      id: body.id,
      name: body.name,
      subject: body.subject,
      content: body.content,
      status: body.status,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update campaign:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    const result = await deleteCampaign(id)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete campaign:', error)
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}

