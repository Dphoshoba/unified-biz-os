import { PrismaClient } from '@prisma/client'

/**
 * PrismaClient singleton for database access.
 * 
 * In development, Next.js hot-reloading can cause multiple instances
 * of PrismaClient to be created, which exhausts database connections.
 * This pattern ensures only one instance exists across hot reloads.
 * 
 * @see https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Export type utilities for use across the app
export type { 
  Organization, 
  User, 
  Membership, 
  MembershipRole 
} from '@prisma/client'

