import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Next.js Configuration - CSRF Protection', () => {
  it('should not have serverActions.allowedOrigins with wildcards', () => {
    const configPath = path.join(process.cwd(), 'next.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf-8')

    // Check for dangerous patterns in serverActions.allowedOrigins
    const hasWildcardOrigin = /allowedOrigins\s*:\s*\[.*['"`]\*['"`].*\]/.test(configContent)
    const hasWildcardSubdomain = /allowedOrigins\s*:\s*\[.*['"`]\*\..*['"`].*\]/.test(configContent)

    expect(hasWildcardOrigin).toBe(false)
    expect(hasWildcardSubdomain).toBe(false)
  })

  it('should not have serverActions.allowedOrigins configuration (default is most secure)', () => {
    const configPath = path.join(process.cwd(), 'next.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf-8')

    // Preferred: no allowedOrigins configuration at all
    const hasAllowedOrigins = /serverActions\s*:\s*\{[^}]*allowedOrigins/.test(configContent)

    expect(hasAllowedOrigins).toBe(false)
  })

  it('middleware should not bypass Origin header checks', () => {
    const middlewarePath = path.join(process.cwd(), 'middleware.ts')
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf-8')

    // Check that middleware doesn't manipulate Origin or Host headers
    const manipulatesOrigin = /headers\(\)\.set\(['"`]origin/i.test(middlewareContent)
    const manipulatesHost = /headers\(\)\.set\(['"`]host/i.test(middlewareContent)

    expect(manipulatesOrigin).toBe(false)
    expect(manipulatesHost).toBe(false)
  })
})
