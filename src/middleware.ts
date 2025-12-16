import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't use a prefix for the default locale
  localePrefix: 'as-needed'
})

// Routes that should NOT be localized
const excludedRoutes = [
  '/api',
  '/_next',
  '/_vercel',
  '/dashboard',
  '/crm',
  '/projects',
  '/documents',
  '/analytics',
  '/inbox',
  '/drive',
  '/automations',
  '/bookings',
  '/payments',
  '/funnels',
  '/settings',
  '/support',
  '/team',
  '/ai-assistant',
  '/app-store',
  '/campaigns',
  '/canvas',
  '/smart-scan',
  '/social',
  '/strategy',
  '/auth',
  '/book',
  '/f',
  '/invite',
  '/onboarding',
]

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip localization for excluded routes
  if (excludedRoutes.some(route => pathname.startsWith(route))) {
    return
  }

  // Skip localization for files with extensions
  if (pathname.includes('.')) {
    return
  }

  // Apply intl middleware for all other routes
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for the ones we exclude in the middleware function
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}

