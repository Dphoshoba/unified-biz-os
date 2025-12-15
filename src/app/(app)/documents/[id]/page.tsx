import { notFound, redirect } from 'next/navigation'
import { getDocument } from '@/lib/documents/actions'
import { getSession } from '@/lib/auth-helpers'
import { DocumentEditor } from './document-editor'

interface DocumentPageProps {
  params: Promise<{ id: string }>
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    redirect('/auth/sign-in')
  }

  const { id } = await params
  const document = await getDocument(id)

  if (!document) {
    notFound()
  }

  return <DocumentEditor document={document} />
}

