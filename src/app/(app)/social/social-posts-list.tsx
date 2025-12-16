'use client'

import { useState, useEffect } from 'react'
import { Twitter, Linkedin, Instagram, Facebook, Calendar, MoreVertical, Trash2, Send, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// Using mock types since we're using mock API for now
type SocialPlatform = 'TWITTER' | 'LINKEDIN' | 'INSTAGRAM' | 'FACEBOOK'
type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED' | 'CANCELLED'

interface SocialPost {
  id: string
  content: string
  platform: SocialPlatform
  status: PostStatus
  scheduledAt?: Date | string
  publishedAt?: Date | string
  likes?: number
  shares?: number
  comments?: number
}

const platformIcons = {
  TWITTER: Twitter,
  LINKEDIN: Linkedin,
  INSTAGRAM: Instagram,
  FACEBOOK: Facebook,
}

const platformColors = {
  TWITTER: 'text-blue-400',
  LINKEDIN: 'text-blue-600',
  INSTAGRAM: 'text-pink-500',
  FACEBOOK: 'text-blue-700',
}

export function SocialPostsList() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<SocialPlatform | 'ALL'>('ALL')

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    try {
      const url = filter === 'ALL' 
        ? '/api/social/posts'
        : `/api/social/posts?platform=${filter}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/social/posts?id=${postId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        fetchPosts()
      } else {
        alert(data.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post')
    }
  }

  const getStatusBadge = (status: PostStatus) => {
    const variants: Record<PostStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      DRAFT: { label: 'Draft', variant: 'outline' },
      SCHEDULED: { label: 'Scheduled', variant: 'secondary' },
      PUBLISHING: { label: 'Publishing', variant: 'default' },
      PUBLISHED: { label: 'Published', variant: 'default' },
      FAILED: { label: 'Failed', variant: 'outline' },
      CANCELLED: { label: 'Cancelled', variant: 'outline' },
    }
    const config = variants[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading posts...</p>
        </CardContent>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-16 text-center">
          <Share2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No posts yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first social media post to get started
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'ALL' ? 'default' : 'outline'}
          onClick={() => setFilter('ALL')}
          className="rounded-xl"
        >
          All Platforms
        </Button>
        {Object.entries(platformIcons).map(([platform, Icon]) => (
          <Button
            key={platform}
            variant={filter === platform ? 'default' : 'outline'}
            onClick={() => setFilter(platform as SocialPlatform)}
            className="rounded-xl"
          >
            <Icon className="h-4 w-4 mr-2" />
            {platform}
          </Button>
        ))}
      </div>

      {/* Posts */}
      {posts.map((post) => {
        const Icon = platformIcons[post.platform]
        const color = platformColors[post.platform]
        
        return (
          <Card key={post.id} className="rounded-2xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <CardTitle className="capitalize">{post.platform.toLowerCase()}</CardTitle>
                    {getStatusBadge(post.status)}
                  </div>
                  <p className="text-sm whitespace-pre-wrap mb-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.scheduledAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.scheduledAt).toLocaleString()}
                      </div>
                    )}
                    {post.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Send className="h-4 w-4" />
                        Published {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    )}
                    {post.status === 'PUBLISHED' && (
                      <>
                        <span>❤️ {post.likes}</span>
                        <span>🔄 {post.shares}</span>
                        <span>💬 {post.comments}</span>
                      </>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}

