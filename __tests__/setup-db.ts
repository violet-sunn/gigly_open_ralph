import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const testDbPath = path.join(process.cwd(), 'test.db')

// Remove existing test database
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath)
}

// Set test database URL
process.env.DATABASE_URL = `file:./test.db`

// Run migrations
console.log('Setting up test database...')
execSync('npx prisma migrate deploy', { stdio: 'inherit' })
console.log('Test database ready!')
