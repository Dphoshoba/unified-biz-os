# Automations & Funnels User Guide

## Table of Contents
1. [Automations Overview](#automations-overview)
2. [Automation Triggers Explained](#automation-triggers-explained)
3. [Automation Actions Explained](#automation-actions-explained)
4. [Funnels Overview](#funnels-overview)
5. [Funnel Types Explained](#funnel-types-explained)
6. [How to Create an Automation](#how-to-create-an-automation)
7. [How to Create a Funnel](#how-to-create-a-funnel)
8. [Best Practices](#best-practices)

---

## Automations Overview

**Automations** are workflows that run automatically based on triggers you set. They help you save time by handling repetitive tasks without manual intervention.

### Key Concepts:
- **Trigger**: The event that starts the automation (e.g., "New contact created")
- **Action**: What happens when the trigger fires (e.g., "Send email")
- **Status**: Active (running) or Paused (stopped)
- **Executions**: How many times the automation has run

---

## Automation Triggers Explained

### 1. **New Contact Created**
**When it fires:** Automatically triggers when a new contact is added to your CRM.

**Best for:**
- Sending welcome emails to new contacts
- Adding new contacts to email sequences
- Assigning tags to new leads
- Creating follow-up tasks for your team

**Example Use Case:** "When someone fills out your contact form, automatically send them a welcome email and add them to your newsletter."

---

### 2. **Tag Added to Contact**
**When it fires:** Triggers when a tag is applied to a contact in your CRM.

**Best for:**
- Segmenting contacts based on interests
- Triggering specific email campaigns
- Moving contacts through different workflows
- Updating contact status based on tags

**Example Use Case:** "When you tag a contact as 'VIP', automatically send them a special offer email and notify your sales team."

---

### 3. **New Deal Created**
**When it fires:** Triggers when a new deal/opportunity is created in your CRM.

**Best for:**
- Notifying team members about new opportunities
- Setting up deal tracking workflows
- Creating follow-up tasks
- Sending confirmation emails to prospects

**Example Use Case:** "When a new deal is created, automatically create a task for the assigned sales rep and send a notification to the sales manager."

---

### 4. **Deal Stage Changed**
**When it fires:** Triggers when a deal moves from one stage to another in your sales pipeline.

**Best for:**
- Sending updates when deals progress
- Triggering stage-specific actions
- Notifying stakeholders of progress
- Creating stage-appropriate follow-ups

**Example Use Case:** "When a deal moves to 'Proposal' stage, automatically send the proposal document to the contact and create a follow-up task for 3 days later."

---

### 5. **Deal Won**
**When it fires:** Triggers when a deal is marked as "Won" in your CRM.

**Best for:**
- Celebrating wins with your team
- Sending thank-you emails to customers
- Creating onboarding workflows
- Updating contact status to "Customer"

**Example Use Case:** "When a deal is won, automatically send a thank-you email to the customer, add them to your 'Customers' tag, and notify your team in Slack."

---

### 6. **Deal Lost**
**When it fires:** Triggers when a deal is marked as "Lost" in your CRM.

**Best for:**
- Sending feedback surveys
- Moving contacts to re-engagement campaigns
- Creating win-back sequences
- Analyzing lost deal reasons

**Example Use Case:** "When a deal is lost, automatically send a feedback survey and add the contact to a 'Re-engagement' email sequence."

---

### 7. **New Booking Created**
**When it fires:** Triggers when someone books an appointment through your booking system.

**Best for:**
- Sending booking confirmation emails
- Adding booking details to calendar
- Creating preparation tasks
- Notifying service providers

**Example Use Case:** "When a new booking is created, automatically send a confirmation email with meeting details and add a reminder task for the day before."

---

### 8. **Booking Confirmed**
**When it fires:** Triggers when a booking is confirmed (after initial creation).

**Best for:**
- Sending detailed confirmation emails
- Creating calendar events
- Sending preparation materials
- Setting up reminder sequences

**Example Use Case:** "When a booking is confirmed, automatically send a detailed confirmation with meeting link and preparation materials."

---

### 9. **Booking Cancelled**
**When it fires:** Triggers when a booking is cancelled.

**Best for:**
- Sending cancellation confirmations
- Offering rescheduling options
- Freeing up calendar slots
- Following up with alternative options

**Example Use Case:** "When a booking is cancelled, automatically send a cancellation confirmation and offer to reschedule with a link to your calendar."

---

### 10. **Payment Received**
**When it fires:** Triggers when a payment is successfully completed.

**Best for:**
- Sending receipt emails
- Updating contact status to "Customer"
- Adding customers to special groups
- Triggering post-purchase sequences

**Example Use Case:** "When a payment is received, automatically send a receipt, add the contact to 'Customers' tag, and start a welcome sequence."

---

### 11. **Form Submitted**
**When it fires:** Triggers when someone submits a form on your website.

**Best for:**
- Capturing leads from landing pages
- Sending thank-you messages
- Adding contacts to CRM
- Triggering lead nurturing sequences

**Example Use Case:** "When someone submits your contact form, automatically add them to your CRM, send a thank-you email, and start a 5-day email sequence."

---

## Automation Actions Explained

### 1. **Send Email**
**What it does:** Sends an automated email to the contact.

**Best for:**
- Welcome sequences
- Follow-up emails
- Notifications
- Educational content

**Configuration:** You'll need to set up email templates and content (this will be expanded in future updates).

---

### 2. **Add Tag**
**What it does:** Automatically adds a tag to the contact in your CRM.

**Best for:**
- Organizing contacts
- Segmenting audiences
- Tracking customer journey stages
- Creating contact groups

**Example:** When a contact makes a purchase, automatically tag them as "Customer" and "VIP".

---

### 3. **Remove Tag**
**What it does:** Removes a specific tag from a contact.

**Best for:**
- Cleaning up old tags
- Moving contacts between segments
- Updating contact status
- Maintaining tag hygiene

**Example:** When a customer cancels their subscription, remove the "Active Subscriber" tag.

---

### 4. **Update Contact Status**
**What it does:** Changes the contact's status in your CRM (e.g., Lead → Customer).

**Best for:**
- Tracking customer lifecycle
- Segmenting by status
- Reporting and analytics
- Workflow management

**Example:** When a deal is won, automatically update contact status from "Lead" to "Customer".

---

### 5. **Create Task**
**What it does:** Creates a follow-up task for you or your team.

**Best for:**
- Reminding yourself to follow up
- Assigning work to team members
- Creating structured workflows
- Ensuring nothing falls through cracks

**Example:** When a new lead is created, automatically create a task "Follow up with [Contact Name] in 24 hours".

---

### 6. **Send Notification**
**What it does:** Sends an in-app notification to team members.

**Best for:**
- Alerting team of important events
- Real-time updates
- Team coordination
- Keeping everyone informed

**Example:** When a high-value deal is won, send a notification to the entire sales team.

---

### 7. **Call Webhook**
**What it does:** Sends data to an external URL (API endpoint).

**Best for:**
- Integrating with third-party tools
- Custom integrations
- Advanced workflows
- Connecting to other systems

**Example:** When a payment is received, call a webhook to update your accounting software.

---

### 8. **Wait/Delay**
**What it does:** Pauses the automation for a specified time before continuing.

**Best for:**
- Creating timed sequences
- Spacing out emails
- Building multi-step workflows
- Preventing overwhelming contacts

**Example:** Wait 3 days after sending a welcome email, then send a follow-up.

---

## Funnels Overview

**Funnels** are multi-step marketing campaigns designed to guide visitors through a journey from awareness to action. Each funnel consists of multiple pages/steps that work together to convert visitors into leads or customers.

### Key Concepts:
- **Template**: Pre-built funnel structure you can customize
- **Steps**: Individual pages in your funnel (landing page, form, thank you, etc.)
- **Visitors**: People who visit your funnel
- **Conversions**: People who complete your funnel goal
- **Conversion Rate**: Percentage of visitors who convert

---

## Funnel Types Explained

### 1. **Lead Magnet**
**Purpose:** Capture leads by offering a free, valuable resource (e.g., ebook, guide, checklist).

**How it works:**
1. **Landing Page**: Presents the free resource and its value
2. **Opt-in Form**: Collects email address in exchange for the resource
3. **Thank You Page**: Confirms submission and delivers the resource

**Best for:**
- Building your email list
- Establishing authority in your niche
- Generating leads for your business
- Content marketing campaigns

**Example:** "Free Guide: 10 Ways to Grow Your Business" - Visitors enter their email to download the guide.

**When to use:**
- You have valuable content to offer
- You want to build an email list
- You're starting a new marketing campaign
- You want to establish thought leadership

---

### 2. **Consultation Booking**
**Purpose:** Get prospects to book a discovery call or consultation with you.

**How it works:**
1. **Landing Page**: Explains the value of the consultation
2. **Calendar Booking**: Shows your available time slots
3. **Confirmation**: Confirms the booking with details

**Best for:**
- Service-based businesses
- Coaches and consultants
- Sales teams
- Professional services

**Example:** "Book a Free 30-Minute Strategy Session" - Visitors can see your calendar and book a time.

**When to use:**
- You offer consultations or discovery calls
- You want to qualify leads before selling
- You provide personalized services
- You want to build relationships first

---

### 3. **Free Trial**
**Purpose:** Convert prospects by offering a free trial of your product or service.

**How it works:**
1. **Landing Page**: Highlights product benefits and trial offer
2. **Sign Up Form**: Collects information to create an account
3. **Onboarding**: Welcomes them and guides them through setup

**Best for:**
- SaaS products
- Software companies
- Subscription services
- Digital products with trial periods

**Example:** "Start Your 14-Day Free Trial - No Credit Card Required" - Visitors sign up to try your product.

**When to use:**
- You have a product with a trial period
- You want to reduce purchase friction
- You're confident in your product's value
- You want to build a user base quickly

---

### 4. **Direct Purchase**
**Purpose:** Sell products or services directly without a lead capture step.

**How it works:**
1. **Sales Page**: Presents your offer with benefits, features, and pricing
2. **Checkout**: Secure payment processing
3. **Thank You**: Confirms purchase and provides next steps

**Best for:**
- E-commerce products
- One-time purchases
- Digital products
- Clear value propositions

**Example:** "Buy Our Premium Course - $297" - Visitors can purchase immediately.

**When to use:**
- You have a clear, compelling offer
- Price point is low enough for impulse purchases
- You want immediate revenue
- Your product doesn't need explanation

---

### 5. **Webinar Registration**
**Purpose:** Build anticipation and register attendees for your webinar.

**How it works:**
1. **Registration Page**: Promotes the webinar with date, time, and value
2. **Sign Up Form**: Collects attendee information
3. **Confirmation**: Confirms registration and provides webinar details

**Best for:**
- Educational content
- Product launches
- Building authority
- Nurturing leads

**Example:** "Register for Our Free Webinar: How to 10x Your Revenue" - Visitors register to attend.

**When to use:**
- You're hosting a webinar
- You want to build an engaged audience
- You're launching a new product
- You want to educate your market

---

### 6. **Waitlist**
**Purpose:** Build anticipation and collect early interest for a product or service launch.

**How it works:**
1. **Coming Soon Page**: Creates excitement about your upcoming launch
2. **Join Waitlist**: Collects email addresses from interested people
3. **Confirmation**: Confirms they're on the waitlist with next steps

**Best for:**
- Product launches
- Building anticipation
- Validating demand
- Creating FOMO (fear of missing out)

**Example:** "Join the Waitlist - Be First to Access Our New Platform" - Visitors join to get early access.

**When to use:**
- You're launching something new
- You want to validate demand
- You want to build a list of interested buyers
- You're creating scarcity and urgency

---

## How to Create an Automation

### Step-by-Step Guide:

1. **Navigate to Automations**
   - Click "Automations" in the left sidebar
   - Click the "Create Automation" button

2. **Choose a Trigger**
   - Review the available triggers
   - Click on the trigger that matches what you want to automate
   - Example: Click "New contact created" if you want to automate actions when someone new joins

3. **Choose an Action**
   - Review the available actions
   - Click on the action you want to happen
   - Example: Click "Send email" to send an automated email

4. **Add Details**
   - Enter a name for your automation (e.g., "Welcome Email Sequence")
   - Add an optional description
   - Review the trigger → action flow shown at the top
   - Click "Create Automation"

5. **Manage Your Automation**
   - **Activate/Pause**: Click the play/pause button to start or stop the automation
   - **Delete**: Click the three-dot menu and select "Delete Automation"
   - **View Stats**: See execution count and last run time on each automation card

### Example Automation Workflow:

**"Welcome New Contacts"**
- **Trigger**: New contact created
- **Action**: Send email
- **Result**: Every time someone new is added to your CRM, they automatically receive a welcome email

---

## How to Create a Funnel

### Step-by-Step Guide:

1. **Navigate to Funnels**
   - Click "Funnels" in the left sidebar
   - Click the "Create Funnel" button

2. **Choose a Template**
   - Review the 6 available templates
   - Each template shows:
     - Icon and name
     - Description
     - Steps that will be created
   - Click on the template that matches your goal
   - Example: Click "Lead Magnet" if you want to capture leads with a free resource

3. **Name Your Funnel**
   - Enter a memorable name (e.g., "Free Strategy Guide Download")
   - Review the steps that will be created (shown as badges)
   - Click "Create Funnel"

4. **Your Funnel is Created**
   - The funnel is created in "Draft" status
   - All steps are automatically created based on the template
   - You can now customize each step (coming in future updates)

5. **Activate Your Funnel**
   - Click the three-dot menu on your funnel
   - Select "Activate Funnel" to make it live
   - Use "View" to see your funnel
   - Use "Copy Link" to share your funnel URL

6. **Track Performance**
   - Monitor visitors, conversions, and conversion rate
   - View revenue generated (for purchase funnels)
   - Use data to optimize your funnel

### Example Funnel Workflow:

**"Free Ebook Download"**
- **Template**: Lead Magnet
- **Steps Created**:
  1. Landing Page (promotes the ebook)
  2. Opt-in Form (collects email)
  3. Thank You Page (confirms and delivers ebook)
- **Result**: Visitors enter their email to download your ebook, and you capture leads

---

## Best Practices

### Automations Best Practices:

1. **Start Simple**
   - Begin with one trigger and one action
   - Test thoroughly before adding complexity
   - Monitor execution counts to ensure they're working

2. **Name Clearly**
   - Use descriptive names (e.g., "Welcome Email for New Contacts")
   - Include the trigger and action in the name
   - Make it easy to find later

3. **Test Before Activating**
   - Create test contacts/deals/bookings
   - Verify the automation works as expected
   - Check email delivery and formatting

4. **Monitor Regularly**
   - Check execution counts weekly
   - Review failed executions
   - Pause automations that aren't performing well

5. **Don't Over-Automate**
   - Some interactions need a personal touch
   - Balance automation with human interaction
   - Use automation for repetitive tasks, not relationships

### Funnels Best Practices:

1. **Choose the Right Template**
   - Match the template to your goal
   - Lead Magnet for list building
   - Direct Purchase for immediate sales
   - Consultation for relationship building

2. **Optimize Each Step**
   - Make landing pages compelling
   - Keep forms short and simple
   - Make thank you pages valuable

3. **Track Your Metrics**
   - Monitor conversion rates
   - A/B test different elements
   - Optimize based on data

4. **Drive Traffic**
   - Share funnel links on social media
   - Include in email campaigns
   - Add to your website

5. **Follow Up**
   - Don't just capture leads, nurture them
   - Use automations to follow up with funnel visitors
   - Create sequences for different funnel types

---

## Common Use Cases

### Automation Use Cases:

1. **New Lead Welcome**
   - Trigger: New contact created
   - Action: Send email
   - Result: Every new lead gets a welcome email automatically

2. **Deal Progress Notifications**
   - Trigger: Deal stage changed
   - Action: Send notification
   - Result: Team gets notified when deals move forward

3. **Customer Onboarding**
   - Trigger: Payment received
   - Actions: Add tag "Customer", Send email, Create task
   - Result: New customers are tagged, emailed, and assigned onboarding tasks

4. **Booking Reminders**
   - Trigger: Booking created
   - Action: Create task (for 24 hours before)
   - Result: You're reminded to prepare for appointments

### Funnel Use Cases:

1. **Content Marketing**
   - Use Lead Magnet funnel
   - Offer valuable content
   - Build your email list
   - Nurture with email sequences

2. **Service Business**
   - Use Consultation Booking funnel
   - Get prospects to book calls
   - Qualify leads before selling
   - Build relationships

3. **Product Launch**
   - Use Waitlist funnel
   - Build anticipation
   - Collect interested buyers
   - Launch with built-in demand

4. **E-commerce**
   - Use Direct Purchase funnel
   - Showcase products
   - Enable instant purchases
   - Maximize conversions

---

## Troubleshooting

### Automation Not Running?

1. **Check Status**: Make sure the automation is "Active" (not "Paused")
2. **Verify Trigger**: Ensure the trigger event is actually happening
3. **Check Permissions**: Verify you have access to perform the action
4. **Review Logs**: Check execution count to see if it's running

### Funnel Not Converting?

1. **Check Traffic**: Are people actually visiting your funnel?
2. **Review Steps**: Is each step clear and compelling?
3. **Test Form**: Make sure the form is working properly
4. **Optimize**: Try different headlines, images, or copy

### Need Help?

- Check the Help & Support section
- Review this guide for detailed explanations
- Contact support if you need additional assistance

---

## Future Enhancements

Coming soon:
- Email template builder for automations
- Advanced automation conditions (if/then logic)
- Funnel page editor with drag-and-drop
- A/B testing for funnels
- Advanced analytics and reporting
- Integration with more third-party tools

---

*Last Updated: January 2025*

