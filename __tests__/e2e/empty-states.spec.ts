import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * empty-states — verifies the empty states on the rebuilt list screens via the modern harness (setE2ESession + Prisma
 * seed, not the removed register form). Browse (/gigs, GigSearchDesign): «Ничего не нашлось» + «Сбросить фильтры».
 * Dashboard (/dashboard, DashboardDesign): the empty «Мои гиги» grid «Здесь пока пусто.» + the empty «Сообщения»
 * panel «Сообщений пока нет.». My-gigs (/my-gigs, MyGigsDesign): «Здесь пока пусто». The kit English empty states
 * (Post Your First Gig / No Messages Yet / View Example Gigs) and the old register-form/tablist paths are gone.
 */
async function seedSpecialist(suffix: string) {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const email = `es-spec-${suffix}-${Date.now()}@example.com`
  const spec = await prisma.user.create({
    data: {
      email,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'T', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } },
    },
  })
  await prisma.$disconnect()
  return { id: spec.id, email }
}

async function seedClient(suffix: string) {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const email = `es-client-${suffix}-${Date.now()}@example.com`
  const client = await prisma.user.create({
    data: {
      email,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Пусто', inn: '7700000001' } },
    },
  })
  await prisma.$disconnect()
  return { id: client.id, email }
}

test.describe('Empty States', () => {
  test.describe('SPECIALIST Empty States', () => {
    test('browse renders the filter selects and the «Найдено» header', async ({ page }) => {
      const spec = await seedSpecialist('browse')
      await setE2ESession(page, { id: spec.id, email: spec.email, role: 'SPECIALIST' })
      await page.goto('/gigs')

      // The rebuilt browse leads with native filter <select>s + the «Найдено» heading (no content role="search").
      await expect(page.getByRole('combobox')).toHaveCount(4)
      await expect(page.getByRole('heading', { name: 'Найдено' })).toBeVisible()
    })

    test('browse shows the «Ничего не нашлось» empty state when filters match nothing', async ({ page }) => {
      const spec = await seedSpecialist('nomatch')
      await setE2ESession(page, { id: spec.id, email: spec.email, role: 'SPECIALIST' })
      await page.goto('/gigs?search=nonexistentgig12345')

      // count badge 0 (scoped to the «Найдено» heading row) + the prototype empty state.
      await expect(page.getByRole('heading', { name: 'Найдено' }).locator('..').getByText('0', { exact: true })).toBeVisible()
      await expect(page.getByText('Ничего не нашлось')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Сбросить фильтры' })).toBeVisible()
    })

    test('dashboard shows the empty «Мои гиги» grid and «Сообщения» panel', async ({ page }) => {
      const spec = await seedSpecialist('dash')
      await setE2ESession(page, { id: spec.id, email: spec.email, role: 'SPECIALIST' })
      await page.goto('/dashboard')

      // A fresh specialist has no applications/gigs and no messages → the prototype empty states render, and the
      // SPECIALIST role panel shows «Найти новый гиг».
      await expect(page.getByText('Здесь пока пусто.')).toBeVisible()
      await expect(page.getByText('Сообщений пока нет.')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Найти новый гиг' })).toBeVisible()
    })
  })

  test.describe('CLIENT Empty States', () => {
    test('dashboard shows the empty grid + messages panel and the create panel', async ({ page }) => {
      const client = await seedClient('dash')
      await setE2ESession(page, { id: client.id, email: client.email, role: 'CLIENT' })
      await page.goto('/dashboard')

      await expect(page.getByText('Здесь пока пусто.')).toBeVisible()
      await expect(page.getByText('Сообщений пока нет.')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Создайте первый гиг' })).toBeVisible()
    })

    test('my-gigs shows the «Здесь пока пусто» empty state', async ({ page }) => {
      const client = await seedClient('mygigs')
      await setE2ESession(page, { id: client.id, email: client.email, role: 'CLIENT' })
      await page.goto('/my-gigs')

      // my-gigs has no trailing period — non-exact match.
      await expect(page.getByText('Здесь пока пусто')).toBeVisible()
    })
  })

  test.describe('ADMIN Empty States', () => {
    test('shows empty state on admin users page', async ({ page }) => {
      // Requires an ADMIN user created via DB — skipped in automated runs (admin console is out of this reground).
      test.skip()
    })

    test('shows empty state on admin gigs page', async ({ page }) => {
      test.skip()
    })
  })

  test.describe('Accessibility', () => {
    test('the browse empty-state «Сбросить фильтры» button is keyboard-activatable', async ({ page }) => {
      const spec = await seedSpecialist('a11y')
      await setE2ESession(page, { id: spec.id, email: spec.email, role: 'SPECIALIST' })
      await page.goto('/gigs?search=zzz-nonexistent-12345')

      const reset = page.getByRole('button', { name: 'Сбросить фильтры' })
      await reset.focus()
      await expect(reset).toBeFocused()
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL('/gigs')
    })
  })
})
