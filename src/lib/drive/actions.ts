'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'

export type CreateFolderInput = {
  name: string
  parentId?: string
  color?: string
}

export type UploadFileInput = {
  name: string
  type: string
  size: number
  url: string
  folderId?: string
  description?: string
  tags?: string[]
}

export async function getFiles(options?: {
  folderId?: string | null
  search?: string
}) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  const files = await db.file.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(options?.folderId !== undefined && { folderId: options.folderId }),
      ...(options?.search && {
        OR: [
          { name: { contains: options.search, mode: 'insensitive' } },
          { description: { contains: options.search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      uploadedBy: {
        select: { id: true, name: true, image: true },
      },
      folder: {
        select: { id: true, name: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return files
}

export async function getFolders(parentId?: string | null) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  const folders = await db.folder.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(parentId !== undefined && { parentId }),
    },
    include: {
      _count: {
        select: { files: true, children: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return folders
}

export async function createFolder(input: CreateFolderInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId || !session.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const folder = await db.folder.create({
      data: {
        organizationId: session.activeOrganizationId,
        name: input.name,
        parentId: input.parentId,
        color: input.color || '#3B82F6',
      },
    })

    revalidatePath('/drive')
    return { success: true, folder }
  } catch (error) {
    console.error('Failed to create folder:', error)
    return { success: false, error: 'Failed to create folder' }
  }
}

export async function uploadFile(input: UploadFileInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId || !session.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const file = await db.file.create({
      data: {
        organizationId: session.activeOrganizationId,
        name: input.name,
        type: input.type,
        size: input.size,
        url: input.url,
        folderId: input.folderId,
        description: input.description,
        tags: input.tags || [],
        uploadedById: session.user.id,
      },
    })

    revalidatePath('/drive')
    return { success: true, file }
  } catch (error) {
    console.error('Failed to upload file:', error)
    return { success: false, error: 'Failed to upload file' }
  }
}

export async function deleteFile(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.file.delete({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
    })

    revalidatePath('/drive')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete file:', error)
    return { success: false, error: 'Failed to delete file' }
  }
}

export async function deleteFolder(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Check if folder has files or subfolders
    const folder = await db.folder.findFirst({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
      include: {
        _count: {
          select: { files: true, children: true },
        },
      },
    })

    if (!folder) {
      return { success: false, error: 'Folder not found' }
    }

    if (folder._count.files > 0 || folder._count.children > 0) {
      return { success: false, error: 'Folder is not empty' }
    }

    await db.folder.delete({
      where: { id },
    })

    revalidatePath('/drive')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete folder:', error)
    return { success: false, error: 'Failed to delete folder' }
  }
}

export async function generateAISummary(fileId: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const file = await db.file.findFirst({
      where: {
        id: fileId,
        organizationId: session.activeOrganizationId,
      },
    })

    if (!file) {
      return { success: false, error: 'File not found' }
    }

    // TODO: Implement actual AI summarization
    // For now, return a placeholder
    const summary = `This ${file.type} file (${(file.size / 1024).toFixed(2)} KB) was uploaded on ${new Date(file.createdAt).toLocaleDateString()}.`

    await db.file.update({
      where: { id: fileId },
      data: { aiSummary: summary },
    })

    revalidatePath('/drive')
    return { success: true, summary }
  } catch (error) {
    console.error('Failed to generate summary:', error)
    return { success: false, error: 'Failed to generate summary' }
  }
}
