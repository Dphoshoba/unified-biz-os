// Base email layout
const baseLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UnifiedBizOS</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .button {
      display: inline-block;
      background: #3b82f6;
      color: white !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background: #2563eb;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 12px;
    }
    .info-box {
      background: #f8fafc;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      color: #64748b;
      font-size: 14px;
    }
    .value {
      font-weight: 600;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} UnifiedBizOS. All rights reserved.</p>
      <p>This email was sent by UnifiedBizOS</p>
    </div>
  </div>
</body>
</html>
`

// Team Invitation Email
export interface InvitationEmailData {
  inviteeName?: string
  inviterName: string
  organizationName: string
  role: string
  inviteUrl: string
  expiresAt: Date
}

export function invitationEmailTemplate(data: InvitationEmailData): { html: string; text: string } {
  const html = baseLayout(`
    <div class="header">
      <h1>You're Invited! 🎉</h1>
    </div>
    <div class="content">
      <p>Hi${data.inviteeName ? ` ${data.inviteeName}` : ''},</p>
      
      <p><strong>${data.inviterName}</strong> has invited you to join <strong>${data.organizationName}</strong> on UnifiedBizOS.</p>
      
      <div class="info-box">
        <div class="info-row">
          <span class="label">Organization</span>
          <span class="value">${data.organizationName}</span>
        </div>
        <div class="info-row">
          <span class="label">Your Role</span>
          <span class="value">${data.role}</span>
        </div>
        <div class="info-row">
          <span class="label">Invited By</span>
          <span class="value">${data.inviterName}</span>
        </div>
      </div>
      
      <p style="text-align: center;">
        <a href="${data.inviteUrl}" class="button">Accept Invitation</a>
      </p>
      
      <p style="font-size: 14px; color: #666;">
        This invitation expires on ${data.expiresAt.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}.
      </p>
      
      <p style="font-size: 12px; color: #999; margin-top: 20px;">
        If you didn't expect this invitation, you can safely ignore this email.
      </p>
    </div>
  `)

  const text = `
You're Invited to ${data.organizationName}!

Hi${data.inviteeName ? ` ${data.inviteeName}` : ''},

${data.inviterName} has invited you to join ${data.organizationName} on UnifiedBizOS.

Organization: ${data.organizationName}
Your Role: ${data.role}
Invited By: ${data.inviterName}

Accept your invitation here: ${data.inviteUrl}

This invitation expires on ${data.expiresAt.toLocaleDateString()}.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} UnifiedBizOS
  `.trim()

  return { html, text }
}

// Booking Confirmation Email
export interface BookingConfirmationData {
  customerName: string
  serviceName: string
  dateTime: Date
  duration: number
  organizationName: string
  notes?: string
  bookingUrl?: string
}

export function bookingConfirmationTemplate(data: BookingConfirmationData): { html: string; text: string } {
  const html = baseLayout(`
    <div class="header">
      <h1>Booking Confirmed! ✓</h1>
    </div>
    <div class="content">
      <p>Hi ${data.customerName},</p>
      
      <p>Your booking with <strong>${data.organizationName}</strong> has been confirmed!</p>
      
      <div class="info-box">
        <div class="info-row">
          <span class="label">Service</span>
          <span class="value">${data.serviceName}</span>
        </div>
        <div class="info-row">
          <span class="label">Date & Time</span>
          <span class="value">${data.dateTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}</span>
        </div>
        <div class="info-row">
          <span class="label">Duration</span>
          <span class="value">${data.duration} minutes</span>
        </div>
        ${data.notes ? `
        <div class="info-row">
          <span class="label">Notes</span>
          <span class="value">${data.notes}</span>
        </div>
        ` : ''}
      </div>
      
      ${data.bookingUrl ? `
      <p style="text-align: center;">
        <a href="${data.bookingUrl}" class="button">View Booking Details</a>
      </p>
      ` : ''}
      
      <p>We look forward to seeing you!</p>
      
      <p style="font-size: 14px; color: #666;">
        Need to make changes? Contact ${data.organizationName} to reschedule or cancel.
      </p>
    </div>
  `)

  const text = `
Booking Confirmed!

Hi ${data.customerName},

Your booking with ${data.organizationName} has been confirmed!

Service: ${data.serviceName}
Date & Time: ${data.dateTime.toLocaleString()}
Duration: ${data.duration} minutes
${data.notes ? `Notes: ${data.notes}` : ''}

We look forward to seeing you!

Need to make changes? Contact ${data.organizationName} to reschedule or cancel.

© ${new Date().getFullYear()} UnifiedBizOS
  `.trim()

  return { html, text }
}

// Welcome Email
export interface WelcomeEmailData {
  userName: string
  organizationName: string
  loginUrl: string
}

export function welcomeEmailTemplate(data: WelcomeEmailData): { html: string; text: string } {
  const html = baseLayout(`
    <div class="header">
      <h1>Welcome to UnifiedBizOS! 🚀</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      
      <p>Welcome to <strong>${data.organizationName}</strong>! Your account has been created and you're ready to start managing your business.</p>
      
      <h3 style="margin-top: 24px;">Here's what you can do:</h3>
      <ul style="color: #555;">
        <li>📊 <strong>Dashboard</strong> - See your business at a glance</li>
        <li>👥 <strong>CRM</strong> - Manage contacts, companies, and deals</li>
        <li>📅 <strong>Bookings</strong> - Accept online appointments</li>
        <li>💳 <strong>Payments</strong> - Send invoices and get paid</li>
        <li>⚡ <strong>Automations</strong> - Automate repetitive tasks</li>
      </ul>
      
      <p style="text-align: center;">
        <a href="${data.loginUrl}" class="button">Go to Dashboard</a>
      </p>
      
      <p>If you have any questions, visit our <a href="${data.loginUrl}/support">Help Center</a> or contact support.</p>
      
      <p>Happy growing! 🌱</p>
      <p><em>The UnifiedBizOS Team</em></p>
    </div>
  `)

  const text = `
Welcome to UnifiedBizOS!

Hi ${data.userName},

Welcome to ${data.organizationName}! Your account has been created and you're ready to start managing your business.

Here's what you can do:
- Dashboard - See your business at a glance
- CRM - Manage contacts, companies, and deals
- Bookings - Accept online appointments
- Payments - Send invoices and get paid
- Automations - Automate repetitive tasks

Get started: ${data.loginUrl}

If you have any questions, visit our Help Center or contact support.

Happy growing!
The UnifiedBizOS Team

© ${new Date().getFullYear()} UnifiedBizOS
  `.trim()

  return { html, text }
}

// Password Reset Email
export interface PasswordResetData {
  userName: string
  resetUrl: string
  expiresIn: string
}

export function passwordResetTemplate(data: PasswordResetData): { html: string; text: string } {
  const html = baseLayout(`
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <p style="text-align: center;">
        <a href="${data.resetUrl}" class="button">Reset Password</a>
      </p>
      
      <p style="font-size: 14px; color: #666;">
        This link will expire in ${data.expiresIn}.
      </p>
      
      <p style="font-size: 14px; color: #666;">
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
    </div>
  `)

  const text = `
Reset Your Password

Hi ${data.userName},

We received a request to reset your password. Click the link below to create a new password:

${data.resetUrl}

This link will expire in ${data.expiresIn}.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

© ${new Date().getFullYear()} UnifiedBizOS
  `.trim()

  return { html, text }
}

// Invoice Email
export interface InvoiceEmailData {
  customerName: string
  invoiceNumber: string
  amount: number
  currency: string
  dueDate: Date
  items: { name: string; quantity: number; price: number }[]
  paymentUrl: string
  organizationName: string
}

export function invoiceEmailTemplate(data: InvoiceEmailData): { html: string; text: string } {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(amount)
  }

  const html = baseLayout(`
    <div class="header">
      <h1>Invoice ${data.invoiceNumber}</h1>
    </div>
    <div class="content">
      <p>Hi ${data.customerName},</p>
      
      <p>Here's your invoice from <strong>${data.organizationName}</strong>.</p>
      
      <div class="info-box">
        <div class="info-row">
          <span class="label">Invoice Number</span>
          <span class="value">${data.invoiceNumber}</span>
        </div>
        <div class="info-row">
          <span class="label">Due Date</span>
          <span class="value">${data.dueDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        <div class="info-row">
          <span class="label">Amount Due</span>
          <span class="value" style="font-size: 18px; color: #3b82f6;">${formatCurrency(data.amount)}</span>
        </div>
      </div>
      
      <h4 style="margin-top: 24px;">Items:</h4>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0;">
            <th style="text-align: left; padding: 8px 0; color: #64748b;">Item</th>
            <th style="text-align: center; padding: 8px 0; color: #64748b;">Qty</th>
            <th style="text-align: right; padding: 8px 0; color: #64748b;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 0;">${item.name}</td>
            <td style="text-align: center; padding: 12px 0;">${item.quantity}</td>
            <td style="text-align: right; padding: 12px 0;">${formatCurrency(item.price * item.quantity)}</td>
          </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px 0; font-weight: 600;">Total</td>
            <td style="text-align: right; padding: 12px 0; font-weight: 600; font-size: 18px;">${formatCurrency(data.amount)}</td>
          </tr>
        </tfoot>
      </table>
      
      <p style="text-align: center;">
        <a href="${data.paymentUrl}" class="button">Pay Now</a>
      </p>
      
      <p style="font-size: 14px; color: #666;">
        Questions? Contact ${data.organizationName} for assistance.
      </p>
    </div>
  `)

  const text = `
Invoice ${data.invoiceNumber}

Hi ${data.customerName},

Here's your invoice from ${data.organizationName}.

Invoice Number: ${data.invoiceNumber}
Due Date: ${data.dueDate.toLocaleDateString()}
Amount Due: ${formatCurrency(data.amount)}

Items:
${data.items.map(item => `- ${item.name} x${item.quantity}: ${formatCurrency(item.price * item.quantity)}`).join('\n')}

Total: ${formatCurrency(data.amount)}

Pay now: ${data.paymentUrl}

Questions? Contact ${data.organizationName} for assistance.

© ${new Date().getFullYear()} UnifiedBizOS
  `.trim()

  return { html, text }
}

