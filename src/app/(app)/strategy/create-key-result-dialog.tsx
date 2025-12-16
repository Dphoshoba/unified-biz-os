'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createKeyResult } from '@/lib/strategy/actions'

interface CreateKeyResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  objectiveId: string
  onSuccess: () => void
}

export function CreateKeyResultDialog({
  open,
  onOpenChange,
  objectiveId,
  onSuccess,
}: CreateKeyResultDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    unit: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.target.trim() || !formData.unit.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const result = await createKeyResult({
        objectiveId,
        ...formData,
      })
      if (result.success) {
        onSuccess()
        onOpenChange(false)
        setFormData({ title: '', description: '', target: '', unit: '' })
      } else {
        alert(result.error || 'Failed to create key result')
      }
    } catch (error) {
      console.error('Failed to create key result:', error)
      alert('Failed to create key result')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add Key Result</DialogTitle>
          <DialogDescription>
            Define a measurable outcome for this objective
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Key Result Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Reach 1000 new customers"
              className="rounded-xl mt-1"
              required
            />
          </div>

          <div>
            <Label>Description (Optional)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add more details..."
              className="rounded-xl mt-1 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target Value</Label>
              <Input
                value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                placeholder="100"
                className="rounded-xl mt-1"
                required
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="customers, revenue, %"
                className="rounded-xl mt-1"
                required
              />
            </div>
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
              ) : (
                'Add Key Result'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

