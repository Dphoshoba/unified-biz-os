import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// Email provider type
type EmailProvider = 'smtp' | 'resend'

// Get the configured provider
const getProvider = (): EmailProvider => {
  if (process.env.RESEND_API_KEY) return 'resend'
  if (process.env.SMTP_HOST) return 'smtp'
  return 'smtp' // Default
}

// Create SMTP transporter
const createSmtpTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

// Create Resend client
const createResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY)
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const provider = getProvider()
  const from = options.from || process.env.EMAIL_FROM || 'Eternal Echoes & Visions <noreply@eternalechoesvisions.com>'

  try {
    if (provider === 'resend' && process.env.RESEND_API_KEY) {
      const resend = createResendClient()
      await resend.emails.send({
        from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      })
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = createSmtpTransporter()
      await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })
    } else {
      // Development mode - log email to console
      console.log('📧 Email would be sent (no email provider configured):')
      console.log('  To:', options.to)
      console.log('  Subject:', options.subject)
      console.log('  Preview: Email logged to console in development mode')
      return { success: true }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

// Export email templates
export * from './templates'



