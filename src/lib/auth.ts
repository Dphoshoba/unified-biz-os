import { type NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { compare } from 'bcryptjs'
import { db } from './db'

/**
 * NextAuth configuration
 * 
 * Uses Prisma adapter for database persistence and supports:
 * - Credentials (email/password)
 * - Google OAuth (when env vars are set)
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as NextAuthOptions['adapter'],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    error: '/auth/error',
    newUser: '/onboarding',
  },

  providers: [
    // Credentials provider for email/password authentication
    CredentialsProvider({
      id: 'credentials',
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: {
            memberships: {
              include: {
                organization: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        })

        if (!user || !user.password) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),

    // Google OAuth (optional - only enabled if env vars are set)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') {
        return true
      }
      return true
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        
        // Fetch user's memberships and set active org
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          include: {
            memberships: {
              include: {
                organization: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        })

        if (dbUser) {
          // Set active org from user preference or first membership
          token.activeOrganizationId = 
            dbUser.activeOrganizationId ?? 
            dbUser.memberships[0]?.organizationId ?? 
            null
        }
      }

      // Handle session updates (e.g., switching organizations)
      if (trigger === 'update' && session?.activeOrganizationId) {
        token.activeOrganizationId = session.activeOrganizationId
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.activeOrganizationId = token.activeOrganizationId as string | null
      }
      return session
    },
  },

  events: {
    async createUser({ user }) {
      // When a new user signs up via OAuth, they won't have an org yet
      // The onboarding flow will handle creating their first org
      console.log(`New user created: ${user.email}`)
    },
  },

  debug: process.env.NODE_ENV === 'development',
}

// =============================================================================
// TYPE AUGMENTATION
// =============================================================================

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    activeOrganizationId: string | null
  }

  interface User {
    id: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    activeOrganizationId: string | null
  }
}


