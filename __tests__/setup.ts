import { beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { setupTestDatabase, cleanupTestDatabase, setTestPrismaClient, resetTestDatabase } from './helpers/db'
import { setupRateLimitMocks } from './helpers/ratelimit-mocks'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import path from 'path'

// Load test environment variables
config({ path: path.resolve(process.cwd(), '.env.test') })

// Setup rate limiting mocks globally (before any imports)
setupRateLimitMocks()

let testClient: PrismaClient | undefined

// Setup: Each worker gets its own isolated database file
beforeAll(async () => {
  testClient = await setupTestDatabase()
  setTestPrismaClient(testClient)
})

// Isolation: reset DB before each test in this worker
beforeEach(async () => {
  await resetTestDatabase()
})

// Teardown: Cleanup database after all tests in this worker
afterAll(async () => {
  await cleanupTestDatabase(testClient)
})
