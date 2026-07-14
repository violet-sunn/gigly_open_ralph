import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * gig-editing-with-notification — the owner «Редактировать» control on /gigs/[id], the owner-only edit screen
 * (/gigs/[id]/edit reusing the create guided-brief form, pre-filled), and the applicant notification fan-out on a
 * material change. A client edits an OPEN gig that has a PENDING applicant: the form is pre-filled, saving fixes the
 * field and recomputes the fee, and the applicant receives a «Условия гига обновлены» notification. A non-owner cannot
 * reach the edit route, and the control disappears once the gig is IN_PROGRESS. Seeds directly into the E2E db.
 */
function db() {
  return new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
}

let ownerId: string
let ownerEmail: string
let applicantId: string
let applicantEmail: string
let strangerId: string // a specialist who is NOT an applicant / owner
let strangerEmail: string
let editGigId: string // OPEN, has a PENDING applicant — the edit target
let inProgressGigId: string // owner-owned but IN_PROGRESS — no edit control

test.beforeAll(async () => {
  const prisma = db()
  const s = Date.now()
  ownerEmail = `ge-owner-${s}@example.com`
  applicantEmail = `ge-applicant-${s}@example.com`
  strangerEmail = `ge-stranger-${s}@example.com`

  // The gig category FKs to a Category row — ensure it exists so the pre-filled edit form is submittable.
  await prisma.category.upsert({
    where: { slug: 'programming' },
    create: { slug: 'programming', name: 'Программирование', order: 2, color: 'green' },
    update: {},
  })

  const owner = await prisma.user.create({
    data: { email: ownerEmail, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Заказчик', inn: '7700000000' } } },
  })
  ownerId = owner.id
  const applicant = await prisma.user.create({
    data: { email: applicantEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Аппликант Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  applicantId = applicant.id
  const stranger = await prisma.user.create({
    data: { email: strangerEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Чужой Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  strangerId = stranger.id

  const editGig = await prisma.gig.create({
    data: {
      title: 'Гиг для редактирования',
      description: 'Описание гига с достаточной длиной для формы брифа.',
      acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига.',
      goal: 'Цель гига',
      deliverables: 'Старые результаты с опечаткой',
      constraints: 'Ограничение',
      budget: 20000000, // 200 000 ₽
      serviceFee: 2000000,
      totalAmount: 22000000,
      status: 'OPEN',
      tags: 'React,TypeScript',
      deadlineDays: 14,
      stageCount: 1,
      categorySlug: 'programming',
      clientId: owner.id,
    },
  })
  editGigId = editGig.id

  // A PENDING applicant on the edit gig → must be notified on a material change.
  await prisma.application.create({
    data: {
      gigId: editGig.id,
      specialistId: applicant.id,
      approach: 'Подробный подход к задаче длиной более ста символов, описывающий методологию и этапы реализации проекта.',
      questions: 'Какие сроки и приоритеты по задаче, и есть ли доступ к API заранее?',
      estimatedEffort: '2 недели',
      status: 'PENDING',
    },
  })

  const inProgressGig = await prisma.gig.create({
    data: {
      title: 'Гиг в работе',
      description: 'Описание гига в работе с достаточной длиной.',
      acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига.',
      budget: 15000000,
      serviceFee: 1500000,
      totalAmount: 16500000,
      status: 'IN_PROGRESS',
      tags: 'React',
      deadlineDays: 10,
      categorySlug: 'programming',
      clientId: owner.id,
      assignedSpecialistId: applicant.id,
    },
  })
  inProgressGigId = inProgressGig.id

  await prisma.$disconnect()
})

test.describe('Gig editing with applicant notification', () => {
  test('owner edits an OPEN gig → form pre-filled → save fixes field, recomputes fee, notifies applicant', async ({ page }) => {
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${editGigId}`)

    // The owner sees an obvious «Редактировать» control → go to the edit screen.
    const editBtn = page.getByRole('button', { name: /Редактировать/ })
    await expect(editBtn).toBeVisible()
    await editBtn.click()
    await page.waitForURL(`**/gigs/${editGigId}/edit`)

    // The form is pre-filled with the gig's current values.
    await expect(page.locator('input[name="title"]')).toHaveValue('Гиг для редактирования')
    await expect(page.locator('textarea[name="deliverables"]')).toHaveValue('Старые результаты с опечаткой')
    await expect(page.locator('input[name="budget"]')).toHaveValue('200000')

    // Fix the deliverables typo + change the budget (material change).
    await page.locator('textarea[name="deliverables"]').fill('Исправленные результаты — PR в репозиторий')
    await page.locator('input[name="budget"]').fill('250000')

    const save = page.getByRole('button', { name: 'Сохранить изменения' })
    await expect(save).toBeEnabled()
    await save.click()

    // Back on the gig detail; the corrected field renders.
    await page.waitForURL(`**/gigs/${editGigId}`)
    await expect(page.getByText('Исправленные результаты — PR в репозиторий')).toBeVisible()

    // The gig terms were persisted (budget recomputed) and the PENDING applicant was notified.
    const prisma = db()
    const gig = await prisma.gig.findUnique({ where: { id: editGigId } })
    expect(gig!.budget).toBe(25000000)
    expect(gig!.serviceFee).toBe(2500000)
    expect(gig!.deliverables).toBe('Исправленные результаты — PR в репозиторий')

    const notif = await prisma.notification.findFirst({
      where: { userId: applicantId, gigId: editGigId, eventType: 'gig_updated' },
    })
    expect(notif).not.toBeNull()
    expect(notif!.type).toBe('STATUS_CHANGE')
    await prisma.$disconnect()
  })

  test('a non-owner sees no Edit control and cannot reach the edit route (bounced to the gig detail)', async ({ page }) => {
    await setE2ESession(page, { id: strangerId, email: strangerEmail, role: 'SPECIALIST' })

    // A non-owner (specialist) viewing the gig detail sees no «Редактировать» control at all.
    await page.goto(`/gigs/${editGigId}`)
    await expect(page.getByRole('button', { name: /Редактировать/ })).toHaveCount(0)

    // And the route itself is server-guarded, not just the button.
    await page.goto(`/gigs/${editGigId}/edit`)
    // Server-guarded: redirected back to the gig detail, no editable form.
    await page.waitForURL(`**/gigs/${editGigId}`)
    await expect(page.locator('input[name="budget"]')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Сохранить изменения' })).toHaveCount(0)
  })

  test('the «Редактировать» control is absent once the gig is IN_PROGRESS', async ({ page }) => {
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${inProgressGigId}`)
    await expect(page.getByRole('button', { name: /Редактировать/ })).toHaveCount(0)
  })
})
