import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * reconcile-disputes-flow (Phase 3) — verifies the reconciled dispute UI: the dedicated «Открыть спор» screen is
 * participant-gated; the detail renders the timeline + evidence; and the admin resolve UI applies a verdict
 * (→ RESOLVED + the resolution carries «В пользу …» + a moderator timeline entry). Seeds directly into the E2E db.
 */
let clientId: string
let clientEmail: string
let specId: string
let adminId: string
let adminEmail: string
let outsiderId: string
let outsiderEmail: string
let gigOpenId: string
let disputeId: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const s = Date.now()
  clientEmail = `rdf-client-${s}@example.com`
  adminEmail = `rdf-admin-${s}@example.com`
  outsiderEmail = `rdf-out-${s}@example.com`

  const client = await prisma.user.create({
    data: { email: clientEmail, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Спор', inn: '7700000060' } } },
  })
  clientId = client.id
  const spec = await prisma.user.create({
    data: { email: `rdf-spec-${s}@example.com`, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Иван Петров', techStack: 'React', experienceLevel: 'SENIOR' } } },
  })
  specId = spec.id
  const admin = await prisma.user.create({ data: { email: adminEmail, password: 'x', role: 'ADMIN' } })
  adminId = admin.id
  const outsider = await prisma.user.create({
    data: { email: outsiderEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Чужой', techStack: 'Go', experienceLevel: 'SENIOR' } } },
  })
  outsiderId = outsider.id

  const base = {
    description: 'Dispute-flow test gig with a reasonably detailed description for the body.',
    acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига при создании.',
    budget: 15000000, serviceFee: 1500000, totalAmount: 16500000, tags: 'React', deadlineDays: 14,
    status: 'IN_PROGRESS', clientId: client.id, assignedSpecialistId: spec.id,
  }
  gigOpenId = (await prisma.gig.create({ data: { ...base, title: 'RDF Open Gig' } })).id

  const gigDispute = await prisma.gig.create({ data: { ...base, title: 'RDF Dispute Gig' } })
  const dispute = await prisma.dispute.create({
    data: {
      gigId: gigDispute.id,
      openerId: client.id,
      openerRole: 'company',
      amount: gigDispute.budget,
      reason: 'Результат не соответствует ТЗ',
      evidence: 'ТЗ.pdf,переписка.png',
      timeline: { create: { authorRole: 'company', authorName: 'ООО Спор', text: 'Объём работ вырос относительно исходной задачи.' } },
    },
  })
  disputeId = dispute.id

  await prisma.$disconnect()
})

test.describe('reconcile-disputes-flow — dispute UI', () => {
  test('the «Открыть спор» screen is participant-gated', async ({ page }) => {
    // A participant reaches the form.
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto(`/disputes/new?gig=${gigOpenId}`)
    // «Открыть спор» is both the header and the submit button → assert the subtitle + a reason option instead.
    await expect(page.getByText('по проекту «RDF Open Gig»')).toBeVisible()
    await expect(page.getByText('Результат не соответствует ТЗ')).toBeVisible() // a reason option (CheckField)

    // A non-participant is redirected to the disputes list.
    await setE2ESession(page, { id: outsiderId, email: outsiderEmail, role: 'SPECIALIST' })
    await page.goto(`/disputes/new?gig=${gigOpenId}`)
    await expect(page).toHaveURL(/\/disputes$/)
  })

  test('the detail renders the timeline + evidence', async ({ page }) => {
    await setE2ESession(page, { id: clientId, email: clientEmail, role: 'CLIENT' })
    await page.goto(`/disputes/${disputeId}`)

    await expect(page.getByText('Заморожено')).toBeVisible()
    await expect(page.getByText('Доказательства')).toBeVisible()
    await expect(page.getByText('ТЗ.pdf')).toBeVisible()
    await expect(page.getByText('Хронология')).toBeVisible()
    await expect(page.getByText('Объём работ вырос относительно исходной задачи.')).toBeVisible()
  })

  test('an admin resolves with a verdict → RESOLVED + the resolution carries «В пользу …» + a moderator entry', async ({ page }) => {
    await setE2ESession(page, { id: adminId, email: adminEmail, role: 'ADMIN' })
    await page.goto(`/disputes/${disputeId}`)

    // Pick the verdict «В пользу специалиста» (CheckField), add a note, resolve.
    await page.getByText('В пользу специалиста').click()
    await page.locator('textarea[name="resolution"]').fill('Бюджет возвращён специалисту.')
    await page.getByRole('button', { name: 'Разрешить спор' }).click()
    await page.waitForURL('**/gigs/**')

    await page.goto(`/disputes/${disputeId}`)
    await expect(page.getByText('Завершён')).toBeVisible() // RESOLVED → completed
    await expect(page.getByText(/В пользу специалиста — Бюджет возвращён специалисту\./).first()).toBeVisible()
    void specId
  })
})
