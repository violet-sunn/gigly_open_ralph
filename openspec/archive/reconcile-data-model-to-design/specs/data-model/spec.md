# Spec delta — data-model (reconcile-data-model-to-design)

Reconciles the schema + VMs/actions to `gigly_full_design/DATA-MODEL.md`: derive `under_review` (no stored enum), add
`Category.color`, add the `payment` notification type (+ optional `text`), and enrich `Dispute` (openerRole, frozen
amount, evidence, a `DisputeEntry` timeline, a reason enum) to support the resolve flow — keeping ratings + transactions
computed and the gig lifecycle unchanged.

## ADDED Requirements

### Requirement: "На рассмотрении" Is a Derived Display Status (No Stored Enum)
The display mappers MUST render an **OPEN gig that has ≥1 application** as the design status `review` («На
рассмотрении»), and an OPEN gig with **0 applications** as `open` («Открыт»). This MUST be derived from the
application count at read time; the stored `Gig.status` enum MUST be unchanged (no `under_review` value) and the gig
lifecycle transitions/guards MUST be untouched.

#### Scenario: OPEN gig status reflects application count
- GIVEN an OPEN gig with 0 applications and another OPEN gig with ≥1 application
- WHEN their cards/detail are built (`toGigCardVM` / `getGigDetail` / the dashboard feeds)
- THEN the first MUST render status `open` and the second `review` («На рассмотрении»)
- AND the stored `Gig.status` MUST remain `OPEN` for both (no migration; lifecycle unaffected)

### Requirement: Category Carries Its Design Colour
The `Category` model MUST gain a `color` field holding the design hue (`blue|rose|green|teal|orange`), seeded per the
pinned mapping (marketing=blue, design=rose, programming=green, development=teal, coding=orange). Existing rendering
(slug→token colour) MUST continue to work.

#### Scenario: Categories expose their colour
- GIVEN the seeded categories
- THEN each MUST have a `color` equal to its pinned hue, and the category VM MUST expose it
- AND the migration MUST back-fill existing rows without data loss

### Requirement: Payment Notifications Are First-Class
The notification taxonomy MUST support a `payment` type so payment events render with the `attention.payment` (cyan)
accent and a payment-specific text. `markAsPaid` MUST tag the notification accordingly, and `notification-utils` + the
`AttentionType` map MUST resolve `payment`/`payment_marked` → the payment type/text. An **optional** `text` column MAY
store denormalized text; the derived text remains the primary source.

#### Scenario: A paid gig produces a payment-typed notification
- GIVEN a CLIENT marks a COMPLETED gig as paid
- THEN the specialist's notification MUST resolve to the `payment` type (cyan `attention.payment` accent) with payment
  text, and the dashboard attention strip MUST classify it as `payment`
- AND existing notification rendering for the other types MUST be unchanged

### Requirement: Dispute Model Supports the Resolve Flow
`Dispute` MUST gain `openerRole` (`specialist|company`, set at creation), `amount` (the gig budget frozen at open),
`evidence` (a JSON/CSV of file names, default empty), and a `reason` **normalized** to the six DATA-MODEL reasons
(a submitted reason not in the set normalizes to «Другое», with the free text preserved as the opening timeline entry
— backward-compatible with the existing inline gig-detail dispute flow). A new `DisputeEntry` model (`disputeId`,
`authorRole`, `authorName`, `text`, `createdAt`) MUST provide the timeline. `resolveDispute` MUST record the moderator verdict (in favour of specialist /
company / 50% split) on resolution and append a closing timeline entry. The `DisputeDetailVM` MUST expose
`openerRole`, `amount`, `evidence`, the `timeline`, and the typed `reason`.

#### Scenario: Opening a dispute captures role, amount, reason, and a timeline
- GIVEN a participant opens a dispute on a gig with one of the six reasons
- THEN the dispute MUST persist `openerRole` (derived from whether the opener is the gig client or assigned
  specialist), `amount` = the gig budget, the `reason` normalized to the six (unknown → «Другое»), any `evidence`
  names, and an opening `DisputeEntry`
- AND `getDispute` MUST return these via `DisputeDetailVM`

#### Scenario: Resolving records the verdict + closes the timeline
- GIVEN an OPEN dispute and a moderator
- WHEN it is resolved with a verdict (specialist / company / 50% split)
- THEN the dispute status MUST become resolved with the verdict in `resolution`, a moderation-log entry MUST be
  created, and a closing `DisputeEntry` (authorRole `moderator`) MUST be appended
- AND existing dispute authorization + the `(gigId, openerId)` uniqueness MUST be preserved

### Requirement: Ratings and Transactions Stay Computed; Migration Is Backward-Compatible
Ratings (`getRatingForUser`) and finances/transactions (`getFinances`) MUST remain computed — no stored
`ratingStars`/`ratingCount` and no `Transaction` table. The migration MUST be backward-compatible: new columns have
defaults and existing rows back-fill (`reason`→`Другое`, `openerRole` derived, `amount`←gig budget) with no data loss,
and the build + unit/integration suites MUST stay green.

#### Scenario: Migration applies cleanly and nothing regresses
- GIVEN the migration
- WHEN it runs against existing data
- THEN existing disputes/categories/notifications MUST back-fill to valid defaults, ratings/finances MUST still be
  computed (no new stored columns for them), the gig lifecycle integration tests MUST still pass, and
  `npm run build` + `npm run test:unit` MUST be green

**Acceptance Criteria:**
- `under_review` derived (OPEN+apps → `review`) in the card/detail/dashboard mappers; `Gig.status` enum + lifecycle unchanged
- `Category.color` added + seeded (5 hues); `Notification` gains `payment` type (+ optional `text`); `markAsPaid` tags payment
- `Dispute` gains `openerRole`/`amount`/`evidence`/typed `reason` + a `DisputeEntry` timeline; resolve records the verdict
- ratings + transactions stay computed; migration back-fills defaults; `build` + unit/integration green; lifecycle unaffected
