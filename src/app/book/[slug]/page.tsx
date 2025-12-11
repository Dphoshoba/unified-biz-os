import { notFound } from 'next/navigation'
import { getPublicServices } from '@/lib/bookings'
import { BookingFlow } from './booking-flow'

interface PublicBookingPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ service?: string; provider?: string }>
}

export async function generateMetadata({ params }: PublicBookingPageProps) {
  const { slug } = await params
  const data = await getPublicServices(slug)
  
  if (!data) {
    return { title: 'Organization Not Found' }
  }
  
  return {
    title: `Book with ${data.organization.name}`,
    description: `Schedule an appointment with ${data.organization.name}`,
  }
}

export default async function PublicBookingPage({ 
  params, 
  searchParams 
}: PublicBookingPageProps) {
  const { slug } = await params
  const { service: preselectedService, provider: preselectedProvider } = await searchParams
  
  const data = await getPublicServices(slug)
  
  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Organization Header */}
        <div className="text-center mb-10">
          {data.organization.logo ? (
            <img 
              src={data.organization.logo} 
              alt={data.organization.name}
              className="h-16 w-16 mx-auto mb-4 rounded-xl"
            />
          ) : (
            <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {data.organization.name.charAt(0)}
              </span>
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight">
            {data.organization.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Select a service to book an appointment
          </p>
        </div>

        {/* Booking Flow */}
        <BookingFlow 
          organization={data.organization}
          services={data.services}
          preselectedServiceId={preselectedService}
          preselectedProviderId={preselectedProvider}
        />
      </div>
    </div>
  )
}

