import { notFound, redirect } from 'next/navigation'
import { getProject } from '@/lib/projects/actions'
import { getSession } from '@/lib/auth-helpers'
import { ProjectKanbanView } from './project-kanban-view'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    redirect('/auth/sign-in')
  }

  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  return <ProjectKanbanView project={project} />
}

