import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * application-withdrawal — the SPECIALIST withdrawal interaction on the rebuilt /gigs/[id]
 * (app/(protected)/gigs/[id]/GigDetail.tsx). A specialist with a PENDING application sees the
 * «Заявка отправлена ✓» banner + «Отозвать заявку»; withdrawing (withdrawApplication server action)
 * clears that control. Seeds directly into the E2E db (file:./test.db, same as the dev server).
 *
 * The old kit coverage is gone by design: no /register→/login flow, no English kit labels, no dashboard
 * archive tab, and no
 * client-side applicant list on the gig detail — owner-facing applicant state lives on /applications
 * (change #7). This spec covers the specialist-side withdrawal that the rebuilt gig-detail supports.
 */
const longApproach =
  'Я подойду к задаче поэтапно: анализ требований, проектирование архитектуры, реализация и тестирование с покрытием. ' +
  'Использую React, TypeScript и проверенные паттерны, обеспечу адаптивную вёрстку и производительность по Lighthouse.'
const longQuestions = 'Какие требования к срокам и приоритетам? Есть ли дизайн-макеты и доступ к API заранее, до старта?'

let specId: string
let specEmail: string
let gigId: string
// Second scenario: a re-applied specialist (PENDING, free withdrawal already spent) → the next withdrawal is final.
let finalSpecId: string
let finalSpecEmail: string
let finalGigId: string
// Third/fourth scenarios: a fresh specialist with no application — example-gig notice + disabled-submit legibility.
let freshSpecId: string
let freshSpecEmail: string
let exampleGigId: string
let plainGigId: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const s = Date.now()
  specEmail = `wd-spec-${s}@example.com`
  finalSpecEmail = `wd-final-${s}@example.com`

  const owner = await prisma.user.create({
    data: { email: `wd-owner-${s}@example.com`, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Заказчик', inn: '7700000000' } } },
  })
  const spec = await prisma.user.create({
    data: { email: specEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Тест Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  specId = spec.id
  const finalSpec = await prisma.user.create({
    data: { email: finalSpecEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Финал Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  finalSpecId = finalSpec.id

  const gigData = (title: string) => ({
    title,
    description: 'Withdrawal flow test gig with a reasonably detailed description.',
    acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига.',
    budget: 10000000,
    serviceFee: 1000000,
    totalAmount: 11000000,
    status: 'OPEN',
    tags: 'React,TypeScript',
    deadlineDays: 14,
    clientId: owner.id,
  })
  const gig = await prisma.gig.create({ data: gigData('WD Gig') })
  gigId = gig.id
  const finalGig = await prisma.gig.create({ data: gigData('WD Final Gig') })
  finalGigId = finalGig.id

  const freshSpec = await prisma.user.create({
    data: { email: `wd-fresh-${s}@example.com`, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Свежий Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  freshSpecId = freshSpec.id
  freshSpecEmail = freshSpec.email
  const exampleGig = await prisma.gig.create({ data: { ...gigData('WD Example Gig'), isExample: true } })
  exampleGigId = exampleGig.id
  const plainGig = await prisma.gig.create({ data: gigData('WD Plain Gig') })
  plainGigId = plainGig.id

  // The specialist's PENDING application — the precondition for the withdraw control.
  await prisma.application.create({
    data: { gigId: gig.id, specialistId: spec.id, approach: longApproach, questions: longQuestions, estimatedEffort: '2 недели', status: 'PENDING' },
  })
  // The re-applied state: PENDING with the single free withdrawal already used → next withdrawal is FINAL.
  await prisma.application.create({
    data: { gigId: finalGig.id, specialistId: finalSpec.id, approach: longApproach, questions: longQuestions, estimatedEffort: '2 недели', status: 'PENDING', freeWithdrawalUsed: true },
  })
  await prisma.$disconnect()
})

test.describe('Application Withdrawal — rebuilt /gigs/[id]', () => {
  test('a specialist withdraws a PENDING application from the gig detail', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${gigId}`)

    // PENDING state: the applied banner + the withdraw control are shown.
    await expect(page.getByText(/Заявка отправлена/)).toBeVisible()
    const withdraw = page.getByRole('button', { name: 'Отозвать заявку' })
    await expect(withdraw).toBeVisible()

    // Withdraw → the PENDING control is gone (withdrawApplication revalidates the screen). The first
    // withdrawal is reversible, so the apply form returns (no dire dialog).
    await withdraw.click()
    await expect(page.getByRole('button', { name: 'Отозвать заявку' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Отправить заявку' })).toBeVisible()
  })

  test('the second (final) withdrawal is gated by a confirmation dialog and leaves an «Отозвано» marker', async ({ page }) => {
    await setE2ESession(page, { id: finalSpecId, email: finalSpecEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${finalGigId}`)

    // PENDING with the free withdrawal spent → the withdraw control warns the next отзыв is final.
    await expect(page.getByText(/Заявка отправлена/)).toBeVisible()
    await expect(page.getByText(/второй отзыв.*окончательным/)).toBeVisible()
    const withdraw = page.getByRole('button', { name: 'Отозвать заявку' })
    await withdraw.click()

    // The confirmation dialog appears; «Не отменять» dismisses it and keeps the application PENDING.
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/повторно откликнуться на этот гиг будет нельзя/)).toBeVisible()
    await page.getByRole('button', { name: 'Не отменять' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByText(/Заявка отправлена/)).toBeVisible()

    // Confirm the final withdrawal → «Отозвано» marker, no apply form, gig still rendered.
    await withdraw.click()
    await page.getByRole('button', { name: 'Отозвать окончательно' }).click()
    await expect(page.getByText('Отозвано')).toBeVisible()
    await expect(page.getByText(/повторный отклик недоступен/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Отправить заявку' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Отозвать заявку' })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'WD Final Gig' })).toBeVisible()
  })

  test('an example gig shows a demonstration notice with a search link, not an apply form', async ({ page }) => {
    await setE2ESession(page, { id: freshSpecId, email: freshSpecEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${exampleGigId}`)

    await expect(page.getByText('Демонстрационный гиг')).toBeVisible()
    await expect(page.getByText(/отклик недоступен/)).toBeVisible()
    await expect(page.getByRole('button', { name: /Перейти к поиску гигов/ })).toBeVisible()
    // No apply form / phantom apply button.
    await expect(page.getByRole('button', { name: 'Отправить заявку' })).toHaveCount(0)
  })

  test('the disabled submit surfaces the unmet minimum, then enables once satisfied', async ({ page }) => {
    await setE2ESession(page, { id: freshSpecId, email: freshSpecEmail, role: 'SPECIALIST' })
    await page.goto(`/gigs/${plainGigId}`)

    const submit = page.getByRole('button', { name: 'Отправить заявку' })
    await expect(submit).toBeVisible()
    // Empty form → disabled + the requirement hint emphasises the unmet minimums with counts.
    await expect(submit).toBeDisabled()
    await expect(page.getByText(/минимум 100 симв\. \(0\/100\)/)).toBeVisible()

    // Fill both fields past the thresholds → button enables and submits.
    await page.locator('textarea[name="approach"]').fill(longApproach)
    await page.locator('textarea[name="questions"]').fill(longQuestions)
    await expect(submit).toBeEnabled()
    await submit.click()
    await expect(page.getByText(/Заявка отправлена/)).toBeVisible()
  })
})
