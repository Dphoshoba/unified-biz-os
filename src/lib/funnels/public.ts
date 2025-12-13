'use server'

import { db } from '@/lib/db'

export async function getPublicFunnel(slug: string) {
  const funnel = await db.funnel.findFirst({
    where: {
      slug,
      status: 'ACTIVE', // Only show active funnels
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
      steps: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  if (!funnel) {
    return null
  }

  // Increment visitor count
  await db.funnel.update({
    where: { id: funnel.id },
    data: { visitors: { increment: 1 } },
  })

  return funnel
}

