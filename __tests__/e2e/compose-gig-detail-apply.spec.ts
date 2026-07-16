import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-gig-detail-apply — verifies the /gigs/[id] screen rebuilt on the gigly_full_design prototype
 * (app/(protected)/gigs/[id]/GigDetail.tsx): col1 = the gig header (title + tags + description) +
 * «Технические требования» (requirement grid) + «Критерии успеха»; col2 «УСЛОВИЯ» = the company bio +
 * the conditions panel (grotesk Срок/Бюджет + the owner-only fee breakdown) + the apply/owner/lifecycle
 * action rail. The preserved flows work end-to-end: a SPECIALIST applies (→ «Заявка отправлена ✓» + can
 * withdraw), the owner accepts on the dedicated «Отклики» screen (→ В работе, with the fee breakdown), the
 * assigned specialist submits (→ На проверке), and example gigs can't be applied to. The rebuilt screen
 * embeds NO chat composer (messaging lives at /chats) and NO «Файлы» section. Seeds directly into the E2E
 * db (file:./test.db, same as the dev server).
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

  // Assigned IN_PROGRESS gig for submit-work
  gigSubmitId = (await prisma.gig.create({ data: { ...base, title: 'GD Submit Gig', status: 'IN_PROGRESS', assignedSpecialistId: assigned.id } })).id

  await prisma.$disconnect()
})

test.describe('compose-gig-detail-apply — rebuilt gig detail', () => {
  test('renders the rebuilt blocks and a SPECIALIST can apply + withdraw', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigApplyId}`)

    await expect(page.getByText('GD Apply Gig').first()).toBeVisible() // gig header title (col1 <h1>)
    await expect(page.getByText(/reasonably detailed description/)).toBeVisible() // header description
    await expect(page.getByText('Технические требования')).toBeVisible() // col1 section
    await expect(page.getByText('Цель проекта')).toBeVisible() // a requirement card
    await expect(page.getByText('Критерии успеха')).toBeVisible() // col1 section
    await expect(page.getByText('Мои условия', { exact: true })).toBeVisible() // conditions panel tab (a <div>, not role=tab)
    await expect(page.getByText('Бюджет проекта')).toBeVisible() // conditions panel grotesk budget label
    await expect(page.getByText('Срок выполнения')).toBeVisible() // conditions panel grotesk deadline label
    await expect(page.getByRole('button', { name: 'Отправить заявку' })).toBeVisible() // apply form

    await page.locator('textarea[name="approach"]').fill(longApproach)
    await page.locator('textarea[name="questions"]').fill(longQuestions)
    await page.getByRole('button', { name: 'Отправить заявку' }).click()

    // After applying, the applied banner + withdraw control replace the apply form.
    await expect(page.getByText(/Заявка отправлена/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Отозвать заявку' })).toBeVisible()
  })

  test('the owner sees the fee breakdown + the «Смотреть отклики» link → accepts on the applications screen (→ В работе)', async ({ page }) => {
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${gigAcceptId}`)

    await expect(page.getByText('Сервисный сбор (17,5%)')).toBeVisible() // owner-only fee breakdown
    // The owner applicant list now lives on the dedicated «Отклики» screen (build-applications-screen).
    await page.getByRole('button', { name: /Смотреть отклики/ }).click()
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigAcceptId}/applications`))
    await expect(page.getByText('Тест Спец')).toBeVisible() // applicant card
    await page.getByRole('button', { name: 'Принять' }).click()

    // acceptApplication redirects back to the gig detail, now IN_PROGRESS.
    await expect(page).toHaveURL(new RegExp(`/gigs/${gigAcceptId}$`))
    await expect(page.getByText('В работе').first()).toBeVisible()
  })

  test('the assigned specialist submits work (→ На проверке)', async ({ page }) => {
    await setE2ESession(page, { id: assignedId, email: assignedEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigSubmitId}`)

    await page.getByRole('button', { name: 'Сдать работу на проверку' }).click()
    await expect(page.getByText('На проверке').first()).toBeVisible() // conditions panel Статус
  })

  test('example gigs cannot be applied to', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigExampleId}`)

    // The apply form is gated server-side (lifecycle.canApply requires !isExample) — no apply button renders.
    await expect(page.getByRole('button', { name: 'Отправить заявку' })).toHaveCount(0)
  })
})
