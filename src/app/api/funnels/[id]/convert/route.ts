import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    // Increment conversion count
    await db.funnel.update({
      where: { id },
      data: { conversions: { increment: 1 } },
    })

    // TODO: Create contact from form data
    // TODO: Trigger automations
    // TODO: Send emails

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to record conversion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record conversion' },
      { status: 500 }
    )
  }
}

