# How Funnels Work - Complete Guide

## Overview

Funnels are **public landing pages** that each organization can create, customize, and share. Think of them as mini-websites that guide visitors through a journey to convert them into leads or customers.

---

## The Complete Flow

### 1. **Creating a Funnel** (Inside Your App)

When you create a funnel:

1. **Go to:** Funnels page → Click "Create Funnel"
2. **Choose a Template:** 
   - Lead Magnet (capture emails)
   - Consultation Booking (book calls)
   - Direct Purchase (sell products)
   - etc.
3. **Name Your Funnel:** e.g., "Free Strategy Guide"
4. **System Automatically:**
   - Creates a unique **slug** (URL-friendly name)
   - Example: "Free Strategy Guide" → `free-strategy-guide`
   - Creates all the steps (Landing Page, Form, Thank You)
   - Sets status to "DRAFT"

### 2. **Your Funnel Gets a Public URL**

Each funnel gets its own unique public URL:

```
https://your-domain.com/f/[funnel-slug]
```

**Example:**
- Funnel name: "Free Strategy Guide"
- Slug: `free-strategy-guide`
- Public URL: `https://unified-biz-os.vercel.app/f/free-strategy-guide`

**Key Points:**
- ✅ **Public** - No login required to view
- ✅ **Unique** - Each organization has their own funnels
- ✅ **Shareable** - Anyone with the link can access it
- ✅ **Branded** - Shows your organization's name and logo

### 3. **How Organizations Are Separated**

**Important:** Each organization is completely separate:

- **Organization A** creates "Free Guide" → `/f/free-guide`
- **Organization B** creates "Free Guide" → `/f/free-guide-2` (auto-numbered if duplicate)
- They're **completely independent** - Organization A can't see Organization B's funnels

**How it works:**
- Each funnel is linked to an `organizationId`
- When someone visits `/f/free-guide`, the system:
  1. Finds the funnel by slug
  2. Checks which organization owns it
  3. Shows that organization's branding
  4. Tracks analytics for that organization

### 4. **Sharing Your Funnel**

Once your funnel is **ACTIVE**, you can share it:

**Option 1: Copy Link Button**
- Go to Funnels page
- Click the "..." menu on your funnel
- Click "Copy Link"
- Share the URL anywhere

**Option 2: View Button**
- Click "View" button
- Opens in new tab
- Copy URL from browser

**Option 3: Direct URL**
- Your funnel URL is: `https://your-domain.com/f/[slug]`
- Share this directly

### 5. **What Visitors See**

When someone visits your funnel URL:

1. **Landing Page** (Step 1)
   - Your organization's logo/name
   - Headline and description
   - Call-to-action button
   - Progress indicator (if multiple steps)

2. **Form Page** (Step 2 - if applicable)
   - Email capture form
   - Name field
   - Submit button

3. **Thank You Page** (Step 3)
   - Confirmation message
   - Next steps
   - Optional CTA button

**All without requiring login!**

### 6. **Analytics Tracking**

The system automatically tracks:

- **Visitors:** Every time someone visits your funnel URL
- **Conversions:** When someone completes the form/submits
- **Revenue:** For purchase funnels (in cents)

**How it works:**
- Visitor count increments when page loads
- Conversion count increments when form is submitted
- All tracked per organization (you only see your own data)

---

## Real-World Example

Let's say you're **"Sierra Leone Welfare Foundation"**:

### Step 1: Create Funnel
- Template: **Lead Magnet**
- Name: **"Free Community Guide"**
- System creates slug: `free-community-guide`

### Step 2: Your Public URL
```
https://unified-biz-os.vercel.app/f/free-community-guide
```

### Step 3: Share It
- Post on Facebook: "Download our free guide: [link]"
- Add to website: "Get your free guide [here]"
- Email campaign: "Click here to download"

### Step 4: Visitor Journey
1. Someone clicks your link
2. Sees your organization's branding
3. Reads about the free guide
4. Enters their email
5. Gets thank you page
6. **You get a new lead in your CRM!**

### Step 5: Track Results
- Go to Funnels page
- See: 150 visitors, 45 conversions (30% conversion rate)
- All leads automatically added to your CRM

---

## Key Features

### ✅ **Multi-Tenant (Organization Isolation)**
- Each organization has completely separate funnels
- Organization A can't see Organization B's funnels
- Each organization has their own analytics

### ✅ **Public Access**
- No login required for visitors
- Shareable links
- Works on any device

### ✅ **Automatic Setup**
- Templates create all steps automatically
- No coding required
- Ready to share immediately

### ✅ **Analytics Built-In**
- Visitor tracking
- Conversion tracking
- Revenue tracking
- All per-organization

### ✅ **Customizable**
- Organization branding (logo, name)
- Custom colors
- Custom headlines/content (coming soon)

---

## How It's Different from Regular Websites

| Feature | Regular Website | UnifiedBizOS Funnels |
|---------|----------------|---------------------|
| **Setup** | Requires web developer | Click "Create Funnel" |
| **Hosting** | Need separate hosting | Included |
| **Analytics** | Need Google Analytics | Built-in |
| **CRM Integration** | Manual import | Automatic |
| **Multi-tenant** | Separate sites | One platform, many orgs |
| **Cost** | $10-50/month per site | Included in platform |

---

## Technical Details

### URL Structure
```
/f/[slug]
```
- `/f/` = Funnel route prefix
- `[slug]` = Unique identifier for your funnel
- Example: `/f/free-guide`

### Database Structure
- Each funnel has `organizationId` (links to organization)
- Each funnel has `slug` (unique per organization)
- Each funnel has `status` (DRAFT, ACTIVE, PAUSED)

### Public Access
- Funnel pages are **public routes** (outside `/app` folder)
- No authentication required
- Anyone with the URL can access

### Security
- Only **ACTIVE** funnels are accessible
- DRAFT/PAUSED funnels return 404
- Each organization's data is isolated

---

## Common Use Cases

### 1. **Lead Generation**
- Create "Free Resource" funnel
- Share on social media
- Capture emails automatically
- Leads go to CRM

### 2. **Event Registration**
- Create "Webinar Registration" funnel
- Share with your audience
- Collect attendee information
- Send confirmation emails

### 3. **Product Sales**
- Create "Direct Purchase" funnel
- Share product link
- Accept payments
- Track revenue

### 4. **Consultation Booking**
- Create "Book a Call" funnel
- Link to booking calendar
- Qualify leads
- Schedule appointments

---

## Summary

**In Simple Terms:**

1. **You create a funnel** → Gets a unique URL
2. **You share the URL** → Anyone can visit
3. **Visitors see your branding** → Your organization's name/logo
4. **They complete the funnel** → You get leads/customers
5. **You track results** → See visitors, conversions, revenue

**Each organization is completely separate:**
- Your funnels are yours alone
- Your analytics are private
- Your branding is displayed
- Your leads go to your CRM

It's like having your own mini-website builder, but all managed in one platform where each organization has their own space!

---

*Last Updated: January 2025*

