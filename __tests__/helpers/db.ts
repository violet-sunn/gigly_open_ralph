import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Cache for per-worker Prisma clients
const clientCache = new Map<string, PrismaClient>()

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

  // Generate unique database URL for this worker
  // LibSQL doesn't support SQLite query parameters, so use simple file path
  const databaseUrl = `file:memdb_${workerId}.db`

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
      const dbPath = path.join(process.cwd(), `memdb_${workerId}.db`)
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
 * Execute callback within a transaction that automatically rolls back
 * This provides perfect test isolation - changes are never committed
 */
export async function withTestTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  const client = getTestPrismaClient()

  try {
    // Use interactive transaction with automatic rollback
    // We throw an error at the end to force rollback
    return await client.$transaction(async (tx) => {
      const result = await callback(tx as PrismaClient)

      // Force rollback by throwing an error
      // We'll catch this and return the result
      throw { __ROLLBACK__: true, result }
    })
  } catch (error: any) {
    // If this is our rollback marker, return the result
    if (error && error.__ROLLBACK__ === true) {
      return error.result
    }
    // Otherwise, re-throw the actual error
    throw error
  }
}
