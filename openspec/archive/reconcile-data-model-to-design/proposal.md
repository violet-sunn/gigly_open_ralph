# reconcile-data-model-to-design

**Type:** Regular change (data model — schema + VMs/actions reconciled to the authoritative design)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 2 (data-model reconcile)
**Capability:** `data-model` (spans `gig` status display, `categories`, `notification`, `dispute`)
**Depends on:** Phase 1 complete (token/theme foundation). Independent of the Phase-3 screen reconciliations.

## Why

The `gigly_full_design/DATA-MODEL.md` is now authoritative, and the delta analysis (`full-design-reground.md` §3.3)
found the Prisma schema materially behind it in four places — while two "deltas" are design-doc denormalizations the
code **already handles better** (ratings via `getRatingForUser`, finances via `getFinances`/`lib/finances`) and MUST
stay computed. The real gaps:

| Design (DATA-MODEL.md) | Schema today | Action |
|---|---|---|
| `GigStatus` distinguishes **`under_review`** («На рассмотрении» = OPEN with applications) from `review` (work submitted) | `Gig.status` bare string; OPEN shown as `'open'` regardless of applications | **derive** `under_review` in the display mappers (no stored enum) |
| `Category.color` (blue/rose/green/teal/orange) | `Category` has no `color` | **add** the column + seed |
| `Notification.type` includes **`payment`**; optional stored `text` | type ∈ MESSAGE/APPLICATION/STATUS_CHANGE; `payment_marked` buried under STATUS_CHANGE; text derived | **add** the `payment` type/accent + an optional `text` column |
| `Dispute` = `openerRole` + frozen `amount` + `evidence[]` + a `DisputeEntry` **timeline** + a **reason enum** (6) + the resolve verdict | free-text `reason`, `OPEN\|RESOLVED\|REJECTED`, no role/amount/evidence/timeline | **enrich** the model + the open/resolve flow |
| ratings, transactions | computed (`getRatingForUser`, `getFinances`) | **keep computed** (non-goal to store) |

Closing these makes the status display, category colour, payment notifications, and the dispute resolve-flow match the
authoritative model — without regressing the gig lifecycle (which is unchanged: the lifecycle stays
`OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID`; `under_review` is a *display* refinement of OPEN, not a new stored state).

## What

- **Derive `under_review` (no migration).** A display helper maps `(status, applicationCount)` → the design `Status`:
  an **OPEN gig with ≥1 application** renders as `'review'` (На рассмотрении, amber); OPEN with 0 applications stays
  `'open'` (Открыт). Thread the application count into `toGigCardVM` / `getGigDetail` / the dashboard feeds so the
  card/detail status reflects it. The stored `Gig.status` enum is **unchanged** (no `under_review` value); all
  lifecycle transitions/guards are untouched. (The coded `Status` union already separates `review` from `verification`.)
- **`Category.color`.** Add `color String` to `Category` (values `blue\|rose\|green\|teal\|orange` per DATA-MODEL §Category /
  the pinned token mapping marketing=blue/design=rose/programming=green/development=teal/coding=orange); seed it in
  `prisma/seed.ts` + the category bootstrap. The category VM exposes `color`; the slug→token rendering path is
  unchanged (the column is the data-model source of truth for the hue, not a new render dependency).
- **Notification `payment` type + optional `text`.** Add `payment` to the notification type taxonomy: `markAsPaid`
  tags the notification so it renders with the **`attention.payment`** accent (cyan), and `notification-utils` +
  the `AttentionType` map resolve `payment`/`payment_marked` → the payment type/text. Add an **optional** `text String?`
  column (forward-compat denormalized text); the derived `notification-utils` text stays the primary source.
- **Enrich `Dispute` + the resolve flow.** Add to `Dispute`: `openerRole` (`specialist`|`company`, set at creation),
  `amount Int` (the gig budget frozen at open), `evidence String` (JSON/CSV of file names, default `""`), and a
  **`reason`** constrained to the 6 DATA-MODEL reasons (TS union + action validation; SQLite stays `String`). Add a
  new **`DisputeEntry`** model (`disputeId`, `authorRole`, `authorName`, `text`, `createdAt`) for the timeline. The
  **resolve flow** supports the moderator verdict (`in favour of specialist` / `in favour of company` / `50% split`)
  recorded on resolution + a closing timeline entry. `openDispute`/`resolveDispute` + the dispute VMs
  (`DisputeDetailVM` gains `openerRole`/`amount`/`evidence`/`timeline`/typed `reason`) are extended.
- **Keep ratings + transactions computed** (no stored `User.ratingStars/ratingCount`, no `Transaction` table).

## Key facts / decisions

- **`under_review` is derived, never stored.** The gig lifecycle + its guards/transitions are unchanged; this is a
  display-status refinement (OPEN+apps → На рассмотрении), so no migration and no risk to the core loop. The display
  status `'review'` is the existing coded `Status` value for «На рассмотрении» (amber); `'verification'` remains «На
  проверке» (REVIEW).
- **`openerRole` + `amount` are stored point-in-time at dispute creation** (role could be derived, but the frozen
  amount can't, and storing both keeps the dispute self-describing for the resolve flow).
- **`reason` stays a `String` column with a TS-union + action-validated enum** (SQLite has no native enum); the 6
  reasons are the DATA-MODEL set. Existing free-text disputes back-fill to `Другое` (Other).
- **`evidence` is a JSON/CSV string** (SQLite has no array type), mirroring `Gig.tags`. No file-upload backend (MVP
  non-goal) — `evidence` holds file *names* only, as the design specifies.
- **Backward compatible.** New columns have defaults; the migration back-fills existing rows (`reason`→`Другое`,
  `openerRole` derived from the existing opener, `amount`←gig budget). No data loss.

## Scope

- **Schema:** `prisma/schema.prisma` — `Category.color`; `Notification.text?` + `payment` type; `Dispute` (`openerRole`,
  `amount`, `evidence`, reason-enum discipline) + new `DisputeEntry` model + relation. A migration (back-fills defaults).
- **Seed/bootstrap:** `prisma/seed.ts` + the category seeding — set `Category.color`.
- **Data layer / mappers:** `lib/view-models.ts` (`under_review` derivation in `toGigCardVM`/`getGigDetail`/dashboard
  feeds), `lib/disputes.ts` (enriched `DisputeDetailVM` + timeline), `lib/notification-utils.ts` (`payment`), and the
  `getDashboardAttention` eventType→`AttentionType` map.
- **Actions:** `app/actions/dispute.ts` (`openDispute` sets role/amount/reason/evidence; `resolveDispute` records the
  verdict + a timeline entry); `app/actions/gig.ts` `markAsPaid` (payment notification type).
- **VMs:** `app/components/blocks/view-models.ts` — `DisputeDetailVM` (+ `openerRole`/`amount`/`evidence`/`timeline`/
  typed `reason`), `DisputeReason` union, `DisputeEntryVM`; `CategoryVM.color` if surfaced.
- **Tests:** integration for the schema/migration + the mappers (`under_review` derivation, dispute enrich, payment
  notification, category colour) + a lifecycle-unaffected regression; unit for `notification-utils` payment + the
  status-derivation helper.

## Non-goals

- Storing ratings (`User.ratingStars/ratingCount`) or a `Transaction` table — both stay **computed** (the code is
  already correct for MVP).
- Changing the gig lifecycle / its transition guards, or adding a *stored* `under_review` gig state.
- A real file-upload backend for dispute `evidence` (names only; uploads are an MVP non-goal).
- The dispute/admin **screens** (the resolve UI is wired in the Phase-3 `reconcile-disputes-flow`; this change provides
  the data + actions it will compose).
- `User.verified`/`online`, `SpecialistProfile.categories`/`completedProjects` (separate; not in this change's args).

## References

`gigly_full_design/DATA-MODEL.md` (User/Gig/GigStatus/Application/Dispute/DisputeReason/Notification/Transaction/Category);
`full-design-reground.md` §3.3 (the delta verdict — real vs computed); `prisma/schema.prisma`; `lib/view-models.ts`
(`GIG_STATUS`, `toGigCardVM`, `getGigDetail`, `getDashboardAttention`), `lib/disputes.ts`, `lib/notification-utils.ts`;
`app/actions/dispute.ts` + `gig.ts`.
