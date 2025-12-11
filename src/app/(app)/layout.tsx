import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AppShell } from '@/components/layout/app-shell'

async function getSessionData() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          organization: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!user) {
    return null
  }

  const organizations = user.memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    logo: m.organization.logo,
    role: m.role,
  }))

  // Find active org or fall back to first org
  let activeOrganization = organizations.find(
    (org) => org.id === user.activeOrganizationId
  ) || organizations[0] || null

  // If user has orgs but no activeOrganizationId set, fix it in the database
  if (activeOrganization && !user.activeOrganizationId) {
    await db.user.update({
      where: { id: user.id },
      data: { activeOrganizationId: activeOrganization.id },
    })
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    organizations,
    activeOrganization,
  }
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sessionData = await getSessionData()

  // Redirect to sign-in if not authenticated
  if (!sessionData) {
    redirect('/auth/sign-in')
  }

  // Redirect to onboarding if no organization
  if (!sessionData.activeOrganization) {
    redirect('/onboarding')
  }

  return (
    <AppShell
      user={sessionData.user}
      organizations={sessionData.organizations}
      activeOrganization={sessionData.activeOrganization}
    >
      {children}
    </AppShell>
  )
}
