import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * terms-negotiation — the «Мои условия» counter-terms flow on the rebuilt /gigs/[id] (GigDetail.tsx) and the
 * owner applicants screen (applications/ApplicationsDesign.tsx). A specialist proposes their own budget/срок in the
 * apply form; the «Мои условия» tab then differs from «Условия {компания}»; the client sees the counter on the
 * applicants list; accepting adopts it into the gig's effective terms. Also: a specialist who proposes nothing sees a
 * no-counter note, and a CLIENT owner sees no 2nd tab. Seeds directly into the E2E db (file:./test.db).
 */
const longApproach =
  'Я подойду к задаче поэтапно: анализ требований, проектирование архитектуры, реализация и тестирование с покрытием. ' +
  'Использую React, TypeScript и проверенные паттерны, обеспечу адаптивную вёрстку и производительность по Lighthouse.'
const longQuestions = 'Какие требования к срокам и приоритетам? Есть ли дизайн-макеты и доступ к API заранее, до старта?'

let ownerId: string
let ownerEmail: string
let specId: string
let specEmail: string
let noCounterSpecId: string
let noCounterSpecEmail: string
let lifecycleSpecId: string
let lifecycleSpecEmail: string
let gigId: string // the counter-flow gig (spec proposes here)
let plainGigId: string // separate gig for the no-counter note
let lifecycleGigId: string // fresh OPEN gig for the withdraw → re-apply lifecycle test

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const s = Date.now()
  ownerEmail = `tn-owner-${s}@example.com`
  specEmail = `tn-spec-${s}@example.com`
  noCounterSpecEmail = `tn-plain-${s}@example.com`
  lifecycleSpecEmail = `tn-life-${s}@example.com`

  const owner = await prisma.user.create({
    data: { email: ownerEmail, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Заказчик', inn: '7700000000' } } },
  })
  ownerId = owner.id
  const spec = await prisma.user.create({
    data: { email: specEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Тест Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  specId = spec.id
  const plainSpec = await prisma.user.create({
    data: { email: noCounterSpecEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Плейн Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  noCounterSpecId = plainSpec.id
  const lifecycleSpec = await prisma.user.create({
    data: { email: lifecycleSpecEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Лайф Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  lifecycleSpecId = lifecycleSpec.id

  const gigData = (title: string) => ({
    title,
    description: 'Terms negotiation gig with a reasonably detailed description for the flow.',
    acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига.',
    budget: 20000000, // 200 000 ₽
    serviceFee: 2000000,
    totalAmount: 22000000,
    status: 'OPEN',
    tags: 'React,TypeScript',
    deadlineDays: 14,
    clientId: owner.id,
  })
  const gig = await prisma.gig.create({ data: gigData('TN Counter Gig') })
  gigId = gig.id
  const plainGig = await prisma.gig.create({ data: gigData('TN Plain Gig') })
  plainGigId = plainGig.id
  const lifecycleGig = await prisma.gig.create({ data: gigData('TN Lifecycle Gig') })
  lifecycleGigId = lifecycleGig.id

  // The no-counter specialist already applied WITHOUT proposing terms → «Мои условия» shows the note.
  await prisma.application.create({
    data: { gigId: plainGig.id, specialistId: plainSpec.id, approach: longApproach, questions: longQuestions, estimatedEffort: '2 недели', status: 'PENDING' },
  })
  await prisma.$disconnect()
})

test.describe('Terms Negotiation — «Мои условия» on /gigs/[id]', () => {
  test('specialist proposes a counter → tabs differ → client sees it → accept adopts it', async ({ page }) => {
    // ── Specialist proposes a counter via the apply form ──
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigId}`)

    await page.locator('textarea[name="approach"]').fill(longApproach)
    await page.locator('textarea[name="questions"]').fill(longQuestions)
    await page.locator('input[name="proposedBudget"]').fill('150000')
    await page.locator('input[name="proposedDeadlineDays"]').fill('21')
    const submit = page.getByRole('button', { name: 'Отправить заявку' })
    await expect(submit).toBeEnabled()
    await submit.click()

    // Applied state; the terms tabs now diverge.
    await expect(page.getByText(/Заявка отправлена/)).toBeVisible()
    await page.getByText('Мои условия', { exact: true }).click()
    await expect(page.getByText('21 дней')).toBeVisible() // proposed срок
    await page.getByText(/^Условия/).click() // «Условия {компания}»
    await expect(page.getByText('14 дней')).toBeVisible() // gig срок — toggle visibly swaps

    // ── Client sees the counter on the applicants screen ──
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${gigId}/applications`)
    await expect(page.getByText('Предложил свои условия')).toBeVisible()
    await expect(page.getByText('21 дней')).toBeVisible()
    await expect(page.getByText(/150.?000/)).toBeVisible() // 150 000 ₽ (nbsp group separator)

    // ── Accept adopts the counter into the gig's effective terms ──
    // acceptApplication redirects to /gigs/{id}; wait for that navigation so the accept has committed.
    await page.getByRole('button', { name: 'Принять' }).click()
    await page.waitForURL(`**/gigs/${gigId}`)
    // Owner view: single terms panel showing the adopted terms.
    await expect(page.getByText('21 дней')).toBeVisible()
    await expect(page.getByText(/150.?000/)).toBeVisible()
    await expect(page.getByText('14 дней')).toHaveCount(0) // old срок no longer the gig's terms
  })

  test('a CLIENT owner sees no «Мои условия» tab', async ({ page }) => {
    await setE2ESession(page, { id: ownerId, email: ownerEmail, role: 'CLIENT' })
    await page.goto(`/gigs/${plainGigId}`)
    await expect(page.getByText('Мои условия', { exact: true })).toHaveCount(0)
  })

  test('a specialist who proposed nothing sees a no-counter note on «Мои условия»', async ({ page }) => {
    await setE2ESession(page, { id: noCounterSpecId, email: noCounterSpecEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${plainGigId}`)
    await page.getByText('Мои условия', { exact: true }).click()
    await expect(page.getByText(/Вы не предложили свои условия/)).toBeVisible()
  })

  test('withdraw → re-apply with different terms updates the counter (lifecycle)', async ({ page }) => {
    await setE2ESession(page, { id: lifecycleSpecId, email: lifecycleSpecEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${lifecycleGigId}`)

    // First apply with a counter of 11 дней.
    await page.locator('textarea[name="approach"]').fill(longApproach)
    await page.locator('textarea[name="questions"]').fill(longQuestions)
    await page.locator('input[name="proposedBudget"]').fill('111000')
    await page.locator('input[name="proposedDeadlineDays"]').fill('11')
    await page.getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(page.getByText(/Заявка отправлена/)).toBeVisible()
    await page.getByText('Мои условия', { exact: true }).click()
    await expect(page.getByText('11 дней')).toBeVisible()

    // Withdraw (first, reversible) → the apply form returns.
    await page.getByRole('button', { name: 'Отозвать заявку' }).click()
    await expect(page.getByRole('button', { name: 'Отправить заявку' })).toBeVisible()
    // The re-apply form is PRE-FILLED with the preserved counter (so «Мои условия» and the form agree).
    await expect(page.locator('input[name="proposedBudget"]')).toHaveValue('111000')
    await expect(page.locator('input[name="proposedDeadlineDays"]')).toHaveValue('11')

    // Re-apply with DIFFERENT terms (22 дней) → «Мои условия» reflects the new counter, not the stale one.
    await page.locator('textarea[name="approach"]').fill(longApproach)
    await page.locator('textarea[name="questions"]').fill(longQuestions)
    await page.locator('input[name="proposedBudget"]').fill('222000')
    await page.locator('input[name="proposedDeadlineDays"]').fill('22')
    await page.getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(page.getByText(/Заявка отправлена/)).toBeVisible()
    await page.getByText('Мои условия', { exact: true }).click()
    await expect(page.getByText('22 дней')).toBeVisible()
    await expect(page.getByText('11 дней')).toHaveCount(0) // stale counter cleared
  })
})
