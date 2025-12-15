'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadFile, UploadFileInput } from '@/lib/drive/actions'

export function UploadFileButton() {
  const router = useRouter()
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // TODO: Implement actual file upload to storage (S3, Cloudinary, etc.)
      // For now, create a data URL for small files or use a placeholder
      let fileUrl: string
      if (file.size < 5 * 1024 * 1024) { // 5MB limit for data URLs
        const reader = new FileReader()
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string
          const input: UploadFileInput = {
            name: file.name,
            type: file.type,
            size: file.size,
            url: dataUrl,
          }
          await uploadFile(input)
          router.refresh()
          setUploading(false)
        }
        reader.readAsDataURL(file)
        return
      } else {
        // For larger files, use a placeholder URL
        fileUrl = `placeholder://${file.name}`
      }
      
      const input: UploadFileInput = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
      }
      
      await uploadFile(input)
      router.refresh()
    } catch (error) {
      console.error('Failed to upload file:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="rounded-xl"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </>
        )}
      </Button>
    </>
  )
}

