import { describe, it, expect } from 'vitest'
import { getTestPrismaClient, withTestTransaction } from './db'

describe('Database Helper Utilities', () => {
  it('provides a working Prisma client', () => {
    const client = getTestPrismaClient()
    expect(client).toBeDefined()
    expect(client.$connect).toBeDefined()
  })

  it('rolls back transaction after test', async () => {
    const client = getTestPrismaClient()

    // Create user inside transaction
    await withTestTransaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: 'rollback-test@example.com',
          password: 'hashedpassword',
          role: 'CLIENT',
          clientProfile: {
            create: {
              companyName: 'Test Company',
              inn: '1234567890'
            }
          }
        }
      })
      expect(user).toBeTruthy()
      expect(user.email).toBe('rollback-test@example.com')
    })

    // After transaction, user should not exist
    const user = await client.user.findUnique({
      where: { email: 'rollback-test@example.com' }
    })
    expect(user).toBeNull()
  })

  it('returns result from transaction callback', async () => {
    const result = await withTestTransaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: 'result-test@example.com',
          password: 'hashedpassword',
          role: 'ADMIN'
        }
      })
      return { userId: user.id, email: user.email }
    })

    expect(result).toBeDefined()
    expect(result.userId).toBeDefined()
    expect(result.email).toBe('result-test@example.com')
  })

  it('handles errors in transaction', async () => {
    await expect(
      withTestTransaction(async (tx) => {
        await tx.user.create({
          data: {
            email: 'error-test@example.com',
            password: 'hashedpassword',
            role: 'CLIENT',
            clientProfile: {
              create: {
                companyName: 'Test Company',
                inn: '1234567890'
              }
            }
          }
        })
        // Throw an error
        throw new Error('Test error')
      })
    ).rejects.toThrow('Test error')

    // User should not exist after error
    const client = getTestPrismaClient()
    const user = await client.user.findUnique({
      where: { email: 'error-test@example.com' }
    })
    expect(user).toBeNull()
  })

  it('isolates tests from each other', async () => {
    // First test creates a user
    await withTestTransaction(async (tx) => {
      await tx.user.create({
        data: {
          email: 'isolation-test-1@example.com',
          password: 'hashedpassword',
          role: 'CLIENT',
          clientProfile: {
            create: {
              companyName: 'Test Company',
              inn: '1234567890'
            }
          }
        }
      })
    })

    // Second test should not see the user from first test
    await withTestTransaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: 'isolation-test-1@example.com' }
      })
      expect(user).toBeNull()
    })
  })
})
