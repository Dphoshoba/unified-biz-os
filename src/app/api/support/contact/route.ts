import { NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { sendEmail } from '@/lib/email'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await requireAuthWithOrg()
    const { subject, message } = await req.json()

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message are required' },
        { status: 400 }
      )
    }

    // Get user information
    const userEmail = session.user.email || 'unknown@example.com'
    const userName = session.user.name || 'Unknown User'
    
    // Get organization name
    let organizationName = 'Unknown Organization'
    if (session.activeOrganizationId) {
      const org = await db.organization.findUnique({
        where: { id: session.activeOrganizationId },
        select: { name: true },
      })
      organizationName = org?.name || 'Unknown Organization'
    }

    // Send email notification to support
    const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM || 'support@eternalechoesvisions.com'
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; margin-bottom: 5px; display: block; }
            .value { color: #333; }
            .message-box { background: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; color: #2563eb;">New Support Request</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">From:</span>
                <span class="value">${userName} (${userEmail})</span>
              </div>
              <div class="field">
                <span class="label">Organization:</span>
                <span class="value">${organizationName}</span>
              </div>
              <div class="field">
                <span class="label">Subject:</span>
                <span class="value">${subject}</span>
              </div>
              <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">${message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Support Request

From: ${userName} (${userEmail})
Organization: ${organizationName}
Subject: ${subject}

Message:
${message}
    `

    // Send email
    const emailResult = await sendEmail({
      to: supportEmail,
      subject: `[Support Request] ${subject}`,
      html: emailHtml,
      text: emailText,
    })

    if (!emailResult.success) {
      console.error('Failed to send support email:', emailResult.error)
      // Still return success to user, but log the error
    }

    // Send confirmation email to user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Support Request Received</h2>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              <p>Thank you for contacting Eternal Echoes & Visions support. We've received your message and will get back to you as soon as possible.</p>
              <p><strong>Your request:</strong></p>
              <p style="background: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</p>
              <p>Best regards,<br>Eternal Echoes & Visions Support Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: userEmail,
      subject: 'Support Request Received - Eternal Echoes & Visions',
      html: confirmationHtml,
      text: `Thank you for contacting Eternal Echoes & Visions support. We've received your message and will get back to you as soon as possible.\n\nYour request:\n${message}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support contact error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send support message' 
      },
      { status: 500 }
    )
  }
}

