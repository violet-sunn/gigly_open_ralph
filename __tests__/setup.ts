import { beforeAll, afterAll } from 'vitest'
import { setupTestDatabase, cleanupTestDatabase, setTestPrismaClient } from './helpers/db'
import { PrismaClient } from '@prisma/client'

let testClient: PrismaClient | undefined

// Setup: Each worker gets its own isolated in-memory database
beforeAll(async () => {
  testClient = await setupTestDatabase()
  setTestPrismaClient(testClient)
})

// Teardown: Cleanup database after all tests in this worker
afterAll(async () => {
  await cleanupTestDatabase(testClient)
})
