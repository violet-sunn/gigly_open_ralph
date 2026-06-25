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

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const s = Date.now()
  specEmail = `wd-spec-${s}@example.com`

  const owner = await prisma.user.create({
    data: { email: `wd-owner-${s}@example.com`, password: 'x', role: 'CLIENT', clientProfile: { create: { companyName: 'ООО Заказчик', inn: '7700000000' } } },
  })
  const spec = await prisma.user.create({
    data: { email: specEmail, password: 'x', role: 'SPECIALIST', specialistProfile: { create: { displayName: 'Тест Спец', techStack: 'React', experienceLevel: 'SENIOR', bio: 'x' } } },
  })
  specId = spec.id

  const gig = await prisma.gig.create({
    data: {
      title: 'WD Gig',
      description: 'Withdrawal flow test gig with a reasonably detailed description.',
      acceptanceCriteria: 'Критерий приёмки достаточной длины, чтобы пройти валидацию полей гига.',
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      status: 'OPEN',
      tags: 'React,TypeScript',
      deadlineDays: 14,
      clientId: owner.id,
    },
  })
  gigId = gig.id

  // The specialist's PENDING application — the precondition for the withdraw control.
  await prisma.application.create({
    data: { gigId: gig.id, specialistId: spec.id, approach: longApproach, questions: longQuestions, estimatedEffort: '2 недели', status: 'PENDING' },
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

    // Withdraw → the PENDING control is gone (withdrawApplication revalidates the screen).
    await withdraw.click()
    await expect(page.getByRole('button', { name: 'Отозвать заявку' })).toHaveCount(0)
  })
})
