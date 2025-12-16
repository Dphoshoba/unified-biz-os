import { NextResponse } from 'next/server'
import { getRevenueData } from '@/lib/analytics/data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getRevenueData()
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Failed to fetch revenue data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}

