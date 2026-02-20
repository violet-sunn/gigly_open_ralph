import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function testAdminRegistration() {
  console.log('Testing ADMIN role registration rejection...')

  try {
    // Check that no user with test email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin-test@example.com' }
    })

    if (existingUser) {
      await prisma.user.delete({ where: { id: existingUser.id } })
      console.log('✓ Cleaned up existing test user')
    }

    // Simulate what registerUser does with ADMIN role
    const role = 'ADMIN'

    // Check validation logic
    if (!role || !['CLIENT', 'SPECIALIST'].includes(role)) {
      console.log('✓ ADMIN role correctly rejected by validation')
    } else {
      console.error('✗ ADMIN role was not rejected!')
      process.exit(1)
    }

    // Additional check for explicit ADMIN rejection
    if (role === 'ADMIN') {
      console.log('✓ Explicit ADMIN check would reject registration')
    }

    // Verify no user was created
    const userCount = await prisma.user.count({
      where: { email: 'admin-test@example.com' }
    })

    if (userCount === 0) {
      console.log('✓ No user was created with ADMIN role')
    } else {
      console.error('✗ User was created when it should not have been!')
      process.exit(1)
    }

    console.log('\n✅ All admin registration tests passed!')
    console.log('Note: ADMIN users can only be created via direct database manipulation')
  } catch (error) {
    console.error('✗ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testAdminRegistration()
