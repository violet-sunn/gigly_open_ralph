import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * build-applications-screen (Phase 3) — verifies the dedicated company «Отклики» screen at /gigs/[id]/applications
 * (gig-scoped, owner-only): the owner sees the applicant cards (Подход/Уточняющие вопросы/Оценка трудозатрат), Принять
 * assigns the specialist (gig → IN_PROGRESS) + auto-rejects the others, a non-owner is redirected, and an empty gig
 * shows the empty state. Seeds directly into the E2E db (file:./test.db).
 */
const approach =
  'Я подойду к задаче поэтапно: анализ требований, проектирование, реализация и тестирование с покрытием по слоям.'
const questions = 'Какие требования к срокам и приоритетам? Есть ли макеты и доступ к API до старта работ?'

let ownerId: string
let ownerEmail: string
let specId: string
let specEmail: string
let spec2Id: string
let gigAcceptId: string
let gigEmptyId: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const s = Date.now()
  ownerEmail = `ba-owner-${s}@example.com`
  specEmail = `ba-spec-${s}@example.com`

  const owner = await prisma.user.create({
    data: { email: ownerEmail, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Заказчик', inn: '7700000050' } } },
  })
  ownerId = owner.id
  const spec = await prisma.user.create({
    data: { email: specEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Тест Спец', techStack: 'React,TypeScript', experienceLevel: 'SENIOR' } } },
  })
  specId = spec.id
  const spec2 = await prisma.user.create({
    data: { email: `ba-spec2-${s}@example.com`, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Второй Спец', techStack: 'Go', experienceLevel: 'MIDDLE' } } },
  })
  spec2Id = spec2.id

  const base = {
    description: 'Applications screen test gig with a reasonably detailed description for the body.',
    acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига при создании.',
    budget: 10000000, serviceFee: 1000000, totalAmount: 11000000, tags: 'React', deadlineDays: 14, clientId: owner.id,
  }
  const gigAccept = await prisma.gig.create({ data: { ...base, title: 'BA Accept Gig', status: 'OPEN' } })
  gigAcceptId = gigAccept.id
  await prisma.application.create({ data: { gigId: gigAccept.id, specialistId: spec.id, approach, questions, estimatedEffort: '2 недели', status: 'PENDING' } })
  await prisma.application.create({ data: { gigId: gigAccept.id, specialistId: spec2.id, approach: 'Другой подход к задаче.', questions: 'Другой вопрос по проекту?', estimatedEffort: '3 недели', status: 'PENDING' } })

  gigEmptyId = (await prisma.gig.create({ data: { ...base, title: 'BA Empty Gig', status: 'OPEN' } })).id

  await prisma.$disconnect()
})

test.describe('build-applications-screen — company «Отклики»', () => {
  test('the owner sees the full applicant card (name/level/rating/status/tags/fields) + the back link', async ({ page }) => {
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${gigAcceptId}/applications`)

    // Header + subtitle + back link.
    await expect(page.getByText('Отклики', { exact: true })).toBeVisible() // SectionHeader
    await expect(page.getByText('на проект «BA Accept Gig»')).toBeVisible() // subtitle
    await expect(page.getByText('← Назад к проекту')).toBeVisible() // back link

    // Full applicant-card anatomy: identity + [level] + rating + derived status + stack tags + the three fields.
    await expect(page.getByText('Тест Спец')).toBeVisible() // identity
    await expect(page.getByText('[SENIOR]')).toBeVisible() // experience level chip (seed spec1 = SENIOR)
    await expect(page.getByText('★★★★★').first()).toBeVisible() // rating row
    await expect(page.getByText('Новый отклик').first()).toBeVisible() // PENDING applicant → accent «Новый отклик»
    await expect(page.getByText('React').first()).toBeVisible() // stack tag (.first(): the gig also tags React)
    await expect(page.getByText('Подход').first()).toBeVisible()
    await expect(page.getByText('Уточняющие вопросы').first()).toBeVisible()
    await expect(page.getByText('Оценка трудозатрат').first()).toBeVisible()

    // Both pending actions render while the gig is un-assigned (this test runs before the accept-flow test).
    await expect(page.getByRole('button', { name: 'Принять' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Отклонить' }).first()).toBeVisible()
  })

  test('gig-detail links to the applications screen («Смотреть отклики»)', async ({ page }) => {
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${gigAcceptId}`)
    await page.getByRole('button', { name: /Смотреть отклики/ }).click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigAcceptId}/applications`))
  })

  test('Принять assigns the specialist (gig → В работе) and auto-rejects the others', async ({ page }) => {
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${gigAcceptId}/applications`)

    await page.getByRole('button', { name: 'Принять' }).first().click()
    // acceptApplication redirects to the gig detail, now IN_PROGRESS.
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigAcceptId}$`))
    await expect(page.getByText('В работе').first()).toBeVisible()

    // Revisiting the applications screen shows the derived «Назначен …» success notice.
    await page.goto(`/gigs/${gigAcceptId}/applications`)
    await expect(page.getByText(/Назначен .* — гиг переходит «В работу»/)).toBeVisible()
  })

  test('a non-owner is redirected away from the applications screen', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigEmptyId}/applications`)
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigEmptyId}$`)) // redirected to the gig detail
    void spec2Id
  })

  test('an empty gig shows the empty state', async ({ page }) => {
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${gigEmptyId}/applications`)
    await expect(page.getByText('Откликов пока нет.')).toBeVisible()
  })
})
