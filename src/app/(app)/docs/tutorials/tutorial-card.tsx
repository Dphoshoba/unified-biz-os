'use client'

import { useState } from 'react'
import { Play, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface TutorialCardProps {
  title: string
  description: string
  duration: string
  category: string
  thumbnail: string
}

export function TutorialCard({ title, description, duration, category, thumbnail }: TutorialCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
          <span className="text-5xl">{thumbnail}</span>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-primary ml-1" />
            </div>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-1">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            <span className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {duration}
            </span>
          </div>
          <CardTitle className="text-base line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm line-clamp-2">
            {description}
          </CardDescription>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Video Tutorial Coming Soon</DialogTitle>
            <DialogDescription>
              We're working on creating comprehensive video tutorials for all features.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-6xl mb-2">{thumbnail}</div>
                <Play className="h-12 w-12 mx-auto text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <Badge variant="secondary">{category}</Badge>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {duration}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} className="rounded-xl">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

