'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, MoreVertical, Trash2, Edit, Send, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Document, DocumentType, DocumentStatus } from '@prisma/client'
import { deleteDocument } from '@/lib/documents/actions'
import { useRouter } from 'next/navigation'

type DocumentWithRelations = Document & {
  contact: { id: string; firstName: string; lastName: string; email: string | null } | null
  company: { id: string; name: string } | null
  template: { id: string; name: string } | null
}

interface DocumentsListProps {
  documents: DocumentWithRelations[]
}

const typeLabels: Record<DocumentType, string> = {
  PROPOSAL: 'Proposal',
  CONTRACT: 'Contract',
  QUOTE: 'Quote',
  STATEMENT_OF_WORK: 'SOW',
  NDA: 'NDA',
  INVOICE: 'Invoice',
  OTHER: 'Other',
}

const statusColors: Record<DocumentStatus, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  SENT: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  VIEWED: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  SIGNED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  EXPIRED: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (documentId: string) => {
    setDeleting(true)
    await deleteDocument(documentId)
    setDeleting(false)
    setDeleteDialogOpen(null)
    router.refresh()
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((document) => (
          <Card key={document.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link href={`/documents/${document.id}`}>
                    <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer line-clamp-2">
                      {document.name}
                    </CardTitle>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{typeLabels[document.type]}</Badge>
                    <Badge className={statusColors[document.status]}>
                      {document.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem asChild>
                      <Link href={`/documents/${document.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </DropdownMenuItem>
                    {document.status === 'SENT' && (
                      <DropdownMenuItem>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Signed
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => setDeleteDialogOpen(document.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {document.contact && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">Contact:</span> {document.contact.firstName} {document.contact.lastName}
                  </div>
                )}
                {document.company && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">Company:</span> {document.company.name}
                  </div>
                )}
                {document.template && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">Template:</span> {document.template.name}
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-2">
                  Updated {new Date(document.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen !== null}
        onOpenChange={(open) => !open && setDeleteDialogOpen(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogOpen && handleDelete(deleteDialogOpen)}
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

