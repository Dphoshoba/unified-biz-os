'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreatePostDialog } from './create-post-dialog'

export function CreatePostButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-xl">
        <Send className="h-4 w-4 mr-2" />
        New Post
      </Button>
      <CreatePostDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

