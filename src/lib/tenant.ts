import { db } from './db'
import type { Organization, User, Membership, MembershipRole } from '@prisma/client'

/**
 * Multi-tenant utility functions for managing organizations, users, and memberships.
 * These helpers provide a clean API for common tenant-related operations.
 */

// =============================================================================
// TYPES
// =============================================================================

export type OrganizationWithMemberships = Organization & {
  memberships: (Membership & { user: User })[]
}

export type UserWithMemberships = User & {
  memberships: (Membership & { organization: Organization })[]
}

export type MembershipWithRelations = Membership & {
  user: User
  organization: Organization
}

// =============================================================================
// ORGANIZATION HELPERS
// =============================================================================

/**
 * Get an organization by its unique slug
 */
export async function getOrganizationBySlug(slug: string) {
  return db.organization.findUnique({
    where: { slug },
  })
}

/**
 * Get an organization with all its members
 */
export async function getOrganizationWithMembers(organizationId: string) {
  return db.organization.findUnique({
    where: { id: organizationId },
    include: {
      memberships: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })
}

/**
 * Create a new organization with an owner
 */
export async function createOrganization(
  name: string,
  slug: string,
  ownerUserId: string
) {
  return db.organization.create({
    data: {
      name,
      slug,
      memberships: {
        create: {
          userId: ownerUserId,
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
}

// =============================================================================
// USER HELPERS
// =============================================================================

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
  })
}

/**
 * Get a user with all their organization memberships
 */
export async function getUserWithMemberships(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
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
}

/**
 * Get all organizations a user belongs to
 */
export async function getUserOrganizations(userId: string) {
  const memberships = await db.membership.findMany({
    where: { userId },
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
  }))
}

// =============================================================================
// MEMBERSHIP HELPERS
// =============================================================================

/**
 * Check if a user has access to an organization
 */
export async function checkMembership(userId: string, organizationId: string) {
  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  })

  return membership !== null
}

/**
 * Get a user's membership for a specific organization
 */
export async function getMembership(userId: string, organizationId: string) {
  return db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
    include: {
      user: true,
      organization: true,
    },
  })
}

/**
 * Check if a user has a specific role (or higher) in an organization
 */
export async function hasRole(
  userId: string,
  organizationId: string,
  requiredRole: MembershipRole
): Promise<boolean> {
  const membership = await getMembership(userId, organizationId)
  
  if (!membership) return false

  const roleHierarchy: Record<MembershipRole, number> = {
    MEMBER: 1,
    ADMIN: 2,
    OWNER: 3,
  }

  return roleHierarchy[membership.role] >= roleHierarchy[requiredRole]
}

/**
 * Add a user to an organization
 */
export async function addMember(
  userId: string,
  organizationId: string,
  role: MembershipRole = 'MEMBER'
) {
  return db.membership.create({
    data: {
      userId,
      organizationId,
      role,
    },
    include: {
      user: true,
      organization: true,
    },
  })
}

/**
 * Update a member's role
 */
export async function updateMemberRole(
  userId: string,
  organizationId: string,
  newRole: MembershipRole
) {
  return db.membership.update({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
    data: {
      role: newRole,
    },
  })
}

/**
 * Remove a user from an organization
 */
export async function removeMember(userId: string, organizationId: string) {
  return db.membership.delete({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  })
}

// =============================================================================
// UTILITY HELPERS
// =============================================================================

/**
 * Generate a unique slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await db.organization.findUnique({
    where: { slug },
    select: { id: true },
  })
  return existing === null
}

/**
 * Generate a unique slug, appending numbers if needed
 */
export async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (!(await isSlugAvailable(slug))) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

