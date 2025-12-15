import { FileText, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { getDocuments } from '@/lib/documents/actions'
import { CreateDocumentDialog } from './create-document-dialog'
import { DocumentsList } from './documents-list'

export default async function DocumentsPage() {
  const documents = await getDocuments()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Documents"
        description="Create and manage proposals, contracts, and other business documents."
      >
        <CreateDocumentDialog />
      </PageHeader>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first document to get started with proposals and contracts.
          </p>
          <CreateDocumentDialog />
        </div>
      ) : (
        <DocumentsList documents={documents} />
      )}
    </div>
  )
}

