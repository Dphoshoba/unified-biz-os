import { NextResponse } from 'next/server'
import { exportContacts } from '@/lib/crm/import-export'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    const csv = await exportContacts({ status, search })

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Failed to export contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export contacts' },
      { status: 500 }
    )
  }
}

