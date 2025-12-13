import Link from 'next/link'
import { ArrowLeft, MessageSquare, Github, Twitter, Users, Star, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const communityLinks = [
  {
    title: 'GitHub Discussions',
    description: 'Ask questions, share ideas, and connect with other developers.',
    icon: Github,
    href: 'https://github.com/Dphoshoba/unified-biz-os/discussions',
    buttonText: 'Join Discussion',
    stats: 'Open Source'
  },
  {
    title: 'Twitter / X',
    description: 'Follow us for updates, tips, and announcements.',
    icon: Twitter,
    href: 'https://twitter.com/unifiedbizos',
    buttonText: 'Follow Us',
    stats: 'Updates'
  },
]

const popularTopics = [
  { title: 'How to set up multi-tenant organizations?', replies: 12, category: 'Setup' },
  { title: 'Best practices for CRM data import', replies: 8, category: 'CRM' },
  { title: 'Customizing booking pages', replies: 15, category: 'Bookings' },
  { title: 'Integrating with external APIs', replies: 6, category: 'Development' },
  { title: 'Tips for team onboarding', replies: 10, category: 'Team' },
]

const contributors = [
  { name: 'David P.', role: 'Creator', avatar: 'DP' },
  { name: 'Community', role: 'Contributors', avatar: '👥' },
]

export default function CommunityPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link href="/support" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Support
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Community Forum</h1>
        <p className="text-lg text-muted-foreground">
          Connect with other UnifiedBizOS users, share knowledge, and get help.
        </p>
      </div>

      {/* Community Links */}
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {communityLinks.map((link) => {
          const Icon = link.icon
          return (
            <Card key={link.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{link.stats}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{link.description}</CardDescription>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    {link.buttonText}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Popular Topics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Popular Discussion Topics
          </CardTitle>
          <CardDescription>
            See what others are talking about in the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularTopics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{topic.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                    <span className="text-xs text-muted-foreground">{topic.replies} replies</span>
                  </div>
                </div>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
          
          <a 
            href="https://github.com/Dphoshoba/unified-biz-os/discussions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-4"
          >
            <Button variant="outline" className="w-full">
              View All Discussions
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Contributors */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contributors
          </CardTitle>
          <CardDescription>
            The people behind UnifiedBizOS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {contributors.map((contributor, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {contributor.avatar}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{contributor.name}</h4>
                  <p className="text-xs text-muted-foreground">{contributor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Open Source */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold">UnifiedBizOS is Open Source!</h3>
                <p className="text-sm text-muted-foreground">
                  Star us on GitHub and contribute to the project.
                </p>
              </div>
            </div>
            <a 
              href="https://github.com/Dphoshoba/unified-biz-os" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button>
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



