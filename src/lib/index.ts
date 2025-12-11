// Database
export { db } from './db'
export type { Organization, User, Membership, MembershipRole } from './db'

// Utilities
export { cn, formatCurrency, formatDate, formatRelativeTime, slugify, truncate, getInitials, generateId } from './utils'

// Authentication
export { authOptions } from './auth'
export {
  getSession,
  requireAuth,
  requireAuthWithOrg,
  getCurrentUser,
  getActiveOrganization,
  hasOrgAccess,
  hasOrgRole,
  type AuthSession,
} from './auth-helpers'

// Multi-tenant helpers
export {
  // Types
  type OrganizationWithMemberships,
  type UserWithMemberships,
  type MembershipWithRelations,
  // Organization helpers
  getOrganizationBySlug,
  getOrganizationWithMembers,
  createOrganization,
  // User helpers
  getUserByEmail,
  getUserWithMemberships,
  getUserOrganizations,
  // Membership helpers
  checkMembership,
  getMembership,
  hasRole,
  addMember,
  updateMemberRole,
  removeMember,
  // Utility helpers
  generateSlug,
  isSlugAvailable,
  generateUniqueSlug,
} from './tenant'

// Organization scoping
export {
  getActiveOrg,
  getUserOrgs,
  switchOrganization,
  orgScope,
  getOrgId,
  withOrgScope,
  updateOrganization,
  inviteToOrganization,
} from './organization'
