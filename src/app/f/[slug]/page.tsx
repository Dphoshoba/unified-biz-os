import { notFound } from 'next/navigation'
import { getPublicFunnel } from '@/lib/funnels/public'
import { FunnelViewer } from './funnel-viewer'

interface PublicFunnelPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PublicFunnelPageProps) {
  const { slug } = await params
  const funnel = await getPublicFunnel(slug)
  
  if (!funnel) {
    return { title: 'Funnel Not Found' }
  }
  
  return {
    title: funnel.name,
    description: funnel.description || `Visit ${funnel.organization.name}'s ${funnel.name}`,
  }
}

export default async function PublicFunnelPage({ params }: PublicFunnelPageProps) {
  const { slug } = await params
  const funnel = await getPublicFunnel(slug)
  
  if (!funnel) {
    notFound()
  }

  return <FunnelViewer funnel={funnel} />
}

