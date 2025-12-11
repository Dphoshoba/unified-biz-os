'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown, Plus, Building2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Organization = {
  id: string
  name: string
  slug: string
  logo?: string | null
  role: string
}

interface OrgSwitcherProps {
  organizations: Organization[]
  activeOrganization: Organization | null
  collapsed?: boolean
}

export function OrgSwitcher({
  organizations,
  activeOrganization,
  collapsed = false,
}: OrgSwitcherProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  async function switchOrganization(organizationId: string) {
    if (organizationId === activeOrganization?.id) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/organization/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to switch organization:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (collapsed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
        {activeOrganization?.name?.[0]?.toUpperCase() || 'U'}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-2 h-12"
          disabled={isLoading}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            {activeOrganization?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-1 flex-col items-start text-left overflow-hidden">
            <span className="text-sm font-semibold truncate w-full">
              {activeOrganization?.name || 'Select Organization'}
            </span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {activeOrganization?.slug || 'No organization'}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrganization(org.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium">
                {org.name[0].toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <span className="text-sm">{org.name}</span>
              </div>
              {org.id === activeOrganization?.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push('/settings/organizations/new')}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

