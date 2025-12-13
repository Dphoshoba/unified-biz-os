'use client'

import * as React from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExportContactsButtonProps {
  status?: string
  search?: string
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ExportContactsButton({ 
  status, 
  search,
  variant = 'outline',
  size = 'sm',
}: ExportContactsButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (search) params.append('search', search)

      const response = await fetch(`/api/crm/contacts/export?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to export contacts')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Failed to export contacts: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isLoading}
      className="rounded-xl"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Export
        </>
      )}
    </Button>
  )
}

