# 🚀 UnifiedBizOS Deployment Guide

This guide walks you through deploying UnifiedBizOS to production.

## Prerequisites

- Node.js 18+ installed
- A PostgreSQL database (we recommend [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
- A [Vercel](https://vercel.com) account (recommended) or other hosting platform

---

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Set Up Database

1. **Create a PostgreSQL database** on your preferred provider:
   
   **Neon (Free tier available):**
   - Go to [neon.tech](https://neon.tech) and sign up
   - Create a new project
   - Copy the connection string

   **Supabase:**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Create a new project
   - Go to Settings → Database → Connection string

   **Railway:**
   - Go to [railway.app](https://railway.app) and sign up
   - Create a new PostgreSQL database
   - Copy the connection string

### Step 2: Deploy to Vercel

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/unifiedbizos.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables:**
   
   In Vercel's project settings, add these environment variables:

   | Variable | Value | Required |
   |----------|-------|----------|
   | `DATABASE_URL` | Your PostgreSQL connection string | ✅ Yes |
   | `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | ✅ Yes |
   | `NEXTAUTH_URL` | `https://your-domain.vercel.app` | ✅ Yes |
   | `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ Optional |
   | `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌ Optional |

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Step 3: Initialize Database

After deployment, run the database migrations:

```bash
# Connect to your project
npx vercel env pull .env.local

# Push schema to database
npx prisma db push

# (Optional) Seed with demo data
npx prisma db seed
```

---

## Option 2: Deploy to Other Platforms

### Railway

1. Create a new project on [railway.app](https://railway.app)
2. Add a PostgreSQL database
3. Connect your GitHub repository
4. Add environment variables in the Railway dashboard
5. Railway will auto-deploy on push

### Docker (Self-Hosted)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
CMD ["node", "server.js"]
```

Update `next.config.js` for standalone output:

```javascript
module.exports = {
  output: 'standalone',
}
```

Build and run:

```bash
docker build -t unifiedbizos .
docker run -p 3000:3000 --env-file .env unifiedbizos
```

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Session encryption key | `your-32-char-secret` |
| `NEXTAUTH_URL` | Your app's base URL | `https://app.example.com` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | For Google OAuth sign-in |
| `GOOGLE_CLIENT_SECRET` | For Google OAuth sign-in |
| `SMTP_HOST` | Email server hostname |
| `SMTP_PORT` | Email server port |
| `SMTP_USER` | Email server username |
| `SMTP_PASSWORD` | Email server password |

---

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate active
- [ ] Test user sign-up flow
- [ ] Test organization creation
- [ ] Test CRM features

---

## Troubleshooting

### Database Connection Issues

```
Error: Can't reach database server
```

**Solution:** Check that:
1. Your `DATABASE_URL` is correct
2. Your database allows connections from Vercel's IP addresses
3. SSL is enabled if required (`?sslmode=require`)

### Build Failures

```
Error: Prisma Client not generated
```

**Solution:** Ensure your build command includes Prisma generation:
```bash
npx prisma generate && npm run build
```

### Authentication Issues

```
Error: [next-auth] NEXTAUTH_URL is not set
```

**Solution:** Set `NEXTAUTH_URL` to your production URL (without trailing slash).

---

## Custom Domain Setup

### Vercel

1. Go to your project's Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

### SSL Certificate

Vercel automatically provisions SSL certificates for custom domains.

---

## Scaling & Performance

### Database Connection Pooling

For high-traffic apps, use connection pooling:

**Neon:**
```
DATABASE_URL="postgresql://...@pooler.neon.tech/..."
```

**Supabase:**
Use the "Pool mode" connection string.

### Caching

The app uses Next.js's built-in caching. For additional caching:
- Configure Redis for session storage
- Use CDN for static assets

---

## Security Best Practices

1. **Use strong secrets** - Generate with `openssl rand -base64 32`
2. **Enable 2FA** on your hosting platform
3. **Regular backups** - Set up automated database backups
4. **Monitor logs** - Check for unusual activity
5. **Keep dependencies updated** - Run `npm audit` regularly

---

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Join our [Discord Community](https://discord.gg/your-server)
- Email: support@your-domain.com

