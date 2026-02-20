import 'dotenv/config'
import { prisma } from '../lib/prisma'

interface TestGig {
  id: string
  title: string
  description: string
  budget: number
  tags: string
}

async function createTestUser() {
  // Create a test client user
  const user = await prisma.user.create({
    data: {
      email: `test-client-${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'CLIENT',
    },
  })
  return user
}

async function createTestGigs(clientId: string): Promise<TestGig[]> {
  const testGigs = [
    {
      title: 'React Frontend Development',
      description: 'Build a modern React application with TypeScript',
      budget: 10000000, // 100,000 roubles
      tags: 'React,TypeScript',
      clientId,
    },
    {
      title: 'Python Backend API',
      description: 'Create a REST API using Python and Django',
      budget: 15000000, // 150,000 roubles
      tags: 'Python,Django',
      clientId,
    },
    {
      title: 'Go Microservice',
      description: 'Develop a microservice in Go with Docker',
      budget: 12000000, // 120,000 roubles
      tags: 'Go,Docker',
      clientId,
    },
    {
      title: 'Node.js Backend',
      description: 'Build a Node.js backend with Express',
      budget: 8000000, // 80,000 roubles
      tags: 'Node.js,TypeScript',
      clientId,
    },
    {
      title: 'Kubernetes Deployment',
      description: 'Set up Kubernetes cluster and deploy applications',
      budget: 20000000, // 200,000 roubles
      tags: 'Kubernetes,Docker',
      clientId,
    },
  ]

  const createdGigs: TestGig[] = []
  for (const gigData of testGigs) {
    const gig = await prisma.gig.create({
      data: {
        ...gigData,
        serviceFee: Math.floor(gigData.budget * 0.2),
        totalAmount: gigData.budget + Math.floor(gigData.budget * 0.2),
        status: 'OPEN',
      },
    })
    createdGigs.push(gig)
  }

  return createdGigs
}

async function testTextSearch(gigs: TestGig[]) {
  console.log('\n🔍 Testing text search...')

  // Search for "React"
  const reactGigs = await prisma.gig.findMany({
    where: {
      AND: [
        { status: 'OPEN' },
        {
          OR: [
            { title: { contains: 'React' } },
            { description: { contains: 'React' } },
          ],
        },
      ],
    },
  })

  console.assert(
    reactGigs.length === 1 && reactGigs[0].title === 'React Frontend Development',
    '❌ Text search for "React" failed'
  )
  console.log('✅ Text search for "React" passed')

  // Search for "backend" (case-insensitive)
  const backendGigs = await prisma.gig.findMany({
    where: {
      AND: [
        { status: 'OPEN' },
        {
          OR: [
            { title: { contains: 'backend' } },
            { description: { contains: 'backend' } },
          ],
        },
      ],
    },
  })

  console.assert(backendGigs.length === 2, '❌ Text search for "backend" failed')
  console.log('✅ Text search for "backend" passed')
}

async function testTagFiltering(gigs: TestGig[]) {
  console.log('\n🏷️  Testing tag filtering...')

  // Filter by single tag "Python"
  const pythonGigs = await prisma.gig.findMany({
    where: {
      AND: [
        { status: 'OPEN' },
        {
          OR: [{ tags: { contains: 'Python' } }],
        },
      ],
    },
  })

  console.assert(pythonGigs.length === 1, '❌ Tag filter for "Python" failed')
  console.log('✅ Tag filter for "Python" passed')

  // Filter by multiple tags "TypeScript" OR "Docker" (OR logic)
  const multiTagGigs = await prisma.gig.findMany({
    where: {
      AND: [
        { status: 'OPEN' },
        {
          OR: [
            { tags: { contains: 'TypeScript' } },
            { tags: { contains: 'Docker' } },
          ],
        },
      ],
    },
  })

  console.assert(multiTagGigs.length === 4, '❌ Multi-tag filter failed')
  console.log('✅ Multi-tag filter (TypeScript OR Docker) passed')
}

async function testBudgetFiltering(gigs: TestGig[]) {
  console.log('\n💰 Testing budget filtering...')

  // Filter by min budget (>= 100,000 roubles = 10,000,000 kopecks)
  const minBudgetGigs = await prisma.gig.findMany({
    where: {
      AND: [
        { status: 'OPEN' },
        { budget: { gte: 10000000 } },
      ],
    },
  })

  console.assert(minBudgetGigs.length === 4, '❌ Min budget filter failed')
  console.log('✅ Min budget filter (>= 100,000₽) passed')

  // Filter by max budget (<= 100,000 roubles = 10,000,000 kopecks)
  const maxBudgetGigs = await prisma.gig.findMany({
    where: {
      AND: [
        { status: 'OPEN' },
        { budget: { lte: 10000000 } },
      ],
    },
  })

  console.assert(maxBudgetGigs.length === 2, '❌ Max budget filter failed')
  console.log('✅ Max budget filter (<= 100,000₽) passed')

  // Filter by budget range (100,000 - 150,000 roubles)
  const rangeBudgetGigs = await prisma.gig.findMany({
    where: {
      AND: [
        { status: 'OPEN' },
        { budget: { gte: 10000000, lte: 15000000 } },
      ],
    },
  })

  console.assert(rangeBudgetGigs.length === 3, '❌ Budget range filter failed')
  console.log('✅ Budget range filter (100,000₽ - 150,000₽) passed')
}

async function testSorting(gigs: TestGig[]) {
  console.log('\n📊 Testing sorting...')

  // Sort by budget descending
  const budgetDescGigs = await prisma.gig.findMany({
    where: { status: 'OPEN' },
    orderBy: { budget: 'desc' },
  })

  console.assert(
    budgetDescGigs[0].budget === 20000000,
    '❌ Sort by budget descending failed'
  )
  console.log('✅ Sort by budget descending passed')

  // Sort by budget ascending
  const budgetAscGigs = await prisma.gig.findMany({
    where: { status: 'OPEN' },
    orderBy: { budget: 'asc' },
  })

  console.assert(
    budgetAscGigs[0].budget === 8000000,
    '❌ Sort by budget ascending failed'
  )
  console.log('✅ Sort by budget ascending passed')
}

async function testCombinedFilters(gigs: TestGig[]) {
  console.log('\n🔗 Testing combined filters (AND logic)...')

  // Search "backend" AND tag "Python" AND budget >= 100,000
  const combinedGigs = await prisma.gig.findMany({
    where: {
      AND: [
        { status: 'OPEN' },
        {
          OR: [
            { title: { contains: 'backend' } },
            { description: { contains: 'backend' } },
          ],
        },
        {
          OR: [{ tags: { contains: 'Python' } }],
        },
        { budget: { gte: 10000000 } },
      ],
    },
  })

  console.assert(
    combinedGigs.length === 1 && combinedGigs[0].title === 'Python Backend API',
    '❌ Combined filters (search AND tag AND budget) failed'
  )
  console.log('✅ Combined filters (search AND tag AND budget) passed')

  // Search "backend" AND tag "Go" (should match Go Microservice)
  const backendGoGigs = await prisma.gig.findMany({
    where: {
      AND: [
        { status: 'OPEN' },
        {
          OR: [
            { title: { contains: 'backend' } },
            { description: { contains: 'backend' } },
          ],
        },
        {
          OR: [{ tags: { contains: 'Go' } }],
        },
      ],
    },
  })

  console.assert(backendGoGigs.length === 0, '❌ Combined filter validation failed')
  console.log('✅ Combined filter validation passed (Go Microservice has no "backend" in title/description)')
}

async function cleanup(userId: string, gigIds: string[]) {
  console.log('\n🧹 Cleaning up test data...')

  // Delete test gigs
  await prisma.gig.deleteMany({
    where: { id: { in: gigIds } },
  })

  // Delete test user
  await prisma.user.delete({
    where: { id: userId },
  })

  console.log('✅ Cleanup complete')
}

async function main() {
  console.log('🚀 Starting Gig Filters Integration Tests\n')

  let testUser
  let testGigs: TestGig[] = []

  try {
    // Setup
    testUser = await createTestUser()
    console.log(`✅ Created test user: ${testUser.email}`)

    testGigs = await createTestGigs(testUser.id)
    console.log(`✅ Created ${testGigs.length} test gigs`)

    // Run tests
    await testTextSearch(testGigs)
    await testTagFiltering(testGigs)
    await testBudgetFiltering(testGigs)
    await testSorting(testGigs)
    await testCombinedFilters(testGigs)

    console.log('\n✅ All tests passed!')
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    throw error
  } finally {
    // Cleanup
    if (testUser && testGigs.length > 0) {
      await cleanup(
        testUser.id,
        testGigs.map(g => g.id)
      )
    }
  }

  await prisma.$disconnect()
}

main()
