import { beforeAll, afterAll } from 'vitest'
import { setupTestDatabase, cleanupTestDatabase, setTestPrismaClient } from './helpers/db'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import path from 'path'

// Load test environment variables
config({ path: path.resolve(process.cwd(), '.env.test') })

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
