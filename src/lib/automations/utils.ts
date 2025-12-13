import { AutomationTrigger, AutomationAction } from '@prisma/client'

// Helper to format trigger type for display
export function formatTriggerType(trigger: AutomationTrigger): string {
  const labels: Record<AutomationTrigger, string> = {
    CONTACT_CREATED: 'New contact created',
    CONTACT_TAG_ADDED: 'Tag added to contact',
    DEAL_CREATED: 'New deal created',
    DEAL_STAGE_CHANGED: 'Deal stage changed',
    DEAL_WON: 'Deal won',
    DEAL_LOST: 'Deal lost',
    BOOKING_CREATED: 'New booking created',
    BOOKING_CONFIRMED: 'Booking confirmed',
    BOOKING_CANCELLED: 'Booking cancelled',
    PAYMENT_RECEIVED: 'Payment received',
    FORM_SUBMITTED: 'Form submitted',
  }
  return labels[trigger] || trigger
}

// Helper to format action type for display
export function formatActionType(action: AutomationAction): string {
  const labels: Record<AutomationAction, string> = {
    SEND_EMAIL: 'Send email',
    ADD_TAG: 'Add tag',
    REMOVE_TAG: 'Remove tag',
    UPDATE_CONTACT_STATUS: 'Update contact status',
    CREATE_TASK: 'Create task',
    SEND_NOTIFICATION: 'Send notification',
    WEBHOOK: 'Call webhook',
    DELAY: 'Wait/Delay',
  }
  return labels[action] || action
}

