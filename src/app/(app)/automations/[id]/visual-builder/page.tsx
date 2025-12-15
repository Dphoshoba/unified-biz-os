import { notFound } from 'next/navigation'
import { getAutomation } from '@/lib/automations/actions'
import { getSession } from '@/lib/auth-helpers'
import { VisualWorkflowBuilder } from './visual-workflow-builder'

interface VisualBuilderPageProps {
  params: Promise<{ id: string }>
}

export default async function VisualBuilderPage({ params }: VisualBuilderPageProps) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    notFound()
  }

  const { id } = await params
  const automation = await getAutomation(id)

  if (!automation || automation.organizationId !== session.activeOrganizationId) {
    notFound()
  }

  return <VisualWorkflowBuilder automation={automation} />
}

