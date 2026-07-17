import { describe, it, expect } from 'vitest'
import { validateInn, validateKpp } from '@/lib/requisites'

const INN_DIGITS_ERROR = 'ИНН может состоять только из цифр.'
const INN_LENGTH_ERROR = 'ИНН должен содержать 10 цифр (для организации) или 12 (для ИП).'
const KPP_DIGITS_ERROR = 'КПП может состоять только из цифр.'
const KPP_LENGTH_ERROR = 'КПП должен содержать ровно 9 цифр.'

describe('validateInn', () => {
  it('accepts a 10-digit organisation ИНН', () => {
    expect(validateInn('7707083893')).toEqual({ valid: true })
  })

  it('accepts a 12-digit ИП ИНН', () => {
    expect(validateInn('500100732259')).toEqual({ valid: true })
  })

  it('accepts an empty value — requisites are optional and filled in later', () => {
    expect(validateInn('')).toEqual({ valid: true })
  })

  it.each([
    ['letters', 'ABCDEFGHIJ'],
    ['Cyrillic', 'АБВГДЕЖЗИК'],
    ['mixed digits and letters', '77070838AB'],
    ['digits with a space', '7707 83893'],
    ['digits with a plus', '+707083893'],
    ['digits with a dash', '7707-83893'],
    // These LOOK like digits but are not ASCII ones — JS `\d` rejects them, which is exactly the intent.
    ['Arabic-Indic digits', '١٢٣٤٥٦٧٨٩٠'],
    ['fullwidth digits', '７７０７０８３８９３'],
    // `^…$` has no `m` flag, so a pasted trailing newline cannot sneak past the check.
    ['a trailing newline', '7707083893\n'],
  ])('rejects %s', (_label, inn) => {
    expect(validateInn(inn)).toEqual({ valid: false, error: INN_DIGITS_ERROR })
  })

  it.each([
    ['too short', '123'],
    ['9 digits (one short of an org ИНН)', '770708389'],
    ['11 digits (between the two valid lengths)', '77070838931'],
    ['13 digits', '7707083893123'],
    ['random long run of digits', '1'.repeat(40)],
  ])('rejects a digits-only value of the wrong length: %s', (_label, inn) => {
    expect(validateInn(inn)).toEqual({ valid: false, error: INN_LENGTH_ERROR })
  })

  it('reports the digits problem before the length problem', () => {
    // 'АБВ' is both non-digit AND the wrong length — the charset message is the more useful one.
    expect(validateInn('АБВ')).toEqual({ valid: false, error: INN_DIGITS_ERROR })
  })

  // Documents the agreed scope: format only, no control-digit check (business decision 2026-07-17).
  it('accepts a structurally valid but fake ИНН — checksum is out of scope', () => {
    expect(validateInn('0000000000')).toEqual({ valid: true })
    expect(validateInn('1234567890')).toEqual({ valid: true })
  })
})

describe('validateKpp', () => {
  it('accepts a 9-digit КПП', () => {
    expect(validateKpp('770101001')).toEqual({ valid: true })
  })

  it('accepts an empty value — requisites are optional', () => {
    expect(validateKpp('')).toEqual({ valid: true })
  })

  it.each([
    ['letters', 'ABCDEFGHI'],
    ['Cyrillic', 'АБВГДЕЖЗИ'],
    // Per the ФНС format, positions 5-6 of a КПП may be capital Latin letters (foreign organisations). We deliberately
    // reject them: digits-only was the chosen rule (2026-07-17).
    ['the ФНС foreign-org form with letters in positions 5-6', '7701AB001'],
    ['digits with a space', '77010 001'],
  ])('rejects %s', (_label, kpp) => {
    expect(validateKpp(kpp)).toEqual({ valid: false, error: KPP_DIGITS_ERROR })
  })

  it.each([
    ['8 digits', '77010100'],
    ['10 digits', '7701010011'],
    ['a single digit', '7'],
  ])('rejects a digits-only value of the wrong length: %s', (_label, kpp) => {
    expect(validateKpp(kpp)).toEqual({ valid: false, error: KPP_LENGTH_ERROR })
  })
})
