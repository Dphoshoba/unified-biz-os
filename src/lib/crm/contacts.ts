'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg } from '@/lib/auth-helpers'
import { ContactStatus } from '@prisma/client'

// =============================================================================
// TYPES
// =============================================================================

export type ContactWithRelations = Awaited<ReturnType<typeof getContacts>>[number]

export type CreateContactInput = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  title?: string
  status?: ContactStatus
  source?: string
  companyId?: string
  notes?: string
  tagIds?: string[]
}

export type UpdateContactInput = Partial<CreateContactInput>

// =============================================================================
// QUERIES
// =============================================================================

export async function getContacts(options?: {
  search?: string
  status?: ContactStatus
  companyId?: string
  tagId?: string
  limit?: number
  offset?: number
}) {
  const session = await requireAuthWithOrg()
  const { search, status, companyId, tagId, limit = 50, offset = 0 } = options || {}

  const contacts = await db.contact.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(status && { status }),
      ...(companyId && { companyId }),
      ...(tagId && { tags: { some: { tagId } } }),
    },
    include: {
      company: {
        select: { id: true, name: true },
      },
      tags: {
        include: { tag: true },
      },
      _count: {
        select: { deals: true, activities: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip: offset,
  })

  return contacts.map((contact) => ({
    ...contact,
    tags: contact.tags.map((t) => t.tag),
  }))
}

export async function getContact(id: string) {
  const session = await requireAuthWithOrg()

  const contact = await db.contact.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      company: true,
      tags: { include: { tag: true } },
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

  if (!contact) return null

  return {
    ...contact,
    tags: contact.tags.map((t) => t.tag),
  }
}

export async function getContactsCount(status?: ContactStatus) {
  const session = await requireAuthWithOrg()

  return db.contact.count({
    where: {
      organizationId: session.activeOrganizationId,
      ...(status && { status }),
    },
  })
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function createContact(input: CreateContactInput) {
  const session = await requireAuthWithOrg()
  const { tagIds, ...data } = input

  const contact = await db.contact.create({
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
      company: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
  })

  revalidatePath('/crm/contacts')
  return { ...contact, tags: contact.tags.map((t) => t.tag) }
}

export async function updateContact(id: string, input: UpdateContactInput) {
  const session = await requireAuthWithOrg()
  const { tagIds, ...data } = input

  // Verify ownership
  const existing = await db.contact.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Contact not found')
  }

  const contact = await db.contact.update({
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
      company: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
  })

  revalidatePath('/crm/contacts')
  revalidatePath(`/crm/contacts/${id}`)
  return { ...contact, tags: contact.tags.map((t) => t.tag) }
}

export async function deleteContact(id: string) {
  const session = await requireAuthWithOrg()

  // Verify ownership
  const existing = await db.contact.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Contact not found')
  }

  await db.contact.delete({ where: { id } })
  revalidatePath('/crm/contacts')
  return { success: true }
}



