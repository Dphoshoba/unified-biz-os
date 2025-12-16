import { NextResponse } from 'next/server'
import { getDealPipelineData } from '@/lib/analytics/data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getDealPipelineData()
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Failed to fetch pipeline data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pipeline data' },
      { status: 500 }
    )
  }
}

