import Link from 'next/link'
import { ArrowLeft, Play, Clock, BookOpen } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const tutorials = [
  {
    title: 'Getting Started with UnifiedBizOS',
    description: 'A complete overview of the platform and its main features.',
    duration: '5 min',
    category: 'Basics',
    thumbnail: '🎬'
  },
  {
    title: 'Setting Up Your CRM',
    description: 'Learn how to add contacts, create deals, and manage your sales pipeline.',
    duration: '8 min',
    category: 'CRM',
    thumbnail: '👥'
  },
  {
    title: 'Creating Your First Booking Service',
    description: 'Set up online booking and share your scheduling link with clients.',
    duration: '6 min',
    category: 'Bookings',
    thumbnail: '📅'
  },
  {
    title: 'Managing Your Sales Pipeline',
    description: 'Drag-and-drop deals through stages and track your revenue.',
    duration: '7 min',
    category: 'CRM',
    thumbnail: '📊'
  },
  {
    title: 'Inviting Team Members',
    description: 'Add your team and assign roles for collaboration.',
    duration: '4 min',
    category: 'Team',
    thumbnail: '👋'
  },
  {
    title: 'Connecting Payment Integrations',
    description: 'Set up Stripe to accept payments and create invoices.',
    duration: '6 min',
    category: 'Payments',
    thumbnail: '💳'
  },
  {
    title: 'Creating Automations',
    description: 'Automate repetitive tasks with triggers and actions.',
    duration: '10 min',
    category: 'Advanced',
    thumbnail: '⚡'
  },
  {
    title: 'Building Sales Funnels',
    description: 'Create landing pages and conversion funnels for your business.',
    duration: '12 min',
    category: 'Advanced',
    thumbnail: '🎯'
  },
]

const categories = ['All', 'Basics', 'CRM', 'Bookings', 'Payments', 'Team', 'Advanced']

export default function TutorialsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Back Link */}
      <Link href="/support" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Support
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Video Tutorials</h1>
        <p className="text-lg text-muted-foreground">
          Watch step-by-step guides to master UnifiedBizOS.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={category === 'All' ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
              <span className="text-5xl">{tutorial.thumbnail}</span>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary ml-1" />
                </div>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="secondary" className="text-xs">
                  {tutorial.category}
                </Badge>
                <span className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {tutorial.duration}
                </span>
              </div>
              <CardTitle className="text-base line-clamp-2">{tutorial.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm line-clamp-2">
                {tutorial.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <Card className="mt-8 border-dashed">
        <CardContent className="py-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">More Tutorials Coming Soon!</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We're constantly adding new tutorials to help you get the most out of UnifiedBizOS.
            Check back regularly for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

