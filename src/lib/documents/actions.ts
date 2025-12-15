'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { DocumentType, DocumentStatus } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'

export type CreateDocumentInput = {
  name: string
  type: DocumentType
  templateId?: string
  content?: JsonObject
  contactId?: string
  companyId?: string
  expiresAt?: Date
}

export type UpdateDocumentInput = {
  id: string
  name?: string
  content?: JsonObject
  status?: DocumentStatus
  contactId?: string | null
  companyId?: string | null
  expiresAt?: Date | null
}

export type CreateTemplateInput = {
  name: string
  type: DocumentType
  description?: string
  content: JsonObject
  isPublic?: boolean
}

export async function getDocuments(options?: {
  type?: DocumentType
  status?: DocumentStatus
  contactId?: string
}) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  const documents = await db.document.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(options?.type && { type: options.type }),
      ...(options?.status && { status: options.status }),
      ...(options?.contactId && { contactId: options.contactId }),
    },
    include: {
      contact: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      company: {
        select: { id: true, name: true },
      },
      template: {
        select: { id: true, name: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return documents
}

export async function getDocument(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return null
  }

  const document = await db.document.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      contact: true,
      company: true,
      template: true,
    },
  })

  return document
}

export async function getTemplates() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  const templates = await db.documentTemplate.findMany({
    where: {
      OR: [
        { organizationId: session.activeOrganizationId },
        { isPublic: true },
      ],
    },
    orderBy: { updatedAt: 'desc' },
  })

  return templates
}

export async function createDocument(input: CreateDocumentInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // If templateId provided, get template content
    let content = input.content
    if (input.templateId && !content) {
      const template = await db.documentTemplate.findFirst({
        where: {
          id: input.templateId,
          OR: [
            { organizationId: session.activeOrganizationId },
            { isPublic: true },
          ],
        },
      })
      if (template) {
        content = template.content as JsonObject
      }
    }

    const document = await db.document.create({
      data: {
        organizationId: session.activeOrganizationId,
        name: input.name,
        type: input.type,
        templateId: input.templateId,
        content: content || {},
        contactId: input.contactId,
        companyId: input.companyId,
        expiresAt: input.expiresAt,
      },
    })

    revalidatePath('/documents')
    return { success: true, document }
  } catch (error) {
    console.error('Failed to create document:', error)
    return { success: false, error: 'Failed to create document' }
  }
}

export async function updateDocument(input: UpdateDocumentInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const document = await db.document.update({
      where: {
        id: input.id,
        organizationId: session.activeOrganizationId,
      },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.status && { status: input.status }),
        ...(input.contactId !== undefined && { contactId: input.contactId }),
        ...(input.companyId !== undefined && { companyId: input.companyId }),
        ...(input.expiresAt !== undefined && { expiresAt: input.expiresAt }),
      },
    })

    revalidatePath('/documents')
    revalidatePath(`/documents/${input.id}`)
    return { success: true, document }
  } catch (error) {
    console.error('Failed to update document:', error)
    return { success: false, error: 'Failed to update document' }
  }
}

export async function deleteDocument(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.document.delete({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
    })

    revalidatePath('/documents')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete document:', error)
    return { success: false, error: 'Failed to delete document' }
  }
}

export async function createTemplate(input: CreateTemplateInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const template = await db.documentTemplate.create({
      data: {
        organizationId: session.activeOrganizationId,
        name: input.name,
        type: input.type,
        description: input.description,
        content: input.content,
        isPublic: input.isPublic || false,
      },
    })

    revalidatePath('/documents/templates')
    return { success: true, template }
  } catch (error) {
    console.error('Failed to create template:', error)
    return { success: false, error: 'Failed to create template' }
  }
}

export async function signDocument(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const document = await db.document.update({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
      },
    })

    revalidatePath('/documents')
    revalidatePath(`/documents/${id}`)
    return { success: true, document }
  } catch (error) {
    console.error('Failed to sign document:', error)
    return { success: false, error: 'Failed to sign document' }
  }
}

