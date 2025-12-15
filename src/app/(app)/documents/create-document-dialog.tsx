'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createDocument, CreateDocumentInput, getTemplates } from '@/lib/documents/actions'
import { DocumentType } from '@prisma/client'

const documentTypes = [
  { value: 'PROPOSAL', label: 'Proposal' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'QUOTE', label: 'Quote' },
  { value: 'STATEMENT_OF_WORK', label: 'Statement of Work' },
  { value: 'NDA', label: 'NDA' },
  { value: 'OTHER', label: 'Other' },
]

export function CreateDocumentDialog() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [templates, setTemplates] = React.useState<Array<{ id: string; name: string; type: string }>>([])
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('')

  React.useEffect(() => {
    if (open) {
      getTemplates().then(setTemplates)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    const input: CreateDocumentInput = {
      name: formData.get('name') as string,
      type: formData.get('type') as DocumentType,
      templateId: selectedTemplate || undefined,
    }

    try {
      const result = await createDocument(input)
      if (result.success && result.document) {
        setOpen(false)
        router.push(`/documents/${result.document.id}`)
      } else {
        setError(result.error || 'Failed to create document')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Start a new document from scratch or use a template.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Document Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Marketing Proposal for Acme Corp"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type">Document Type *</Label>
              <Select name="type" required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {templates.length > 0 && (
              <div>
                <Label htmlFor="template">Use Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None - Start from scratch</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedTemplate && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>AI will help populate this document from the template</span>
              </div>
            )}
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

