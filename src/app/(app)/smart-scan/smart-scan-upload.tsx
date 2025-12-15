'use client'

import { useState } from 'react'
import { Upload, Loader2, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SmartScanUploadProps {
  type: 'receipt' | 'business-card'
}

export function SmartScanUpload({ type }: SmartScanUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useState<HTMLInputElement | null>(null)[0]

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setResult(null)

    // Simulate AI processing
    setTimeout(() => {
      if (type === 'receipt') {
        setResult({
          vendor: 'Office Supplies Co.',
          date: new Date().toLocaleDateString(),
          amount: '$45.99',
          items: ['Printer Paper', 'Pens', 'Staples'],
        })
      } else {
        setResult({
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          company: 'Acme Corporation',
          title: 'Sales Manager',
        })
      }
      setUploading(false)
    }, 2000)
  }

  const handleCreateContact = () => {
    if (type === 'business-card' && result) {
      // TODO: Navigate to create contact with pre-filled data
      alert(`Creating contact: ${result.name}`)
    }
  }

  const handleCreateExpense = () => {
    if (type === 'receipt' && result) {
      // TODO: Navigate to create expense with pre-filled data
      alert(`Creating expense: ${result.vendor} - ${result.amount}`)
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={(el) => {
          if (el) (fileInputRef as any).current = el
        }}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      {!result ? (
        <Button
          onClick={() => (fileInputRef as any).current?.click()}
          disabled={uploading}
          className="w-full rounded-xl"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload {type === 'receipt' ? 'Receipt' : 'Business Card'}
            </>
          )}
        </Button>
      ) : (
        <Card className="rounded-xl border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Extracted
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setResult(null)
                    setError(null)
                  }}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {type === 'receipt' ? (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">Vendor</p>
                    <p className="font-medium">{result.vendor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{result.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-medium text-lg">{result.amount}</p>
                  </div>
                  {result.items && (
                    <div>
                      <p className="text-xs text-muted-foreground">Items</p>
                      <ul className="text-sm mt-1">
                        {result.items.map((item: string, i: number) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button onClick={handleCreateExpense} className="w-full rounded-xl mt-2">
                    Create Expense
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{result.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{result.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{result.phone}</p>
                  </div>
                  {result.company && (
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="font-medium">{result.company}</p>
                    </div>
                  )}
                  {result.title && (
                    <div>
                      <p className="text-xs text-muted-foreground">Title</p>
                      <p className="font-medium">{result.title}</p>
                    </div>
                  )}
                  <Button onClick={handleCreateContact} className="w-full rounded-xl mt-2">
                    Create Contact
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="text-sm text-destructive p-3 bg-destructive/10 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}

