'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Project, Task, TaskStatus } from '@prisma/client'
import { deleteProject, moveTask, deleteTask } from '@/lib/projects/actions'
import { CreateTaskDialog } from './create-task-dialog'
import { TaskCard } from './task-card'

type ProjectWithTasks = Project & {
  tasks: (Task & {
    assignedTo: { id: string; name: string | null; image: string | null } | null
    dependsOn: { id: string; name: string; status: TaskStatus } | null
  })[]
  milestones: Array<{ id: string; name: string; dueDate: Date; completedAt: Date | null }>
  progress: number
}

interface ProjectKanbanViewProps {
  project: ProjectWithTasks
}

const columns: { id: TaskStatus; name: string; color: string }[] = [
  { id: 'TODO', name: 'To Do', color: 'bg-muted' },
  { id: 'IN_PROGRESS', name: 'In Progress', color: 'bg-blue-500' },
  { id: 'IN_REVIEW', name: 'In Review', color: 'bg-amber-500' },
  { id: 'DONE', name: 'Done', color: 'bg-emerald-500' },
]

export function ProjectKanbanView({ project: initialProject }: ProjectKanbanViewProps) {
  const router = useRouter()
  const [project, setProject] = useState(initialProject)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteProject = async () => {
    setDeleting(true)
    await deleteProject(project.id)
    setDeleting(false)
    router.push('/projects')
  }

  const handleDeleteTask = async (taskId: string) => {
    setDeleting(true)
    await deleteTask(taskId)
    setDeleting(false)
    setDeleteTaskDialogOpen(null)
    router.refresh()
  }

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    await moveTask(taskId, newStatus)
    // Update local state
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }))
  }

  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.id] = project.tasks.filter(t => t.status === column.id)
    return acc
  }, {} as Record<TaskStatus, typeof project.tasks>)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: project.color }}>
              {project.name}
            </h1>
            {project.description && (
              <p className="text-muted-foreground mt-1">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CreateTaskDialog projectId={project.id} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Overall Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${project.progress}%`,
              backgroundColor: project.color,
            }}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const tasks = tasksByStatus[column.id] || []
          return (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold">{column.name}</h3>
                  <span className="text-sm text-muted-foreground">({tasks.length})</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 min-h-[200px]">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={(newStatus) => handleTaskMove(task.id, newStatus)}
                    onDelete={() => setDeleteTaskDialogOpen(task.id)}
                  />
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete Project Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This will also delete all tasks and milestones. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={deleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Task Dialog */}
      <AlertDialog
        open={deleteTaskDialogOpen !== null}
        onOpenChange={(open) => !open && setDeleteTaskDialogOpen(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTaskDialogOpen && handleDeleteTask(deleteTaskDialogOpen)}
              disabled={deleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

