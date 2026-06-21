import { test, expect } from '@playwright/test'
import { setE2ESession } from '../helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

/**
 * compose-finances (Phase 2) — verifies /finances is composed from the kit (StatPanel + LedgerTable) over the logical
 * finances-ledger layer: the screen reflects the user's PAID gigs (ledger row + balance + stats), shows the
 * logical-amounts framing, renders an empty state for users with no realized payments, and the sidebar «Финансы» nav
 * item is active. Seeds directly into the E2E db (file:./test.db). No Финансы mock exists → F1 flagged-missing.
 */
let payerId: string
let payerEmail: string
let emptyId: string
let emptyEmail: string

test.beforeAll(async () => {
  const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) as any })
  const stamp = Date.now()
  payerEmail = `cfin-payer-${stamp}@example.com`
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

  await prisma.gig.create({
    data: {
      title: 'E2E Finances Paid Gig',
      description: 'Finances composition test gig.',
      acceptanceCriteria: 'Acceptance criteria with at least fifty characters to pass validation here.',
      budget: 10000000,
      serviceFee: 1000000,
      totalAmount: 11000000,
      status: 'PAID',
      tags: 'React',
      deadlineDays: 14,
      clientId: payer.id,
      paidAt: new Date('2026-04-01T10:00:00Z'),
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

test.describe('compose-finances — composed finances screen', () => {
  test('reflects the ledger (paid gig row + balance) + stats + logical-amounts framing', async ({ page }) => {
    await setE2ESession(page, { id: payerId, email: payerEmail, role: 'CLIENT' })
    await page.goto('/finances')

    await expect(page.getByText('Суммы логические, без реальных платежей.')).toBeVisible() // framing
    await expect(page.getByText('Выплачено')).toBeVisible() // role figure (CLIENT realized)
    await expect(page.getByText('В резерве')).toBeVisible() // role figure (committed-but-unpaid)
    await expect(page.getByText('Сервисный сбор')).toBeVisible() // role figure (10% fee)
    await expect(page.getByText('E2E Finances Paid Gig')).toBeVisible() // LedgerTable operation
    await expect(page.getByText('Баланс')).toBeVisible() // balance footer
  })

  test('shows an empty state for a user with no lifecycle gigs', async ({ page }) => {
    await setE2ESession(page, { id: emptyId, email: emptyEmail, role: 'CLIENT' })
    await page.goto('/finances')

    await expect(page.getByText('Пока нет операций')).toBeVisible() // LedgerTable empty state
  })

  test('the sidebar «Финансы» nav item is active on /finances', async ({ page }) => {
    await setE2ESession(page, { id: payerId, email: payerEmail, role: 'CLIENT' })
    await page.goto('/finances')

    // The active nav item carries the active surface class (SidebarNav.navState); inactive items do not.
    const financesLink = page.getByRole('link', { name: 'Финансы' })
    await expect(financesLink).toHaveClass(/bg-surface-level-3/)
  })
})
