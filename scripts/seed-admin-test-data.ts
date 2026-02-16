import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function seedAdminTestData() {
  console.log('Seeding admin test data...\n')

  try {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create ADMIN user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@gigly.test' },
      update: {},
      create: {
        email: 'admin@gigly.test',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log('✓ Created ADMIN user: admin@gigly.test')

    // Create CLIENT users
    const client1 = await prisma.user.upsert({
      where: { email: 'client1@gigly.test' },
      update: {},
      create: {
        email: 'client1@gigly.test',
        password: hashedPassword,
        role: 'CLIENT',
        clientProfile: {
          create: {
            companyName: 'Tech Corp',
            inn: '1234567890',
            kpp: '123456789'
          }
        }
      }
    })
    console.log('✓ Created CLIENT user: client1@gigly.test')

    const client2 = await prisma.user.upsert({
      where: { email: 'client2@gigly.test' },
      update: {},
      create: {
        email: 'client2@gigly.test',
        password: hashedPassword,
        role: 'CLIENT',
        suspended: true,
        clientProfile: {
          create: {
            companyName: 'Suspended Company',
            inn: '9876543210',
            kpp: '987654321'
          }
        }
      }
    })
    console.log('✓ Created suspended CLIENT user: client2@gigly.test')

    // Create SPECIALIST users
    const specialist1 = await prisma.user.upsert({
      where: { email: 'specialist1@gigly.test' },
      update: {},
      create: {
        email: 'specialist1@gigly.test',
        password: hashedPassword,
        role: 'SPECIALIST',
        specialistProfile: {
          create: {
            displayName: 'John Developer',
            techStack: 'React, TypeScript, Node.js',
            experienceLevel: 'Senior',
            bio: 'Full-stack developer with 5+ years experience'
          }
        }
      }
    })
    console.log('✓ Created SPECIALIST user: specialist1@gigly.test')

    const specialist2 = await prisma.user.upsert({
      where: { email: 'specialist2@gigly.test' },
      update: {},
      create: {
        email: 'specialist2@gigly.test',
        password: hashedPassword,
        role: 'SPECIALIST',
        specialistProfile: {
          create: {
            displayName: 'Jane Designer',
            techStack: 'Figma, Adobe XD, CSS',
            experienceLevel: 'Middle',
            bio: 'UI/UX designer'
          }
        }
      }
    })
    console.log('✓ Created SPECIALIST user: specialist2@gigly.test')

    // Create gigs
    const gig1 = await prisma.gig.create({
      data: {
        title: 'Build React Dashboard',
        description: 'Need a modern dashboard with charts and analytics',
        budget: 15000000, // 150,000 roubles
        serviceFee: 3000000,
        totalAmount: 18000000,
        tags: 'React, TypeScript, Charts',
        clientId: client1.id
      }
    })
    console.log('✓ Created open gig: Build React Dashboard')

    const gig2 = await prisma.gig.create({
      data: {
        title: 'Design Landing Page',
        description: 'Modern landing page for SaaS product',
        budget: 8000000, // 80,000 roubles
        serviceFee: 1600000,
        totalAmount: 9600000,
        tags: 'Design, Figma',
        clientId: client1.id,
        closedByAdmin: true,
        closedAt: new Date()
      }
    })
    console.log('✓ Created closed gig: Design Landing Page')

    // Create moderation logs
    await prisma.moderationLog.create({
      data: {
        action: 'SUSPEND_USER',
        reason: 'Fraudulent activity detected',
        adminId: admin.id,
        targetUserId: client2.id
      }
    })
    console.log('✓ Created moderation log for suspended user')

    await prisma.moderationLog.create({
      data: {
        action: 'CLOSE_GIG',
        reason: 'Violates platform terms of service',
        adminId: admin.id,
        targetGigId: gig2.id
      }
    })
    console.log('✓ Created moderation log for closed gig')

    console.log('\n✅ Seed data created successfully!')
    console.log('\nTest credentials:')
    console.log('- Admin: admin@gigly.test / password123')
    console.log('- Client: client1@gigly.test / password123')
    console.log('- Suspended Client: client2@gigly.test / password123')
    console.log('- Specialist: specialist1@gigly.test / password123')
    console.log('- Specialist: specialist2@gigly.test / password123')
  } catch (error) {
    console.error('✗ Seed failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdminTestData()
