import { notFound, redirect } from 'next/navigation'
import { getFunnel } from '@/lib/funnels/actions'
import { getSession } from '@/lib/auth-helpers'
import { FunnelEditor } from './funnel-editor'

interface FunnelEditPageProps {
  params: Promise<{ id: string }>
}

export default async function FunnelEditPage({ params }: FunnelEditPageProps) {
  const session = await getSession()
  if (!session?.activeOrganizationId) {
    redirect('/auth/sign-in')
  }

  const { id } = await params
  const funnel = await getFunnel(id)

  if (!funnel) {
    notFound()
  }

  return <FunnelEditor funnel={funnel} />
}

