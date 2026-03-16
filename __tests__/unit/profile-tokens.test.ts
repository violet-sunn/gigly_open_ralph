import { describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'

describe('UI design tokens - Specialist Profile subset', () => {
  it('resolves required semantic tokens without missing references', () => {
    const out = execSync('node scripts/validate-profile-tokens.mjs', {
      encoding: 'utf-8',
      stdio: 'pipe',
    })

    expect(out).toContain('OK: Specialist Profile token subset resolves')
  })
})
