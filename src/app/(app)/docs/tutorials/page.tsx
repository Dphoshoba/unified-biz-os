'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TutorialCard } from './tutorial-card'

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
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredTutorials = selectedCategory === 'All' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory)

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
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Video Grid */}
      {filteredTutorials.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTutorials.map((tutorial, index) => (
            <TutorialCard
              key={index}
              title={tutorial.title}
              description={tutorial.description}
              duration={tutorial.duration}
              category={tutorial.category}
              thumbnail={tutorial.thumbnail}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No tutorials in this category</h3>
            <p className="text-sm text-muted-foreground">
              Try selecting a different category or "All" to see all tutorials.
            </p>
          </CardContent>
        </Card>
      )}

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



