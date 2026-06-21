import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * reconcile-finances-and-admin (Phase 3) — verifies the admin dashboard's two re-grounded sections: the «Споры на
 * модерации» dispute queue (an OPEN dispute, linking to /disputes/[id]) and the «Журнал модерации» moderation log.
 * Seeds an admin + an open dispute + a log entry directly into the E2E db.
 */
let adminId: string
let adminEmail: string
let disputeId: string
let gigTitle: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const s = Date.now()
  adminEmail = `cad-admin-${s}@example.com`
  gigTitle = `CAD Dispute Gig ${s}`

  const admin = await prisma.user.create({ data: { email: adminEmail, password: 'x', role: 'ADMIN' } })
  adminId = admin.id
  const client = await prisma.user.create({
    data: { email: `cad-client-${s}@example.com`, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Админ', inn: '7700000099' } } },
  })
  const spec = await prisma.user.create({
    data: { email: `cad-spec-${s}@example.com`, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Спец', techStack: 'React', experienceLevel: 'SENIOR' } } },
  })

  const gig = await prisma.gig.create({
    data: {
      title: gigTitle,
      description: 'Admin dashboard test gig with a reasonably detailed description for the body.',
      acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига при создании.',
      budget: 10000000, serviceFee: 1000000, totalAmount: 11000000, tags: 'React', deadlineDays: 14,
      status: 'IN_PROGRESS', clientId: client.id, assignedSpecialistId: spec.id,
    },
  })
  const dispute = await prisma.dispute.create({
    data: { gigId: gig.id, openerId: client.id, openerRole: 'company', reason: 'Результат не соответствует ТЗ', status: 'OPEN' },
  })
  disputeId = dispute.id
  await prisma.moderationLog.create({ data: { action: 'CLOSE_GIG', reason: 'нарушение', adminId: admin.id, targetGigId: gig.id } })

  await prisma.$disconnect()
})

test.describe('reconcile-finances-and-admin — admin console', () => {
  test('the dashboard shows the dispute queue + moderation log', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin')

    await expect(page.getByText('Споры на модерации')).toBeVisible()
    await expect(page.getByText(gigTitle)).toBeVisible() // the OPEN dispute row
    await expect(page.getByText('Журнал модерации')).toBeVisible()
    await expect(page.getByText('Закрыт гиг')).toBeVisible() // the log row action label
  })

  test('the dispute queue links to the dispute', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto('/admin')

    await page.getByText(gigTitle).click()
    await expect(page).toHaveURL(new RegExp(`/disputes/${disputeId}`))
  })
})
