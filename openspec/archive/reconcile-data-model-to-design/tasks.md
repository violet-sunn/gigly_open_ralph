# Tasks — reconcile-data-model-to-design

Reconcile the schema/VMs/actions to `DATA-MODEL.md`: derive `under_review` (no stored enum), add `Category.color`, add
the `payment` notification type (+ optional `text`), enrich `Dispute` (openerRole, frozen amount, evidence, a
`DisputeEntry` timeline, reason enum) for the resolve flow — ratings/transactions stay computed, lifecycle unchanged.
Source: `gigly_full_design/DATA-MODEL.md`. Friction: **high** (schema migration + new model + actions + mappers across
gig/category/notification/dispute, kept backward-compatible).

## 1. Derive `under_review` in the display mappers (no migration)
- [x] Added `gigDisplayStatus(status, applicationCount)` → `'review'` for `OPEN`+count>0, else `GIG_STATUS[status]??'open'`.
      Threaded the count via `GigForCard.applicationCount` into `toGigCardVM`, `getGigDetail` (gig.applications.length),
      `getClientDashboard` (`_count.applications`), and the browse (`getGigSearch` + the `page.tsx` `_count`).
- [x] `Gig.status` + lifecycle transitions/guards untouched.
- **Test:** ✅ `gigDisplayStatus` unit + integration — OPEN+0→`open`, OPEN+1→`review`, stored status stays `OPEN`; lifecycle tests green.

## 2. Add Category.color (+ seed)
- [x] `Category.color String @default("blue")`; added `seedCategories()` in `lib/categories.ts` (+ `CATEGORIES.color`)
      and the hues in `prisma/seed.ts` (marketing=blue/design=rose/programming=green/development=teal/coding=orange).
- **Test:** ✅ integration — `seedCategories` writes each pinned colour.

## 3. Notification `payment` type + optional `text`
- [x] `Notification.text String?`; `notification-utils` PAYMENT branch (text + 💰 icon); `getDashboardAttention`
      fallback maps `type==='PAYMENT'`→`payment` (+ the existing `payment_marked`→payment); `markAsPaid` tags `'PAYMENT'`.
      Extended the `NotificationType` union.
- **Test:** ✅ unit (PAYMENT text + icon); integration — `markAsPaid` creates a PAYMENT-typed notification (gig-lifecycle-notifications updated).

## 4. Enrich the Dispute schema (+ DisputeEntry)
- [x] `Dispute` += `openerRole`/`amount`/`evidence`; new `DisputeEntry` model + `Dispute.timeline`. Applied via `db push`.
- **Test:** ✅ schema applies (test DB via db push); build green; existing dispute tests pass (free-text reason → «Другое»).

## 5. Dispute reason enum + VMs
- [x] `DisputeReason` union (6) + `DisputeEntryVM`; extended `DisputeDetailVM` (`openerRole`/`amount: Money`/`evidence`/
      `timeline`/typed `reason`). `lib/disputes.ts` `getDisputeDetail` returns them (parse evidence CSV; map timeline);
      updated both `disputeDetail*` fixtures.
- **Test:** ✅ integration — `getDisputeDetail` VM carries role/amount/evidence/timeline; build type-checks.

## 6. Dispute open/resolve actions
- [x] `openDispute`: normalize `reason` to the enum (unknown→«Другое», backward-compatible vs hard-reject), set
      `openerRole` (company if opener=client else specialist), `amount`=gig.budget, `evidence`, + an opening `DisputeEntry`.
- [x] `resolveDispute`: verdict (specialist/company/split_50) prefixed onto `resolution` + a closing moderator `DisputeEntry`;
      auth + `(gigId, openerId)` uniqueness preserved.
- **Test:** ✅ integration — open persists role/amount/reason/evidence + opening entry; free-text→«Другое»+entry; resolve records verdict + moderator entry.
- *Spec note:* the proposal's "reject if not one of six" was softened to **normalize→«Другое»** to keep the existing inline gig-detail dispute flow (free-text reason) working; recorded in the spec delta.

## 7. Keep ratings/transactions computed (non-goal held)
- [x] No `User.ratingStars/ratingCount`, no `Transaction` table; `getRatingForUser`/`getFinances` remain the source.
- **Test:** ✅ schema grep — no stored rating/transaction columns; rating/finance integration tests green.

## 8. Quality gates (run, assert green)
- [x] `prisma db push` applied (test DB picks it up via its own `db push`); `prisma generate` ran.
- [x] `npm run build` — ✅ PASS.
- [x] `npm run validate:tokens` + `npm run lint:tokens` — ✅ PASS (unaffected).
- [x] `npm run clean:test-db && npm run test:unit` — ✅ **918/918** (911 + 7 new acceptance tests; gig-lifecycle-notifications updated to PAYMENT).
- **Acceptance:** ✅ `under_review` derived (lifecycle unchanged); `Category.color` + `payment` notification + enriched
  `Dispute`/`DisputeEntry` + resolve verdict; ratings/transactions computed; backward-compatible; suites green.

## 9. Planning-status (Phase 2)
- [x] Checked the `reconcile-data-model-to-design` item in `full-design-reground.md` Phase 2.
- **Test:** ✅ the Phase-2 item reads `[x]`.
