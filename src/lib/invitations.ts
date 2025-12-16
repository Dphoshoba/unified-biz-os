'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg, getSession } from '@/lib/auth-helpers'
import { MembershipRole } from '@prisma/client'
import { sendEmail, invitationEmailTemplate } from '@/lib/email'

// =============================================================================
// TYPES
// =============================================================================

export type InvitationWithDetails = {
  id: string
  email: string
  role: MembershipRole
  token: string
  expiresAt: Date
  createdAt: Date
  invitedBy: { name: string | null; email: string }
}

export type CreateInvitationInput = {
  email: string
  role: MembershipRole
}

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get all pending invitations for the current organization
 */
export async function getInvitations(): Promise<InvitationWithDetails[]> {
  const session = await requireAuthWithOrg()

  const invitations = await db.invitation.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      expiresAt: { gt: new Date() }, // Only non-expired
    },
    include: {
      invitedBy: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return invitations
}

/**
 * Get invitation by token (for accepting)
 */
export async function getInvitationByToken(token: string) {
  const invitation = await db.invitation.findUnique({
    where: { token },
    include: {
      organization: {
        select: { id: true, name: true, slug: true },
      },
      invitedBy: {
        select: { name: true, email: true },
      },
    },
  })

  if (!invitation) {
    return { error: 'Invitation not found' }
  }

  if (invitation.expiresAt < new Date()) {
    return { error: 'This invitation has expired' }
  }

  return { invitation }
}

/**
 * Get team members for current organization
 */
export async function getTeamMembers() {
  const session = await requireAuthWithOrg()

  const memberships = await db.membership.findMany({
    where: { organizationId: session.activeOrganizationId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return memberships.map((m) => ({
    id: m.id,
    userId: m.user.id,
    name: m.user.name,
    email: m.user.email,
    image: m.user.image,
    role: m.role,
    joinedAt: m.createdAt,
  }))
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new invitation
 */
export async function createInvitation(input: CreateInvitationInput) {
  const session = await requireAuthWithOrg()
  const { email, role } = input

  // Check if user is admin/owner
  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: session.activeOrganizationId,
      },
    },
  })

  if (!membership || membership.role === 'MEMBER') {
    return { error: 'You do not have permission to invite team members' }
  }

  // Check if email is already a member
  const existingMember = await db.user.findFirst({
    where: {
      email: email.toLowerCase(),
      memberships: {
        some: { organizationId: session.activeOrganizationId },
      },
    },
  })

  if (existingMember) {
    return { error: 'This user is already a member of this organization' }
  }

  // Check if invitation already exists
  const existingInvitation = await db.invitation.findUnique({
    where: {
      email_organizationId: {
        email: email.toLowerCase(),
        organizationId: session.activeOrganizationId,
      },
    },
  })

  if (existingInvitation) {
    // Update existing invitation
    const invitation = await db.invitation.update({
      where: { id: existingInvitation.id },
      data: {
        role,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        invitedById: session.user.id,
      },
    })

    revalidatePath('/settings/team')
    return { success: true, invitation, renewed: true }
  }

  // Get organization name for the email
  const organization = await db.organization.findUnique({
    where: { id: session.activeOrganizationId },
    select: { name: true },
  })

  // Create new invitation
  const invitation = await db.invitation.create({
    data: {
      email: email.toLowerCase(),
      organizationId: session.activeOrganizationId,
      role,
      invitedById: session.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })

  // Send invitation email
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const inviteUrl = `${baseUrl}/invite/${invitation.token}`
  
  const emailData = invitationEmailTemplate({
    inviterName: session.user.name || session.user.email || 'A team member',
    organizationName: organization?.name || 'the organization',
    role: role.charAt(0) + role.slice(1).toLowerCase(), // Format: "Admin" instead of "ADMIN"
    inviteUrl,
    expiresAt: invitation.expiresAt,
  })

  const emailResult = await sendEmail({
    to: email,
    subject: `You've been invited to join ${organization?.name || 'a team'} on Eternal Echoes & Visions`,
    html: emailData.html,
    text: emailData.text,
  })

  if (!emailResult.success) {
    console.warn('Failed to send invitation email:', emailResult.error)
    // Don't fail the invitation creation, just log the error
  }

  revalidatePath('/settings/team')
  return { success: true, invitation, emailSent: emailResult.success }
}

/**
 * Accept an invitation
 */
export async function acceptInvitation(token: string) {
  const session = await getSession()

  if (!session?.user?.id) {
    return { error: 'You must be signed in to accept an invitation', requiresAuth: true }
  }

  const invitation = await db.invitation.findUnique({
    where: { token },
    include: {
      organization: true,
    },
  })

  if (!invitation) {
    return { error: 'Invitation not found' }
  }

  if (invitation.expiresAt < new Date()) {
    return { error: 'This invitation has expired' }
  }

  // Check if user email matches invitation
  if (session.user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
    return { 
      error: `This invitation was sent to ${invitation.email}. Please sign in with that email address.` 
    }
  }

  // Check if already a member
  const existingMembership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: invitation.organizationId,
      },
    },
  })

  if (existingMembership) {
    // Delete the invitation since they're already a member
    await db.invitation.delete({ where: { id: invitation.id } })
    return { error: 'You are already a member of this organization' }
  }

  // Create membership and delete invitation
  await db.$transaction([
    db.membership.create({
      data: {
        userId: session.user.id,
        organizationId: invitation.organizationId,
        role: invitation.role,
      },
    }),
    db.invitation.delete({ where: { id: invitation.id } }),
    // Set as active organization
    db.user.update({
      where: { id: session.user.id },
      data: { activeOrganizationId: invitation.organizationId },
    }),
  ])

  return { 
    success: true, 
    organizationName: invitation.organization.name,
    organizationId: invitation.organizationId,
  }
}

/**
 * Cancel/delete an invitation
 */
export async function deleteInvitation(invitationId: string) {
  const session = await requireAuthWithOrg()

  // Check if user is admin/owner
  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: session.activeOrganizationId,
      },
    },
  })

  if (!membership || membership.role === 'MEMBER') {
    return { error: 'You do not have permission to manage invitations' }
  }

  // Verify invitation belongs to this org
  const invitation = await db.invitation.findFirst({
    where: {
      id: invitationId,
      organizationId: session.activeOrganizationId,
    },
  })

  if (!invitation) {
    return { error: 'Invitation not found' }
  }

  await db.invitation.delete({ where: { id: invitationId } })

  revalidatePath('/settings/team')
  return { success: true }
}

/**
 * Remove a team member
 */
export async function removeTeamMember(membershipId: string) {
  const session = await requireAuthWithOrg()

  // Check if user is admin/owner
  const myMembership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: session.activeOrganizationId,
      },
    },
  })

  if (!myMembership || myMembership.role === 'MEMBER') {
    return { error: 'You do not have permission to remove team members' }
  }

  // Get the membership to remove
  const membershipToRemove = await db.membership.findFirst({
    where: {
      id: membershipId,
      organizationId: session.activeOrganizationId,
    },
  })

  if (!membershipToRemove) {
    return { error: 'Team member not found' }
  }

  // Can't remove yourself
  if (membershipToRemove.userId === session.user.id) {
    return { error: 'You cannot remove yourself from the organization' }
  }

  // Can't remove an owner unless you're also an owner
  if (membershipToRemove.role === 'OWNER' && myMembership.role !== 'OWNER') {
    return { error: 'Only owners can remove other owners' }
  }

  await db.membership.delete({ where: { id: membershipId } })

  revalidatePath('/settings/team')
  return { success: true }
}

