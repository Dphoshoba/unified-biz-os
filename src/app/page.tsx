import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-helpers'
import { defaultLocale } from '@/i18n/config'

export default async function LandingPage() {
  // Redirect authenticated users to dashboard
  const session = await getSession()
  if (session?.user) {
    redirect('/dashboard')
  }
  
  // Redirect to locale version
  redirect(`/${defaultLocale}`)
}
