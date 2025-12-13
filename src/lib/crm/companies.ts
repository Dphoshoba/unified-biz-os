'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'

// =============================================================================
// TYPES
// =============================================================================

export type CompanyWithRelations = Awaited<ReturnType<typeof getCompanies>>[number]

export type CreateCompanyInput = {
  name: string
  website?: string
  industry?: string
  size?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  notes?: string
  tagIds?: string[]
}

export type UpdateCompanyInput = Partial<CreateCompanyInput>

// =============================================================================
// QUERIES
// =============================================================================

export async function getCompanies(options?: {
  search?: string
  industry?: string
  tagId?: string
  limit?: number
  offset?: number
}) {
  const session = await requireAuthWithOrg()
  const { search, industry, tagId, limit = 50, offset = 0 } = options || {}

  const companies = await db.company.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { website: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(industry && { industry }),
      ...(tagId && { tags: { some: { tagId } } }),
    },
    include: {
      tags: { include: { tag: true } },
      _count: {
        select: { contacts: true, deals: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip: offset,
  })

  return companies.map((company) => ({
    ...company,
    tags: company.tags.map((t) => t.tag),
  }))
}

export async function getCompany(id: string) {
  const session = await requireAuthWithOrg()

  const company = await db.company.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      tags: { include: { tag: true } },
      contacts: {
        orderBy: { updatedAt: 'desc' },
        take: 10,
      },
      deals: {
        include: {
          stage: true,
          pipeline: true,
        },
        orderBy: { updatedAt: 'desc' },
      },
      activities: {
        include: { createdBy: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!company) return null

  return {
    ...company,
    tags: company.tags.map((t) => t.tag),
  }
}

export async function getCompaniesCount() {
  const session = await requireAuthWithOrg()

  return db.company.count({
    where: { organizationId: session.activeOrganizationId },
  })
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function createCompany(input: CreateCompanyInput) {
  const session = await requireAuthWithOrg()
  const { tagIds, ...data } = input

  const company = await db.company.create({
    data: {
      ...data,
      organizationId: session.activeOrganizationId,
      ...(tagIds?.length && {
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      }),
    },
    include: {
      tags: { include: { tag: true } },
      _count: { select: { contacts: true, deals: true } },
    },
  })

  revalidatePath('/crm/companies')
  return { ...company, tags: company.tags.map((t) => t.tag) }
}

export async function updateCompany(id: string, input: UpdateCompanyInput) {
  const session = await requireAuthWithOrg()
  const { tagIds, ...data } = input

  const existing = await db.company.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Company not found')
  }

  const company = await db.company.update({
    where: { id },
    data: {
      ...data,
      ...(tagIds && {
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId) => ({ tagId })),
        },
      }),
    },
    include: {
      tags: { include: { tag: true } },
      _count: { select: { contacts: true, deals: true } },
    },
  })

  revalidatePath('/crm/companies')
  revalidatePath(`/crm/companies/${id}`)
  return { ...company, tags: company.tags.map((t) => t.tag) }
}

export async function deleteCompany(id: string) {
  const session = await requireAuthWithOrg()

  const existing = await db.company.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Company not found')
  }

  await db.company.delete({ where: { id } })
  revalidatePath('/crm/companies')
  return { success: true }
}



