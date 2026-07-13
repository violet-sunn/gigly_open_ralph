import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * admin-disputes — the dedicated admin «Споры» screen at /admin/disputes: ALL disputes (open + resolved + rejected)
 * with a status filter, reachable from the admin sidebar «Споры» nav item (active there). Distinct from the console's
 * inline OPEN-only queue. Seeds directly into the E2E db (file:./test.db).
 */
let adminId: string
let adminEmail: string
let openTitle: string
let resolvedTitle: string
let rejectedTitle: string
let clientUserId: string
let specUserId: string
let gigIds: string[] = []

async function makeGig(prisma: any, clientId: string, specId: string, title: string) {
  const g = await prisma.gig.create({
    data: {
      title,
      description: 'Admin disputes test gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to satisfy validation here.',
      budget: 9000000,
      serviceFee: 900000,
      totalAmount: 9900000,
      status: 'IN_PROGRESS',
      tags: 'React',
      deadlineDays: 14,
      clientId,
      assignedSpecialistId: specId,
    },
  })
  return g.id
}

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  adminEmail = `adis-admin-${stamp}@example.com`
  openTitle = `ADis OPEN ${stamp}`
  resolvedTitle = `ADis RESOLVED ${stamp}`
  rejectedTitle = `ADis REJECTED ${stamp}`

  const client = await prisma.user.create({
    data: { email: `adis-client-${stamp}@example.com`, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Адис', inn: '7700000099' } } },
  })
  const spec = await prisma.user.create({
    data: { email: `adis-spec-${stamp}@example.com`, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Адис Спец', techStack: 'React', experienceLevel: 'SENIOR' } } },
  })
  const admin = await prisma.user.create({ data: { email: adminEmail, password: 'x', role: 'ADMIN' } })
  adminId = admin.id
  clientUserId = client.id
  specUserId = spec.id

  const gOpen = await makeGig(prisma, client.id, spec.id, openTitle)
  const gResolved = await makeGig(prisma, client.id, spec.id, resolvedTitle)
  const gRejected = await makeGig(prisma, client.id, spec.id, rejectedTitle)
  gigIds = [gOpen, gResolved, gRejected]

  await prisma.dispute.create({ data: { gigId: gOpen, openerId: client.id, openerRole: 'company', reason: 'Оплата не поступила', status: 'OPEN' } })
  await prisma.dispute.create({ data: { gigId: gResolved, openerId: client.id, openerRole: 'company', reason: 'Результат не соответствует ТЗ', status: 'RESOLVED', resolution: 'В пользу заказчика.', resolvedById: admin.id } })
  await prisma.dispute.create({ data: { gigId: gRejected, openerId: client.id, openerRole: 'company', reason: 'Просрочен срок выполнения', status: 'REJECTED', resolution: 'Отклонён — нарушения не подтверждены.', resolvedById: admin.id } })

  await prisma.$disconnect()
})

// Scoped, FK-safe cleanup: remove this spec's disputes (then gigs, profiles, users) so its Dispute rows can't break
// later specs' unscoped `gig.deleteMany()` (e.g. admin-pagination) in a shared-db run.
test.afterAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  await prisma.dispute.deleteMany({ where: { gigId: { in: gigIds } } })
  await prisma.gig.deleteMany({ where: { id: { in: gigIds } } })
  await prisma.specialistProfile.deleteMany({ where: { userId: { in: [specUserId] } } })
  await prisma.clientProfile.deleteMany({ where: { userId: { in: [clientUserId] } } })
  await prisma.user.deleteMany({ where: { id: { in: [clientUserId, specUserId, adminId] } } })
  await prisma.$disconnect()
})

test.describe('admin-disputes — dedicated «Споры» screen', () => {
  const rowByTitle = (page: any, title: string) => page.locator('[data-row="dispute"]').filter({ hasText: title })

  test('the «Споры» nav item opens /admin/disputes and is active there', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin')
    await page.getByRole('navigation').getByRole('link', { name: 'Споры' }).click()
    await page.waitForURL('**/admin/disputes')
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Споры' })).toHaveAttribute('aria-current', 'page')
  })

  test('lists disputes of every status (open + resolved + rejected)', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin/disputes')

    await expect(rowByTitle(page, openTitle)).toBeVisible()
    await expect(rowByTitle(page, resolvedTitle)).toBeVisible()
    await expect(rowByTitle(page, rejectedTitle)).toBeVisible()

    // each row shows the dispute-specific status label
    await expect(rowByTitle(page, openTitle).getByText('Открыт', { exact: true })).toBeVisible()
    await expect(rowByTitle(page, resolvedTitle).getByText('Решён', { exact: true })).toBeVisible()
    await expect(rowByTitle(page, rejectedTitle).getByText('Отклонён', { exact: true })).toBeVisible()
  })

  test('the status filter narrows the list (RESOLVED hides OPEN)', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin/disputes')

    await page.getByRole('combobox', { name: 'Фильтр по статусу' }).selectOption('RESOLVED')
    await page.waitForURL(/status=RESOLVED/)

    await expect(rowByTitle(page, resolvedTitle)).toBeVisible()
    await expect(rowByTitle(page, openTitle)).toHaveCount(0)
    await expect(rowByTitle(page, rejectedTitle)).toHaveCount(0)
  })

  test('opening a dispute keeps the ADMIN shell and «Назад» returns to the list', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin/disputes')
    await rowByTitle(page, openTitle).click()
    await page.waitForURL(/\/disputes\/.+from=/)

    // ADMIN shell (not the CLIENT/«Компания» one): the admin nav «Модерация» is present, the company-only «Финансы» is not
    await expect(page.getByRole('link', { name: 'Модерация' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Финансы' })).toHaveCount(0)

    // back link honours the entry point → /admin/disputes (not /admin)
    await page.getByText('Назад к спорам').click()
    await page.waitForURL('**/admin/disputes')
  })
})
