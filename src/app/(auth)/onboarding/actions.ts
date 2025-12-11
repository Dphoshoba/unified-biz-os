'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function checkAndFixOrganization() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { hasOrg: false, needsOnboarding: true }
  }

  // Get user with memberships
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          organization: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!user) {
    return { hasOrg: false, needsOnboarding: true }
  }

  // If user has no memberships, they need to create an org
  if (user.memberships.length === 0) {
    return { hasOrg: false, needsOnboarding: true }
  }

  // User has memberships - check if activeOrganizationId is set
  const firstOrg = user.memberships[0].organization

  if (!user.activeOrganizationId) {
    // Fix: Set the active organization to their first org
    await db.user.update({
      where: { id: session.user.id },
      data: { activeOrganizationId: firstOrg.id },
    })
  }

  return { 
    hasOrg: true, 
    needsOnboarding: false,
    organization: {
      id: firstOrg.id,
      name: firstOrg.name,
      slug: firstOrg.slug,
    }
  }
}

export async function createFirstOrganization(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  // Validation
  if (!name || !slug) {
    return { error: 'Organization name and slug are required' }
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: 'Slug can only contain lowercase letters, numbers, and hyphens' }
  }

  // Check if user already has an organization
  const existingMembership = await db.membership.findFirst({
    where: { userId: session.user.id },
  })

  if (existingMembership) {
    return { error: 'You already have an organization' }
  }

  // Check if slug is available
  const existingOrg = await db.organization.findUnique({
    where: { slug },
  })

  if (existingOrg) {
    return { error: 'This URL slug is already taken' }
  }

  try {
    // Create organization with owner membership
    const organization = await db.organization.create({
      data: {
        name,
        slug,
        memberships: {
          create: {
            userId: session.user.id,
            role: 'OWNER',
          },
        },
      },
    })

    // Set as active organization
    await db.user.update({
      where: { id: session.user.id },
      data: { activeOrganizationId: organization.id },
    })

    return { success: true, organizationId: organization.id }
  } catch (error) {
    console.error('Create organization error:', error)
    return { error: 'Failed to create organization. Please try again.' }
  }
}

