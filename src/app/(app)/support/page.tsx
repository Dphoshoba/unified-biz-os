import Link from 'next/link'
import { Search, Book, Video, MessageSquare, ExternalLink } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactSupportForm } from './contact-support-form'

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
      'Automations run based on triggers (like new contact created or payment received). When a trigger fires, the associated actions (like sending an email or adding a tag) are executed automatically. See our complete guide in the Resources section.',
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
    title: 'Automations & Funnels Guide',
    description: 'Complete guide to automations and funnels',
    icon: Book,
    href: '/docs/automations-funnels',
  },
  {
    title: 'Getting Started Guide',
    description: 'Learn the basics of Eternal Echoes & Visions',
    icon: Book,
    href: '/docs/getting-started',
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step tutorials',
    icon: Video,
    href: '/docs/tutorials',
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users',
    icon: MessageSquare,
    href: '/docs/community',
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
                  <Link key={resource.title} href={resource.href}>
                    <Card className="card-hover cursor-pointer hover:border-primary/50 transition-colors">
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
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Contact Form */}
          <ContactSupportForm />
        </div>
      </div>
    </div>
  )
}

