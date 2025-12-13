import { Search, Filter, MoreHorizontal, Upload } from 'lucide-react'

import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { ComingSoonButton } from '@/components/ui/coming-soon-button'
import { ImportContactsDialog } from './import-contacts-dialog'
import { ExportContactsButton } from './export-contacts-button'
import { getContacts, getContactsCount } from '@/lib/crm'
import { AddContactDialog } from './add-contact-dialog'

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'secondary' | 'destructive'> = {
  ACTIVE: 'success',
  LEAD: 'default',
  CUSTOMER: 'success',
  INACTIVE: 'secondary',
  CHURNED: 'destructive',
}

export default async function ContactsPage() {
  const [contacts, totalCount] = await Promise.all([
    getContacts({ limit: 50 }),
    getContactsCount(),
  ])

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Contacts" description={`${totalCount} total contacts`}>
        <div className="flex gap-2">
          <ImportContactsDialog />
          <AddContactDialog />
        </div>
      </PageHeader>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-10 max-w-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <ComingSoonButton featureName="Filter Contacts" variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </ComingSoonButton>
              <ExportContactsButton />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Deals
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No contacts found. Create your first contact to get started.
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {contact.firstName[0]}
                              {contact.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {contact.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {contact.company?.name || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColors[contact.status] || 'default'}>
                          {contact.status.toLowerCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {contact.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs"
                              style={{ borderColor: tag.color, color: tag.color }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                          {contact.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {contact._count.deals}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
