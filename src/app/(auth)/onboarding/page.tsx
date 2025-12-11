import { redirect } from 'next/navigation'
import { checkAndFixOrganization } from './actions'
import { OnboardingForm } from './onboarding-form'

export default async function OnboardingPage() {
  // Check if user already has an organization
  const result = await checkAndFixOrganization()

  // If user already has an org, redirect to dashboard
  if (result.hasOrg && !result.needsOnboarding) {
    redirect('/dashboard')
  }

  return <OnboardingForm />
}

