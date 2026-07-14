import { prisma } from '@/lib/prisma'
import type { TermsTabsVM, TermRow } from '@/app/components/blocks/view-models'
import { days } from '@/lib/utils/plural'

// kopecks → "300 400 ₽" (matches the UI's `formatRoubles` + " ₽" and the TermsTabs fixture)
const money = (kopecks: number): string => `${new Intl.NumberFormat('ru-RU').format(kopecks / 100)} ₽`

/**
 * Assemble the TermsTabs view-model for an application — the {proposed, client} term rows the block renders.
 *
 *   client   = the gig's terms (Бюджет + Срок) — the "От заказчика" tab
 *   proposed = the specialist's counter (Бюджет + Срок), falling back to the gig's terms when not countered
 *              (`proposedBudget ?? gig.budget`, `proposedDeadlineDays ?? gig.deadlineDays`) — the "Предложено" tab
 *
 * Returns null when the application (or its gig) does not exist. Server-only data helper; the view-model types are
 * imported `import type` (erased at build) so the data layer matches the SSOT with NO runtime UI coupling — the same
 * pattern as `lib/reviews.ts` / `lib/categories.ts` / `lib/profiles.ts`.
 */
export async function getTermsTabs(applicationId: string): Promise<TermsTabsVM | null> {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })
  if (!app || !app.gig) return null

  const g = app.gig
  const client: TermRow[] = [
    { label: 'Бюджет', value: money(g.budget) },
    { label: 'Срок', value: days(g.deadlineDays) },
  ]
  const proposed: TermRow[] = [
    { label: 'Бюджет', value: money(app.proposedBudget ?? g.budget) },
    { label: 'Срок', value: days(app.proposedDeadlineDays ?? g.deadlineDays) },
  ]
  return { proposed, client }
}
