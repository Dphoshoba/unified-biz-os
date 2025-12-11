import { Search, Book, Video, MessageSquare, ExternalLink } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const faqItems = [
  {
    question: 'How do I connect my Stripe account?',
    answer:
      'Go to Settings > Integrations and click "Connect Stripe". You\'ll be redirected to Stripe to authorize the connection.',
  },
  {
    question: 'Can I customize my booking page?',
    answer:
      'Yes! Go to Bookings > Services and click on any service. You can customize the title, description, duration, and appearance.',
  },
  {
    question: 'How do automations work?',
    answer:
      'Automations run based on triggers (like new form submission or booking). When a trigger fires, the associated actions are executed automatically.',
  },
  {
    question: 'What payment methods are supported?',
    answer:
      'We support Stripe for credit/debit cards and PayPal. You can enable one or both in your payment settings.',
  },
  {
    question: 'How do I import contacts?',
    answer:
      'Go to CRM > Contacts and click "Import Contacts". You can upload a CSV file with your contact data.',
  },
]

const resources = [
  {
    title: 'Getting Started Guide',
    description: 'Learn the basics of UnifiedBizOS',
    icon: Book,
    href: '#',
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step tutorials',
    icon: Video,
    href: '#',
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users',
    icon: MessageSquare,
    href: '#',
  },
]

export default function SupportPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Help & Support"
        description="Find answers, learn best practices, and get help."
      />

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="py-6">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources & Contact */}
        <div className="space-y-6">
          {/* Resources */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Resources</h2>
            <div className="space-y-3">
              {resources.map((resource) => {
                const Icon = resource.icon
                return (
                  <Card key={resource.title} className="card-hover cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{resource.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Send us a message.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Describe your issue or question..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

