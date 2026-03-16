import { defineConfig, defineProject } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

const baseExclude = ['**/node_modules/**', '**/e2e/**', '**/*.spec.ts']
const componentTestInclude = ['__tests__/unit/components/**/*.test.ts', '__tests__/unit/components/**/*.test.tsx']

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  esbuild: {
    jsx: 'automatic'
  },
  test: {
    globals: true,
    hookTimeout: 60_000,
    fileParallelism: true,

    projects: [
      defineProject({
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './')
          }
        },
        esbuild: {
          jsx: 'automatic'
        },
        test: {
          globals: true,
          hookTimeout: 60_000,
          fileParallelism: true,
          name: 'node',
          environment: 'node',
          setupFiles: ['__tests__/setup.ts'],
          exclude: [...baseExclude, ...componentTestInclude]
        }
      }),
      defineProject({
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './')
          }
        },
        esbuild: {
          jsx: 'automatic'
        },
        test: {
          globals: true,
          hookTimeout: 60_000,
          fileParallelism: true,
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
        '**/*.types.ts',
        '**/types.ts'
      ]
    }
  }
})
