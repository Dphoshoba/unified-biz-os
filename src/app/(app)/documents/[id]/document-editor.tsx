'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Send, Sparkles, Eye, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Document, DocumentStatus } from '@prisma/client'
import { updateDocument } from '@/lib/documents/actions'

type DocumentWithRelations = Document & {
  contact: { id: string; firstName: string; lastName: string; email: string | null } | null
  company: { id: string; name: string } | null
  template: { id: string; name: string } | null
}

interface DocumentEditorProps {
  document: DocumentWithRelations
}

export function DocumentEditor({ document: initialDocument }: DocumentEditorProps) {
  const router = useRouter()
  const [document, setDocument] = useState(initialDocument)
  const [content, setContent] = useState<string>(
    typeof initialDocument.content === 'object' && initialDocument.content !== null
      ? JSON.stringify(initialDocument.content, null, 2)
      : ''
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      let parsedContent
      try {
        parsedContent = JSON.parse(content)
      } catch {
        parsedContent = { blocks: [{ type: 'paragraph', content: content }] }
      }

      const result = await updateDocument({
        id: document.id,
        content: parsedContent,
      })
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Failed to save document:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAIGenerate = () => {
    setShowAIDialog(true)
  }

  const handleAISubmit = async () => {
    if (!aiPrompt.trim()) return

    setAiGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          clientName: document.contact 
            ? `${document.contact.firstName} ${document.contact.lastName}`
            : undefined,
          documentType: document.type,
          existingContent: content,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Append or replace content based on user preference
        const newContent = content 
          ? `${content}\n\n${data.content}`
          : data.content
        setContent(newContent)
        setShowAIDialog(false)
        setAiPrompt('')
      } else {
        alert(data.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('Failed to generate AI content:', error)
      alert('Failed to generate content. Please try again.')
    } finally {
      setAiGenerating(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/documents" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <Input
              value={document.name}
              onChange={(e) => setDocument({ ...document, name: e.target.value })}
              className="text-2xl font-bold border-0 p-0 h-auto focus-visible:ring-0"
              onBlur={async () => {
                await updateDocument({ id: document.id, name: document.name })
                router.refresh()
              }}
            />
            {document.contact && (
              <p className="text-sm text-muted-foreground mt-1">
                For: {document.contact.firstName} {document.contact.lastName}
                {document.company && ` at ${document.company.name}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleAIGenerate}
            className="rounded-xl"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Magic Writer
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl"
          >
            {saving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
          <Button className="rounded-xl">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Document Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Content (JSON format or plain text)</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your document... Use {{Client.Name}} for variables"
                className="mt-1 min-h-[400px] font-mono text-sm"
                rows={20}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Use variables like {`{{Client.Name}}`}, {`{{Client.Email}}`}, {`{{Company.Name}}`} to auto-fill details
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variables Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Available Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {document.contact && (
              <>
                <div>
                  <strong>Client Variables:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                    <li>{`{{Client.Name}}`} - {document.contact.firstName} {document.contact.lastName}</li>
                    <li>{`{{Client.Email}}`} - {document.contact.email || 'N/A'}</li>
                  </ul>
                </div>
              </>
            )}
            {document.company && (
              <div>
                <strong>Company Variables:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                  <li>{`{{Company.Name}}`} - {document.company.name}</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Generation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>AI Magic Writer</DialogTitle>
            <DialogDescription>
              Describe what you'd like to generate. The AI will create professional content for your document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>What would you like to generate?</Label>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Write an executive summary for this proposal, Create a contract introduction, Generate a project scope section..."
                className="mt-1 min-h-[100px]"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAIDialog(false)
                  setAiPrompt('')
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAISubmit}
                disabled={!aiPrompt.trim() || aiGenerating}
                className="rounded-xl"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

