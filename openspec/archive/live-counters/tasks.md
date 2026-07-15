# Tasks — live-counters

Diagnosed roots (do not re-litigate): the **write is fine** and the **read path is fine**. The bug is *freshness* — `NotificationBell` fetches once in `useEffect(…, [])` inside a persistent shell that never re-mounts, the sidebar counts are a once-per-mount server render, and nothing marks authenticated responses uncacheable (zero `export const dynamic` / `Cache-Control` in `app/`).

Refresh triggers, applied consistently to both the bell and the sidebar counts: **pathname change**, **~30s poll** (≤60s), **tab re-focus**.

## 1. Shared live-counts source (server action)
- [x] Add a server action returning the session user's nav counts + unread bell count in one round trip (e.g. `getLiveCounts()` in `app/actions/notification.ts` or a small `app/actions/counts.ts`): `{ notifications, gigs, chats }`.
- [x] Reuse the **existing derivations** — `getUnreadCount()` for notifications, `getUnreadChatCount({ userId, role })` for chats, and the same role-scoped `prisma.gig.count` the layout uses (CLIENT → `clientId`, SPECIALIST → `assignedSpecialistId`). Do NOT duplicate/fork count logic; if useful, extract the layout's gig-count into a helper both call.
- [x] Return zeros (or a clear "unauthenticated" signal) rather than throwing/redirecting when there's no session, so a poll from a logged-out tab is harmless.
- **Test plan:** unit/integration — for a seeded CLIENT with known unread state, the action returns counts matching `getUnreadCount()` / `getUnreadChatCount()` / the layout's gig count; with no session it does not throw.

## 2. `NotificationBell` — refresh without a reload
- [x] `app/components/NotificationBell.tsx`: add `usePathname()` and put it in the fetch effect's deps so every client-side navigation refetches.
- [x] Add a ~30s interval poll (≤60s) as an idle backstop; clear the interval on unmount (no leaked timers).
- [x] Refetch on tab re-focus (`visibilitychange` / `focus`).
- [x] Guard the refresh so it does not close the open dropdown or steal focus, and swallow/ignore fetch failures (logged-out tab) without console spam.
- **Test plan:** live — client on `/dashboard`, specialist applies; bell increments after in-app navigation and, separately, within the poll window with no interaction. Dropdown stays open across a background refresh.

## 3. Sidebar «Мои гиги» / «Чаты» badges — go live
- [x] `app/_design/AppShellDesign.tsx` (already a client component using `usePathname()`): seed state from the server-rendered `counts` prop (no zero-flash on first paint), then refetch via the Task-1 action on the same triggers as the bell.
- [x] Keep `app/(protected)/layout.tsx` computing the initial counts server-side (it stays the SSR seed). Consider sharing one refresh hook between the bell and the shell so there's a single poll, not two.
- [x] The ADMIN shell path (`counts={{}}`) MUST NOT issue count fetches.
- **Test plan:** live — counterparty sends a message; «Чаты» badge increments after navigation/poll without a reload. Hard reload shows correct counts with no flash to zero.

## 4. Anti-cache hardening (the actual production fix)
- [x] Set `Cache-Control: no-store` on authenticated responses in `middleware.ts` — it already runs the session/role gate, so it's the single choke point. Scope it to authenticated HTML; do NOT make static assets or public routes uncacheable.
- [x] Add `export const dynamic = 'force-dynamic'` to the protected shell / counter-bearing segments (currently zero such directives exist in `app/`).
- [x] Sanity-check the build output: the protected routes should render dynamically (ƒ), not be statically optimized (○).
- **Test plan:** `next build && next start` — inspect response headers on `/dashboard` (expect `no-store`); confirm the route table marks protected routes dynamic; confirm static assets still cache normally.

## 5. Awaited notification writes (insurance)
- [x] `app/actions/gig.ts`: await the `createNotification(...)` / `createNotificationsBulk(...)` calls that precede a `redirect()` (call sites around L263, L410, L457, L473, L569, L586, L644, L688, L733).
- [x] Keep each failure-isolated — a rejected notification promise MUST NOT fail the user's action; log it, matching the existing `updateGig` fan-out contract ("a notification fan-out failure does not fail the edit").
- [x] Ensure `redirect()` stays outside any `try` that would swallow Next.js's control-flow redirect error.
- **Test plan:** integration — the existing notification/fan-out tests stay green; a mocked notification failure still lets the action succeed and redirect (there is already such a test for `updateGig`).

## 6. Verify live end-to-end
- [x] `npx tsc --noEmit` clean on touched files; `npm run build` clean.
- [x] Playwright pass, **dev**: client `ivan.petrov@techcorp.ru` on `/dashboard` → bell increments (a) after in-app navigation and (b) via the idle poll with no interaction; «Чаты» badge increments likewise.
- [x] Repeat against a **real prod build** (`next build && next start`) — kill the dev server first, `.next` is shared and building over a live dev server corrupts it.
- [x] Confirm no leaked intervals / no console errors on logout with a tab open.
- [x] Clean up temp scripts; ad-hoc Playwright scripts live **inside** the project dir (ESM resolution).
- **Test plan:** the E2E above, run in dev and prod; assert on the rendered badge text, not internal state.

### Corrections to this plan, found while implementing
- The PRD's specialist `andrey.sokolova@mail.ru` **does not exist** in the seed. Real seed specialists: `alexey.ivanov@mail.ru`, `dmitry.volkov@yandex.ru`, `sergey.morozov@gmail.com`.
- The **stimulus** is a directly-written `Notification`/`Message` row rather than a specialist's UI click. `Notification` is unique on `(userId, gigId)` and the bell counts *gigs with unread*, so the row must land on a gig with no existing notification row. This is sound because the change under test is read-freshness only — the write path was already proven correct (7→8) during diagnosis, and every assertion is on the rendered badge with no reload.
- The middleware `matcher` did **not** cover `/my-gigs`, `/chats`, `/finances`, `/disputes`, `/settings` — so `no-store` would have missed most counter-bearing routes. Extended it (header-only; no redirect block matches them, so the `(protected)` layout remains their auth guard).

## Verification summary (2026-07-15)
- **Live E2E — 7/7 in BOTH dev and a real prod build** (`next build && next start`), seed client `ivan.petrov@techcorp.ru`:
  - authenticated `/dashboard` carries `no-store` (prod: `private, no-store, max-age=0, must-revalidate`; dev: `no-store, must-revalidate`)
  - bell refreshes on in-app navigation, **no reload** (3 → 4)
  - «Чаты» badge **increments** on in-app navigation, no reload (1 → 2) — the conversation is marked read first, so this is a real +1 rather than a trivially-true assertion
  - bell refreshes via the **idle poll** with no navigation and no reload (4 → 5); the page URL is asserted unchanged across the wait
  - no console errors from the background refresh; a logged-out tab keeps polling without throwing or zeroing the UI
- **Build:** clean. Route table confirms every counter-bearing route is now ƒ (Dynamic) — `/dashboard`, `/chats`, `/my-gigs`, `/finances`, `/disputes`, `/settings`, `/profile`. Static assets still `public, max-age=31536000, immutable` (hardening correctly scoped).
- **Unit/integration:** new `__tests__/integration/live-counts.test.ts` 5/5 green (counts match the individual derivations; role-scoped; no-session does not throw; ADMIN zeroed).
- **Zero regressions:** full integration suite is **identical with and without this change** — 72 failed / 651 passed / 723 total both ways (measured by stashing the source changes). Those failures are the pre-existing English-string drift + test-db pollution greenup, untouched by this change.
- **Gotcha re-learned:** starting `npm run dev` while `next start` still held `:3000` corrupted the shared `.next` and made the client bundle die — the bell read 0 and looked broken. Not a code defect; kill the listener and `rm -rf .next` first.

## Validation (/ralphy-validate, 2026-07-15)

Every scenario in the two spec deltas mapped to evidence. **14 scenarios → 14 covered.**

**Gap found and fixed (real defect):** the "unauthenticated" scenario required that a logged-out tab issue no count
requests, but the hook polled forever — a tab left open after logout would hit the non-trivial unread query every 30s
indefinitely. `useLiveCounts` now sets a `stopped` ref on the first unauthenticated response and never asks again.
The scenario was also reconciled: a client cannot know its session ended without asking once, so the honest contract
is "exactly one request may observe it; polling MUST stop after that" — the original wording was unachievable.

**Added `__tests__/unit/components/NotificationBell.test.tsx` (9 tests, jsdom `dom` project)** for the scenarios live
E2E can't cheaply prove: tab re-focus refetch, hidden-tab does NOT refetch, interval backstop, permanent stand-down
after logout (keeping the last value, not flashing zero), interval cleared on unmount, background refresh does not
close an open dropdown, shell-driven bell opens no second poll, pathname-change refetch, and no badge before the
first real read.

**Mutation-tested (the tests bite):**
- reverting `useLiveCounts` to the original mount-only fetch → **4 tests fail** (navigation, focus, poll, dropdown refresh)
- removing the stand-down → the stand-down test fails with `expected 6 to be 2` (it kept polling)

**Re-verified live after the stand-down change** (it touched the hook the E2E proved): bell 3→4 on navigation, 4→5 via
the idle poll. 2/2.

**Coverage map:**
| Scenario | Evidence |
| --- | --- |
| Bell refreshes on client-side navigation | live 3→4 (dev+prod) + component test |
| Bell refreshes on idle poll | live 4→5 (dev+prod) + component test |
| Bell refreshes on tab re-focus | component test (+ hidden-tab negative) |
| Polling stands down when unauthenticated | component test (mutation-verified) |
| Refresh does not disturb an open dropdown | component test |
| Chats badge updates | live 1→2 (real +1: read first, then delivered) |
| Gigs badge updates | `live-counts.test.ts` (role-scoped derivation) + same hook/state as chats |
| SSR counts are the initial value (no flash) | component test (no badge before first read); shell seeds `useState` from the `counts` prop |
| Counts remain correctly derived | `live-counts.test.ts` 5/5 vs `getUnreadCount`/`getUnreadChatCount` |
| Authenticated responses no-store | live header assert, dev + prod |
| Counter-bearing segments dynamic | build route table — all ƒ |
| Hard reload reflects current state | no-store + force-dynamic in place; **full confirmation is deploy-gated → Task 7** |
| Notification persists before redirect | existing `application-notifications.test.ts` |
| Notification failure does not fail the action | existing `gig-editing.test.ts` fan-out test |

**Final state:** typecheck clean; touched suites 111 passed / 3 failed — the 3 are the pre-existing English-string
drift, proven identical with the change stashed (full integration suite: 72 failed / 651 passed **both ways**).

## 7. Post-deploy confirmation (Amvera proxy)
- [ ] After `./deploy-to-amvera.sh`, re-run the tester's scenario against `gigly-m0jo.amvera.io` to confirm «F5 не помогает, только перезаход» no longer reproduces — this is the only way to actually confirm the proxy-cache theory, which cannot be verified locally.
- [ ] If it still reproduces, the remaining suspect is an Amvera-side cache config (not app code) — capture response headers as evidence before changing anything else.

## 8. Reconcile spec on archive (deferred to /ralphy-archive)
- [x] Applied to canonical `openspec/specs/ui/spec.md`: ADDED "Notification Bell Refreshes Without a Manual Reload" (5 scenarios), "Sidebar Nav Counts Are Live" (4 scenarios), "Authenticated Counter Surfaces Are Not Cacheable by an Intermediary" (4 scenarios, incl. the static-assets-stay-cacheable guard). Amended "Notification Bell in Navigation" to state it governs display/dropdown only and to point at the freshness requirement — it was silent on refresh, which is precisely how the bug hid in a "spec-compliant" component.
- [x] Applied to canonical `openspec/specs/gig/spec.md`: ADDED "Notification Writes Are Awaited Before Redirect", explicitly framed as defence-in-depth (the write was never the cause) so nobody later reads it as the fix.
- [x] Moved `openspec/changes/live-counters/` → `openspec/archive/live-counters/`.

## ⚠️ Carried forward at archive — Task 7 is NOT done
The code is complete and verified; **Task 7 (post-deploy Amvera confirmation) remains genuinely open** and was
deliberately not ticked. The `no-store` + `force-dynamic` hardening is correct and verified locally, but the tester's
«F5 не помогает, только перезаход» symptom only ever reproduced on `gigly-m0jo.amvera.io` and **cannot be confirmed
fixed from a local environment**. After the next `./deploy-to-amvera.sh`:
1. Re-run the tester's scenario against `gigly-m0jo.amvera.io`.
2. If it still reproduces, the remaining suspect is Amvera-side cache config, not app code — capture the response
   headers (`curl -sI` on `/dashboard` with a session cookie) as evidence *before* changing anything else.
