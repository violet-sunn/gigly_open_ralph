import { describe, it, expect } from 'vitest'
import { NOT_PROPOSED, formatBudgetRub, typedProposedTerm } from '@/lib/terms-display'

/**
 * The «Мои условия» tab must answer «what am I proposing?» from what is typed in the apply form, and must NEVER
 * substitute the gig's own figure — that substitution made the tab a copy of «Условия {company}» (Round-3 #3,
 * gig spec "Gig-Detail Terms Tabs Reflect the Counter").
 */
// Intl groups with U+00A0, not a plain space — compare normalized.
const noSpace = (s: string | null) => (s == null ? s : s.replace(/\s/g, ''))

describe('typedProposedTerm (apply-terms-lock)', () => {
  it('formats a full typed counter', () => {
    const t = typedProposedTerm('120000', '7')
    expect(noSpace(t.budget)).toBe('120000₽')
    expect(t.deadline).toBe('7 дней')
  })

  it('treats empty inputs as not proposed (never a substitute figure)', () => {
    expect(typedProposedTerm('', '')).toEqual({ budget: null, deadline: null })
  })

  it('treats whitespace-only inputs as not proposed', () => {
    expect(typedProposedTerm('   ', '  ')).toEqual({ budget: null, deadline: null })
  })

  it('keeps absence per field — a budget-only counter leaves срок not proposed', () => {
    const t = typedProposedTerm('99000', '')
    expect(noSpace(t.budget)).toBe('99000₽')
    expect(t.deadline).toBeNull()
  })

  it('keeps absence per field — a срок-only counter leaves budget not proposed', () => {
    const t = typedProposedTerm('', '14')
    expect(t.budget).toBeNull()
    expect(t.deadline).toBe('14 дней')
  })

  it('reads an invalid budget as not proposed rather than showing an unsubmittable figure', () => {
    // Mirrors the apply form + applyToGig rule: budget must be > 0.
    expect(typedProposedTerm('0', '').budget).toBeNull()
    expect(typedProposedTerm('-5', '').budget).toBeNull()
    expect(typedProposedTerm('abc', '').budget).toBeNull()
  })

  it('reads an out-of-range or non-integer срок as not proposed', () => {
    // Mirrors the server rule: an integer 1–365.
    expect(typedProposedTerm('', '0').deadline).toBeNull()
    expect(typedProposedTerm('', '366').deadline).toBeNull()
    expect(typedProposedTerm('', '2.5').deadline).toBeNull()
    expect(typedProposedTerm('', 'x').deadline).toBeNull()
    // Boundaries are valid.
    expect(typedProposedTerm('', '1').deadline).toBe('1 день')
    expect(typedProposedTerm('', '365').deadline).toBe('365 дней')
  })

  it('pluralises срок in Russian', () => {
    expect(typedProposedTerm('', '1').deadline).toBe('1 день')
    expect(typedProposedTerm('', '3').deadline).toBe('3 дня')
    expect(typedProposedTerm('', '7').deadline).toBe('7 дней')
  })

  it('formatBudgetRub groups roubles', () => {
    expect(noSpace(formatBudgetRub(140000))).toBe('140000₽')
  })

  it('NOT_PROPOSED is a single shared string (no per-call-site copies to drift)', () => {
    expect(NOT_PROPOSED).toBe('— не предложено')
  })
})
