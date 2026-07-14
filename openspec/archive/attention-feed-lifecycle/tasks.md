# Tasks: attention-feed-lifecycle

## 1. Filter the attention query in `getDashboardAttention`

- [x] In `lib/view-models.ts`, update the `prisma.notification.findMany` call in
      `getDashboardAttention` (around line 165) to add the filter to `where`:
      ```ts
      where: {
        userId,
        lastReadAt: null,                              // unread only
        gig: {
          status: { notIn: ['COMPLETED', 'PAID'] },    // not terminal
          closedByAdmin: false,                        // not admin-killed
        },
      },
      ```
      Keep `include: { gig: true }`, `orderBy: { createdAt: 'desc' }`, and `take: 6` unchanged.
      The relation filter on `gig` means the cap applies to the filtered set (filter-then-take).
- [x] Confirm no other caller relies on the old unfiltered behavior (grep
      `getDashboardAttention` — it feeds only the dashboard VM assembly). Verified: the only
      call site is `getSpecialistDashboard` at `lib/view-models.ts:291`.

**Test plan:** `npx tsc --noEmit` clean. Confirm the `where` compiles against the generated Prisma
types (relation filter on `gig.status` / `gig.closedByAdmin` is valid because `include` still
returns the row).

## 2. Verify empty-state and count badge in the dashboard UI

- [x] Read `app/(protected)/dashboard/DashboardDesign.tsx` around line 415. Confirm the block is
      gated by `vm.attention.length > 0` (block hidden when feed empties) and the badge renders
      `vm.attention.length` (filtered count). Verified: block gated at `:415`, badge at `:419`
      reads `vm.attention.length`. **No change needed.**
- [x] Confirm `page.tsx` maps `getDashboardAttention` output straight into `vm.attention` with no
      re-fetch or re-count that would bypass the filter. Verified: `getSpecialistDashboard`
      returns `attention` straight from the filtered helper; no re-count.

**Test plan:** Visual/manual confirmation in step 5; no code expected here.

## 3. Integration test — the filter rule

- [x] Add tests near the existing dashboard-VM specs (e.g.
      `__tests__/integration/specialist-dashboard-vm.test.ts`, which already seeds a
      `Notification`). Cover:
  - An unread notification on an `IN_PROGRESS` gig **is** returned.
  - After the gig transitions to `COMPLETED` (and separately `PAID`), the same notification is
    **not** returned.
  - A notification whose gig has `closedByAdmin = true` is **not** returned.
  - A notification with a non-null `lastReadAt` is **not** returned.
  - Cap correctness: with >6 unread live-gig notifications plus several COMPLETED-gig
    notifications interleaved by recency, exactly the 6 newest **live-gig unread** rows come back,
    newest-first, and no COMPLETED-gig row appears even if more recent.

**Test plan:** `npm run clean:test-db` then `npm run test:unit -- specialist-dashboard-vm` (or the
chosen spec file); all new assertions pass. (Per test-db hygiene, clean first to avoid escalating
factory-validation failures.) ✅ Done — added a `describe('getDashboardAttention — attention-feed
lifecycle filter')` block with 6 tests (live-shown, COMPLETED-dropped, PAID-dropped,
admin-closed-dropped, read-dropped, cap-excludes-more-recent-COMPLETED). `vitest run` → **8/8 pass**
(2 original + 6 new); `tsc --noEmit` clean for touched files.

## 4. E2E test — the reported bug end-to-end

- [x] Add/extend an E2E spec (Playwright): as a specialist, have an application accepted (produces
      an `application_accepted` notification → «Требует внимания» lists it with «Открыть»), then
      drive the gig to `COMPLETED` (client approves work). Assert the «Требует внимания» card for
      that gig is gone and the count badge dropped by one.
- [x] Assert a second, still-actionable unread notification on a live gig **remains** visible, so
      the filter is proven selective (not a blanket hide).

**Test plan:** `DISABLE_RATE_LIMIT=true` in the Playwright webServer env; restart the `:3000`
listener before the run if the dev server has a stale test.db handle. Run the targeted spec;
both assertions pass. ✅ Done — `__tests__/e2e/attention-feed-lifecycle.spec.ts` seeds two unread
acceptance notifications on two live gigs, asserts 2 CTAs scoped to the strip, transitions one gig
to COMPLETED, reloads, and asserts the strip drops to 1 CTA with the completed gig's card gone and
the active card still visible. `npx playwright test attention-feed-lifecycle` → **1 passed (16.1s)**
(fresh webServer on `file:./test.db`, no stale handle).

## 5. Live verification

- [x] Run the app, log in as a specialist with a completed gig that produced an acceptance
      notification. Confirm «Требует внимания» no longer shows that card and the count is correct.
- [x] Confirm an unread notification on an active gig still shows. Confirm an admin-closed gig's
      card is gone (integration-covered). Confirm the block disappears entirely when no actionable
      cards remain (existing empty-strip integration test).

**Test plan:** Manual click-through per the seed logins
(spec = `alexey.ivanov@mail.ru`, client = `ivan.petrov@techcorp.ru`, password `TestPass123`).
Do not `npm run build` over a live dev server (corrupts `.next`). ✅ Covered by the passing E2E,
which drives the **real** rendered dashboard (Next dev server + real DB + real `DashboardDesign`)
through card-shown → gig COMPLETED → card-gone + count-drop, with the active card remaining. The
admin-closed and empty-block cases are covered by integration tests.

## 6. Validate & document

- [x] Run `/ralphy-validate` (or `openspec validate attention-feed-lifecycle`) — every requirement
      has ≥1 scenario; deltas parse. ✅ Validated against the format rules by hand (the `openspec`
      CLI is not installed locally): the delta uses `## ADDED Requirements`; the single requirement
      carries MUST/SHALL language and **5** `#### Scenario:` blocks; `proposal.md`/`tasks.md` complete.
- [ ] After merge/verification, archive via `/ralphy-archive` and reconcile the `data-model` spec.
      *(Follow-up — deferred to the archive step, per the ralphy flow.)*
