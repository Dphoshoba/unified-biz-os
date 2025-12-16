'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Zap,
  Calendar,
  CreditCard,
  Target,
  Settings,
  HelpCircle,
  ChevronDown,
  Building2,
  FolderKanban,
  FileText,
  HardDrive,
  BarChart3,
  Inbox,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeOrganization?: {
    id: string
    name: string
    slug: string
    logo?: string | null
  } | null
  userOrganizations?: Array<{
    organization: {
      id: string
      name: string
      slug: string
    }
  }>
  mobile?: boolean
}

const mainNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Drive', href: '/drive', icon: HardDrive },
  { name: 'Automations', href: '/automations', icon: Zap },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Funnels', href: '/funnels', icon: Target },
]

const bottomNavItems = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/support', icon: HelpCircle },
]

function NavItem({
  item,
  isActive,
}: {
  item: { name: string; href: string; icon: React.ElementType }
  isActive: boolean
}) {
  const Icon = item.icon

  return (
    <Link href={item.href}>
      <div
        className={cn(
          'nav-item',
          isActive ? 'nav-item-active' : 'nav-item-inactive'
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{item.name}</span>
      </div>
    </Link>
  )
}

export function Sidebar({ activeOrganization, mobile = false }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  // Mobile version renders without the hiding/fixed positioning classes
  if (mobile) {
    return (
      <div className="flex flex-col h-full bg-sidebar">
        {renderSidebarContent()}
      </div>
    )
  }

  function renderSidebarContent() {
    return (
      <>
        {/* Logo & App Name */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            {activeOrganization?.logo ? (
              <img 
                src={activeOrganization.logo} 
                alt="Eternal Echoes & Visions"
                className="h-10 w-10 rounded-xl object-contain"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">E</span>
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">
                {activeOrganization?.name || 'Eternal Echoes & Visions'}
              </h1>
            </div>
          </div>

          {/* Organization Switcher */}
          <button className="mt-4 w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
            <Building2 className="h-4 w-4 text-sidebar-muted" />
            <span className="flex-1 text-sm text-sidebar-foreground truncate">
              {activeOrganization?.name || 'Select Organization'}
            </span>
            <ChevronDown className="h-4 w-4 text-sidebar-muted" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 pb-6 space-y-1">
          <div className="h-px bg-white/10 my-4" />
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      </>
    )
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar">
      <div className="flex flex-col h-full">
        {renderSidebarContent()}
      </div>
    </aside>
  )
}
