'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAuthWithOrg, getSession } from '@/lib/auth-helpers'

// =============================================================================
// TYPES
// =============================================================================

export type ServiceWithProviders = Awaited<ReturnType<typeof getServices>>[number]

export type CreateServiceInput = {
  name: string
  description?: string
  durationMinutes?: number
  price?: number
  currency?: string
  color?: string
  isActive?: boolean
  requiresPayment?: boolean
  bufferBefore?: number
  bufferAfter?: number
  maxAdvanceDays?: number
  minNoticeMins?: number
  providerIds?: string[]
}

export type UpdateServiceInput = Partial<CreateServiceInput>

// =============================================================================
// QUERIES
// =============================================================================

export async function getServices(options?: {
  isActive?: boolean
  limit?: number
}) {
  const session = await requireAuthWithOrg()
  const { isActive, limit = 50 } = options || {}

  const services = await db.service.findMany({
    where: {
      organizationId: session.activeOrganizationId,
      ...(isActive !== undefined && { isActive }),
    },
    include: {
      providers: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        where: { isActive: true },
      },
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return services.map((service) => ({
    ...service,
    price: service.price.toNumber(),
    providers: service.providers.map((p) => p.user),
  }))
}

export async function getService(id: string) {
  const session = await requireAuthWithOrg()

  const service = await db.service.findFirst({
    where: {
      id,
      organizationId: session.activeOrganizationId,
    },
    include: {
      providers: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      },
      _count: {
        select: { bookings: true },
      },
    },
  })

  if (!service) return null

  return {
    ...service,
    price: service.price.toNumber(),
    providers: service.providers.map((p) => ({
      ...p.user,
      isActive: p.isActive,
    })),
  }
}

export async function getServicesCount() {
  const session = await requireAuthWithOrg()

  return db.service.count({
    where: {
      organizationId: session.activeOrganizationId,
      isActive: true,
    },
  })
}

// Public: Get services for booking page (no auth required)
export async function getPublicServices(orgSlug: string) {
  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
  })

  if (!org) return null

  const services = await db.service.findMany({
    where: {
      organizationId: org.id,
      isActive: true,
    },
    include: {
      providers: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        where: { isActive: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return {
    organization: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      logo: org.logo,
      timezone: org.timezone,
    },
    services: services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      durationMinutes: service.durationMinutes,
      price: service.price.toNumber(),
      currency: service.currency,
      color: service.color,
      providers: service.providers.map((p) => p.user),
    })),
  }
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function createService(input: CreateServiceInput) {
  const session = await requireAuthWithOrg()
  const { providerIds, price, ...data } = input

  const service = await db.service.create({
    data: {
      ...data,
      price: price || 0,
      organizationId: session.activeOrganizationId,
      ...(providerIds?.length && {
        providers: {
          create: providerIds.map((userId) => ({ userId })),
        },
      }),
    },
    include: {
      providers: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
    },
  })

  revalidatePath('/bookings/services')
  return {
    ...service,
    price: service.price.toNumber(),
    providers: service.providers.map((p) => p.user),
  }
}

export async function updateService(id: string, input: UpdateServiceInput) {
  const session = await requireAuthWithOrg()
  const { providerIds, price, ...data } = input

  const existing = await db.service.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
  })

  if (!existing) {
    throw new Error('Service not found')
  }

  const service = await db.service.update({
    where: { id },
    data: {
      ...data,
      ...(price !== undefined && { price }),
      ...(providerIds && {
        providers: {
          deleteMany: {},
          create: providerIds.map((userId) => ({ userId })),
        },
      }),
    },
    include: {
      providers: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
    },
  })

  revalidatePath('/bookings/services')
  revalidatePath(`/bookings/services/${id}`)
  return {
    ...service,
    price: service.price.toNumber(),
    providers: service.providers.map((p) => p.user),
  }
}

export async function deleteService(id: string) {
  const session = await requireAuthWithOrg()

  const existing = await db.service.findFirst({
    where: { id, organizationId: session.activeOrganizationId },
    include: { _count: { select: { bookings: true } } },
  })

  if (!existing) {
    throw new Error('Service not found')
  }

  if (existing._count.bookings > 0) {
    // Soft delete by deactivating
    await db.service.update({
      where: { id },
      data: { isActive: false },
    })
  } else {
    await db.service.delete({ where: { id } })
  }

  revalidatePath('/bookings/services')
  return { success: true }
}


