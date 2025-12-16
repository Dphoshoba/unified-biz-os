'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Twitter, Linkedin, Instagram } from 'lucide-react'

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    platforms: [] as string[],
    scheduledAt: '',
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.content.trim() || formData.platforms.length === 0) {
      alert('Please fill in content and select at least one platform')
      return
    }

    setLoading(true)
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
        router.refresh()
        onOpenChange(false)
        setFormData({ content: '', platforms: [], scheduledAt: '' })
      } else {
        alert(data.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post')
    } finally {
      setLoading(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Social Media Post</DialogTitle>
          <DialogDescription>
            Write a post and schedule it across multiple platforms
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              required
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
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : formData.scheduledAt ? (
                'Schedule Post'
              ) : (
                'Save as Draft'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

