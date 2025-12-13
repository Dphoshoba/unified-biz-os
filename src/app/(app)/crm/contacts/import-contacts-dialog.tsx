'use client'

import * as React from 'react'
import { Upload, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ImportContactsDialogProps {
  children?: React.ReactNode
}

export function ImportContactsDialog({ children }: ImportContactsDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [csvText, setCsvText] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvText(text)
    }
    reader.readAsText(file)
  }

  const handleSubmit = async () => {
    if (!csvText.trim()) {
      alert('Please paste CSV data or upload a file')
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/crm/contacts/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText }),
      })

      const data = await response.json()

      if (data.imported) {
        setResult({
          success: data.success,
          failed: data.failed,
          errors: data.errors || [],
        })
        if (data.success > 0) {
          // Refresh page after a delay
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      } else {
        alert('Failed to import contacts: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Failed to import contacts: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {children ? (
        <div onClick={() => setOpen(true)}>{children}</div>
      ) : (
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => setOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Upload a CSV file or paste CSV data to import contacts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <Label>Upload CSV File</Label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground mt-1">
                CSV should include: First Name, Last Name, Email, Phone, Title, Company, Source, Notes
              </p>
            </div>

            {/* CSV Text Input */}
            <div>
              <Label>Or Paste CSV Data</Label>
              <Textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="First Name,Last Name,Email,Phone,Title,Company,Source,Notes&#10;John,Doe,john@example.com,+1234567890,CEO,Acme Corp,Website,Interested in product"
                className="mt-1 font-mono text-sm"
                rows={8}
              />
            </div>

            {/* Results */}
            {result && (
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  {result.success > 0 && (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-600">
                        {result.success} contacts imported successfully
                      </span>
                    </>
                  )}
                  {result.failed > 0 && (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="font-semibold text-amber-600">
                        {result.failed} contacts failed
                      </span>
                    </>
                  )}
                </div>
                {result.errors.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground max-h-32 overflow-y-auto">
                    {result.errors.slice(0, 5).map((error, i) => (
                      <div key={i}>{error}</div>
                    ))}
                    {result.errors.length > 5 && (
                      <div>... and {result.errors.length - 5} more errors</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setCsvText('')
                  setResult(null)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading || !csvText.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Contacts
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

