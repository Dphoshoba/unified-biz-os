import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { generateDocumentContent } from '@/lib/ai/openai'

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { prompt, clientName, documentType, existingContent } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Generate document content
    const content = await generateDocumentContent(prompt, {
      clientName,
      documentType,
      existingContent,
    })

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error('AI document generation error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate content',
      },
      { status: 500 }
    )
  }
}

