import { describe, it, expect } from 'vitest'
import { formatCurrency, calculateServiceFee } from '@/lib/utils/currency'

describe('Currency Utils', () => {
  describe('formatCurrency', () => {
    it('formats Russian rubles correctly', () => {
      // Note: Russian number format uses non-breaking spaces (U+00A0)
      expect(formatCurrency(100000)).toBe('100\u00A0000\u00A0₽')
    })

    it('handles zero amount', () => {
      expect(formatCurrency(0)).toBe('0\u00A0₽')
    })
  })

  describe('calculateServiceFee', () => {
    it('calculates 10% fee correctly', () => {
      expect(calculateServiceFee(100000, 10)).toBe(10000)
    })

    it('uses default 10% when not specified', () => {
      expect(calculateServiceFee(100000)).toBe(10000)
    })

    it('rounds to nearest integer', () => {
      expect(calculateServiceFee(100, 15)).toBe(15)
    })
  })
})
