# Change: attention-feed-lifecycle

## Why

The dashboard «Требует внимания» block never clears (Гигли баги #9). After a deal is
completed, the block still shows a stale card — e.g. «Ваша заявка принята» → «Открыть» — for a
gig already marked **Завершён / COMPLETED**. The acceptance card lingers forever, so the count
badge and the feed misrepresent what actually needs the user's attention.

Root cause: `getDashboardAttention` (`lib/view-models.ts:165`) returns the user's 6 most-recent
`Notification` rows **unconditionally** — no filter by read state, by the linked gig's lifecycle,
or by whether the gig was closed by an admin:

```ts
const notifications = await prisma.notification.findMany({
  where: { userId },
  include: { gig: true },
  orderBy: { createdAt: 'desc' },
  take: 6,
})
```

An «attention» feed should show only items that still require action. A card whose underlying
context is resolved — the gig finished (COMPLETED/PAID), the gig was closed by an admin, or the
user has already read the notification — should drop out.

## What Changes

Add a filter to `getDashboardAttention` so the feed keeps **only notifications that are unread AND
whose gig is still live**. Concretely, a notification is included iff **all** hold:

1. `lastReadAt` is `null` — the user has not read/opened it yet (unread).
2. The linked gig's `status` is **not** `COMPLETED` and **not** `PAID` (not in a terminal state).
3. The linked gig's `closedByAdmin` is `false` (not an admin-killed dead gig).

The filter is applied **in the Prisma query, before `take: 6`**, so the cap always returns up to 6
*still-actionable* cards (not 6 fetched-then-decimated). The newest-first ordering and the cap are
unchanged. The count badge in `DashboardDesign.tsx` is already derived from the filtered array
length, and the whole block is already hidden when the feed is empty — so the empty-state falls out
for free with no UI change required beyond verification.

### Why `lastReadAt: null` is the correct "unread" predicate here

There is one `Notification` row per `(userId, gigId)` (`@@unique([userId, gigId])`), created once
by `createNotification` (a plain `create`, so the row's `createdAt` is frozen at first-event time).
`lastReadAt` is only ever set **later**, by `markNotificationAsRead`. Therefore `createdAt >
lastReadAt` is effectively never true for a row that has been read, and the cross-column comparison
used elsewhere (`app/actions/notification.ts:87`) collapses to a simple `lastReadAt == null` for
this feed — which is natively expressible in a Prisma `where` (a cross-column compare is not).

## Non-Goals

- **No schema migration.** `Notification.lastReadAt` already exists (`schema.prisma:265`); no new
  read-state field is added.
- **No change to notification creation, the header bell/dropdown, or `markNotificationAsRead`.**
  Only the dashboard attention query is touched.
- **No new "dismiss" affordance.** Cards clear implicitly (read, or gig resolved), not via an
  explicit per-card dismiss button.
- **No broader per-viewer "resolved" logic** (e.g. dropping a `rejected` card while the gig is
  still OPEN for other specialists). Terminal gig state + admin-closed + read is the agreed rule.

## Impact

- Affected specs: `data-model` (notification / attention-feed behavior).
- Affected code:
  - `lib/view-models.ts` — `getDashboardAttention` query gains the filter.
  - `app/(protected)/dashboard/DashboardDesign.tsx` — verify empty-state + count badge (expected
    no change; badge already reads filtered length, block already hidden when empty).
- Behavior change: completed/paid/admin-closed and already-read cards disappear from «Требует
  внимания»; the count drops accordingly. Still-actionable unread cards on live gigs remain.
