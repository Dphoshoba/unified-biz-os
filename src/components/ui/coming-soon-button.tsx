'use client'

import { useState } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Construction } from 'lucide-react'

interface ComingSoonButtonProps extends ButtonProps {
  featureName: string
  children: React.ReactNode
}

export function ComingSoonButton({ featureName, children, ...props }: ComingSoonButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button {...props} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Construction className="h-6 w-6 text-amber-600" />
              </div>
              <DialogTitle className="text-xl">Coming Soon</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              <strong>{featureName}</strong> is currently under development and will be available in a future update.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button onClick={() => setOpen(false)} className="w-full">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

