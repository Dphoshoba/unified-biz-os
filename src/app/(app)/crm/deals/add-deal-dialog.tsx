'use client'

import * as React from 'react'
import { Loader2, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createDeal, type CreateDealInput } from '@/lib/crm/deals'
import { ensureDefaultPipeline } from '@/lib/crm/pipelines'
import { getContacts } from '@/lib/crm/contacts'

interface Pipeline {
  id: string
  name: string
  stages: Array<{ id: string; name: string; color: string }>
}

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string | null
}

export function AddDealDialog() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [pipeline, setPipeline] = React.useState<Pipeline | null>(null)
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [selectedStageId, setSelectedStageId] = React.useState<string>('')

  async function loadData() {
    setIsFetching(true)
    setError(null)
    try {
      // Get or create default pipeline
      const pipelineData = await ensureDefaultPipeline()
      
      setPipeline(pipelineData)
      setSelectedStageId(pipelineData.stages[0]?.id || '')
      
      // Get contacts for association
      const contactsData = await getContacts({ limit: 100 })
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load data. Please try again.')
    } finally {
      setIsFetching(false)
    }
  }

  function handleOpen() {
    setOpen(true)
    loadData()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!pipeline || !selectedStageId) return
    
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    const input: CreateDealInput = {
      name: formData.get('name') as string,
      pipelineId: pipeline.id,
      stageId: selectedStageId,
      value: parseFloat(formData.get('value') as string) || 0,
      contactId: formData.get('contactId') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    }

    try {
      await createDeal(input)
      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <Button onClick={handleOpen}>
        <Plus className="h-4 w-4 mr-2" />
        Add Deal
      </Button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Dialog */}
          <div className="relative z-50 w-full max-w-lg mx-4 bg-background rounded-2xl shadow-xl border">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Add New Deal</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isFetching ? (
              <div className="px-6 py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Deal Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Website Redesign Project"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Value ($)</Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="5000"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Stage *</Label>
                    <div className="flex flex-wrap gap-2">
                      {pipeline?.stages.map((stage) => (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => setSelectedStageId(stage.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedStageId === stage.id
                              ? 'ring-2 ring-primary ring-offset-2'
                              : 'hover:opacity-80'
                          }`}
                          style={{ 
                            backgroundColor: `${stage.color}20`,
                            color: stage.color,
                            borderColor: stage.color,
                          }}
                        >
                          {stage.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {contacts.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="contactId">Associated Contact</Label>
                      <select
                        id="contactId"
                        name="contactId"
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        disabled={isLoading}
                      >
                        <option value="">No contact</option>
                        {contacts.map((contact) => (
                          <option key={contact.id} value={contact.id}>
                            {contact.firstName} {contact.lastName} {contact.email ? `(${contact.email})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      name="notes"
                      placeholder="Any additional information about this deal..."
                      className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !pipeline}>
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Deal
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

