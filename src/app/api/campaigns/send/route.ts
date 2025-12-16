import { NextRequest, NextResponse } from 'next/server'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { sendCampaign } from '@/lib/campaigns/actions'
import { sendEmail } from '@/lib/email'
import { db } from '@/lib/db'

/**
 * Send a campaign to all recipients
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthWithOrg()
    const { campaignId } = await req.json()

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        organizationId: session.activeOrganizationId,
      },
      include: {
        recipients: {
          where: { status: 'PENDING' },
          include: {
            contact: true,
          },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Send emails to all pending recipients
    let sentCount = 0
    let failedCount = 0

    for (const recipient of campaign.recipients) {
      try {
        // Replace variables in content
        let emailContent = campaign.content
        if (recipient.contact) {
          emailContent = emailContent
            .replace(/{{Contact\.FirstName}}/g, recipient.contact.firstName)
            .replace(/{{Contact\.LastName}}/g, recipient.contact.lastName)
            .replace(/{{Contact\.Name}}/g, `${recipient.contact.firstName} ${recipient.contact.lastName}`)
            .replace(/{{Contact\.Email}}/g, recipient.contact.email || recipient.email)
        }

        await sendEmail({
          to: recipient.email,
          subject: campaign.subject,
          html: emailContent,
        })

        // Update recipient status
        await db.campaignRecipient.update({
          where: { id: recipient.id },
          data: {
            status: 'SENT',
          },
        })

        sentCount++
      } catch (error) {
        console.error(`Failed to send to ${recipient.email}:`, error)
        await db.campaignRecipient.update({
          where: { id: recipient.id },
          data: {
            status: 'FAILED',
          },
        })
        failedCount++
      }
    }

    // Update campaign status
    await db.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        sentCount: sentCount,
      },
    })

    return NextResponse.json({
      success: true,
      sent: sentCount,
      failed: failedCount,
    })
  } catch (error) {
    console.error('Campaign send error:', error)
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    )
  }
}

