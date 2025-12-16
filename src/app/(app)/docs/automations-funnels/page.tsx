import { Book, Zap, Target, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AutomationsFunnelsGuidePage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/support">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Support
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Automations & Funnels Guide"
        description="Complete guide to using automations and funnels in Eternal Echoes & Visions"
      />

      {/* Quick Navigation */}
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle>Automations</CardTitle>
            </div>
            <CardDescription>
              Learn how to automate repetitive tasks and workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded">11 Triggers</Badge>
                <Badge variant="outline" className="rounded">8 Actions</Badge>
              </div>
              <p className="text-muted-foreground">
                Automate emails, tags, tasks, and more based on events in your CRM, bookings, and payments.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Target className="h-5 w-5" />
              </div>
              <CardTitle>Funnels</CardTitle>
            </div>
            <CardDescription>
              Create high-converting marketing funnels and landing pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded">6 Templates</Badge>
                <Badge variant="outline" className="rounded">Multi-Step</Badge>
              </div>
              <p className="text-muted-foreground">
                Build lead magnets, booking pages, sales funnels, and more with pre-built templates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="prose prose-slate max-w-none space-y-8">
        {/* Automations Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6 text-violet-600" />
            Automations Overview
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Automations are workflows that run automatically based on triggers you set. They help you save time by handling repetitive tasks without manual intervention.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Concepts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Trigger:</strong> The event that starts the automation
                </div>
                <div>
                  <strong>Action:</strong> What happens when the trigger fires
                </div>
                <div>
                  <strong>Status:</strong> Active (running) or Paused (stopped)
                </div>
                <div>
                  <strong>Executions:</strong> How many times it has run
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Example</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">
                  <strong>Trigger:</strong> New contact created
                </p>
                <p className="mb-2">
                  <strong>Action:</strong> Send email
                </p>
                <p className="text-muted-foreground">
                  Result: Every new contact automatically receives a welcome email!
                </p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">Automation Triggers</h3>
          <div className="space-y-4">
            {[
              {
                name: 'New Contact Created',
                description: 'Triggers when a new contact is added to your CRM',
                use: 'Welcome emails, adding tags, creating follow-up tasks',
              },
              {
                name: 'Tag Added to Contact',
                description: 'Triggers when a tag is applied to a contact',
                use: 'Segmenting contacts, triggering specific campaigns',
              },
              {
                name: 'New Deal Created',
                description: 'Triggers when a new deal/opportunity is created',
                use: 'Notifying team, creating tasks, sending confirmations',
              },
              {
                name: 'Deal Stage Changed',
                description: 'Triggers when a deal moves to a different stage',
                use: 'Progress updates, stage-specific actions, notifications',
              },
              {
                name: 'Deal Won',
                description: 'Triggers when a deal is marked as "Won"',
                use: 'Thank-you emails, customer onboarding, team celebrations',
              },
              {
                name: 'Deal Lost',
                description: 'Triggers when a deal is marked as "Lost"',
                use: 'Feedback surveys, re-engagement campaigns, win-back sequences',
              },
              {
                name: 'New Booking Created',
                description: 'Triggers when someone books an appointment',
                use: 'Confirmation emails, calendar events, preparation tasks',
              },
              {
                name: 'Booking Confirmed',
                description: 'Triggers when a booking is confirmed',
                use: 'Detailed confirmations, meeting links, preparation materials',
              },
              {
                name: 'Booking Cancelled',
                description: 'Triggers when a booking is cancelled',
                use: 'Cancellation confirmations, rescheduling offers',
              },
              {
                name: 'Payment Received',
                description: 'Triggers when a payment is successfully completed',
                use: 'Receipt emails, customer tags, post-purchase sequences',
              },
              {
                name: 'Form Submitted',
                description: 'Triggers when someone submits a form on your website',
                use: 'Lead capture, thank-you messages, nurturing sequences',
              },
            ].map((trigger, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{trigger.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{trigger.description}</p>
                  <div>
                    <strong>Best for:</strong> {trigger.use}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">Automation Actions</h3>
          <div className="space-y-4">
            {[
              {
                name: 'Send Email',
                description: 'Sends an automated email to the contact',
                use: 'Welcome sequences, follow-ups, notifications',
              },
              {
                name: 'Add Tag',
                description: 'Automatically adds a tag to the contact',
                use: 'Organizing contacts, segmenting audiences, tracking stages',
              },
              {
                name: 'Remove Tag',
                description: 'Removes a specific tag from a contact',
                use: 'Cleaning up tags, updating segments, maintaining organization',
              },
              {
                name: 'Update Contact Status',
                description: 'Changes the contact\'s status in your CRM',
                use: 'Tracking lifecycle, segmenting, reporting',
              },
              {
                name: 'Create Task',
                description: 'Creates a follow-up task for you or your team',
                use: 'Reminders, assignments, structured workflows',
              },
              {
                name: 'Send Notification',
                description: 'Sends an in-app notification to team members',
                use: 'Team alerts, real-time updates, coordination',
              },
              {
                name: 'Call Webhook',
                description: 'Sends data to an external URL (API endpoint)',
                use: 'Third-party integrations, custom workflows, system connections',
              },
              {
                name: 'Wait/Delay',
                description: 'Pauses the automation for a specified time',
                use: 'Timed sequences, spacing emails, multi-step workflows',
              },
            ].map((action, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{action.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{action.description}</p>
                  <div>
                    <strong>Best for:</strong> {action.use}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Funnels Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-emerald-600" />
            Funnels Overview
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Funnels are multi-step marketing campaigns designed to guide visitors through a journey from awareness to action. Each funnel consists of multiple pages/steps that work together to convert visitors into leads or customers.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Concepts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Template:</strong> Pre-built funnel structure
                </div>
                <div>
                  <strong>Steps:</strong> Individual pages in your funnel
                </div>
                <div>
                  <strong>Visitors:</strong> People who visit your funnel
                </div>
                <div>
                  <strong>Conversions:</strong> People who complete your goal
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Example</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">
                  <strong>Template:</strong> Lead Magnet
                </p>
                <p className="mb-2">
                  <strong>Steps:</strong> Landing Page → Form → Thank You
                </p>
                <p className="text-muted-foreground">
                  Result: Visitors enter email to download your free resource!
                </p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">Funnel Types</h3>
          <div className="space-y-4">
            {[
              {
                name: 'Lead Magnet',
                description: 'Capture leads by offering a free, valuable resource (ebook, guide, checklist)',
                steps: ['Landing Page', 'Opt-in Form', 'Thank You Page'],
                bestFor: 'Building email lists, establishing authority, generating leads',
                example: 'Free Guide: 10 Ways to Grow Your Business',
              },
              {
                name: 'Consultation Booking',
                description: 'Get prospects to book a discovery call or consultation with you',
                steps: ['Landing Page', 'Calendar Booking', 'Confirmation'],
                bestFor: 'Service businesses, coaches, consultants, sales teams',
                example: 'Book a Free 30-Minute Strategy Session',
              },
              {
                name: 'Free Trial',
                description: 'Convert prospects by offering a free trial of your product or service',
                steps: ['Landing Page', 'Sign Up Form', 'Onboarding'],
                bestFor: 'SaaS products, software companies, subscription services',
                example: 'Start Your 14-Day Free Trial - No Credit Card Required',
              },
              {
                name: 'Direct Purchase',
                description: 'Sell products or services directly without a lead capture step',
                steps: ['Sales Page', 'Checkout', 'Thank You'],
                bestFor: 'E-commerce, one-time purchases, digital products',
                example: 'Buy Our Premium Course - $297',
              },
              {
                name: 'Webinar Registration',
                description: 'Build anticipation and register attendees for your webinar',
                steps: ['Registration Page', 'Sign Up Form', 'Confirmation'],
                bestFor: 'Educational content, product launches, building authority',
                example: 'Register for Our Free Webinar: How to 10x Your Revenue',
              },
              {
                name: 'Waitlist',
                description: 'Build anticipation and collect early interest for a product or service launch',
                steps: ['Coming Soon Page', 'Join Waitlist', 'Confirmation'],
                bestFor: 'Product launches, validating demand, creating FOMO',
                example: 'Join the Waitlist - Be First to Access Our New Platform',
              },
            ].map((funnel, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{funnel.name}</CardTitle>
                    <div className="flex gap-1">
                      {funnel.steps.map((step, j) => (
                        <Badge key={j} variant="outline" className="text-xs">
                          {j + 1}. {step}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{funnel.description}</p>
                  <div>
                    <strong>Best for:</strong> {funnel.bestFor}
                  </div>
                  <div>
                    <strong>Example:</strong> "{funnel.example}"
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How-To Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">How to Use</h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Creating an Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">1</Badge>
                  <p>Navigate to <strong>Automations</strong> and click <strong>"Create Automation"</strong></p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">2</Badge>
                  <p>Choose a <strong>Trigger</strong> (what starts the automation)</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">3</Badge>
                  <p>Choose an <strong>Action</strong> (what happens when triggered)</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">4</Badge>
                  <p>Add a name and description, then click <strong>"Create Automation"</strong></p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Creating a Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">1</Badge>
                  <p>Navigate to <strong>Funnels</strong> and click <strong>"Create Funnel"</strong></p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">2</Badge>
                  <p>Choose a <strong>Template</strong> that matches your goal</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">3</Badge>
                  <p>Enter a name for your funnel</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">4</Badge>
                  <p>Click <strong>"Create Funnel"</strong> - steps are created automatically!</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">5</Badge>
                  <p>Activate your funnel and share the link to start driving traffic</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Best Practices */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Automations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>✓ Start simple with one trigger and one action</div>
                <div>✓ Use clear, descriptive names</div>
                <div>✓ Test before activating</div>
                <div>✓ Monitor execution counts regularly</div>
                <div>✓ Don't over-automate - keep personal touch</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Funnels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>✓ Choose the right template for your goal</div>
                <div>✓ Optimize each step for conversions</div>
                <div>✓ Track metrics and A/B test</div>
                <div>✓ Drive traffic from multiple sources</div>
                <div>✓ Follow up with automations</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

