import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Default to Node for server actions, Prisma, and jose (JWT) usage.
    // React component tests can opt into jsdom per-file (see `__tests__/setup.ts`).
    environment: 'node',
    globals: true,
    setupFiles: ['__tests__/setup.ts'],
    hookTimeout: 60_000,
    fileParallelism: true, // Safe with per-worker database isolation
    exclude: ['**/node_modules/**', '**/e2e/**', '**/*.spec.ts'], // Exclude Playwright tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['app/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/types.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
