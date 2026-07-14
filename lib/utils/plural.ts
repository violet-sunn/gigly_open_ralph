/**
 * Russian pluralization helpers (content-cosmetic-fixes, Заказчик #4).
 *
 * Russian counted nouns take three forms depending on the number:
 *   - "one"  → 1, 21, 31, … (but NOT 11)          e.g. «1 день»
 *   - "few"  → 2–4, 22–24, … (but NOT 12–14)       e.g. «2 дня»
 *   - "many" → 0, 5–20, 25–30, …                   e.g. «5 дней»
 *
 * Pure and side-effect-free — no locale libraries.
 */

/** Pick the correct Russian plural form for `n` given `[one, few, many]`. */
export function pluralRu(n: number, forms: [one: string, few: string, many: string]): string {
  const abs = Math.abs(n)
  const mod10 = abs % 10
  const mod100 = abs % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return forms[1]
  return forms[2]
}

/** «1 день» / «2 дня» / «5 дней» */
export function days(n: number): string {
  return `${n} ${pluralRu(n, ['день', 'дня', 'дней'])}`
}

/** «1 этап» / «2 этапа» / «5 этапов» */
export function stages(n: number): string {
  return `${n} ${pluralRu(n, ['этап', 'этапа', 'этапов'])}`
}
