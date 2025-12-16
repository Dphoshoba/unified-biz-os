import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { generateAIResponse } from '@/lib/ai/openai'
import { getBusinessContext } from '@/lib/ai/business-context'

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Fetch business context
    const businessContext = await getBusinessContext()

    // Generate AI response
    const response = await generateAIResponse(message, businessContext)

    return NextResponse.json({
      success: true,
      response,
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate response',
        fallback: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.'
      },
      { status: 500 }
    )
  }
}

