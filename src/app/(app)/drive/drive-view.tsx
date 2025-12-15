'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  File, 
  Folder, 
  MoreVertical, 
  Trash2, 
  Download, 
  Eye,
  Sparkles,
  ArrowLeft,
  HardDrive,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { File as FileType, Folder as FolderType } from '@prisma/client'
import { deleteFile, deleteFolder, generateAISummary } from '@/lib/drive/actions'

type FileWithRelations = FileType & {
  uploadedBy: { id: string; name: string | null; image: string | null }
  folder: { id: string; name: string } | null
}

type FolderWithCount = FolderType & {
  _count: { files: number; children: number }
}

interface DriveViewProps {
  files: FileWithRelations[]
  folders: FolderWithCount[]
  currentFolderId?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function DriveView({ files, folders, currentFolderId }: DriveViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState<string | null>(null)
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [summarizing, setSummarizing] = useState<string | null>(null)

  const handleDeleteFile = async (fileId: string) => {
    setDeleting(true)
    await deleteFile(fileId)
    setDeleting(false)
    setDeleteFileDialogOpen(null)
    router.refresh()
  }

  const handleDeleteFolder = async (folderId: string) => {
    setDeleting(true)
    await deleteFolder(folderId)
    setDeleting(false)
    setDeleteFolderDialogOpen(null)
    router.refresh()
  }

  const handleSummarize = async (fileId: string) => {
    setSummarizing(fileId)
    await generateAISummary(fileId)
    setSummarizing(null)
    router.refresh()
  }

  return (
    <>
      {/* Breadcrumb */}
      {currentFolderId && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/drive" className="hover:text-foreground">
            Drive
          </Link>
          <span>/</span>
          <span>Current Folder</span>
        </div>
      )}

      {/* Folders */}
      {folders.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {folders.map((folder) => (
            <Card key={folder.id} className="hover:shadow-lg transition-shadow group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link
                    href={`/drive?folder=${folder.id}`}
                    className="flex-1 flex items-center gap-3"
                  >
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${folder.color}20` }}
                    >
                      <Folder className="h-6 w-6" style={{ color: folder.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {folder._count.files} files, {folder._count.children} folders
                      </p>
                    </div>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem
                        onClick={() => setDeleteFolderDialogOpen(folder.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Files */}
      {files.length === 0 && folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <HardDrive className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No files yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first file to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {files.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-shadow group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <File className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSummarize(file.id)}
                        disabled={summarizing === file.id}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {summarizing === file.id ? 'Summarizing...' : 'Summarize Content'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteFileDialogOpen(file.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {file.aiSummary && (
                  <div className="mt-2 p-2 bg-primary/5 rounded text-xs text-muted-foreground">
                    <strong>AI Summary:</strong> {file.aiSummary}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete File Dialog */}
      <AlertDialog
        open={deleteFileDialogOpen !== null}
        onOpenChange={(open) => !open && setDeleteFileDialogOpen(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFileDialogOpen && handleDeleteFile(deleteFileDialogOpen)}
              disabled={deleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Folder Dialog */}
      <AlertDialog
        open={deleteFolderDialogOpen !== null}
        onOpenChange={(open) => !open && setDeleteFolderDialogOpen(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this folder? This will only delete the folder if it's empty. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFolderDialogOpen && handleDeleteFolder(deleteFolderDialogOpen)}
              disabled={deleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

