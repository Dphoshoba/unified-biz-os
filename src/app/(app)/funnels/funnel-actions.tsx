'use client'

import { useState } from 'react'
import { Play, Pause, MoreHorizontal, Trash2, ExternalLink, Copy, Edit } from 'lucide-react'
import { FunnelStatus } from '@prisma/client'

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
import { toggleFunnelStatus, deleteFunnel } from '@/lib/funnels/actions'

interface FunnelActionsProps {
  id: string
  slug: string
  status: FunnelStatus
}

export function FunnelActions({ id, slug, status }: FunnelActionsProps) {
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await toggleFunnelStatus(id)
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    await deleteFunnel(id)
    setLoading(false)
    setDeleteDialogOpen(false)
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/f/${slug}`
    navigator.clipboard.writeText(url)
  }

  const handleViewFunnel = () => {
    window.open(`/f/${slug}`, '_blank')
  }

  const handleEditFunnel = () => {
    window.location.href = `/funnels/${id}/edit`
  }

  const isActive = status === 'ACTIVE'

  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl"
          onClick={handleEditFunnel}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl"
          onClick={handleViewFunnel}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggle} disabled={loading}>
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Funnel
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Activate Funnel
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Funnel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Funnel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this funnel? This will remove all pages and data associated with it. This action cannot be undone.
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

