import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * e2e-finances (reconciliation #10) — verifies the rebuilt «Финансы» screen at /finances
 * (app/(protected)/finances/FinancesDesign.tsx): the role-aware stat tiles (getFinanceStats), the «Операции» ledger
 * (heading + count badge), and the operation rows (title + counterparty·date + role-aware amount + status). Read-only;
 * the shell header owns the «ФИНАНСЫ» title (no in-screen title). Seeds a CLIENT «ООО Финанс» + an assigned SPECIALIST
 * «Иван Финанс» with a PAID + an IN_PROGRESS gig, plus an empty CLIENT. App/lib (getFinances/Stats/Ledger) is unchanged.
 */
let payerId: string
let payerEmail: string
let specId: string
let specEmail: string
let emptyId: string
let emptyEmail: string

const PAID_TITLE = 'E2E Finances Paid Gig'
const ACTIVE_TITLE = 'E2E Finances Active Gig'
const DONE_TITLE = 'E2E Finances Completed Gig'

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  payerEmail = `cfin-payer-${stamp}@example.com`
  specEmail = `cfin-spec-${stamp}@example.com`
  emptyEmail = `cfin-empty-${stamp}@example.com`

  const payer = await prisma.user.create({
    data: {
      email: payerEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Финанс', inn: '7700000004' } },
    },
  })
  payerId = payer.id

  const spec = await prisma.user.create({
    data: {
      email: specEmail,
      password: 'x',
      role: 'SPECIALIST',
      specialistProfile: { create: { displayName: 'Иван Финанс', techStack: 'React', experienceLevel: 'SENIOR' } },
    },
  })
  specId = spec.id

  // Gig A — PAID. CLIENT amount = totalAmount (110 000 ₽); SPECIALIST amount = budget (100 000 ₽); status «Оплачено».
  await prisma.gig.create({
    data: {
      title: PAID_TITLE,
      description: 'Finances composition test gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      status: 'PAID',
      tags: 'React',
      deadlineDays: 14,
      clientId: payer.id,
      assignedSpecialistId: spec.id,
      paidAt: new Date('2026-04-01T10:00:00Z'),
    },
  })

  // Gig B — IN_PROGRESS. Status badge «В работе»; drives CLIENT «В резерве» + SPECIALIST «В работе».
  await prisma.gig.create({
    data: {
      title: ACTIVE_TITLE,
      description: 'Finances active test gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget: 5000000,
      serviceFee: 500000,
      totalAmount: 5500000,
      status: 'IN_PROGRESS',
      tags: 'React',
      deadlineDays: 14,
      clientId: payer.id,
      assignedSpecialistId: spec.id,
    },
  })

  // Gig C — COMPLETED (work done, payment pending). The prototype's awaiting-payment row: role-aware label
  // «Ожидает оплаты» (specialist) / «К оплате» (client) on the #34C759 green.
  await prisma.gig.create({
    data: {
      title: DONE_TITLE,
      description: 'Finances completed test gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget: 3000000,
      serviceFee: 300000,
      totalAmount: 3300000,
      status: 'COMPLETED',
      tags: 'React',
      deadlineDays: 14,
      clientId: payer.id,
      assignedSpecialistId: spec.id,
    },
  })

  const empty = await prisma.user.create({
    data: {
      email: emptyEmail,
      password: 'x',
      role: 'CLIENT',
      clientProfile: { create: { companyName: 'ООО Пусто', inn: '7700000005' } },
    },
  })
  emptyId = empty.id

  await prisma.$disconnect()
})

test.describe('e2e-finances — finances screen', () => {
  test('a CLIENT sees their stat tiles + the «Операции» ledger rows', async ({ page }) => {
    await setE2ESession(page, { id: payerId, email: payerEmail, role: 'CLIENT' })
    await page.goto('/finances')

    // CLIENT stat-tile labels (getFinanceStats CLIENT set).
    await expect(page.getByText('Выплачено')).toBeVisible()
    await expect(page.getByText('В резерве')).toBeVisible()
    await expect(page.getByText('Сервисный сбор')).toBeVisible()
    // The stat-tile caption line under the value (the only place the fee rate is surfaced).
    await expect(page.getByText('комиссия Gigly 17,5%')).toBeVisible()

    // «Операции» heading + its count badge (the adjacent sibling span — scoped away from the sidebar «Мои гиги»).
    await expect(page.getByRole('heading', { name: 'Операции' })).toBeVisible()
    await expect(page.locator('h2:text-is("Операции") + span')).toHaveText('3')

    // Ledger rows: titles + statuses + the specialist counterparty subtitle.
    await expect(page.getByText(PAID_TITLE)).toBeVisible()
    await expect(page.getByText('Оплачено')).toBeVisible() // PAID → statusLabel «Оплачено»
    await expect(page.getByText(ACTIVE_TITLE)).toBeVisible()
    await expect(page.getByText('В работе').first()).toBeVisible() // IN_PROGRESS status badge
    await expect(page.getByText(DONE_TITLE)).toBeVisible()
    await expect(page.getByText('К оплате')).toBeVisible() // COMPLETED → client awaiting-payment label
    await expect(page.getByText('Иван Финанс').first()).toBeVisible() // counterparty (CLIENT → specialist)
  })

  test('a SPECIALIST sees the specialist stat tiles + role-aware ledger amounts', async ({ page }) => {
    await setE2ESession(page, { id: specId, email: specEmail, role: 'SPECIALIST' })
    await page.goto('/finances')

    // SPECIALIST stat-tile labels (getFinanceStats SPECIALIST set). «В работе» is also Gig B's status badge → .first().
    await expect(page.getByText('Заработано')).toBeVisible()
    await expect(page.getByText('На проверке')).toBeVisible()
    await expect(page.getByText('В работе').first()).toBeVisible()
    // The stat-tile caption line under «Заработано».
    await expect(page.getByText('выплачено по завершённым')).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Операции' })).toBeVisible()
    await expect(page.locator('h2:text-is("Операции") + span')).toHaveText('3')

    // COMPLETED → specialist awaiting-payment label «Ожидает оплаты» (distinct from the client's «К оплате»).
    await expect(page.getByText('Ожидает оплаты')).toBeVisible()

    // Counterparty = the company (SPECIALIST viewer); amount = budget (role-aware) → «100 000 ₽».
    await expect(page.getByText('ООО Финанс').first()).toBeVisible()
    await expect(page.getByText(/100\s?000\s*₽/).first()).toBeVisible()
  })

  test('a user with no lifecycle gigs sees the empty ledger', async ({ page }) => {
    await setE2ESession(page, { id: emptyId, email: emptyEmail, role: 'CLIENT' })
    await page.goto('/finances')

    await expect(page.getByText('Операций пока нет.')).toBeVisible()
  })
})
