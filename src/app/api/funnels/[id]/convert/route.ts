import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createContactFromFunnel } from '@/lib/crm/contacts-public'
import { triggerAutomations } from '@/lib/automations/executor'
import { sendEmail } from '@/lib/email'
import { AutomationTrigger } from '@prisma/client'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    // Get funnel with organization
    const funnel = await db.funnel.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!funnel) {
      return NextResponse.json(
        { success: false, error: 'Funnel not found' },
        { status: 404 }
      )
    }

    // Increment conversion count
    await db.funnel.update({
      where: { id },
      data: { conversions: { increment: 1 } },
    })

    // Parse form data
    const email = body.email as string | undefined
    const name = body.name as string | undefined
    const firstName = body.firstName as string | undefined
    const lastName = body.lastName as string | undefined
    const phone = body.phone as string | undefined

    let contactId: string | undefined

    // Create or update contact if email/name provided
    if (email || name || firstName) {
      const contact = await createContactFromFunnel(funnel.organizationId, {
        email,
        name,
        firstName,
        lastName,
        phone,
        source: `Funnel: ${funnel.name}`,
        notes: `Submitted via funnel: ${funnel.name} (${funnel.slug})`,
      })

      contactId = contact.id

      // Trigger CONTACT_CREATED automations (if this is a new contact)
      if (email) {
        const existingContact = await db.contact.findUnique({
          where: {
            organizationId_email: {
              organizationId: funnel.organizationId,
              email,
            },
          },
        })

        // Only trigger if this is a new contact
        if (!existingContact || existingContact.id === contact.id) {
          await triggerAutomations(
            funnel.organizationId,
            AutomationTrigger.CONTACT_CREATED,
            {
              contactId: contact.id,
              email: contact.email,
              firstName: contact.firstName,
              lastName: contact.lastName,
            }
          )
        }
      }
    }

    // Trigger FORM_SUBMITTED automations
    await triggerAutomations(
      funnel.organizationId,
      AutomationTrigger.FORM_SUBMITTED,
      {
        funnelId: funnel.id,
        funnelName: funnel.name,
        contactId,
        email,
        name,
        firstName,
        lastName,
        phone,
      }
    )

    // Send confirmation email if email provided
    if (email) {
      try {
        await sendEmail({
          to: email,
          subject: `Thank you for your submission - ${funnel.organization.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Thank You!</h2>
              <p>Hi ${firstName || name || 'there'},</p>
              <p>Thank you for your interest in <strong>${funnel.organization.name}</strong>.</p>
              <p>We've received your submission and will be in touch soon.</p>
              ${funnel.description ? `<p><em>${funnel.description}</em></p>` : ''}
              <p>Best regards,<br>The ${funnel.organization.name} Team</p>
            </div>
          `,
        })
      } catch (emailError) {
        // Don't fail the whole request if email fails
        console.error('Failed to send confirmation email:', emailError)
      }
    }

    return NextResponse.json({ 
      success: true,
      contactId,
    })
  } catch (error) {
    console.error('Failed to record conversion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record conversion' },
      { status: 500 }
    )
  }
}

