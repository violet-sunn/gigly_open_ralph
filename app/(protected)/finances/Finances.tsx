/* @composed-screen */
import { Section } from '@/app/components/layout/Section'
import { StatPanel, LedgerTable, Notice } from '@/app/components/blocks'
import type { FinancesData } from '@/lib/view-models'

/**
 * Finances — the /finances screen, composed purely from the kit (compose-finances, Phase 2). Renders inside the
 * layout's AppShell. Template + slotted blocks + data only — no styling/className/style; arranged via layout
 * primitives. Read-only (no client interactivity, no actions): the logical-amounts framing (Notice) + the finance
 * StatPanel + the realized LedgerTable (or its empty state). Amounts are the logical PAID status — no real payments
 * (project.md Escrow/Payments MVP boundary).
 */
export function Finances({ stats, ledger }: FinancesData) {
  return (
    <Section title="Финансы" gap={6}>
      <Notice tone="muted">Суммы логические, без реальных платежей.</Notice>
      <StatPanel vm={stats} variant="grid" />
      <LedgerTable vm={ledger} />
    </Section>
  )
}
