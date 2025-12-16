'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { revalidatePath } from 'next/cache'
import { ObjectiveStatus, KeyResultStatus } from '@prisma/client'

export interface CreateObjectiveInput {
  title: string
  description?: string
  quarter: string
}

export interface UpdateObjectiveInput {
  id: string
  title?: string
  description?: string
  status?: ObjectiveStatus
  progress?: number
}

export interface CreateKeyResultInput {
  objectiveId: string
  title: string
  description?: string
  target: string
  unit: string
}

export interface UpdateKeyResultInput {
  id: string
  title?: string
  description?: string
  target?: string
  current?: string
  status?: KeyResultStatus
}

export async function getObjectives(quarter?: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  try {
    const objectives = await db.objective.findMany({
      where: {
        organizationId: session.activeOrganizationId,
        ...(quarter && { quarter }),
      },
      include: {
        keyResults: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return objectives
  } catch (error) {
    console.error('Failed to fetch objectives:', error)
    return []
  }
}

export async function createObjective(input: CreateObjectiveInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const objective = await db.objective.create({
      data: {
        organizationId: session.activeOrganizationId,
        title: input.title,
        description: input.description,
        quarter: input.quarter,
      },
    })

    revalidatePath('/strategy')
    return { success: true, objective }
  } catch (error) {
    console.error('Failed to create objective:', error)
    return { success: false, error: 'Failed to create objective' }
  }
}

export async function updateObjective(input: UpdateObjectiveInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.objective.updateMany({
      where: {
        id: input.id,
        organizationId: session.activeOrganizationId,
      },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status && { status: input.status }),
        ...(input.progress !== undefined && { progress: input.progress }),
      },
    })

    revalidatePath('/strategy')
    return { success: true }
  } catch (error) {
    console.error('Failed to update objective:', error)
    return { success: false, error: 'Failed to update objective' }
  }
}

export async function deleteObjective(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.objective.deleteMany({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
    })

    revalidatePath('/strategy')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete objective:', error)
    return { success: false, error: 'Failed to delete objective' }
  }
}

export async function createKeyResult(input: CreateKeyResultInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Verify objective belongs to organization
    const objective = await db.objective.findFirst({
      where: {
        id: input.objectiveId,
        organizationId: session.activeOrganizationId,
      },
    })

    if (!objective) {
      return { success: false, error: 'Objective not found' }
    }

    const keyResult = await db.keyResult.create({
      data: {
        objectiveId: input.objectiveId,
        title: input.title,
        description: input.description,
        target: input.target,
        unit: input.unit,
      },
    })

    revalidatePath('/strategy')
    return { success: true, keyResult }
  } catch (error) {
    console.error('Failed to create key result:', error)
    return { success: false, error: 'Failed to create key result' }
  }
}

export async function updateKeyResult(input: UpdateKeyResultInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Verify key result belongs to organization
    const keyResult = await db.keyResult.findFirst({
      where: {
        id: input.id,
        objective: {
          organizationId: session.activeOrganizationId,
        },
      },
    })

    if (!keyResult) {
      return { success: false, error: 'Key result not found' }
    }

    await db.keyResult.update({
      where: { id: input.id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.target && { target: input.target }),
        ...(input.current !== undefined && { current: input.current }),
        ...(input.status && { status: input.status }),
      },
    })

    // Update objective progress based on key results
    const objective = await db.objective.findUnique({
      where: { id: keyResult.objectiveId },
      include: { keyResults: true },
    })

    if (objective) {
      const totalProgress = objective.keyResults.reduce((sum, kr) => {
        const current = parseFloat(kr.current) || 0
        const target = parseFloat(kr.target) || 1
        return sum + Math.min((current / target) * 100, 100)
      }, 0)
      const avgProgress = objective.keyResults.length > 0
        ? totalProgress / objective.keyResults.length
        : 0

      await db.objective.update({
        where: { id: keyResult.objectiveId },
        data: { progress: Math.round(avgProgress) },
      })
    }

    revalidatePath('/strategy')
    return { success: true }
  } catch (error) {
    console.error('Failed to update key result:', error)
    return { success: false, error: 'Failed to update key result' }
  }
}

export async function deleteKeyResult(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.keyResult.deleteMany({
      where: {
        id,
        objective: {
          organizationId: session.activeOrganizationId,
        },
      },
    })

    revalidatePath('/strategy')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete key result:', error)
    return { success: false, error: 'Failed to delete key result' }
  }
}

