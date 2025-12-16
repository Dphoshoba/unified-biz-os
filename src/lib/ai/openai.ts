import OpenAI from 'openai'

let openaiClient: OpenAI | null = null

export function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not set, AI features will be disabled')
    return null
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  return openaiClient
}

/**
 * Generate AI response with business context
 */
export async function generateAIResponse(
  userMessage: string,
  businessContext?: {
    contacts?: number
    deals?: number
    revenue?: string
    appointments?: number
    activeDeals?: { name: string; value: number }[]
    upcomingAppointments?: { time: string; client: string }[]
    topClients?: { name: string; revenue: string }[]
  }
): Promise<string> {
  const client = getOpenAIClient()
  
  if (!client) {
    // Fallback response if OpenAI is not configured
    return 'I apologize, but AI features are not currently configured. Please set your OPENAI_API_KEY environment variable to enable AI assistance.'
  }

  const systemPrompt = `You are Nexus AI, a helpful business assistant for a Business Operating System. You have access to the user's CRM, calendar, invoices, and deals data.

Your role is to:
- Answer questions about the user's business data accurately
- Provide insights and recommendations
- Help with scheduling, contacts, deals, and revenue questions
- Be concise but helpful

Current business context:
${businessContext ? `
- Total Contacts: ${businessContext.contacts || 0}
- Active Deals: ${businessContext.deals || 0}
- Monthly Revenue: ${businessContext.revenue || '$0'}
- Upcoming Appointments: ${businessContext.appointments || 0}
${businessContext.activeDeals?.length ? `\nActive Deals:\n${businessContext.activeDeals.map(d => `- ${d.name}: $${d.value}`).join('\n')}` : ''}
${businessContext.upcomingAppointments?.length ? `\nUpcoming Appointments:\n${businessContext.upcomingAppointments.map(a => `- ${a.time}: ${a.client}`).join('\n')}` : ''}
${businessContext.topClients?.length ? `\nTop Clients:\n${businessContext.topClients.map(c => `- ${c.name}: ${c.revenue}`).join('\n')}` : ''}
` : 'No business context available.'}

Be conversational, helpful, and data-driven. If you don't have specific data, acknowledge it and provide general guidance.`

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Using cost-effective model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate AI response')
  }
}

/**
 * Generate document content using AI
 */
export async function generateDocumentContent(
  prompt: string,
  context?: {
    clientName?: string
    documentType?: string
    existingContent?: string
  }
): Promise<string> {
  const client = getOpenAIClient()
  
  if (!client) {
    throw new Error('OpenAI API key not configured')
  }

  const systemPrompt = `You are a professional business document writer. Generate high-quality, professional content for business documents like proposals, contracts, and reports.

${context?.clientName ? `Client: ${context.clientName}` : ''}
${context?.documentType ? `Document Type: ${context.documentType}` : ''}

Generate professional, clear, and well-structured content. Use proper business language and formatting.`

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate document content')
  }
}

