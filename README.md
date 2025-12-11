# UnifiedBizOS

A multi-tenant SaaS platform for business management, featuring CRM, automations, bookings, payments, and funnels.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui patterns
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand

## Features

- 📊 **CRM** - Contacts, companies, deals, and pipeline management
- ⚡ **Automations** - Trigger-based workflow automation
- 📅 **Bookings** - Online appointments and scheduling
- 💳 **Payments** - Stripe and PayPal integration
- 🎯 **Funnels** - Landing pages and conversion funnels
- 🤖 **AI Assistant** - Integrated AI helper (coming soon)
- 👥 **Multi-Tenant** - Isolated organizations with team management
- 🔐 **Role-Based Access** - Owner, Admin, and Member roles
- ✉️ **Team Invitations** - Invite team members via email links

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/unified-biz-os.git
   cd unified-biz-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your database credentials and API keys.

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Authenticated app routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── crm/           # CRM module
│   │   ├── automations/   # Automations module
│   │   ├── bookings/      # Bookings module
│   │   ├── payments/      # Payments module
│   │   ├── funnels/       # Funnels module
│   │   ├── settings/      # Settings pages
│   │   └── support/       # Help & support
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components
├── lib/                   # Utility functions
└── styles/                # Global styles
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production URL
4. Deploy!

### Database Providers (Recommended)

- [Neon](https://neon.tech) - Free tier, serverless PostgreSQL
- [Supabase](https://supabase.com) - Free tier, PostgreSQL + extras
- [Railway](https://railway.app) - Easy setup, great DX

## Multi-Tenancy

UnifiedBizOS supports multiple organizations with complete data isolation:

- Each user can create/join multiple organizations
- Data is automatically scoped to the active organization
- Team members can be invited with role-based permissions (Owner, Admin, Member)

## License

MIT

