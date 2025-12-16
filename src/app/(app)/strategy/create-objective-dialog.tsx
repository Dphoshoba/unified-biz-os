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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createObjective } from '@/lib/strategy/actions'

interface CreateObjectiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  defaultQuarter?: string
}

export function CreateObjectiveDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultQuarter = 'Q1 2024',
}: CreateObjectiveDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quarter: defaultQuarter,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Please enter an objective title')
      return
    }

    setLoading(true)
    try {
      const result = await createObjective(formData)
      if (result.success) {
        onSuccess()
        onOpenChange(false)
        setFormData({ title: '', description: '', quarter: defaultQuarter })
      } else {
        alert(result.error || 'Failed to create objective')
      }
    } catch (error) {
      console.error('Failed to create objective:', error)
      alert('Failed to create objective')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create Objective</DialogTitle>
          <DialogDescription>
            Set a high-level objective for your team to achieve
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Objective Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Increase revenue by 50%"
              className="rounded-xl mt-1"
              required
            />
          </div>

          <div>
            <Label>Description (Optional)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you want to achieve..."
              className="rounded-xl mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <Label>Quarter</Label>
            <Select
              value={formData.quarter}
              onValueChange={(value) => setFormData(prev => ({ ...prev, quarter: value }))}
            >
              <SelectTrigger className="rounded-xl mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                <SelectItem value="Q2 2025">Q2 2025</SelectItem>
              </SelectContent>
            </Select>
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
                'Create Objective'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

