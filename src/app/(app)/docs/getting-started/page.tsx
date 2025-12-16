import Link from 'next/link'
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const steps = [
  {
    title: '1. Create Your Organization',
    description: 'When you first sign up, you\'ll be prompted to create your organization. This is your workspace where all your data lives.',
    tips: [
      'Choose a memorable name for your organization',
      'Your URL slug will be used for booking pages',
      'You can change these settings later'
    ]
  },
  {
    title: '2. Invite Your Team',
    description: 'Add team members to collaborate on your business. Go to Settings → Team to invite people.',
    tips: [
      'Team members can have different roles (Owner, Admin, Member)',
      'Invitations are sent via email',
      'Each member gets their own login credentials'
    ]
  },
  {
    title: '3. Set Up Your CRM',
    description: 'Start by adding your contacts and companies. You can import from CSV or add them manually.',
    tips: [
      'Import contacts from your existing tools using CSV',
      'Create custom fields to track specific information',
      'Use tags to organize and segment contacts'
    ]
  },
  {
    title: '4. Create Your Pipeline',
    description: 'Set up deal stages that match your sales process. Go to CRM → Pipeline to customize.',
    tips: [
      'A default sales pipeline is created automatically',
      'Customize stages to match your workflow',
      'Track deal values and close probabilities'
    ]
  },
  {
    title: '5. Configure Bookings',
    description: 'Set up your services and availability for online booking. Share your booking link with clients.',
    tips: [
      'Define your available hours',
      'Create different service types with pricing',
      'Your booking page is automatically generated'
    ]
  },
  {
    title: '6. Connect Payments',
    description: 'Integrate Stripe to accept payments for services and products.',
    tips: [
      'Go to Settings → Integrations to connect Stripe',
      'Create invoices directly from deals',
      'Set up recurring billing for subscriptions'
    ]
  }
]

const quickLinks = [
  { title: 'Add Your First Contact', href: '/crm/contacts', description: 'Start building your customer database' },
  { title: 'Create a Deal', href: '/crm/deals', description: 'Track your sales opportunities' },
  { title: 'Set Up Booking Services', href: '/bookings/services', description: 'Configure your service offerings' },
  { title: 'Invite Team Members', href: '/settings/team', description: 'Collaborate with your team' },
]

export default function GettingStartedPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link href="/support" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Support
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Getting Started Guide</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to Eternal Echoes & Visions! Follow these steps to set up your business platform.
        </p>
      </div>

      {/* Quick Start */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">🚀 Quick Start</CardTitle>
          <CardDescription>
            Get up and running in minutes by following these key steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="p-3 rounded-lg border bg-background hover:bg-accent transition-colors">
                  <h4 className="font-medium text-sm">{link.title}</h4>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step by Step Guide */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Step-by-Step Setup</h2>
        
        {steps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {index + 1}
                </span>
                {step.title.replace(/^\d+\.\s*/, '')}
              </CardTitle>
              <CardDescription className="text-base">
                {step.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {step.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      <Card className="mt-8">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Need more help?</h3>
              <p className="text-sm text-muted-foreground">
                Check out our video tutorials or contact support.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/docs/tutorials">
                <Button variant="outline">
                  Video Tutorials
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/support">
                <Button>
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



