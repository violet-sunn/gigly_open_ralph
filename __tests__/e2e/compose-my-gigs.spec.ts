import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-my-gigs — verifies /my-gigs is the rebuilt «МОИ ГИГИ» screen
 * (app/(protected)/my-gigs/MyGigsDesign.tsx, rendering app/_design/GigCard.tsx in `full` mode): the five status
 * filter chips (Все/Заявки/В работе/На проверке/Завершённые) rendered as <div> chips (NOT role="tab"), a 2-col grid
 * of FULL GigCards for the viewer's OWN gigs (footer Фикс. цена / Срок выполнения / «К проекту»), and the prototype
 * empty state for an empty tab. The page title lives in the shell header («МОИ ГИГИ»), so there is no in-content title.
 * The whole GigCard is a <Link> to the gig detail («К проекту» is a <span>, not a button). Seeds a CLIENT + one
 * IN_PROGRESS gig directly into the E2E db (file:./test.db) → the «В работе» tab is populated, «Заявки» is empty.
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

test.describe('compose-my-gigs — rebuilt «МОИ ГИГИ»', () => {
  test('renders the five status chips and the own-gig full GigCard grid', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/my-gigs')

    // The five <div> filter chips — selected by text, NOT role="tab". The first match is the chip row (which renders
    // before the grid), so .first() avoids colliding with a GigCard's «В работе»/… status label.
    for (const label of ['Все', 'Заявки', 'В работе', 'На проверке', 'Завершённые']) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible()
    }

    // The own-gig FULL GigCard: title + the full-footer labels.
    await expect(page.getByText('E2E Мои Гиги — активный гиг')).toBeVisible()
    await expect(page.getByText('Фикс. цена').first()).toBeVisible()
    await expect(page.getByText('Срок выполнения').first()).toBeVisible()
    await expect(page.getByText('К проекту').first()).toBeVisible()
  })

  test('a card opens the gig detail', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/my-gigs')

    // The whole card is a <Link> to /gigs/[id] («К проекту» is a <span> inside it, not a button) — click by title.
    await page.getByRole('link', { name: /E2E Мои Гиги — активный гиг/ }).first().click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigId}`))
  })

  test('an empty tab shows the prototype empty state', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto('/my-gigs')

    // The single seeded gig is IN_PROGRESS → the «Заявки» chip is empty. Click the chip (first match = the chip row).
    await page.getByText('Заявки', { exact: true }).first().click()
    await expect(page.getByText('Здесь пока пусто')).toBeVisible()
    await expect(
      page.getByText('Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.'),
    ).toBeVisible()
    await expect(page.getByText('E2E Мои Гиги — активный гиг')).toHaveCount(0)
  })
})
