import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-gig-detail-apply (Phase 2) — verifies the /gigs/[id] screen is composed from the kit (GigHeader +
 * RequirementCard·grid + CriteriaList + ClientCard + TermsTabs + ApplyPanel + ChatPanel) and that the preserved flows
 * work end-to-end: a SPECIALIST applies, the owner accepts (→ IN_PROGRESS), the assigned specialist submits
 * (→ REVIEW), messaging works once assigned, and example gigs can't be applied to. Seeds directly into the E2E db
 * (file:./test.db, same as the dev server).
 */
const longApproach =
  'Я подойду к задаче поэтапно: анализ требований, проектирование архитектуры, реализация и тестирование с покрытием. ' +
  'Использую React, TypeScript и проверенные паттерны, обеспечу адаптивную вёрстку и производительность по Lighthouse.'
const longQuestions = 'Какие требования к срокам и приоритетам? Есть ли дизайн-макеты и доступ к API заранее, до старта?'

let ownerId: string
let ownerEmail: string
let specId: string
let specEmail: string
let assignedId: string
let assignedEmail: string
let gigApplyId: string
let gigAcceptId: string
let gigSubmitId: string
let gigMsgId: string
let gigExampleId: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const s = Date.now()
  ownerEmail = `gd-owner-${s}@example.com`
  specEmail = `gd-spec-${s}@example.com`
  assignedEmail = `gd-assigned-${s}@example.com`

  const owner = await prisma.user.create({
    data: { email: ownerEmail, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Заказчик', inn: '7700000000' } } },
  })
  ownerId = owner.id
  const spec = await prisma.user.create({
    data: { email: specEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Тест Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  specId = spec.id
  const assigned = await prisma.user.create({
    data: { email: assignedEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Назн Спец', techStack: 'Go', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  assignedId = assigned.id

  const base = {
    description: 'Gig detail composition test gig with a reasonably detailed description.',
    acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига.',
    goal: 'Цель проекта',
    deliverables: 'Конкретные результаты',
    constraints: 'Технические ограничения',
    budget: 10000000,
    serviceFee: 1000000,
    totalAmount: 11000000,
    tags: 'React,TypeScript',
    deadlineDays: 14,
    clientId: owner.id,
  }
  gigApplyId = (await prisma.gig.create({ data: { ...base, title: 'GD Apply Gig', status: 'OPEN' } })).id
  gigExampleId = (await prisma.gig.create({ data: { ...base, title: 'GD Example Gig', status: 'OPEN', isExample: true } })).id

  // Pending application for the owner-accept test
  const gigAccept = await prisma.gig.create({ data: { ...base, title: 'GD Accept Gig', status: 'OPEN' } })
  gigAcceptId = gigAccept.id
  await prisma.application.create({
    data: { gigId: gigAccept.id, specialistId: spec.id, approach: longApproach, questions: longQuestions, estimatedEffort: '2 недели', status: 'PENDING' },
  })

  // Assigned IN_PROGRESS gigs for submit-work + messaging
  gigSubmitId = (await prisma.gig.create({ data: { ...base, title: 'GD Submit Gig', status: 'IN_PROGRESS', assignedSpecialistId: assigned.id } })).id
  gigMsgId = (await prisma.gig.create({ data: { ...base, title: 'GD Msg Gig', status: 'IN_PROGRESS', assignedSpecialistId: assigned.id } })).id

  await prisma.$disconnect()
})

test.describe('compose-gig-detail-apply — composed gig detail', () => {
  test('renders the composed blocks and a SPECIALIST can apply', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigApplyId}`)

    await expect(page.getByText('GD Apply Gig').first()).toBeVisible() // GigHeader (title also in the breadcrumb)
    await expect(page.getByText('Цель проекта')).toBeVisible() // RequirementCard
    await expect(page.getByRole('tab', { name: 'От заказчика' })).toBeVisible() // TermsTabs
    await expect(page.getByRole('button', { name: 'Откликнуться' })).toBeVisible() // ApplyPanel

    await page.locator('textarea[name="approach"]').fill(longApproach)
    await page.locator('textarea[name="questions"]').fill(longQuestions)
    await page.getByRole('button', { name: 'Откликнуться' }).click()

    // After applying, the withdraw control replaces the apply form.
    await expect(page.getByRole('button', { name: 'Отозвать отклик' })).toBeVisible()
  })

  test('the owner sees the application and accepts it (→ В работе)', async ({ page }) => {
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${gigAcceptId}`)

    await expect(page.getByText(/Отклики: 1/)).toBeVisible()
    await expect(page.getByText('Тест Спец')).toBeVisible() // ProfileCard
    await page.getByRole('button', { name: 'Принять' }).click()

    await expect(page.getByText('В работе')).toBeVisible() // GigHeader status after accept
  })

  test('the assigned specialist submits work (→ На проверке)', async ({ page }) => {
    await setE2ESession(page, { id: assignedId, email: assignedEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigSubmitId}`)

    await page.getByRole('button', { name: 'Отправить работу' }).click()
    await expect(page.getByText('На проверке')).toBeVisible()
  })

  test('messaging works once a specialist is assigned', async ({ page }) => {
    await setE2ESession(page, { id: assignedId, email: assignedEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigMsgId}`)

    const box = page.getByRole('textbox', { name: 'Сообщение' })
    await box.fill('Привет, приступаю к работе')
    await box.press('Enter') // submit via the composer form (the Topbar also has an "Отправить" button)
    await expect(page.getByText('Привет, приступаю к работе')).toBeVisible()
  })

  test('example gigs cannot be applied to', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigExampleId}`)

    await expect(page.getByText(/Откликаться на примеры нельзя/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Откликнуться' })).toHaveCount(0)
  })
})
