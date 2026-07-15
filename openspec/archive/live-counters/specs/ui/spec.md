# UI — Spec Delta (live-counters)

> Reconciliation note: the existing "Notification Bell in Navigation" requirement (`openspec/specs/ui/spec.md`)
> specifies only that the badge *displays* a count — it is silent on **when the count is refreshed**, which is
> exactly the gap that made the app look broken. These requirements add the freshness contract. The existing
> "Unread, Mark-Read, and the Sidebar «Чаты» Count" requirement (which pins the count's *derivation* to
> `getUnreadChatCount`) stays authoritative for *what* is counted; this delta governs *when it re-reads*.

## ADDED Requirements

### Requirement: Notification Bell Refreshes Without a Manual Reload
The notification bell MUST keep its unread count fresh during a session without the user reloading the page. The bell lives in the persistent `app/(protected)/layout.tsx` shell, which does not re-mount on client-side navigation, so a mount-only fetch (`useEffect(…, [])`) is NOT sufficient and MUST NOT be the only refresh trigger.

#### Scenario: Count refreshes on client-side navigation
- GIVEN an authenticated CLIENT sitting on `/dashboard` with a bell count of N
- AND a specialist applies to one of their gigs (raising the true count to N+1)
- WHEN the client navigates in-app to another protected route (e.g. `/my-gigs`) without a full page reload
- THEN the bell MUST refetch the unread count and display N+1
- AND the refetch MUST be driven by the current pathname changing (e.g. `usePathname()` in the effect dependencies)

#### Scenario: Count refreshes on a poll backstop while the user is idle
- GIVEN an authenticated user who stays on a single route without navigating
- AND their true unread count changes
- WHEN the poll interval elapses (~30s, and no longer than 60s)
- THEN the bell MUST refetch and display the new count without any user action

#### Scenario: Count refreshes when the tab is re-focused
- GIVEN an authenticated user who switches away to another tab and returns
- WHEN the tab becomes visible again
- THEN the bell MUST refetch the unread count

#### Scenario: Polling stands down for unauthenticated users
- GIVEN a tab whose session has ended (logged out, or expired in another tab)
- WHEN the next poll observes an unauthenticated response
- THEN the hook MUST stop polling permanently — no further count requests for the life of that mount
- AND the counters MUST keep their last known value rather than flashing to zero
- AND the failed/unauthenticated read MUST NOT throw an unhandled error or spam the console
- NOTE: the client cannot know the session ended without asking once, so exactly one request per mount may observe
  the unauthenticated state; what MUST NOT happen is continued polling after that.

#### Scenario: Refresh does not disturb an open dropdown
- GIVEN the user has the notification dropdown open
- WHEN a background refresh completes
- THEN the dropdown MUST remain open and usable (the refresh MUST NOT close it or steal focus)

**Acceptance Criteria:**
- `NotificationBell` refetches on: pathname change, an interval of ~30s (≤60s), and tab re-focus (`visibilitychange`)
- The mount-only `useEffect(…, [])` fetch is replaced/extended — pathname is in the dependency list
- The interval is cleared on unmount (no leaked timers)
- Notification semantics are unchanged: unread still derives from `Notification.lastReadAt` via the existing `getUnreadCount` → `getUnreadNotifications` path, and preference gating is untouched

---

### Requirement: Sidebar Nav Counts Are Live
The sidebar «Мои гиги» / «Чаты» badges MUST reflect current state during a session. They are currently computed once per shell mount in the server layout (`prisma.gig.count` / `getUnreadChatCount`) and never re-render on client-side navigation; they MUST be refreshed on the same triggers as the bell.

#### Scenario: Chats badge updates after a new message arrives
- GIVEN an authenticated user whose sidebar shows a «Чаты» count of N
- AND the counterparty sends a message on a gig (raising the true unread-conversation count to N+1)
- WHEN the user navigates in-app or the poll interval elapses
- THEN the «Чаты» badge MUST display N+1 without a full page reload

#### Scenario: Gigs badge updates after a gig-set change
- GIVEN an authenticated user whose sidebar shows a «Мои гиги» count
- WHEN the underlying set of their gigs changes and they navigate in-app or the poll elapses
- THEN the badge MUST reflect the new count without a full page reload

#### Scenario: Server-rendered counts are the initial value (no flash)
- GIVEN a fresh page load of a protected route
- WHEN the shell first paints
- THEN the badges MUST render the server-computed counts immediately as their initial value
- AND MUST NOT flash empty/zero before the first client refetch

#### Scenario: Counts remain correctly derived
- GIVEN the live refresh
- WHEN the chats count is recomputed
- THEN it MUST still use `getUnreadChatCount` (gigs with unread messages), matching the inbox badges, per the existing "Unread, Mark-Read, and the Sidebar «Чаты» Count" requirement
- AND the gigs count MUST still be scoped by role (CLIENT → `clientId`, SPECIALIST → `assignedSpecialistId`)

**Acceptance Criteria:**
- A server action returns the nav counts for the session user, reusing the layout's existing derivations (no duplicated/divergent count logic)
- `AppShellDesign` (already a client component using `usePathname()`) seeds from the server-rendered `counts` prop and refetches on pathname change / poll / focus
- The ADMIN shell path (`counts={{}}`) is unaffected and MUST NOT issue count fetches

---

### Requirement: Authenticated Counter Surfaces Are Not Cacheable by an Intermediary
Authenticated, counter-bearing responses MUST be marked uncacheable so a proxy/CDN in front of the app cannot serve another user's or a stale session's HTML by URL. The codebase currently sets **no** `export const dynamic` and **no** `Cache-Control` header on any route (verified: zero occurrences), which is what allows the deployed Amvera layer to serve a stale `/dashboard` such that even F5 does not refresh it.

#### Scenario: Authenticated responses are marked no-store
- GIVEN an authenticated request to a protected route (e.g. `/dashboard`)
- WHEN the response is returned
- THEN it MUST carry a `Cache-Control` header of `no-store` (or equivalently `private, no-store, max-age=0`)
- AND an intermediary caching by URL MUST NOT be able to serve that response to a later request

#### Scenario: Counter-bearing segments are dynamically rendered
- GIVEN the protected shell and the routes that render counters
- WHEN the app is built
- THEN those segments MUST be dynamically rendered (e.g. `export const dynamic = 'force-dynamic'`), not statically optimized or full-route cached

#### Scenario: A hard reload always reflects current state
- GIVEN a user whose true counts have changed
- WHEN they hard-reload a protected route in the deployed environment
- THEN the response MUST reflect the current counts (never a cached earlier body)
- AND the «F5 не помогает, только перезаход» symptom MUST NOT reproduce

**Acceptance Criteria:**
- `Cache-Control: no-store` is set on authenticated responses (middleware is the natural single choke point, since it already runs the session/role gate)
- `export const dynamic = 'force-dynamic'` on the protected shell / counter-bearing segments
- Static assets and public/unauthenticated routes are NOT made uncacheable (the hardening is scoped to authenticated HTML)
- Verified in a real production build (`next build && next start`), not just dev
