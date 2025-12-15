import { FolderKanban } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { getProjects } from '@/lib/projects/actions'
import { CreateProjectDialog } from './create-project-dialog'
import { ProjectsKanban } from './projects-kanban'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Projects"
        description="Manage your projects, tasks, and milestones."
      >
        <CreateProjectDialog />
      </PageHeader>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderKanban className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first project to start managing tasks and milestones.
          </p>
          <CreateProjectDialog />
        </div>
      ) : (
        <ProjectsKanban projects={projects} />
      )}
    </div>
  )
}

