import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding test data...')

  // Create test client user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const client = await prisma.user.upsert({
    where: { email: 'client@test.com' },
    update: {},
    create: {
      email: 'client@test.com',
      password: hashedPassword,
      role: 'CLIENT',
    },
  })
  console.log('✅ Created client user: client@test.com')

  // Create test specialist user
  const specialist = await prisma.user.upsert({
    where: { email: 'specialist@test.com' },
    update: {},
    create: {
      email: 'specialist@test.com',
      password: hashedPassword,
      role: 'SPECIALIST',
    },
  })
  console.log('✅ Created specialist user: specialist@test.com')

  // Create test gigs with various attributes
  const testGigs = [
    {
      title: 'React Frontend Development',
      description: 'Build a modern React application with TypeScript and Redux',
      budget: 10000000, // 100,000 roubles
      tags: 'React,TypeScript,Redux',
    },
    {
      title: 'Python Backend API',
      description: 'Create a REST API using Python, Django, and PostgreSQL',
      budget: 15000000, // 150,000 roubles
      tags: 'Python,Django,PostgreSQL',
    },
    {
      title: 'Go Microservice Development',
      description: 'Develop a high-performance microservice in Go with Docker',
      budget: 12000000, // 120,000 roubles
      tags: 'Go,Docker,Microservices',
    },
    {
      title: 'Node.js Backend Service',
      description: 'Build a scalable backend service with Node.js and Express',
      budget: 8000000, // 80,000 roubles
      tags: 'Node.js,TypeScript,Express',
    },
    {
      title: 'Kubernetes Deployment Setup',
      description: 'Set up Kubernetes cluster and deploy containerized applications',
      budget: 20000000, // 200,000 roubles
      tags: 'Kubernetes,Docker,DevOps',
    },
    {
      title: 'Rust Systems Programming',
      description: 'Develop low-level systems software in Rust',
      budget: 18000000, // 180,000 roubles
      tags: 'Rust,Systems Programming',
    },
    {
      title: 'Full Stack Web Application',
      description: 'Build a complete web application with React frontend and Python backend',
      budget: 25000000, // 250,000 roubles
      tags: 'React,Python,Full Stack',
    },
    {
      title: 'Mobile App Backend',
      description: 'Create backend API for mobile application using Node.js',
      budget: 9000000, // 90,000 roubles
      tags: 'Node.js,API,Mobile',
    },
  ]

  for (const gigData of testGigs) {
    await prisma.gig.upsert({
      where: {
        // Use a composite unique constraint if available, or just create
        id: `test-${gigData.title.toLowerCase().replace(/\s+/g, '-')}`
      },
      update: {},
      create: {
        ...gigData,
        serviceFee: Math.floor(gigData.budget * 0.2),
        totalAmount: gigData.budget + Math.floor(gigData.budget * 0.2),
        status: 'OPEN',
        clientId: client.id,
      },
    })
  }

  console.log(`✅ Created ${testGigs.length} test gigs`)
  console.log('\n📝 Test credentials:')
  console.log('   Client: client@test.com / password123')
  console.log('   Specialist: specialist@test.com / password123')
  console.log('\n🔗 Navigate to http://localhost:3000/login to test')

  await prisma.$disconnect()
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error)
  process.exit(1)
})
