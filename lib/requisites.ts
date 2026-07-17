/**
 * Company requisites (ИНН / КПП) — the single source of truth for their format.
 *
 * Client-safe on purpose (no Prisma, no server-only imports) so the profile form can mirror these rules for live
 * feedback while `updateProfile` stays the authority — same split as `lib/password.ts`.
 *
 * Both fields are OPTIONAL: clients register with the design's minimal set and fill requisites later, so an empty
 * value is valid here and only a NON-empty value is checked.
 *
 * Scope: format only. There is deliberately no ИНН control-digit (checksum) check and no ФНС registry lookup, so
 * structurally-well-formed-but-fake values (e.g. 0000000000) still pass. Business decision 2026-07-17.
 */

/** ИНН: 10 digits for an organisation, 12 for an individual entrepreneur (ИП). */
export const INN_LENGTH_ORG = 10
export const INN_LENGTH_PERSON = 12

/** КПП: always exactly 9 digits. */
export const KPP_LENGTH = 9

// ASCII digits only. JS `\d` is [0-9] and does NOT match Arabic-Indic (١٢٣), Devanagari (१२३) or fullwidth (１２３)
// digits, which is what we want — those look like numbers but are not. `^…$` without the `m` flag also rejects a
// trailing newline, so a pasted "7707083893\n" cannot slip through.
const DIGITS_ONLY = /^\d+$/

export function validateInn(inn: string): { valid: boolean; error?: string } {
  if (inn === '') return { valid: true } // optional field

  if (!DIGITS_ONLY.test(inn)) {
    return { valid: false, error: 'ИНН может состоять только из цифр.' }
  }
  if (inn.length !== INN_LENGTH_ORG && inn.length !== INN_LENGTH_PERSON) {
    return { valid: false, error: 'ИНН должен содержать 10 цифр (для организации) или 12 (для ИП).' }
  }
  return { valid: true }
}

export function validateKpp(kpp: string): { valid: boolean; error?: string } {
  if (kpp === '') return { valid: true } // optional field

  if (!DIGITS_ONLY.test(kpp)) {
    return { valid: false, error: 'КПП может состоять только из цифр.' }
  }
  if (kpp.length !== KPP_LENGTH) {
    return { valid: false, error: 'КПП должен содержать ровно 9 цифр.' }
  }
  return { valid: true }
}
