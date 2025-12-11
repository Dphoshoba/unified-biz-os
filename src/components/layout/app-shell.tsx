'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  user?: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  organizations?: Array<{
    id: string
    name: string
    slug: string
    logo: string | null
    role: string
  }>
  activeOrganization?: {
    id: string
    name: string
    slug: string
    logo?: string | null
  } | null
  // Legacy prop support
  userOrganizations?: Array<{
    organization: {
      id: string
      name: string
      slug: string
    }
  }>
}

export function AppShell({
  children,
  user,
  organizations,
  activeOrganization,
  userOrganizations,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Normalize organizations format
  const normalizedOrgs = userOrganizations?.map(uo => ({
    organization: uo.organization
  })) || organizations?.map(org => ({
    organization: { id: org.id, name: org.name, slug: org.slug }
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        activeOrganization={activeOrganization}
        userOrganizations={normalizedOrgs}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar
          activeOrganization={activeOrganization}
          userOrganizations={normalizedOrgs}
          mobile={true}
        />
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
