'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Search,
  Settings,
  Target,
  Users,
  Zap,
  Sparkles,
  HelpCircle,
  Building2,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'

interface CommandMenuProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, keywords: ['home', 'overview'] },
  { name: 'CRM', href: '/crm', icon: Users, keywords: ['contacts', 'customers', 'deals', 'pipeline'] },
  { name: 'Projects', href: '/projects', icon: FolderKanban, keywords: ['tasks', 'kanban', 'gantt', 'milestones'] },
  { name: 'Automations', href: '/automations', icon: Zap, keywords: ['workflows', 'triggers'] },
  { name: 'Bookings', href: '/bookings', icon: Calendar, keywords: ['appointments', 'schedule', 'calendar'] },
  { name: 'Payments', href: '/payments', icon: CreditCard, keywords: ['invoices', 'stripe', 'billing'] },
  { name: 'Funnels', href: '/funnels', icon: Target, keywords: ['landing', 'pages', 'conversion'] },
  { name: 'Settings', href: '/settings', icon: Settings, keywords: ['preferences', 'config'] },
  { name: 'Help & Support', href: '/support', icon: HelpCircle, keywords: ['help', 'docs', 'support'] },
]

const quickActions = [
  { name: 'New Contact', href: '/crm/contacts', icon: Users, keywords: ['add', 'create', 'contact'] },
  { name: 'New Deal', href: '/crm/deals', icon: FileText, keywords: ['add', 'create', 'deal', 'opportunity'] },
  { name: 'New Project', href: '/projects', icon: FolderKanban, keywords: ['add', 'create', 'project'] },
  { name: 'New Booking', href: '/bookings', icon: Calendar, keywords: ['add', 'create', 'appointment'] },
  { name: 'New Invoice', href: '/payments/invoices', icon: CreditCard, keywords: ['add', 'create', 'invoice', 'bill'] },
  { name: 'New Automation', href: '/automations', icon: Zap, keywords: ['add', 'create', 'workflow'] },
  { name: 'New Funnel', href: '/funnels', icon: Target, keywords: ['add', 'create', 'landing', 'page'] },
]

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  const [openState, setOpenState] = React.useState(open ?? false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenState((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    if (open !== undefined) {
      setOpenState(open)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpenState(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleSelect = (href: string) => {
    router.push(href)
    handleOpenChange(false)
  }

  return (
    <CommandDialog open={openState} onOpenChange={handleOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={item.href}
                value={item.name}
                keywords={item.keywords}
                onSelect={() => handleSelect(item.href)}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <CommandItem
                key={action.href}
                value={action.name}
                keywords={action.keywords}
                onSelect={() => handleSelect(action.href)}
              >
                <Plus className="mr-2 h-4 w-4" />
                <Icon className="mr-2 h-4 w-4" />
                <span>{action.name}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="AI Assistant">
          <CommandItem
            value="ai-assistant"
            onSelect={() => {
              // TODO: Open AI Assistant
              handleOpenChange(false)
            }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Open AI Assistant</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

