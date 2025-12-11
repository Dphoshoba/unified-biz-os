import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './auth'
import { db } from './db'

/**
 * Server-side authentication helpers
 */

export type AuthSession = {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  activeOrganizationId: string | null
}

/**
 * Get the current session on the server.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions)
  return session as AuthSession | null
}

/**
 * Require authentication for a server component or action.
 * Redirects to sign-in if not authenticated.
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  return session
}

/**
 * Require authentication AND an active organization.
 * Redirects to sign-in if not authenticated.
 * Redirects to onboarding if no organization.
 */
export async function requireAuthWithOrg(): Promise<AuthSession & { activeOrganizationId: string }> {
  const session = await requireAuth()

  // If session has activeOrganizationId, use it
  if (session.activeOrganizationId) {
    return session as AuthSession & { activeOrganizationId: string }
  }

  // Session might have stale JWT - check database for user's organizations
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: { organization: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  // If user has organizations, use the activeOrganizationId or first org
  if (user && user.memberships.length > 0) {
    const activeOrgId = user.activeOrganizationId || user.memberships[0].organizationId

    // Fix the database if activeOrganizationId wasn't set
    if (!user.activeOrganizationId) {
      await db.user.update({
        where: { id: user.id },
        data: { activeOrganizationId: activeOrgId },
      })
    }

    // Return session with the correct activeOrganizationId
    return {
      ...session,
      activeOrganizationId: activeOrgId,
    }
  }

  // User truly has no organization - redirect to onboarding
  redirect('/onboarding')
}

/**
 * Get current user with their memberships
 */
export async function getCurrentUser() {
  const session = await getSession()
  
  if (!session?.user?.id) {
    return null
  }

  return db.user.findUnique({
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
}

/**
 * Get active organization details
 */
export async function getActiveOrganization() {
  const session = await getSession()
  
  if (!session?.activeOrganizationId) {
    return null
  }

  return db.organization.findUnique({
    where: { id: session.activeOrganizationId },
  })
}

/**
 * Check if current user has access to an organization
 */
export async function hasOrgAccess(organizationId: string): Promise<boolean> {
  const session = await getSession()
  
  if (!session?.user?.id) {
    return false
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  })

  return membership !== null
}

/**
 * Check if current user has a specific role in an organization
 */
export async function hasOrgRole(
  organizationId: string,
  requiredRole: 'OWNER' | 'ADMIN' | 'MEMBER'
): Promise<boolean> {
  const session = await getSession()
  
  if (!session?.user?.id) {
    return false
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  })

  if (!membership) return false

  const roleHierarchy = { MEMBER: 1, ADMIN: 2, OWNER: 3 }
  return roleHierarchy[membership.role] >= roleHierarchy[requiredRole]
}

