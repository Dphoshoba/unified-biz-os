'use client'

import { useState, useEffect } from 'react'
import { Send, Calendar, Twitter, Linkedin, Instagram, Loader2, Sparkles, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

interface SocialPost {
  id: string
  content: string
  platforms: string[]
  status: 'draft' | 'scheduled' | 'published'
  scheduledAt?: Date | string
  publishedAt?: Date | string
  createdAt: Date | string
}

export function SocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    platforms: [] as string[],
    scheduledAt: '',
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/social/posts')
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

  const handleAIGenerate = async () => {
    if (!formData.content.trim()) {
      alert('Please enter a topic or prompt first')
      return
    }

    setAiGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Write a viral social media post about: "${formData.content}". Make it engaging, include relevant hashtags and emojis. Keep it concise (under 280 characters for Twitter).`,
          documentType: 'Social Media Post',
        }),
      })

      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, content: data.content }))
      } else {
        alert(data.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('Failed to generate AI content:', error)
      alert('Failed to generate content')
    } finally {
      setAiGenerating(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.content.trim() || formData.platforms.length === 0) {
      alert('Please fill in content and select at least one platform')
      return
    }

    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.content,
          platforms: formData.platforms,
          scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
        }),
      })

      const data = await response.json()
      if (data.success) {
        fetchPosts()
        setShowCreateDialog(false)
        setFormData({ content: '', platforms: [], scheduledAt: '' })
      } else {
        alert(data.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post')
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />
      case 'instagram':
        return <Instagram className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      draft: { label: 'Draft', variant: 'outline' },
      scheduled: { label: 'Scheduled', variant: 'secondary' },
      published: { label: 'Published', variant: 'default' },
    }
    const config = variants[status] || variants.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading posts...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-16 text-center">
              <Send className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No posts yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first social media post to start engaging with your audience
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="rounded-2xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-base">{post.content}</CardTitle>
                      {getStatusBadge(post.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {post.platforms.map((platform) => (
                          <div key={platform} className="flex items-center gap-1">
                            {getPlatformIcon(platform)}
                            <span className="capitalize">{platform}</span>
                          </div>
                        ))}
                      </div>
                      {post.scheduledAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.scheduledAt).toLocaleDateString()}
                        </div>
                      )}
                      {post.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Send className="h-4 w-4" />
                          Published {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Social Media Post</DialogTitle>
            <DialogDescription>
              Write a post and schedule it across multiple platforms
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Post Content</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAIGenerate}
                  disabled={aiGenerating}
                  className="h-8 rounded-xl"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Assist
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="What's on your mind? Use AI Assist to generate viral-ready posts with hashtags and emojis!"
                className="rounded-xl min-h-[120px]"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.content.length}/500 characters
              </p>
            </div>

            <div>
              <Label>Platforms</Label>
              <div className="flex gap-4 mt-2">
                {['twitter', 'linkedin', 'instagram'].map((platform) => (
                  <div key={platform} className="flex items-center gap-2">
                    <Checkbox
                      id={platform}
                      checked={formData.platforms.includes(platform)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            platforms: [...prev.platforms, platform],
                          }))
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            platforms: prev.platforms.filter(p => p !== platform),
                          }))
                        }
                      }}
                    />
                    <Label htmlFor={platform} className="flex items-center gap-2 cursor-pointer">
                      {getPlatformIcon(platform)}
                      <span className="capitalize">{platform}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Schedule (Optional)</Label>
              <Input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                className="rounded-xl mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to save as draft
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="rounded-xl">
                {formData.scheduledAt ? 'Schedule Post' : 'Save as Draft'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

