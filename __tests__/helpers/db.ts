import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Cache for per-worker Prisma clients
const clientCache = new Map<string, PrismaClient>()

// Directory for test database files (relative to project root)
const TEST_DB_DIR = path.join(process.cwd(), '__tests__', '.tmp')

/**
 * Get unique worker identifier for database isolation
 */
function getWorkerId(): string {
  // Use VITEST_WORKER_ID if available, otherwise fall back to process.pid
  return process.env.VITEST_WORKER_ID || `${process.pid}`
}

/**
 * Setup test database with per-worker isolation
 * Each Vitest worker gets its own in-memory SQLite database
 */
export async function setupTestDatabase(): Promise<PrismaClient> {
  const workerId = getWorkerId()

  // Ensure test database directory exists
  if (!fs.existsSync(TEST_DB_DIR)) {
    fs.mkdirSync(TEST_DB_DIR, { recursive: true })
  }

  // Generate unique database URL for this worker
  // LibSQL doesn't support SQLite query parameters, so use simple file path
  const dbPath = path.join(TEST_DB_DIR, `memdb_${workerId}.db`)
  const databaseUrl = `file:${dbPath}`

  console.log(`[Worker ${workerId}] Setting up test database: ${databaseUrl}`)

  // Set DATABASE_URL environment variable for this worker
  // Keep it set for the entire worker lifetime
  process.env.DATABASE_URL = databaseUrl

  try {
    // Apply schema using db push (faster than migrate for in-memory)
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'pipe', // Suppress output unless there's an error
      env: { ...process.env, DATABASE_URL: databaseUrl }
    })

    // Create adapter for LibSQL
    const adapter = new PrismaLibSql({
      url: databaseUrl
    })

    // Create Prisma client with adapter
    const client = new PrismaClient({
      adapter: adapter as any
    })

    // Connect to database
    await client.$connect()

    console.log(`[Worker ${workerId}] Test database ready`)
    return client
  } catch (error) {
    console.error(`[Worker ${workerId}] Failed to setup test database:`, error)
    throw error
  }
}

/**
 * Cleanup test database
 */
export async function cleanupTestDatabase(client: PrismaClient | undefined): Promise<void> {
  const workerId = getWorkerId()
  console.log(`[Worker ${workerId}] Cleaning up test database`)

  try {
    if (client) {
      await client.$disconnect()
    }

    // Remove from cache
    clientCache.delete(workerId)

    // Try to remove database files (may fail on Windows due to file locks)
    // This is not critical - files will be overwritten on next run
    try {
      const dbPath = path.join(TEST_DB_DIR, `memdb_${workerId}.db`)
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath)
      }

      // Also remove WAL and SHM files if they exist
      const walPath = `${dbPath}-wal`
      const shmPath = `${dbPath}-shm`
      if (fs.existsSync(walPath)) {
        fs.unlinkSync(walPath)
      }
      if (fs.existsSync(shmPath)) {
        fs.unlinkSync(shmPath)
      }
    } catch (fileError: any) {
      // File deletion can fail on Windows due to locks - this is not critical
      if (fileError.code !== 'EBUSY' && fileError.code !== 'EPERM') {
        console.warn(`[Worker ${workerId}] Could not delete database files:`, fileError.message)
      }
    }
  } catch (error) {
    console.error(`[Worker ${workerId}] Error during cleanup:`, error)
    throw error
  }
}

/**
 * Get or create Prisma client for current worker (singleton per worker)
 */
export function getTestPrismaClient(): PrismaClient {
  const workerId = getWorkerId()

  let client = clientCache.get(workerId)
  if (!client) {
    throw new Error(
      `Test database not initialized for worker ${workerId}. ` +
      `Make sure setupTestDatabase() is called in beforeAll hook.`
    )
  }

  return client
}

/**
 * Set the cached client for the current worker
 * Called by setup.ts after initializing the database
 */
export function setTestPrismaClient(client: PrismaClient): void {
  const workerId = getWorkerId()
  clientCache.set(workerId, client)
}

/**
 * Reset all tables for the current worker database.
 *
 * We prefer deterministic cleanup between tests rather than relying on
 * transaction rollbacks, because some adapters / sqlite configurations can
 * behave differently under interactive transactions.
 */
export async function resetTestDatabase(): Promise<void> {
  const prisma = getTestPrismaClient()

  // Delete in FK-safe order.
  // Dispute references ModerationLog (resolutionLogId), Gig, and User — delete it first.
  await prisma.dispute.deleteMany()
  await prisma.review.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.application.deleteMany()
  await prisma.moderationLog.deleteMany()
  await prisma.gig.deleteMany()

  // Category is referenced by Gig.categorySlug (deleted above) and the favorites m-n join
  // (cascades on user/category delete) — delete after gigs, before users.
  await prisma.category.deleteMany()

  // WorkExperience references SpecialistProfile (profileId → userId); delete it before the profiles
  // so SQLite FK enforcement stays happy (onDelete: Cascade is the backstop).
  await prisma.workExperience.deleteMany()

  // Profiles have onDelete: Cascade from User, but delete explicitly to keep
  // ordering clear for SQLite FK enforcement.
  await prisma.clientProfile.deleteMany()
  await prisma.specialistProfile.deleteMany()

  await prisma.user.deleteMany()
}

/**
 * Execute callback within a transaction that automatically rolls back.
 *
 * Note: we still expose this helper for call sites that want it, but the
 * primary isolation mechanism is the global reset in __tests__/setup.ts.
 */
export async function withTestTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  const client = getTestPrismaClient()

  try {
    return await client.$transaction(async (tx) => {
      const result = await callback(tx as PrismaClient)
      throw { __ROLLBACK__: true, result }
    })
  } catch (error: any) {
    if (error && error.__ROLLBACK__ === true) {
      return error.result
    }
    throw error
  }
}
