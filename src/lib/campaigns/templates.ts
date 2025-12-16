export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  description: string
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'newsletter',
    name: 'Monthly Newsletter',
    subject: '{{Contact.FirstName}}, here\'s what\'s new this month',
    content: `<h1>Hello {{Contact.Name}},</h1>
<p>We're excited to share what's been happening this month!</p>

<h2>Featured Updates</h2>
<ul>
  <li>New features and improvements</li>
  <li>Latest news and announcements</li>
  <li>Upcoming events and opportunities</li>
</ul>

<p>Thank you for being part of our community!</p>

<p>Best regards,<br>
The Team</p>`,
    description: 'Monthly newsletter template with updates and announcements',
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    subject: 'Introducing {{Contact.FirstName}}: [Product Name]',
    content: `<h1>Hello {{Contact.Name}},</h1>
<p>We're thrilled to announce our latest innovation!</p>

<h2>[Product Name]</h2>
<p>After months of development, we're excited to introduce [Product Name] - designed to [key benefit].</p>

<h3>Key Features:</h3>
<ul>
  <li>Feature 1</li>
  <li>Feature 2</li>
  <li>Feature 3</li>
</ul>

<p><a href="[CTA Link]" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Learn More</a></p>

<p>Best regards,<br>
The Team</p>`,
    description: 'Announce new products or features to your audience',
  },
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome {{Contact.FirstName}}!',
    content: `<h1>Welcome {{Contact.Name}}!</h1>
<p>Thank you for joining us. We're excited to have you as part of our community!</p>

<h2>Getting Started</h2>
<p>Here are some resources to help you get the most out of [Your Service]:</p>
<ul>
  <li><a href="#">Quick Start Guide</a></li>
  <li><a href="#">Video Tutorials</a></li>
  <li><a href="#">Help Center</a></li>
</ul>

<p>If you have any questions, don't hesitate to reach out to our support team.</p>

<p>Welcome aboard!<br>
The Team</p>`,
    description: 'Welcome new subscribers or customers',
  },
  {
    id: 'promotion',
    name: 'Promotional Offer',
    subject: '{{Contact.FirstName}}, special offer just for you!',
    content: `<h1>Hello {{Contact.Name}},</h1>
<p>As a valued member of our community, we have a special offer just for you!</p>

<h2>Limited Time Offer</h2>
<p>Get [X]% off on [Product/Service] - valid until [Date]</p>

<p><strong>Use code: [PROMO_CODE]</strong></p>

<p><a href="[Link]" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Claim Offer</a></p>

<p>Hurry, this offer won't last long!</p>

<p>Best regards,<br>
The Team</p>`,
    description: 'Send promotional offers and discounts',
  },
  {
    id: 'event-invitation',
    name: 'Event Invitation',
    subject: 'You\'re invited: [Event Name]',
    content: `<h1>Hello {{Contact.Name}},</h1>
<p>You're invited to join us for an exclusive event!</p>

<h2>[Event Name]</h2>
<p><strong>Date:</strong> [Date]<br>
<strong>Time:</strong> [Time]<br>
<strong>Location:</strong> [Location/Virtual Link]</p>

<h3>What to Expect:</h3>
<ul>
  <li>Networking opportunities</li>
  <li>Expert presentations</li>
  <li>Q&A sessions</li>
</ul>

<p><a href="[RSVP Link]" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">RSVP Now</a></p>

<p>We hope to see you there!</p>

<p>Best regards,<br>
The Team</p>`,
    description: 'Invite contacts to events, webinars, or meetings',
  },
]

