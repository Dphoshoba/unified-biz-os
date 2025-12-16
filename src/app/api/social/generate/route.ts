import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { generateAIResponse } from '@/lib/ai/openai'

/**
 * Generate social media post content using AI
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { prompt, platform } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Create platform-specific prompt
    const platformPrompts: Record<string, string> = {
      TWITTER: 'Write a Twitter post (280 characters max) that is engaging, includes relevant hashtags, and has a clear call-to-action. Make it viral-ready with emojis.',
      LINKEDIN: 'Write a professional LinkedIn post that is informative, engaging, and includes relevant hashtags. Keep it professional but personable.',
      INSTAGRAM: 'Write an Instagram post caption that is engaging, includes relevant hashtags, and has a clear call-to-action. Make it visually appealing with emojis.',
      FACEBOOK: 'Write a Facebook post that is engaging, includes relevant hashtags, and encourages interaction. Make it friendly and conversational.',
    }

    const systemPrompt = platformPrompts[platform] || 'Write a social media post that is engaging and includes relevant hashtags.'

    const client = require('openai')
    const openai = new client.OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 300,
    })

    const content = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error('AI social generation error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate content',
        fallback: 'I apologize, but I couldn\'t generate content right now. Please try again later.'
      },
      { status: 500 }
    )
  }
}

