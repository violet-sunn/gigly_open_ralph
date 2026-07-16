/**
 * Service-fee SSOT. The platform commission is defined ONCE here; every computation and every displayed percent
 * derives from `SERVICE_FEE_RATE`, so a future rate change touches this file only.
 *
 * Client-safe on purpose (pure, no Prisma / no server-only imports): the `'use server'` actions AND the client
 * design components (`CreateGigDesign`, `EditGigDesign`, `GigDetail`, `FeePanel`, `ConditionsPanel`) all import it,
 * so the live preview can never drift from the value the server persists.
 */

/** Platform service fee as a fraction of the budget. Business decision 2026-07-16: 10% → 17.5%. */
export const SERVICE_FEE_RATE = 0.175

/** The displayed percent, «17,5%» (Russian decimal comma). Rendered as «Сервисный сбор (17,5%)». Sourced from here so
 *  the label can never disagree with the rate. */
export const SERVICE_FEE_PCT_LABEL = '17,5%'

/** Fee for a budget given in kopecks (the persisted unit). Floors to whole kopecks. */
export const serviceFeeKopecks = (budgetKopecks: number): number =>
  Math.floor(budgetKopecks * SERVICE_FEE_RATE)

/** Fee for a budget given in roubles — for the live create/edit previews, which work in whole roubles. */
export const serviceFeeRoubles = (budgetRoubles: number): number =>
  Math.floor(budgetRoubles * SERVICE_FEE_RATE)
