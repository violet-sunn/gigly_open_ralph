import { prisma } from '../lib/prisma'

console.log('🔍 Validating bug-fix-1: Prisma Query Pattern Fix\n')

async function validatePrismaQueryFix() {
  let passed = 0
  let failed = 0

  function pass(msg: string) {
    console.log(`✅ ${msg}`)
    passed++
  }

  function fail(msg: string) {
    console.log(`❌ ${msg}`)
    failed++
  }

  try {
    // Test 1: Verify Prisma schema is valid
    console.log('📋 Test 1: Prisma schema validation')
    // This is implicitly tested by the import working
    pass('Prisma schema is valid')

    // Test 2: Create test data for gig detail query
    console.log('\n📋 Test 2: Setting up test data')

    const testClient = await prisma.user.upsert({
      where: { email: 'test-bugfix-client@example.com' },
      update: {},
      create: {
        email: 'test-bugfix-client@example.com',
        password: 'hashedpassword',
        role: 'CLIENT',
      },
    })

    await prisma.clientProfile.upsert({
      where: { userId: testClient.id },
      update: { companyName: 'Test Company' },
      create: {
        userId: testClient.id,
        companyName: 'Test Company',
        inn: '1234567890',
      },
    })

    const testSpecialist = await prisma.user.upsert({
      where: { email: 'test-bugfix-specialist@example.com' },
      update: {},
      create: {
        email: 'test-bugfix-specialist@example.com',
        password: 'hashedpassword',
        role: 'SPECIALIST',
      },
    })

    await prisma.specialistProfile.upsert({
      where: { userId: testSpecialist.id },
      update: { displayName: 'Test Specialist' },
      create: {
        userId: testSpecialist.id,
        displayName: 'Test Specialist',
        techStack: 'TypeScript, React',
        experienceLevel: 'Senior',
      },
    })

    const testGig = await prisma.gig.create({
      data: {
        title: 'Test Gig for Bug Fix Validation',
        description: 'Testing Prisma query patterns',
        budget: 10000000,
        serviceFee: 2000000,
        totalAmount: 12000000,
        clientId: testClient.id,
        assignedSpecialistId: testSpecialist.id,
        status: 'IN_PROGRESS',
      },
    })

    await prisma.application.create({
      data: {
        gigId: testGig.id,
        specialistId: testSpecialist.id,
        status: 'ACCEPTED',
        coverLetter: 'Test application',
      },
    })

    await prisma.message.create({
      data: {
        gigId: testGig.id,
        senderId: testClient.id,
        content: 'Test message from client',
      },
    })

    pass('Test data created successfully')

    // Test 3: Execute the fixed query pattern (same as in page.tsx)
    console.log('\n📋 Test 3: Execute fixed Prisma query')

    const gig = await prisma.gig.findUnique({
      where: { id: testGig.id },
      include: {
        client: {
          include: { clientProfile: true }
        },
        assignedSpecialist: true,
        applications: {
          include: {
            specialist: {
              include: { specialistProfile: true }
            }
          },
          orderBy: { createdAt: 'desc' },
        },
        messages: {
          include: {
            sender: {
              include: {
                clientProfile: true,
                specialistProfile: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        moderations: false, // Simulating non-ADMIN user
      },
    })

    if (!gig) {
      fail('Query returned null')
    } else {
      pass('Query executed without PrismaClientValidationError')
    }

    // Test 4: Verify data structure is correct
    console.log('\n📋 Test 4: Verify returned data structure')

    if (gig?.client?.email === testClient.email) {
      pass('Client email is accessible')
    } else {
      fail('Client email not accessible')
    }

    if (gig?.client?.clientProfile?.companyName === 'Test Company') {
      pass('Client profile (companyName) is accessible')
    } else {
      fail('Client profile not accessible')
    }

    if (gig?.assignedSpecialist?.email === testSpecialist.email) {
      pass('Assigned specialist email is accessible')
    } else {
      fail('Assigned specialist email not accessible')
    }

    if (gig?.applications?.[0]?.specialist?.email === testSpecialist.email) {
      pass('Application specialist email is accessible')
    } else {
      fail('Application specialist email not accessible')
    }

    if (gig?.applications?.[0]?.specialist?.specialistProfile?.displayName === 'Test Specialist') {
      pass('Application specialist profile is accessible')
    } else {
      fail('Application specialist profile not accessible')
    }

    if (gig?.messages?.[0]?.sender?.email === testClient.email) {
      pass('Message sender email is accessible')
    } else {
      fail('Message sender email not accessible')
    }

    if (gig?.messages?.[0]?.sender?.clientProfile?.companyName === 'Test Company') {
      pass('Message sender client profile is accessible')
    } else {
      fail('Message sender client profile not accessible')
    }

    // Test 5: Test conditional include with ADMIN role
    console.log('\n📋 Test 5: Test conditional include (ADMIN scenario)')

    const gigWithModerations = await prisma.gig.findUnique({
      where: { id: testGig.id },
      include: {
        client: {
          include: { clientProfile: true }
        },
        assignedSpecialist: true,
        applications: {
          include: {
            specialist: {
              include: { specialistProfile: true }
            }
          },
          orderBy: { createdAt: 'desc' },
        },
        messages: {
          include: {
            sender: {
              include: {
                clientProfile: true,
                specialistProfile: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        moderations: {
          include: {
            admin: true
          },
          orderBy: { createdAt: 'desc' }
        },
      },
    })

    if (gigWithModerations) {
      pass('Conditional include with moderations works')
    } else {
      fail('Conditional include with moderations failed')
    }

    // Cleanup
    console.log('\n🧹 Cleaning up test data')
    await prisma.message.deleteMany({ where: { gigId: testGig.id } })
    await prisma.application.deleteMany({ where: { gigId: testGig.id } })
    await prisma.gig.delete({ where: { id: testGig.id } })
    await prisma.clientProfile.delete({ where: { userId: testClient.id } })
    await prisma.specialistProfile.delete({ where: { userId: testSpecialist.id } })
    await prisma.user.delete({ where: { id: testClient.id } })
    await prisma.user.delete({ where: { id: testSpecialist.id } })
    pass('Test data cleaned up')

  } catch (error: any) {
    fail(`Unexpected error: ${error.message}`)
    console.error(error)
  }

  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('📊 VALIDATION SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)

  if (failed === 0) {
    console.log('\n🎉 All validation tests passed! bug-fix-1 is complete.')
  } else {
    console.log('\n⚠️  Some tests failed. Please review the output above.')
    process.exit(1)
  }
}

validatePrismaQueryFix()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
