'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { CampaignStatus, RecipientType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export interface CreateCampaignInput {
  name: string
  subject: string
  content: string
  recipientType: RecipientType
  segmentIds?: string[]
  scheduledAt?: Date
}

export interface UpdateCampaignInput {
  id: string
  name?: string
  subject?: string
  content?: string
  status?: CampaignStatus
  scheduledAt?: Date
}

export async function getCampaigns() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  try {
    const campaigns = await db.campaign.findMany({
      where: { organizationId: session.activeOrganizationId },
      orderBy: { createdAt: 'desc' },
      include: {
        recipients: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return campaigns
  } catch (error) {
    console.error('Failed to fetch campaigns:', error)
    return []
  }
}

export async function getCampaign(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return null
  }

  try {
    const campaign = await db.campaign.findFirst({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
      include: {
        recipients: {
          include: {
            contact: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return campaign
  } catch (error) {
    console.error('Failed to fetch campaign:', error)
    return null
  }
}

export async function createCampaign(input: CreateCampaignInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId || !session.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Get recipients based on type
    let recipients: { email: string; contactId: string | null }[] = []
    
    if (input.recipientType === 'ALL_CONTACTS') {
      const contacts = await db.contact.findMany({
        where: {
          organizationId: session.activeOrganizationId,
          email: { not: null },
        },
        select: { id: true, email: true },
      })
      recipients = contacts.map(c => ({
        email: c.email!,
        contactId: c.id,
      }))
    } else if (input.recipientType === 'SEGMENT' && input.segmentIds) {
      // TODO: Implement segment-based recipient selection
      // For now, use all contacts
      const contacts = await db.contact.findMany({
        where: {
          organizationId: session.activeOrganizationId,
          email: { not: null },
        },
        select: { id: true, email: true },
      })
      recipients = contacts.map(c => ({
        email: c.email!,
        contactId: c.id,
      }))
    }

    const campaign = await db.campaign.create({
      data: {
        organizationId: session.activeOrganizationId,
        name: input.name,
        subject: input.subject,
        content: input.content,
        status: input.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
        recipientType: input.recipientType,
        segmentIds: input.segmentIds || [],
        scheduledAt: input.scheduledAt,
        totalRecipients: recipients.length,
        recipients: {
          create: recipients.map(r => ({
            contactId: r.contactId,
            email: r.email,
          })),
        },
      },
    })

    revalidatePath('/campaigns')
    return { success: true, campaign }
  } catch (error) {
    console.error('Failed to create campaign:', error)
    return { success: false, error: 'Failed to create campaign' }
  }
}

export async function updateCampaign(input: UpdateCampaignInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const campaign = await db.campaign.updateMany({
      where: {
        id: input.id,
        organizationId: session.activeOrganizationId,
      },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.subject && { subject: input.subject }),
        ...(input.content && { content: input.content }),
        ...(input.status && { status: input.status }),
        ...(input.scheduledAt !== undefined && { scheduledAt: input.scheduledAt }),
      },
    })

    revalidatePath('/campaigns')
    return { success: true }
  } catch (error) {
    console.error('Failed to update campaign:', error)
    return { success: false, error: 'Failed to update campaign' }
  }
}

export async function deleteCampaign(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.campaign.deleteMany({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
    })

    revalidatePath('/campaigns')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete campaign:', error)
    return { success: false, error: 'Failed to delete campaign' }
  }
}

export async function sendCampaign(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const campaign = await db.campaign.findFirst({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
      include: {
        recipients: {
          where: { status: 'PENDING' },
        },
      },
    })

    if (!campaign) {
      return { success: false, error: 'Campaign not found' }
    }

    // Update campaign status
    await db.campaign.update({
      where: { id },
      data: {
        status: CampaignStatus.SENDING,
      },
    })

    // Send emails (this would be done via a queue in production)
    // For now, we'll mark them as sent
    await db.campaignRecipient.updateMany({
      where: {
        campaignId: id,
        status: 'PENDING',
      },
      data: {
        status: 'SENT',
      },
    })

    await db.campaign.update({
      where: { id },
      data: {
        status: CampaignStatus.SENT,
        sentAt: new Date(),
        sentCount: campaign.recipients.length,
      },
    })

    revalidatePath('/campaigns')
    return { success: true }
  } catch (error) {
    console.error('Failed to send campaign:', error)
    return { success: false, error: 'Failed to send campaign' }
  }
}

