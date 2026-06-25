import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-cross-cutting (loading-states) — reconciled to the rebuilt app. The rebuilt create-gig («Опубликовать гиг»)
 * and gig-detail apply («Отправить заявку») submit buttons no longer carry a per-button pending label, and /register
 * is now a multi-step wizard — so those original flows no longer apply. The surviving, observable loading indicator
 * is the profile-edit form (useFormStatus → disabled + «Saving profile...»). This verifies that pending state with
 * the server action slowed via route interception so it is deterministically observable. Seeds a SPECIALIST.
 */
let specId: string
let specEmail: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  specEmail = `loading-${stamp}@example.com`
  const spec = await prisma.user.create({
    data: {
      email: specEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Лоадинг Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } },
    },
  })
  specId = spec.id
  await prisma.$disconnect()
})

test.describe('e2e-cross-cutting — loading states', () => {
  test('profile edit shows the pending state during submission', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/profile/edit')

    await expect(page.getByRole('button', { name: 'Save Profile' })).toBeVisible()
    await page.fill('input[name="displayName"]', 'Test Specialist')
    await page.fill('input[name="techStack"]', 'React, TypeScript')

    // Slow ONLY the server-action POST (to the page URL) so the pending state is deterministically observable.
    // A redirect can abort the in-flight request, so guard route.continue() against the "already handled" race.
    await page.route('**/profile/edit', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }
      await new Promise((resolve) => setTimeout(resolve, 1500))
      try {
        await route.continue()
      } catch {
        /* the navigation away aborted this request — fine */
      }
    })

    await page.getByRole('button', { name: 'Save Profile' }).click()

    // The submit button reflects the pending state and is disabled (prevents double-submit).
    const pendingBtn = page.getByRole('button', { name: 'Saving profile...' })
    await expect(pendingBtn).toBeVisible()
    await expect(pendingBtn).toBeDisabled()

    await page.waitForURL('**/profile', { timeout: 10000 })
  })
})
