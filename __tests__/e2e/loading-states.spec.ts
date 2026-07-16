import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-cross-cutting (loading-states) — reconciled to the rebuilt app. The standalone profile-edit form is retired
 * (editing is now done via the on-screen profile modals), so the observable loading indicator is the profile bio
 * modal's «Сохранить» button: useActionState → disabled while the updateProfile server action is in flight. This
 * verifies that pending state with the server action slowed via route interception so it is deterministically
 * observable. Seeds a SPECIALIST.
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
  test('the profile bio modal Save button shows the pending state during submission', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/profile')

    // Open the «Опыт и уровень» modal (the Опыт button = the 2nd owner «Редактировать» button; all share that name).
    await page.getByRole('button', { name: 'Редактировать' }).nth(1).click()
    await expect(page.getByRole('heading', { name: 'Опыт и уровень' })).toBeVisible()
    await page.locator('textarea[name="bio"]').fill('Обновлённое описание для проверки состояния ожидания.')

    // Slow ONLY the server-action POST (it posts to the page URL /profile) so the pending state is observable.
    // The success path refreshes (a GET) which the method guard lets through; guard continue() against the abort race.
    await page.route('**/profile', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }
      await new Promise((resolve) => setTimeout(resolve, 1500))
      try {
        await route.continue()
      } catch {
        /* the refresh aborted this request — fine */
      }
    })

    const save = page.getByRole('button', { name: 'Сохранить' })
    await save.click()
    // useActionState pending → the Save button is disabled (prevents double-submit) while the action is in flight.
    await expect(save).toBeDisabled()
  })
})
