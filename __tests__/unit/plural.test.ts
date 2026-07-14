import { describe, it, expect } from 'vitest'
import { pluralRu, days, stages } from '@/lib/utils/plural'

describe('pluralRu', () => {
  const forms: [string, string, string] = ['день', 'дня', 'дней']

  it('selects "one" for 1, 21, 31, 101 but not 11', () => {
    expect(pluralRu(1, forms)).toBe('день')
    expect(pluralRu(21, forms)).toBe('день')
    expect(pluralRu(31, forms)).toBe('день')
    expect(pluralRu(101, forms)).toBe('день')
    expect(pluralRu(11, forms)).toBe('дней')
  })

  it('selects "few" for 2-4, 22-24 but not 12-14', () => {
    expect(pluralRu(2, forms)).toBe('дня')
    expect(pluralRu(3, forms)).toBe('дня')
    expect(pluralRu(4, forms)).toBe('дня')
    expect(pluralRu(22, forms)).toBe('дня')
    expect(pluralRu(12, forms)).toBe('дней')
    expect(pluralRu(13, forms)).toBe('дней')
    expect(pluralRu(14, forms)).toBe('дней')
  })

  it('selects "many" for 0, 5-20, 25-30', () => {
    expect(pluralRu(0, forms)).toBe('дней')
    expect(pluralRu(5, forms)).toBe('дней')
    expect(pluralRu(15, forms)).toBe('дней')
    expect(pluralRu(25, forms)).toBe('дней')
  })
})

describe('days', () => {
  it('renders the grammatically correct day forms', () => {
    expect(days(1)).toBe('1 день')
    expect(days(2)).toBe('2 дня')
    expect(days(5)).toBe('5 дней')
    expect(days(11)).toBe('11 дней')
    expect(days(21)).toBe('21 день')
    expect(days(22)).toBe('22 дня')
    expect(days(25)).toBe('25 дней')
  })
})

describe('stages', () => {
  it('renders the grammatically correct stage forms', () => {
    expect(stages(1)).toBe('1 этап')
    expect(stages(2)).toBe('2 этапа')
    expect(stages(5)).toBe('5 этапов')
    expect(stages(11)).toBe('11 этапов')
  })
})
