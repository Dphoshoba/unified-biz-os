'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateCampaignDialog } from './create-campaign-dialog'

export function CreateCampaignButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-xl">
        <Send className="h-4 w-4 mr-2" />
        New Campaign
      </Button>
      <CreateCampaignDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

