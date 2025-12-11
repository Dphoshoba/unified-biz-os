import { PrismaClient, MembershipRole, ContactStatus, DealStatus, ActivityType, BookingStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean up existing data
  console.log('Cleaning up existing seed data...')
  await prisma.booking.deleteMany({})
  await prisma.serviceProvider.deleteMany({})
  await prisma.service.deleteMany({})
  await prisma.availability.deleteMany({})
  await prisma.activity.deleteMany({})
  await prisma.tagsOnDeals.deleteMany({})
  await prisma.tagsOnCompanies.deleteMany({})
  await prisma.tagsOnContacts.deleteMany({})
  await prisma.deal.deleteMany({})
  await prisma.pipelineStage.deleteMany({})
  await prisma.pipeline.deleteMany({})
  await prisma.contact.deleteMany({})
  await prisma.company.deleteMany({})
  await prisma.tag.deleteMany({})
  await prisma.membership.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.organization.deleteMany({})
  await prisma.user.deleteMany({})

  const hashedPassword = await hash('demo1234', 12)

  // Create demo organization
  console.log('Creating demo organization...')
  const demoOrg = await prisma.organization.create({
    data: {
      name: 'Demo Organization',
      slug: 'demo',
    },
  })

  // Create demo users
  console.log('Creating users...')
  const demoUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'demo@unifiedbizos.com',
      password: hashedPassword,
      emailVerified: new Date(),
      activeOrganizationId: demoOrg.id,
    },
  })

  const sarah = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@demo.com',
      password: hashedPassword,
      emailVerified: new Date(),
      activeOrganizationId: demoOrg.id,
    },
  })

  const michael = await prisma.user.create({
    data: {
      name: 'Michael Chen',
      email: 'michael@demo.com',
      password: hashedPassword,
      emailVerified: new Date(),
      activeOrganizationId: demoOrg.id,
    },
  })

  // Create memberships
  console.log('Creating memberships...')
  await prisma.membership.createMany({
    data: [
      { userId: demoUser.id, organizationId: demoOrg.id, role: MembershipRole.OWNER },
      { userId: sarah.id, organizationId: demoOrg.id, role: MembershipRole.ADMIN },
      { userId: michael.id, organizationId: demoOrg.id, role: MembershipRole.MEMBER },
    ],
  })

  // Create tags
  console.log('Creating tags...')
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Hot Lead', color: '#EF4444', organizationId: demoOrg.id } }),
    prisma.tag.create({ data: { name: 'Enterprise', color: '#8B5CF6', organizationId: demoOrg.id } }),
    prisma.tag.create({ data: { name: 'SMB', color: '#3B82F6', organizationId: demoOrg.id } }),
    prisma.tag.create({ data: { name: 'Startup', color: '#10B981', organizationId: demoOrg.id } }),
    prisma.tag.create({ data: { name: 'Referral', color: '#EC4899', organizationId: demoOrg.id } }),
    prisma.tag.create({ data: { name: 'VIP', color: '#F97316', organizationId: demoOrg.id } }),
  ])

  const [hotLead, enterprise, smb, startup, referral, vip] = tags

  // Create companies
  console.log('Creating companies...')
  const acme = await prisma.company.create({
    data: {
      name: 'Acme Corp',
      website: 'acme.com',
      industry: 'Technology',
      size: '500-1000',
      organizationId: demoOrg.id,
      tags: { create: [{ tagId: enterprise.id }] },
    },
  })

  const techStart = await prisma.company.create({
    data: {
      name: 'TechStart Inc',
      website: 'techstart.io',
      industry: 'Software',
      size: '50-100',
      organizationId: demoOrg.id,
      tags: { create: [{ tagId: startup.id }] },
    },
  })

  const globalVentures = await prisma.company.create({
    data: {
      name: 'Global Ventures',
      website: 'globalventures.com',
      industry: 'Finance',
      size: '1000+',
      organizationId: demoOrg.id,
      tags: { create: [{ tagId: enterprise.id }, { tagId: vip.id }] },
    },
  })

  const innovateCo = await prisma.company.create({
    data: {
      name: 'Innovate Co',
      website: 'innovate.co',
      industry: 'Consulting',
      size: '100-500',
      organizationId: demoOrg.id,
      tags: { create: [{ tagId: smb.id }] },
    },
  })

  const creativeStudio = await prisma.company.create({
    data: {
      name: 'Creative Studio',
      website: 'creativestudio.design',
      industry: 'Design',
      size: '10-50',
      organizationId: demoOrg.id,
      tags: { create: [{ tagId: startup.id }, { tagId: referral.id }] },
    },
  })

  // Create contacts
  console.log('Creating contacts...')
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@acme.com',
        title: 'VP of Engineering',
        status: ContactStatus.CUSTOMER,
        companyId: acme.id,
        organizationId: demoOrg.id,
        tags: { create: [{ tagId: enterprise.id }, { tagId: hotLead.id }] },
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'mchen@techstart.io',
        title: 'CTO',
        status: ContactStatus.LEAD,
        companyId: techStart.id,
        organizationId: demoOrg.id,
        tags: { create: [{ tagId: startup.id }] },
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily@globalventures.com',
        title: 'Director of Operations',
        status: ContactStatus.ACTIVE,
        companyId: globalVentures.id,
        organizationId: demoOrg.id,
        tags: { create: [{ tagId: enterprise.id }] },
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'James',
        lastName: 'Wilson',
        email: 'jwilson@innovate.co',
        title: 'CEO',
        status: ContactStatus.LEAD,
        companyId: innovateCo.id,
        organizationId: demoOrg.id,
        tags: { create: [{ tagId: smb.id }, { tagId: referral.id }] },
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa@creativestudio.design',
        title: 'Creative Director',
        status: ContactStatus.CUSTOMER,
        companyId: creativeStudio.id,
        organizationId: demoOrg.id,
        tags: { create: [{ tagId: startup.id }] },
      },
    }),
  ])

  const [sarahContact, michaelContact, emilyContact, jamesContact, lisaContact] = contacts

  // Create pipeline with stages
  console.log('Creating pipeline...')
  const pipeline = await prisma.pipeline.create({
    data: {
      name: 'Sales Pipeline',
      description: 'Default sales pipeline',
      isDefault: true,
      organizationId: demoOrg.id,
    },
  })

  const stages = await Promise.all([
    prisma.pipelineStage.create({
      data: { name: 'Discovery', color: '#6B7280', probability: 10, order: 0, pipelineId: pipeline.id },
    }),
    prisma.pipelineStage.create({
      data: { name: 'Qualified', color: '#3B82F6', probability: 25, order: 1, pipelineId: pipeline.id },
    }),
    prisma.pipelineStage.create({
      data: { name: 'Proposal', color: '#F59E0B', probability: 50, order: 2, pipelineId: pipeline.id },
    }),
    prisma.pipelineStage.create({
      data: { name: 'Negotiation', color: '#8B5CF6', probability: 75, order: 3, pipelineId: pipeline.id },
    }),
    prisma.pipelineStage.create({
      data: { name: 'Won', color: '#10B981', probability: 100, order: 4, pipelineId: pipeline.id },
    }),
  ])

  const [discovery, qualified, proposal, negotiation, won] = stages

  // Create deals
  console.log('Creating deals...')
  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        name: 'Enterprise Plan - Acme Corp',
        value: 45000,
        status: DealStatus.OPEN,
        expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        organizationId: demoOrg.id,
        pipelineId: pipeline.id,
        stageId: proposal.id,
        contactId: sarahContact.id,
        companyId: acme.id,
        assignedToId: sarah.id,
        tags: { create: [{ tagId: enterprise.id }] },
      },
    }),
    prisma.deal.create({
      data: {
        name: 'Annual Subscription - TechStart',
        value: 12500,
        status: DealStatus.OPEN,
        expectedCloseDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        organizationId: demoOrg.id,
        pipelineId: pipeline.id,
        stageId: negotiation.id,
        contactId: michaelContact.id,
        companyId: techStart.id,
        assignedToId: michael.id,
      },
    }),
    prisma.deal.create({
      data: {
        name: 'Consulting Package - Global Ventures',
        value: 78000,
        status: DealStatus.OPEN,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        organizationId: demoOrg.id,
        pipelineId: pipeline.id,
        stageId: qualified.id,
        contactId: emilyContact.id,
        companyId: globalVentures.id,
        assignedToId: demoUser.id,
        tags: { create: [{ tagId: enterprise.id }, { tagId: vip.id }] },
      },
    }),
    prisma.deal.create({
      data: {
        name: 'Growth Plan - Innovate Co',
        value: 24000,
        status: DealStatus.OPEN,
        expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        organizationId: demoOrg.id,
        pipelineId: pipeline.id,
        stageId: discovery.id,
        contactId: jamesContact.id,
        companyId: innovateCo.id,
        assignedToId: sarah.id,
      },
    }),
    prisma.deal.create({
      data: {
        name: 'Pro Plan - Creative Studio',
        value: 8400,
        status: DealStatus.WON,
        expectedCloseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        actualCloseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        organizationId: demoOrg.id,
        pipelineId: pipeline.id,
        stageId: won.id,
        contactId: lisaContact.id,
        companyId: creativeStudio.id,
        assignedToId: michael.id,
      },
    }),
  ])

  // Create activities
  console.log('Creating activities...')
  await Promise.all([
    prisma.activity.create({
      data: {
        type: ActivityType.NOTE,
        title: 'Initial contact',
        description: 'Had a great introductory call. Very interested in our enterprise features.',
        organizationId: demoOrg.id,
        contactId: sarahContact.id,
        companyId: acme.id,
        dealId: deals[0].id,
        createdById: sarah.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: ActivityType.MEETING,
        title: 'Demo presentation',
        description: 'Presented full product demo to the team.',
        durationMinutes: 60,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        organizationId: demoOrg.id,
        contactId: sarahContact.id,
        companyId: acme.id,
        dealId: deals[0].id,
        createdById: sarah.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: ActivityType.CALL,
        title: 'Follow-up call',
        description: 'Discussed pricing options and timeline.',
        durationMinutes: 30,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        organizationId: demoOrg.id,
        contactId: michaelContact.id,
        companyId: techStart.id,
        dealId: deals[1].id,
        createdById: michael.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: ActivityType.EMAIL,
        title: 'Sent proposal',
        description: 'Sent detailed proposal with custom pricing.',
        organizationId: demoOrg.id,
        contactId: emilyContact.id,
        companyId: globalVentures.id,
        dealId: deals[2].id,
        createdById: demoUser.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: ActivityType.TASK,
        title: 'Schedule discovery call',
        description: 'Need to schedule initial discovery call.',
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        organizationId: demoOrg.id,
        contactId: jamesContact.id,
        companyId: innovateCo.id,
        dealId: deals[3].id,
        createdById: sarah.id,
      },
    }),
  ])

  // =============================================================================
  // BOOKINGS & APPOINTMENTS
  // =============================================================================

  // Create availability for team members
  console.log('Creating availability...')
  const availabilityDays = [1, 2, 3, 4, 5] // Mon-Fri
  for (const userId of [demoUser.id, sarah.id, michael.id]) {
    await prisma.availability.createMany({
      data: availabilityDays.map((day) => ({
        userId,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      })),
    })
  }

  // Create services
  console.log('Creating services...')
  const discoveryCall = await prisma.service.create({
    data: {
      name: 'Discovery Call',
      description: 'A free 30-minute call to understand your needs and explore how we can help.',
      durationMinutes: 30,
      price: 0,
      color: '#8B5CF6',
      isActive: true,
      organizationId: demoOrg.id,
      providers: {
        create: [
          { userId: demoUser.id },
          { userId: sarah.id },
          { userId: michael.id },
        ],
      },
    },
  })

  const strategyConsultation = await prisma.service.create({
    data: {
      name: 'Strategy Consultation',
      description: 'A 60-minute deep dive into your business strategy with actionable recommendations.',
      durationMinutes: 60,
      price: 150,
      color: '#3B82F6',
      isActive: true,
      requiresPayment: true,
      bufferAfter: 15,
      organizationId: demoOrg.id,
      providers: {
        create: [
          { userId: demoUser.id },
          { userId: sarah.id },
        ],
      },
    },
  })

  const coachingSession = await prisma.service.create({
    data: {
      name: 'Coaching Session',
      description: 'One-on-one coaching for personal or professional growth.',
      durationMinutes: 45,
      price: 100,
      color: '#10B981',
      isActive: true,
      bufferBefore: 5,
      bufferAfter: 10,
      organizationId: demoOrg.id,
      providers: {
        create: [
          { userId: sarah.id },
        ],
      },
    },
  })

  const teamWorkshop = await prisma.service.create({
    data: {
      name: 'Team Workshop',
      description: 'Interactive workshop for teams (up to 10 people) with hands-on exercises.',
      durationMinutes: 120,
      price: 500,
      color: '#F59E0B',
      isActive: true,
      requiresPayment: true,
      maxAdvanceDays: 90,
      organizationId: demoOrg.id,
      providers: {
        create: [
          { userId: demoUser.id },
        ],
      },
    },
  })

  const vipDay = await prisma.service.create({
    data: {
      name: 'VIP Day',
      description: 'Full day intensive session with comprehensive strategy and implementation support.',
      durationMinutes: 480,
      price: 2000,
      color: '#EC4899',
      isActive: false, // Draft
      requiresPayment: true,
      maxAdvanceDays: 30,
      minNoticeMins: 2880, // 48 hours
      organizationId: demoOrg.id,
      providers: {
        create: [
          { userId: demoUser.id },
        ],
      },
    },
  })

  // Create bookings
  console.log('Creating bookings...')
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  // Helper to set time on a date
  const setTime = (date: Date, hours: number, minutes: number) => {
    const d = new Date(date)
    d.setHours(hours, minutes, 0, 0)
    return d
  }

  await Promise.all([
    // Upcoming bookings
    prisma.booking.create({
      data: {
        organizationId: demoOrg.id,
        serviceId: strategyConsultation.id,
        providerId: sarah.id,
        contactId: sarahContact.id,
        status: BookingStatus.CONFIRMED,
        startTime: setTime(tomorrow, 14, 0),
        endTime: setTime(tomorrow, 15, 0),
        guestName: 'Sarah Johnson',
        guestEmail: 'sarah.johnson@acme.com',
        notes: 'Looking forward to discussing our Q1 strategy.',
      },
    }),
    prisma.booking.create({
      data: {
        organizationId: demoOrg.id,
        serviceId: discoveryCall.id,
        providerId: michael.id,
        contactId: michaelContact.id,
        status: BookingStatus.CONFIRMED,
        startTime: setTime(tomorrow, 16, 30),
        endTime: setTime(tomorrow, 17, 0),
        guestName: 'Michael Chen',
        guestEmail: 'mchen@techstart.io',
        notes: 'Interested in enterprise features.',
      },
    }),
    prisma.booking.create({
      data: {
        organizationId: demoOrg.id,
        serviceId: coachingSession.id,
        providerId: sarah.id,
        contactId: emilyContact.id,
        status: BookingStatus.PENDING,
        startTime: setTime(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), 10, 0),
        endTime: setTime(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), 10, 45),
        guestName: 'Emily Davis',
        guestEmail: 'emily@globalventures.com',
      },
    }),
    prisma.booking.create({
      data: {
        organizationId: demoOrg.id,
        serviceId: teamWorkshop.id,
        providerId: demoUser.id,
        contactId: jamesContact.id,
        status: BookingStatus.CONFIRMED,
        startTime: setTime(nextWeek, 9, 0),
        endTime: setTime(nextWeek, 11, 0),
        guestName: 'James Wilson',
        guestEmail: 'jwilson@innovate.co',
        guestPhone: '+1 (555) 123-4567',
        notes: 'Team of 8 people attending.',
        location: 'Virtual - Zoom',
      },
    }),
    // Past bookings
    prisma.booking.create({
      data: {
        organizationId: demoOrg.id,
        serviceId: strategyConsultation.id,
        providerId: demoUser.id,
        contactId: lisaContact.id,
        status: BookingStatus.COMPLETED,
        startTime: setTime(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), 15, 0),
        endTime: setTime(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), 16, 0),
        guestName: 'Lisa Anderson',
        guestEmail: 'lisa@creativestudio.design',
        internalNotes: 'Great session, interested in coaching follow-up.',
      },
    }),
    prisma.booking.create({
      data: {
        organizationId: demoOrg.id,
        serviceId: discoveryCall.id,
        providerId: sarah.id,
        status: BookingStatus.NO_SHOW,
        startTime: setTime(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), 11, 0),
        endTime: setTime(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), 11, 30),
        guestName: 'Tom Brown',
        guestEmail: 'tom@newco.io',
      },
    }),
  ])

  console.log('')
  console.log('🎉 Database seed completed successfully!')
  console.log('')
  console.log('Demo credentials:')
  console.log('  Email: demo@unifiedbizos.com')
  console.log('  Password: demo1234')
  console.log('')
  console.log('Created:')
  console.log('  - 1 Organization')
  console.log('  - 3 Users')
  console.log('  - 5 Companies')
  console.log('  - 5 Contacts')
  console.log('  - 6 Tags')
  console.log('  - 1 Pipeline with 5 stages')
  console.log('  - 5 Deals')
  console.log('  - 5 Activities')
  console.log('  - 5 Services')
  console.log('  - 6 Bookings')
  console.log('')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
