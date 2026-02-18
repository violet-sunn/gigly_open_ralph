import { execSync } from 'child_process'

// Reset test database before all tests
execSync('npx tsx __tests__/setup-db.ts', { stdio: 'inherit' })
