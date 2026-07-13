import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-admin-console (reconciliation #14) — verifies the rebuilt admin moderation console «МОДЕРАЦИЯ»
 * (app/admin/AdminConsoleDesign.tsx, route /admin) over the unchanged getAdminDashboard view model and the
 * suspendUser / unsuspendUser / closeGig moderation actions. Covers the consolidated console's five panels: the
 * 4 stat tiles, the «Споры на модерации» queue (→ /disputes/[id] via «Рассмотреть»), the «Пользователи»
 * block/unblock panel, the «Гиги» close panel, and the «Журнал модерации» audit log.
 *
 * NOTE: the moderation actions redirect to the old-kit /admin/users · /admin/gigs after a mutation, so the tests
 * verify a block/close by re-visiting /admin and asserting the row's new state. /admin/users + /admin/gigs are
 * still old-kit and covered by the PASS-AS-IS admin-moderation / admin-pagination specs — out of scope here.
 *
 * The same Russian text appears as a stat-tile label, a sidebar nav item, AND a panel heading («Пользователи»,
 * «Гиги») — so panel assertions use getByRole('heading', …) and the dispute/user/gig rows are scoped by text.
 */
let adminId: string
let adminEmail: string
let disputeId: string
let disputeGigTitle: string
let blockEmail: string
let closeGigTitle: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const s = Date.now()
  adminEmail = `cad-admin-${s}@example.com`
  blockEmail = `cad-blockme-${s}@example.com`
  disputeGigTitle = `CAD Dispute Gig ${s}`
  closeGigTitle = `CAD Close Gig ${s}`

  const admin = await prisma.user.create({ data: { email: adminEmail, password: 'x', role: 'ADMIN' } })
  adminId = admin.id
  const client = await prisma.user.create({
    data: { email: `cad-client-${s}@example.com`, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Админ', inn: '7700000099' } } },
  })
  const spec = await prisma.user.create({
    data: { email: `cad-spec-${s}@example.com`, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Спец', techStack: 'React', experienceLevel: 'SENIOR' } } },
  })
  // A dedicated active user the «Пользователи» block test mutates (keeps the other rows untouched).
  await prisma.user.create({ data: { email: blockEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Блок', techStack: 'Go', experienceLevel: 'MIDDLE' } } } })

  const gig = await prisma.gig.create({
    data: {
      title: disputeGigTitle,
      description: 'Admin dashboard test gig with a reasonably detailed description for the body.',
      acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига при создании.',
      budget: 10000000, serviceFee: 1000000, totalAmount: 11000000, tags: 'React', deadlineDays: 14,
      status: 'IN_PROGRESS', clientId: client.id, assignedSpecialistId: spec.id,
    },
  })
  // A dedicated open (un-closed) gig the «Гиги» close test mutates — no dispute, so it only appears in «Гиги».
  await prisma.gig.create({
    data: {
      title: closeGigTitle,
      description: 'Second admin test gig used exclusively by the close-gig moderation scenario.',
      acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига при создании.',
      budget: 5000000, serviceFee: 500000, totalAmount: 5500000, tags: 'Go', deadlineDays: 7,
      status: 'OPEN', clientId: client.id,
    },
  })
  const dispute = await prisma.dispute.create({
    data: { gigId: gig.id, openerId: client.id, openerRole: 'company', reason: 'Результат не соответствует ТЗ', status: 'OPEN' },
  })
  disputeId = dispute.id
  await prisma.moderationLog.create({ data: { action: 'CLOSE_GIG', reason: 'нарушение', adminId: admin.id, targetGigId: gig.id } })

  await prisma.$disconnect()
})

test.describe('e2e-admin-console — moderation console', () => {
  test('the console renders the four stat tiles', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin')

    // «Заблокировано» + «Закрыто» are stat-tile-exclusive labels (no nav/heading collision) → they prove the tile row.
    await expect(page.getByText('Заблокировано')).toBeVisible()
    await expect(page.getByText('Закрыто')).toBeVisible()
    // «Пользователи» / «Гиги» also label tiles (they double as nav items + panel headings) — assert they render.
    await expect(page.getByText('Пользователи').first()).toBeVisible()
    await expect(page.getByText('Гиги').first()).toBeVisible()
  })

  test('the dispute queue lists an open dispute and «Рассмотреть» opens it', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin')

    await expect(page.getByText('Споры на модерации')).toBeVisible()
    await expect(page.getByText(disputeGigTitle).first()).toBeVisible() // the OPEN dispute row
    await expect(page.getByText('Результат не соответствует ТЗ')).toBeVisible()

    await page.getByRole('button', { name: 'Рассмотреть' }).first().click()
    await expect(page).toHaveURL(new RegExp(`/disputes/${disputeId}`))
  })

  test('an admin blocks a user from the «Пользователи» panel', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin')

    await expect(page.getByRole('heading', { name: 'Пользователи' })).toBeVisible()
    await expect(page.getByText(blockEmail)).toBeVisible()

    // Scope to the seeded user's row (the innermost element holding both the email and an active «Заблокировать»).
    const row = page
      .locator('div')
      .filter({ hasText: blockEmail })
      .filter({ has: page.getByRole('button', { name: 'Заблокировать' }) })
      .last()
    await row.getByRole('button', { name: 'Заблокировать' }).click()

    // The captured destructive-confirm dialog opens — confirm to fire suspendUser.
    await page.getByRole('dialog').getByRole('button', { name: 'Заблокировать' }).click()

    // suspendUser redirects to the old-kit /admin/users; re-visit the console to confirm the flipped row state.
    await page.waitForURL('**/admin/users')
    await page.goto('/admin')

    // Anchor to the row (the div holding BOTH the email and the status) — not the nested title-only text column.
    const updated = page.locator('div').filter({ hasText: blockEmail }).filter({ hasText: 'Заблокирован' }).last()
    await expect(updated.getByText('Заблокирован', { exact: true })).toBeVisible()
    await expect(updated.getByRole('button', { name: 'Разблокировать' })).toBeVisible()
  })

  test('an admin closes a gig from the «Гиги» panel', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin')

    await expect(page.getByRole('heading', { name: 'Гиги' })).toBeVisible()
    await expect(page.getByText(closeGigTitle)).toBeVisible()

    const gigRow = page
      .locator('div')
      .filter({ hasText: closeGigTitle })
      .filter({ has: page.getByRole('button', { name: 'Закрыть' }) })
      .last()
    await gigRow.getByRole('button', { name: 'Закрыть' }).click()

    // The destructive-confirm dialog opens — confirm to fire closeGig.
    await page.getByRole('dialog').getByRole('button', { name: 'Закрыть' }).click()

    // closeGig redirects to the old-kit /admin/gigs; re-visit the console to confirm the gig is now closed.
    await page.waitForURL('**/admin/gigs')
    await page.goto('/admin')

    // Anchor to the row (the div holding BOTH the title and the «Закрыт» status) — not the nested title-only column.
    const updated = page.locator('div').filter({ hasText: closeGigTitle }).filter({ hasText: 'Закрыт' }).last()
    await expect(updated.getByText('Закрыт', { exact: true })).toBeVisible()
    await expect(updated.getByRole('button', { name: 'Закрыть' })).toHaveCount(0)
  })

  test('the moderation log shows audit entries', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin')

    await expect(page.getByText('Журнал модерации')).toBeVisible()
    await expect(page.getByText('Закрыт гиг').first()).toBeVisible() // the seeded CLOSE_GIG log row
  })
})
