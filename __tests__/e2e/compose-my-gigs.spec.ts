import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * reconcile-my-projects (Phase 3) — verifies /my-gigs is the composed «Мои гиги» screen: a «Мои гиги» header + the five
 * status tabs (Все/Заявки/В работе/На проверке/Завершённые) over a GigCard grid of the viewer's OWN gigs, with the
 * prototype empty state for an empty tab, and cards that open the gig detail. Seeds a CLIENT + one IN_PROGRESS gig
 * directly into the E2E db (file:./test.db).
 */
let clientId: string
let clientEmail: string
let gigId: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  clientEmail = `cmygigs-client-${stamp}@example.com`

  const client = await prisma.user.create({
    data: {
      email: clientEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Мои Гиги', inn: '7700000009' } },
    },
  })
  clientId = client.id

  const gig = await prisma.gig.create({
    data: {
      title: 'E2E Мои Гиги — активный гиг',
      description: 'My-gigs composition test gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget: 5000000,
      serviceFee: 500000,
      totalAmount: 5500000,
      status: 'IN_PROGRESS',
      tags: 'React',
      deadlineDays: 14,
      clientId: client.id,
    },
  })
  gigId = gig.id

  await prisma.$disconnect()
})

test.describe('reconcile-my-projects — composed «Мои гиги»', () => {
  test('renders the header, the five status tabs, and the own-gig grid', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/my-gigs')

    // «Мои гиги» appears in both the sidebar nav and the screen header — scope to the main content (SectionHeader).
    await expect(page.locator('#main-content').getByText('Мои гиги', { exact: true })).toBeVisible()
    for (const label of ['Все', 'Заявки', 'В работе', 'На проверке', 'Завершённые']) {
      await expect(page.getByRole('tab', { name: label })).toBeVisible()
    }
    await expect(page.getByText('E2E Мои Гиги — активный гиг')).toBeVisible() // GigCard for the own gig
  })

  test('a card opens the gig detail', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/my-gigs')

    await page.getByRole('button', { name: 'К проекту' }).first().click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigId}`))
  })

  test('an empty tab shows the prototype empty state', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/my-gigs')

    // The single seeded gig is IN_PROGRESS → the «Заявки» tab is empty.
    await page.getByRole('tab', { name: 'Заявки' }).click()
    await expect(page.getByText('Здесь пока пусто')).toBeVisible()
    await expect(
      page.getByText('Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.'),
    ).toBeVisible()
    await expect(page.getByText('E2E Мои Гиги — активный гиг')).toHaveCount(0)
  })
})
