import { describe, it, expect } from 'vitest'
import { withTestTransaction } from '../helpers/db'
import { createTestUser } from '../helpers/seed'
import bcrypt from 'bcryptjs'

describe('User Registration', () => {
  it('creates a new user with hashed password', async () => {
    await withTestTransaction(async (tx) => {
      const testUser = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        role: 'CLIENT' as const,
        companyName: 'Test Company',
        inn: '1234567890'
      }

      // Create user using seed helper
      const user = await createTestUser(tx, {
        email: testUser.email,
        password: testUser.password,
        role: testUser.role,
        companyName: testUser.companyName,
        inn: testUser.inn
      })

      // Assertions
      expect(user.email).toBe(testUser.email)
      expect(user.role).toBe('CLIENT')
      expect(user.password).not.toBe(testUser.password) // Password should be hashed
      expect(await bcrypt.compare(testUser.password, user.password)).toBe(true)
      expect(user.clientProfile?.companyName).toBe(testUser.companyName)
      expect(user.clientProfile?.inn).toBe(testUser.inn)
    })
  })

  it('prevents duplicate email registration', async () => {
    await withTestTransaction(async (tx) => {
      const email = `test-duplicate-${Date.now()}@example.com`

      // Create first user
      await createTestUser(tx, {
        email,
        role: 'SPECIALIST',
        techStack: 'React, Node.js',
        experienceLevel: 'SENIOR'
      })

      // Attempt to create duplicate
      await expect(
        tx.user.create({
          data: {
            email,
            password: await bcrypt.hash('password456', 10),
            role: 'CLIENT',
            clientProfile: {
              create: {
                companyName: 'Another Company',
                inn: '9876543210'
              }
            }
          }
        })
      ).rejects.toThrow()
    })
  })
})
