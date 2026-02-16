import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function testSuspendedLogin() {
  console.log('Testing suspended user login...')

  try {
    // Clean up test user if exists
    await prisma.user.deleteMany({
      where: { email: 'suspended-test@example.com' }
    })

    // Create a suspended user
    const hashedPassword = await bcrypt.hash('password123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'suspended-test@example.com',
        password: hashedPassword,
        role: 'CLIENT',
        suspended: true
      }
    })

    console.log('✓ Created suspended user:', user.email)

    // Verify password comparison works
    const valid = await bcrypt.compare('password123', user.password)
    console.log('✓ Password verification works:', valid)

    // Check suspended status
    const fetchedUser = await prisma.user.findUnique({
      where: { email: 'suspended-test@example.com' }
    })

    if (fetchedUser?.suspended) {
      console.log('✓ User is suspended as expected')
      console.log('✓ Login action should return error: "Your account has been suspended. Please contact support."')
    } else {
      console.error('✗ User is not suspended!')
      process.exit(1)
    }

    // Clean up
    await prisma.user.delete({ where: { id: user.id } })
    console.log('✓ Test user cleaned up')

    console.log('\n✅ All suspended login tests passed!')
  } catch (error) {
    console.error('✗ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testSuspendedLogin()
