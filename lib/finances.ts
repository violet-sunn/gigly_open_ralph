import { prisma } from '@/lib/prisma'
import type { LedgerTableVM, StatPanelVM, Status } from '@/app/components/blocks/view-models'

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

// The lifecycle statuses shown as operations + their design Status tone / badge label (reconcile-finances-and-admin).
const OPERATION_STATUSES = ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] as const
const OP_DESIGN: Record<string, { tone: Status; label?: string }> = {
  IN_PROGRESS: { tone: 'in-progress' },
  REVIEW: { tone: 'verification' },
  COMPLETED: { tone: 'completed' },
  PAID: { tone: 'completed', label: 'Оплачено' }, // the design Status enum has no `paid`
}

/**
 * The operations ledger — the user's gigs across the lifecycle (В работе / На проверке / Завершён / Оплачено), newest
 * first, with role-aware amounts + the counterparty subtitle. The «Баланс» footer is the realized (PAID) total.
 */
export async function getLedger(userId: string, role: Role): Promise<LedgerTableVM> {
  const gigs = await prisma.gig.findMany({
    where: { ...ownerWhere(userId, role), status: { in: [...OPERATION_STATUSES] } },
    orderBy: { updatedAt: 'desc' },
    include: {
      client: { include: { clientProfile: true } },
      assignedSpecialist: { include: { specialistProfile: true } },
    },
  })

  const entries = gigs.map((g) => {
    const d = OP_DESIGN[g.status] ?? { tone: 'completed' as Status }
    const counterparty =
      role === 'CLIENT'
        ? g.assignedSpecialist?.specialistProfile?.displayName || g.assignedSpecialist?.email || '—'
        : g.client?.clientProfile?.companyName || g.client?.email || '—'
    return {
      date: (g.paidAt ?? g.updatedAt).toISOString(),
      label: g.title,
      subtitle: counterparty,
      amount: money(amountOf(g, role)),
      status: d.tone,
      statusLabel: d.label,
    }
  })

  // Balance = realized (PAID) only — settled money, not the in-flight reserve.
  const total = gigs.filter((g) => g.status === 'PAID').reduce((sum, g) => sum + amountOf(g, role), 0)
  return { entries, balance: money(total) }
}

/**
 * Finance stat tiles (reconcile-finances-and-admin) — 3 role-aware figures over the lifecycle (logical amounts):
 *  - CLIENT:     Выплачено (PAID totalAmount) · В резерве (IN_PROGRESS + REVIEW totalAmount) · Сервисный сбор (PAID fee)
 *  - SPECIALIST: Заработано (PAID budget) · На проверке (REVIEW budget) · В работе (IN_PROGRESS budget)
 */
export async function getFinanceStats(userId: string, role: Role): Promise<StatPanelVM> {
  const where = ownerWhere(userId, role)
  const [paid, inProgress, review] = await Promise.all([
    prisma.gig.findMany({ where: { ...where, status: 'PAID' } }),
    prisma.gig.findMany({ where: { ...where, status: 'IN_PROGRESS' } }),
    prisma.gig.findMany({ where: { ...where, status: 'REVIEW' } }),
  ])
  const sum = (gigs: typeof paid, pick: (g: (typeof paid)[number]) => number) => gigs.reduce((s, g) => s + pick(g), 0)

  if (role === 'CLIENT') {
    return {
      stats: [
        { label: 'Выплачено', value: money(sum(paid, (g) => g.totalAmount)) },
        { label: 'В резерве', value: money(sum(inProgress, (g) => g.totalAmount) + sum(review, (g) => g.totalAmount)) },
        { label: 'Сервисный сбор', value: money(sum(paid, (g) => g.serviceFee)) },
      ],
    }
  }
  return {
    stats: [
      { label: 'Заработано', value: money(sum(paid, (g) => g.budget)) },
      { label: 'На проверке', value: money(sum(review, (g) => g.budget)) },
      { label: 'В работе', value: money(sum(inProgress, (g) => g.budget)) },
    ],
  }
}
