'use client'

import { GripVertical, MoreVertical, Trash2, Edit } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Task, TaskStatus, TaskPriority } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type TaskWithRelations = Task & {
  assignedTo: { id: string; name: string | null; image: string | null } | null
  dependsOn: { id: string; name: string; status: TaskStatus } | null
}

interface TaskCardProps {
  task: TaskWithRelations
  onMove: (newStatus: TaskStatus) => void
  onDelete: () => void
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  URGENT: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">{task.name}</h4>
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            {task.priority !== 'MEDIUM' && (
              <Badge
                variant="secondary"
                className={`text-xs ${priorityColors[task.priority]}`}
              >
                {task.priority}
              </Badge>
            )}
            {task.assignedTo && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignedTo.image || undefined} />
                <AvatarFallback className="text-xs">
                  {task.assignedTo.name?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Quick Move Buttons */}
        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => {
            if (status === task.status) return null
            return (
              <Button
                key={status}
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() => onMove(status)}
              >
                {status.replace('_', ' ')}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

