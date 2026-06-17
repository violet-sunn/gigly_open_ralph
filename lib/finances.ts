import { prisma } from '@/lib/prisma'
import type { LedgerTableVM, StatPanelVM } from '@/app/components/blocks/view-models'

/**
 * LOGICAL finances view — NO payment gateway, NO real money movement, NO DB writes.
 *
 * Balances/ledgers are DERIVED read-only from gig statuses (budget / serviceFee / totalAmount / PAID).
 * Per project.md "Escrow / Payments (MVP)": payment is the logical `PAID` status, not an actual financial
 * transfer through the platform. Real payment-gateway / escrow integration is a POST-MVP change that will sit
 * behind the same LedgerTableVM / StatPanelVM shapes, so the Финансы screen is unaffected when it lands.
 *
 * Server-only data helpers (consumed by Phase-2 `compose-finances` via @/lib/finances). View-model types are
 * imported `import type` (erased at build) so the data layer matches the SSOT with NO runtime UI coupling.
 */

type Role = 'CLIENT' | 'SPECIALIST'

// kopecks → "300 400 ₽" (matches the UI's formatRoubles + " ₽")
const money = (kopecks: number): string => `${new Intl.NumberFormat('ru-RU').format(kopecks / 100)} ₽`

// A user's gigs are theirs as a CLIENT (clientId) or as a SPECIALIST (assignedSpecialistId).
const ownerWhere = (userId: string, role: Role) =>
  role === 'CLIENT' ? { clientId: userId } : { assignedSpecialistId: userId }

// A CLIENT pays the totalAmount (budget + fee); a SPECIALIST receives the budget (no fee deducted).
const amountOf = (gig: { totalAmount: number; budget: number }, role: Role): number =>
  role === 'CLIENT' ? gig.totalAmount : gig.budget

/**
 * The realized ledger — the user's PAID gigs (the logical transactions), newest first, plus the summed balance.
 */
export async function getLedger(userId: string, role: Role): Promise<LedgerTableVM> {
  const paid = await prisma.gig.findMany({
    where: { ...ownerWhere(userId, role), status: 'PAID' },
    orderBy: { paidAt: 'desc' },
  })

  const entries = paid.map((g) => ({
    date: (g.paidAt ?? g.updatedAt).toISOString(),
    label: g.title,
    amount: money(amountOf(g, role)),
    // The design Status enum has no `paid`; a realized payment maps to the terminal `completed` (green).
    status: 'completed' as const,
  }))

  const total = paid.reduce((sum, g) => sum + amountOf(g, role), 0)
  return { entries, balance: money(total) }
}

/**
 * Finance stat tiles that reflect payment statuses: realized (PAID) vs pending (COMPLETED-but-unpaid), per role.
 */
export async function getFinanceStats(userId: string, role: Role): Promise<StatPanelVM> {
  const where = ownerWhere(userId, role)
  const [paid, completed] = await Promise.all([
    prisma.gig.findMany({ where: { ...where, status: 'PAID' } }),
    prisma.gig.findMany({ where: { ...where, status: 'COMPLETED' } }),
  ])

  const realized = paid.reduce((sum, g) => sum + amountOf(g, role), 0)
  const pending = completed.reduce((sum, g) => sum + amountOf(g, role), 0)
  const realizedLabel = role === 'CLIENT' ? 'Оплачено' : 'Заработано'

  return {
    stats: [
      { label: realizedLabel, value: money(realized) },
      { label: 'Ожидает', value: money(pending) },
      { label: 'Выполнено', value: paid.length },
    ],
  }
}
