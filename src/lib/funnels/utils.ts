import { FunnelType, FunnelStepType } from '@prisma/client'

// Helper to format funnel type for display
export function formatFunnelType(type: FunnelType): string {
  const labels: Record<FunnelType, string> = {
    LEAD_MAGNET: 'Lead Magnet',
    CONSULTATION: 'Consultation Booking',
    FREE_TRIAL: 'Free Trial',
    DIRECT_PURCHASE: 'Direct Purchase',
    WEBINAR: 'Webinar Registration',
    WAITLIST: 'Waitlist',
  }
  return labels[type] || type
}

// Template definitions for funnel creation
export const FUNNEL_TEMPLATES = {
  LEAD_MAGNET: {
    name: 'Lead Magnet',
    description: 'Capture leads with a free resource download',
    steps: [
      { name: 'Landing Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Opt-in Form', type: 'OPT_IN_FORM' as FunnelStepType, order: 2 },
      { name: 'Thank You', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  CONSULTATION: {
    name: 'Consultation Booking',
    description: 'Book discovery calls or consultations',
    steps: [
      { name: 'Landing Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Calendar Booking', type: 'CALENDAR' as FunnelStepType, order: 2 },
      { name: 'Confirmation', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  FREE_TRIAL: {
    name: 'Free Trial',
    description: 'Offer a free trial to convert prospects',
    steps: [
      { name: 'Landing Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Sign Up Form', type: 'OPT_IN_FORM' as FunnelStepType, order: 2 },
      { name: 'Onboarding', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  DIRECT_PURCHASE: {
    name: 'Direct Purchase',
    description: 'Sell products or services directly',
    steps: [
      { name: 'Sales Page', type: 'SALES_PAGE' as FunnelStepType, order: 1 },
      { name: 'Checkout', type: 'CHECKOUT' as FunnelStepType, order: 2 },
      { name: 'Thank You', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  WEBINAR: {
    name: 'Webinar Registration',
    description: 'Register attendees for your webinar',
    steps: [
      { name: 'Registration Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Sign Up Form', type: 'OPT_IN_FORM' as FunnelStepType, order: 2 },
      { name: 'Confirmation', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
  WAITLIST: {
    name: 'Waitlist',
    description: 'Build anticipation with a waitlist',
    steps: [
      { name: 'Coming Soon Page', type: 'LANDING_PAGE' as FunnelStepType, order: 1 },
      { name: 'Join Waitlist', type: 'OPT_IN_FORM' as FunnelStepType, order: 2 },
      { name: 'Confirmation', type: 'THANK_YOU' as FunnelStepType, order: 3 },
    ],
  },
}

