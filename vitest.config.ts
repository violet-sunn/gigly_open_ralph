import { defineConfig, defineProject } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

const baseExclude = ['**/node_modules/**', '**/e2e/**', '**/*.spec.ts']
const componentTestInclude = ['__tests__/unit/components/**/*.test.ts', '__tests__/unit/components/**/*.test.tsx']

export default defineConfig({
  plugins: [react()],
  test: {
    // Keep Node as the default environment for server actions, Prisma, and jose (JWT) usage.
    // Component tests run in jsdom via a dedicated Vitest project.
    globals: true,
    hookTimeout: 60_000,
    fileParallelism: true, // Safe with per-worker database isolation

    // Workspace projects provide deterministic, directory-based jsdom opt-in.
    projects: [
      defineProject({
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          setupFiles: ['__tests__/setup.ts'],
          exclude: [...baseExclude, ...componentTestInclude]
        }
      }),
      defineProject({
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: componentTestInclude,
          setupFiles: ['__tests__/setup.ts', '__tests__/setup-dom.ts'],
          exclude: baseExclude
        }
      })
    ],

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
  },
  esbuild: {
    jsx: 'automatic'
  }
})
