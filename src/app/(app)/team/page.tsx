import { Users, UserPlus, Briefcase } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'

export default async function TeamPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Team"
        description="Manage your internal directory and hiring pipeline."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Directory</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              View your team members and their roles
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Team directory coming soon</p>
              <ComingSoonButton featureName="Team Directory" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Recruiting</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Kanban board for tracking job candidates
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Recruiting pipeline coming soon</p>
              <ComingSoonButton featureName="Recruiting" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

