import { days } from '@/lib/utils/plural'

/**
 * Shared, client-safe presentation of «Мои условия» (the specialist's counter-terms).
 *
 * This lives apart from `lib/view-models.ts` on purpose: the gig-detail screen is a client component, and importing
 * the view-model module would pull Prisma into the browser bundle. It is a single module rather than a literal copied
 * per call site so the string and the "not proposed" rule cannot drift between the server VM, the ConditionsPanel
 * block, and the gig-detail screen — a drift the tests would not catch, since each asserts its own copy.
 */

/** Rendered where the viewer proposed no term. NEVER substitute the gig's own figure: that is what made «Мои условия»
 *  a character-for-character copy of «Условия {company}» and «убивает смысл вкладки» (Round-3 #3). */
export const NOT_PROPOSED = '— не предложено'

/** Roubles → «120 000 ₽» (Intl groups with U+00A0, not a plain space — compare accordingly in tests). */
export const formatBudgetRub = (rub: number): string => `${new Intl.NumberFormat('ru-RU').format(rub)} ₽`

export interface ProposedTermFigures {
  /** `null` ⇒ not proposed. */
  budget: string | null
  /** `null` ⇒ not proposed. */
  deadline: string | null
}

/**
 * «Мои условия» figures derived from what is currently typed into the apply form, so the tab answers «what am I
 * actually proposing?» before submission.
 *
 * Absence is per field — a budget-only counter leaves срок `null` rather than borrowing the gig's. Validity mirrors
 * the apply form's client-side rules (and `applyToGig`'s server rules): budget > 0; срок an integer 1–365. An invalid
 * or empty input reads as "not proposed" rather than showing a figure that would never be submitted.
 */
export function typedProposedTerm(budgetInput: string, deadlineInput: string): ProposedTermFigures {
  const budget = Number(budgetInput)
  const deadline = Number(deadlineInput)
  return {
    budget:
      budgetInput.trim() !== '' && Number.isFinite(budget) && budget > 0 ? formatBudgetRub(budget) : null,
    deadline:
      deadlineInput.trim() !== '' && Number.isInteger(deadline) && deadline >= 1 && deadline <= 365
        ? days(deadline)
        : null,
  }
}
