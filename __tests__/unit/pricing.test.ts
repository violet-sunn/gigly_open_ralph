import { describe, it, expect } from 'vitest'
import {
  SERVICE_FEE_RATE,
  SERVICE_FEE_PCT_LABEL,
  serviceFeeKopecks,
  serviceFeeRoubles,
} from '@/lib/pricing'

/**
 * The service fee is the single most safety-critical constant in the app — a wrong value means wrong money on every
 * gig. These pin the business rate (17.5%) and the gig-spec "Fee Calculation" worked examples, so any accidental
 * drift of SERVICE_FEE_RATE fails here immediately rather than only surfacing in a downstream integration test.
 */
describe('pricing SSOT (service fee)', () => {
  it('the rate is 17.5% and the label matches it', () => {
    expect(SERVICE_FEE_RATE).toBe(0.175)
    expect(SERVICE_FEE_PCT_LABEL).toBe('17,5%')
  })

  it('gig-spec worked example: 100,000 ₽ budget → 17,500 ₽ fee, 117,500 ₽ total', () => {
    const budgetKopecks = 10_000_000 // 100,000 ₽
    expect(serviceFeeKopecks(budgetKopecks)).toBe(1_750_000)
    expect(budgetKopecks + serviceFeeKopecks(budgetKopecks)).toBe(11_750_000)
  })

  it('gig-spec worked example: 333 ₽ budget floors the fractional kopeck', () => {
    const budgetKopecks = 33_300 // 333 ₽ → fee 5827.5 kop, floored
    expect(serviceFeeKopecks(budgetKopecks)).toBe(5_827)
    expect(budgetKopecks + serviceFeeKopecks(budgetKopecks)).toBe(39_127)
  })

  it('always floors to whole kopecks (never fractional money)', () => {
    for (const b of [1, 7, 99, 100001, 333_333]) {
      expect(Number.isInteger(serviceFeeKopecks(b))).toBe(true)
      expect(serviceFeeKopecks(b)).toBe(Math.floor(b * SERVICE_FEE_RATE))
    }
  })

  it('the roubles helper (live previews) matches the kopecks helper on the same magnitude', () => {
    expect(serviceFeeRoubles(100_000)).toBe(17_500)
    expect(serviceFeeRoubles(100_000)).toBe(Math.floor(100_000 * SERVICE_FEE_RATE))
  })
})
