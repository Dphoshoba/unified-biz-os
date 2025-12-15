'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Pause, MoreHorizontal, Trash2, Workflow } from 'lucide-react'
import { AutomationStatus } from '@prisma/client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { toggleAutomationStatus, deleteAutomation } from '@/lib/automations/actions'

interface AutomationActionsProps {
  id: string
  status: AutomationStatus
}

export function AutomationActions({ id, status }: AutomationActionsProps) {
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await toggleAutomationStatus(id)
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    await deleteAutomation(id)
    setLoading(false)
    setDeleteDialogOpen(false)
  }

  const isActive = status === 'ACTIVE'

  return (
    <>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-xl"
          onClick={handleToggle}
          disabled={loading}
        >
          {isActive ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem asChild>
                    <Link href={`/automations/${id}/visual-builder`}>
                      <Workflow className="h-4 w-4 mr-2" />
                      Visual Builder
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleToggle} disabled={loading}>
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Automation
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Activate Automation
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Automation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Automation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this automation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

