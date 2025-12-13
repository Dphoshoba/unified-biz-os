import { NextResponse } from 'next/server'
import { importContacts } from '@/lib/crm/import-export'

export async function POST(req: Request) {
  try {
    const { csvText } = await req.json()

    if (!csvText || typeof csvText !== 'string') {
      return NextResponse.json(
        { success: false, error: 'CSV text is required' },
        { status: 400 }
      )
    }

    const results = await importContacts(csvText)

    return NextResponse.json({
      imported: true,
      ...results,
    })
  } catch (error) {
    console.error('Failed to import contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import contacts' },
      { status: 500 }
    )
  }
}

