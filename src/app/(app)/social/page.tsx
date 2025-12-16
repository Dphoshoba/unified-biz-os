import { Share2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { SocialPostsList } from './social-posts-list'
import { CreatePostButton } from './create-post-button'

export default async function SocialPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Social"
        description="Plan and publish content to Twitter, LinkedIn, and Instagram."
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Posts</h2>
          <p className="text-muted-foreground">
            Schedule and manage your social media content
          </p>
        </div>
        <CreatePostButton />
      </div>

      <SocialPostsList />
    </div>
  )
}

