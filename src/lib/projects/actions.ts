'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-helpers'
import { ProjectStatus, TaskStatus, TaskPriority } from '@prisma/client'

export type CreateProjectInput = {
  name: string
  description?: string
  color?: string
  startDate?: Date
  endDate?: Date
  budget?: number
}

export type UpdateProjectInput = {
  id: string
  name?: string
  description?: string
  status?: ProjectStatus
  color?: string
  startDate?: Date | null
  endDate?: Date | null
  budget?: number
}

export type CreateTaskInput = {
  projectId: string
  name: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: Date
  startDate?: Date
  assignedToId?: string
  estimatedHours?: number
  dependsOnId?: string
}

export type UpdateTaskInput = {
  id: string
  name?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: Date | null
  startDate?: Date | null
  assignedToId?: string | null
  estimatedHours?: number
  actualHours?: number
  progress?: number
  dependsOnId?: string | null
}

export async function getProjects() {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return []
  }

  const projects = await db.project.findMany({
    where: {
      organizationId: session.activeOrganizationId,
    },
    include: {
      tasks: {
        include: {
          assignedTo: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Calculate progress for each project
  return projects.map(project => {
    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter(t => t.status === 'DONE').length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      ...project,
      progress,
    }
  })
}

export async function getProject(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return null
  }

  const project = await db.project.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      tasks: {
        include: {
          assignedTo: {
            select: { id: true, name: true, image: true },
          },
          dependsOn: {
            select: { id: true, name: true, status: true },
          },
        },
        orderBy: { order: 'asc' },
      },
      milestones: {
        orderBy: { dueDate: 'asc' },
      },
    },
  })

  if (!project) return null

  // Calculate progress
  const totalTasks = project.tasks.length
  const completedTasks = project.tasks.filter(t => t.status === 'DONE').length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return {
    ...project,
    progress,
  }
}

export async function createProject(input: CreateProjectInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const project = await db.project.create({
      data: {
        organizationId: session.activeOrganizationId,
        name: input.name,
        description: input.description,
        color: input.color || '#3B82F6',
        startDate: input.startDate,
        endDate: input.endDate,
        ...(input.budget && { budget: input.budget }),
      },
    })

    revalidatePath('/projects')
    return { success: true, project }
  } catch (error) {
    console.error('Failed to create project:', error)
    return { success: false, error: 'Failed to create project' }
  }
}

export async function updateProject(input: UpdateProjectInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const project = await db.project.update({
      where: {
        id: input.id,
        organizationId: session.activeOrganizationId,
      },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status && { status: input.status }),
        ...(input.color && { color: input.color }),
        ...(input.startDate !== undefined && { startDate: input.startDate }),
        ...(input.endDate !== undefined && { endDate: input.endDate }),
        ...(input.budget !== undefined && { budget: input.budget }),
      },
    })

    revalidatePath('/projects')
    revalidatePath(`/projects/${input.id}`)
    return { success: true, project }
  } catch (error) {
    console.error('Failed to update project:', error)
    return { success: false, error: 'Failed to update project' }
  }
}

export async function deleteProject(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    await db.project.delete({
      where: {
        id,
        organizationId: session.activeOrganizationId,
      },
    })

    revalidatePath('/projects')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete project:', error)
    return { success: false, error: 'Failed to delete project' }
  }
}

export async function createTask(input: CreateTaskInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Verify project belongs to organization
    const project = await db.project.findFirst({
      where: {
        id: input.projectId,
        organizationId: session.activeOrganizationId,
      },
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    // Get max order for tasks in this project
    const maxOrder = await db.task.findFirst({
      where: { projectId: input.projectId },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const task = await db.task.create({
      data: {
        projectId: input.projectId,
        name: input.name,
        description: input.description,
        status: input.status || 'TODO',
        priority: input.priority || 'MEDIUM',
        dueDate: input.dueDate,
        startDate: input.startDate,
        assignedToId: input.assignedToId,
        ...(input.estimatedHours && { estimatedHours: input.estimatedHours }),
        ...(input.dependsOnId && { dependsOnId: input.dependsOnId }),
        order: (maxOrder?.order ?? -1) + 1,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    revalidatePath('/projects')
    revalidatePath(`/projects/${input.projectId}`)
    return { success: true, task }
  } catch (error) {
    console.error('Failed to create task:', error)
    return { success: false, error: 'Failed to create task' }
  }
}

export async function updateTask(input: UpdateTaskInput) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Verify task belongs to user's organization
    const existing = await db.task.findFirst({
      where: {
        id: input.id,
        project: {
          organizationId: session.activeOrganizationId,
        },
      },
    })

    if (!existing) {
      return { success: false, error: 'Task not found' }
    }

    const task = await db.task.update({
      where: { id: input.id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status && { status: input.status }),
        ...(input.priority && { priority: input.priority }),
        ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
        ...(input.startDate !== undefined && { startDate: input.startDate }),
        ...(input.assignedToId !== undefined && { assignedToId: input.assignedToId }),
        ...(input.estimatedHours !== undefined && { estimatedHours: input.estimatedHours }),
        ...(input.actualHours !== undefined && { actualHours: input.actualHours }),
        ...(input.progress !== undefined && { progress: input.progress }),
        ...(input.dependsOnId !== undefined && { dependsOnId: input.dependsOnId }),
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    revalidatePath('/projects')
    revalidatePath(`/projects/${existing.projectId}`)
    return { success: true, task }
  } catch (error) {
    console.error('Failed to update task:', error)
    return { success: false, error: 'Failed to update task' }
  }
}

export async function deleteTask(id: string) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const task = await db.task.findFirst({
      where: {
        id,
        project: {
          organizationId: session.activeOrganizationId,
        },
      },
    })

    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    await db.task.delete({
      where: { id },
    })

    revalidatePath('/projects')
    revalidatePath(`/projects/${task.projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete task:', error)
    return { success: false, error: 'Failed to delete task' }
  }
}

export async function moveTask(taskId: string, newStatus: TaskStatus, newOrder?: number) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const task = await db.task.findFirst({
      where: {
        id: taskId,
        project: {
          organizationId: session.activeOrganizationId,
        },
      },
    })

    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    await db.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        ...(newOrder !== undefined && { order: newOrder }),
      },
    })

    revalidatePath('/projects')
    revalidatePath(`/projects/${task.projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to move task:', error)
    return { success: false, error: 'Failed to move task' }
  }
}

