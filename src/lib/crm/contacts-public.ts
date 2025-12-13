'use server'

import { db } from '@/lib/db'
import { ContactStatus } from '@prisma/client'

/**
 * Create a contact from public funnel submission
 * This doesn't require authentication since it's from a public form
 */
export async function createContactFromFunnel(
  organizationId: string,
  input: {
    email?: string
    name?: string
    firstName?: string
    lastName?: string
    phone?: string
    source?: string
    notes?: string
  }
) {
  // Parse name into first/last if provided
  let firstName = input.firstName
  let lastName = input.lastName

  if (!firstName && !lastName && input.name) {
    const nameParts = input.name.trim().split(/\s+/)
    firstName = nameParts[0] || 'Unknown'
    lastName = nameParts.slice(1).join(' ') || ''
  }

  if (!firstName) firstName = 'Unknown'
  if (!lastName) lastName = ''

  // Check if contact already exists (by email)
  let contact
  if (input.email) {
    contact = await db.contact.findUnique({
      where: {
        organizationId_email: {
          organizationId,
          email: input.email,
        },
      },
    })
  }

  if (contact) {
    // Update existing contact
    contact = await db.contact.update({
      where: { id: contact.id },
      data: {
        firstName,
        lastName,
        ...(input.phone && !contact.phone && { phone: input.phone }),
        ...(input.source && { source: input.source }),
        ...(input.notes && {
          notes: contact.notes
            ? `${contact.notes}\n\n---\n${input.notes}`
            : input.notes,
        }),
      },
      include: {
        company: { select: { id: true, name: true } },
        tags: { include: { tag: true } },
      },
    })
  } else {
    // Create new contact
    contact = await db.contact.create({
      data: {
        organizationId,
        firstName,
        lastName,
        email: input.email,
        phone: input.phone,
        status: ContactStatus.LEAD,
        source: input.source || 'Funnel',
        notes: input.notes,
      },
      include: {
        company: { select: { id: true, name: true } },
        tags: { include: { tag: true } },
      },
    })
  }

  return {
    ...contact,
    tags: contact.tags.map((t) => t.tag),
  }
}

