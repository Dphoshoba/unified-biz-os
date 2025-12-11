import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'

import { SessionProvider } from '@/components/providers/session-provider'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'UnifiedBizOS | All-in-One Business Platform',
  description:
    'CRM, Automations, Bookings, Payments, and Funnels - everything your business needs in one platform.',
  keywords: ['CRM', 'Business', 'SaaS', 'Automation', 'Bookings', 'Payments'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
