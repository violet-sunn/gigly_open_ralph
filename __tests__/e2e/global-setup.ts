import { config } from 'dotenv'
import path from 'path'
import { execSync } from 'child_process'
import fs from 'fs'

/**
 * Playwright global setup
 * Loads environment variables and initializes test database
 */
async function globalSetup() {
  // Load test environment variables
  config({ path: path.resolve(process.cwd(), '.env.test') })

  console.log('✓ Loaded .env.test for E2E tests')
  console.log(`  SESSION_SECRET: ${process.env.SESSION_SECRET ? '***' + process.env.SESSION_SECRET.slice(-4) : 'NOT SET'}`)
  console.log(`  DATABASE_URL: ${process.env.DATABASE_URL || 'NOT SET'}`)

  // Initialize test database with schema
  const dbUrl = process.env.DATABASE_URL || 'file:./test.db'

  // Extract file path from DATABASE_URL (format: "file:./test.db")
  const dbPath = dbUrl.replace('file:', '')

  // Remove existing test database to start fresh
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath)
    console.log('✓ Removed existing test database')
  }

  // Apply schema using prisma db push
  console.log('⏳ Applying database schema...')
  try {
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: dbUrl }
    })
    console.log('✓ Database schema applied successfully')
  } catch (error: any) {
    console.error('✗ Failed to apply database schema:', error.message)
    throw error
  }
}

export default globalSetup
