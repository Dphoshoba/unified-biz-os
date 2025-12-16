import { NextResponse } from 'next/server'
import { getContactGrowthData } from '@/lib/analytics/data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getContactGrowthData()
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Failed to fetch contact growth data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact growth data' },
      { status: 500 }
    )
  }
}

