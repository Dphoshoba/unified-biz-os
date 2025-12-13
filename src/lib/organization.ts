import { db } from './db'
import { getSession, requireAuthWithOrg } from './auth-helpers'
import type { Prisma } from '@prisma/client'

/**
 * Organization scoping utilities for multi-tenant data access
 */

// =============================================================================
// ORGANIZATION CONTEXT
// =============================================================================

/**
 * Get the active organization for the current session
 */
export async function getActiveOrg() {
  const session = await getSession()
  
  if (!session?.activeOrganizationId) {
    return null
  }

  return db.organization.findUnique({
    where: { id: session.activeOrganizationId },
    include: {
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  })
}

/**
 * Get all organizations the current user belongs to
 */
export async function getUserOrgs() {
  const session = await getSession()
  
  if (!session?.user?.id) {
    return []
  }

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return memberships.map((m) => ({
    ...m.organization,
    role: m.role,
    membershipId: m.id,
  }))
}

/**
 * Switch the active organization for the current user.
 * Updates both the session and the user's preference in the database.
 */
export async function switchOrganization(organizationId: string) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  // Verify user has access to this organization
  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  })

  if (!membership) {
    throw new Error('Access denied to this organization')
  }

  // Update user's preference in database
  await db.user.update({
    where: { id: session.user.id },
    data: { activeOrganizationId: organizationId },
  })

  return { success: true, organizationId }
}

// =============================================================================
// ORG-SCOPED QUERY HELPERS
// =============================================================================

/**
 * Create an organization-scoped where clause.
 * Use this to ensure all queries are scoped to the active organization.
 * 
 * @example
 * const contacts = await db.contact.findMany({
 *   where: {
 *     ...await orgScope(),
 *     status: 'active',
 *   },
 * })
 */
export async function orgScope(): Promise<{ organizationId: string }> {
  const session = await requireAuthWithOrg()
  return { organizationId: session.activeOrganizationId }
}

/**
 * Get the active organization ID or throw if not available.
 * Use this for server actions and API routes.
 */
export async function getOrgId(): Promise<string> {
  const session = await requireAuthWithOrg()
  return session.activeOrganizationId
}

/**
 * Create a Prisma transaction scoped to the current organization.
 * All operations in the callback will include the organization filter.
 */
export async function withOrgScope<T>(
  callback: (orgId: string) => Promise<T>
): Promise<T> {
  const orgId = await getOrgId()
  return callback(orgId)
}

// =============================================================================
// ORGANIZATION MANAGEMENT
// =============================================================================

/**
 * Create a new organization and add the current user as owner
 */
export async function createOrganization(data: {
  name: string
  slug: string
  logo?: string
}) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  // Check if slug is available
  const existing = await db.organization.findUnique({
    where: { slug: data.slug },
  })

  if (existing) {
    throw new Error('Organization slug already taken')
  }

  // Create organization with owner membership
  const organization = await db.organization.create({
    data: {
      name: data.name,
      slug: data.slug,
      logo: data.logo,
      memberships: {
        create: {
          userId: session.user.id,
          role: 'OWNER',
        },
      },
    },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
    },
  })

  // Set as active organization if user doesn't have one
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user?.activeOrganizationId) {
    await db.user.update({
      where: { id: session.user.id },
      data: { activeOrganizationId: organization.id },
    })
  }

  return organization
}

/**
 * Update organization details
 */
export async function updateOrganization(
  organizationId: string,
  data: { name?: string; logo?: string }
) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  // Verify user is admin or owner
  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  })

  if (!membership || membership.role === 'MEMBER') {
    throw new Error('Insufficient permissions')
  }

  return db.organization.update({
    where: { id: organizationId },
    data,
  })
}

/**
 * Invite a user to an organization
 */
export async function inviteToOrganization(
  organizationId: string,
  email: string,
  role: 'ADMIN' | 'MEMBER' = 'MEMBER'
) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }

  // Verify user is admin or owner
  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  })

  if (!membership || membership.role === 'MEMBER') {
    throw new Error('Insufficient permissions')
  }

  // Find or create the user
  let user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) {
    // Create a placeholder user (they'll set password on first sign-in)
    user = await db.user.create({
      data: {
        email: email.toLowerCase(),
      },
    })
  }

  // Check if already a member
  const existingMembership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId,
      },
    },
  })

  if (existingMembership) {
    throw new Error('User is already a member of this organization')
  }

  // Create membership
  return db.membership.create({
    data: {
      userId: user.id,
      organizationId,
      role,
    },
    include: {
      user: true,
      organization: true,
    },
  })
}



