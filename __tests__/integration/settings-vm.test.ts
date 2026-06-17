import { describe, it, expect, vi } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { createTestUser } from '../helpers/seed'

vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: () => undefined, set: vi.fn(), delete: vi.fn() })),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((u: string) => {
    throw new Error(`NEXT_REDIRECT:${u}`)
  }),
}))

import { getSettings } from '@/lib/view-models'

/**
 * compose-settings mapper test — getSettings reuses lib/preferences (getPreferences) and bundles the viewer's email for
 * the delete-account confirm. Defaults reflect the schema (locale ru, all toggles on); stored changes are reflected.
 */
describe('getSettings', () => {
  it('returns the default preferences + the viewer email for a new user', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'CLIENT', email: `set-${Date.now()}@example.com` })

    const data = await getSettings({ userId: user.id, email: user.email })

    expect(data.email).toBe(user.email)
    expect(data.prefs.locale).toBe('ru') // RU default
    expect(data.prefs.notifyApplications).toBe(true)
    expect(data.prefs.notifyStatusChanges).toBe(true)
    expect(data.prefs.notifyMessages).toBe(true)
  })

  it('reflects stored preference changes', async () => {
    const prisma = getTestPrismaClient()
    const user = await createTestUser(prisma, { role: 'SPECIALIST', email: `set2-${Date.now()}@example.com` })
    await prisma.user.update({
      where: { id: user.id },
      data: { locale: 'en', notifyMessages: false },
    })

    const data = await getSettings({ userId: user.id, email: user.email })

    expect(data.prefs.locale).toBe('en')
    expect(data.prefs.notifyMessages).toBe(false)
    expect(data.prefs.notifyApplications).toBe(true) // unchanged
  })
})
