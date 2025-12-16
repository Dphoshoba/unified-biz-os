'use client'

import { useState } from 'react'
import { Upload, Loader2, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { scanReceipt, scanBusinessCard, ReceiptData, BusinessCardData } from '@/lib/smart-scan/ocr'
import { useRouter } from 'next/navigation'

interface SmartScanUploadProps {
  type: 'receipt' | 'business-card'
}

export function SmartScanUpload({ type }: SmartScanUploadProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ReceiptData | BusinessCardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useState<HTMLInputElement | null>(null)[0]

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)
    setProgress(0)

    try {
      if (type === 'receipt') {
        setProgress(30)
        const receiptData = await scanReceipt(file)
        setResult(receiptData)
      } else {
        setProgress(30)
        const cardData = await scanBusinessCard(file)
        setResult(cardData)
      }
      setProgress(100)
    } catch (err) {
      console.error('OCR error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process image')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleCreateContact = () => {
    if (type === 'business-card' && result) {
      const cardData = result as BusinessCardData
      // Navigate to create contact with pre-filled data
      const params = new URLSearchParams()
      if (cardData.name) params.set('name', cardData.name)
      if (cardData.email) params.set('email', cardData.email)
      if (cardData.phone) params.set('phone', cardData.phone)
      if (cardData.company) params.set('company', cardData.company)
      if (cardData.title) params.set('title', cardData.title)
      router.push(`/crm/contacts?${params.toString()}`)
    }
  }

  const handleCreateExpense = () => {
    if (type === 'receipt' && result) {
      const receiptData = result as ReceiptData
      // TODO: Navigate to create expense with pre-filled data
      alert(`Creating expense: ${receiptData.vendor} - ${receiptData.amount}`)
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
              
              {type === 'receipt' && 'vendor' in result ? (
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
              ) : type === 'business-card' && 'name' in result ? (
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
              ) : null}
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

