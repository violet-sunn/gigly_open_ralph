# Proposal — live-counters

## Why

Round-3 stress test (tester Арсений): «серверные действия не обновляются», «счётчики не работают», «уведомления не приходят вообще даже после обновления страницы, только при обновлении сессии с перезаходом». The app reads as broken — a specialist applies to a gig and the client's bell simply never moves.

**This was diagnosed live**, in dev *and* against a real production build (`next build && next start`), with seed users (client `ivan.petrov@techcorp.ru`, specialist `andrey.sokolova@mail.ru`, `TestPass123`, gig `seed-open-gig-12`). The findings narrow the problem precisely:

| Hypothesis | Verdict |
| --- | --- |
| Notification write is lost / racy (fire-and-forget before `redirect()`) | **REFUTED** — the write persists immediately (7→8) on Node |
| The read path (`app/actions/notification.ts`) is cached or wrong | **REFUTED** — it is correct and uncached |
| Counters are stale in-session | **CONFIRMED** — bell stays put with no reload *and* after client-side navigation |
| «F5 не помогает, только перезаход» | **NOT app logic** — F5 *does* update the bell in both dev and prod locally; the tester saw this only on `gigly-m0jo.amvera.io`, so it is an Amvera proxy/CDN cache serving `/dashboard` by URL |

**Roots (verified in code):**
1. `app/components/NotificationBell.tsx` fetches `getUnreadCount()` in `useEffect(…, [])` — **once, on mount** — and it lives in the persistent `app/(protected)/layout.tsx` shell, which does **not** re-mount on client-side navigation. So the count is frozen for the life of the tab.
2. The sidebar gigs/chats badges are computed **once** in that same server layout (`prisma.gig.count` / `getUnreadChatCount`) and never re-render on navigation.
3. There is **no** `export const dynamic` / `Cache-Control: no-store` anywhere in `app/` (verified by grep — zero hits), so nothing stops an intermediary from serving a stale authenticated page by URL.

The data layer is fine. This change is about **freshness of the read**, not correctness of the write.

## What

1. **`NotificationBell` refreshes itself** — refetch the unread count on every route change (`usePathname()` in the effect deps), on tab re-focus, and on a light interval poll (~30s) as a backstop. The bell must move without a manual reload.
2. **Sidebar badges go live** — the gigs/chats counts become client-refreshed (seeded by the server-rendered values, then refetched on navigation/poll) instead of a once-per-mount server render. `AppShellDesign` is already a client component using `usePathname()`, so this is wiring, not restructuring.
3. **Anti-cache hardening for the deployment layer** — authenticated, counter-bearing responses must be uncacheable (`Cache-Control: no-store` on authenticated responses + `export const dynamic = 'force-dynamic'` on the counter-bearing segments) so an Amvera proxy cannot serve a stale `/dashboard`. This is what makes the tester's «только перезаход» symptom actually go away in production.
4. **Cheap insurance on the write** — `await` the `createNotification(...)` calls that currently fire-and-forget before `redirect()` in `app/actions/gig.ts`. The write already works on Node; awaiting removes any future serverless/edge timing risk at no real cost.

## Constraints

- **No real-time transport.** No WebSockets, SSE, or a polling library. Poll + navigation-refetch only — this is a defense-deadline fix (~2026-07-19), and the app is documented as request-response with manual refresh.
- **Do not change notification semantics.** The unread derivation (`Notification.lastReadAt`), the preference gating in `getUnreadNotifications`, and mark-read behavior all stay exactly as they are.
- Token-pure / `gigly_full_design` skin; no visual redesign of the bell or badges.
- The poll must be cheap and must not fire for logged-out users or hammer the DB — `getUnreadNotifications` is a non-trivial query (it loads gigs + messages + notifications).

## Non-goals

- Real-time push/streaming notifications (a separate, larger change).
- Redesigning the notification dropdown or the bell's appearance.
- Fixing the pre-existing English-string test drift in `gig-authorization` / `authorization-errors`.
- Reworking `getUnreadNotifications`' query shape or performance (only add a cheap count path if the poll makes it necessary).
- Round-3 clusters C3 (`apply-terms-lock`) and C5 (`examples-for-clients`).

## Risks

- **Poll cost.** `getUnreadCount()` currently calls the full `getUnreadNotifications()`. A 30s poll per open tab multiplies that query. Mitigation: refetch on navigation/focus (the high-value triggers) and keep the interval conservative; if measurably heavy, add a cheap count-only query path.
- **Proxy behavior is unverified from here.** The `no-store` hardening is the correct fix for a URL-keyed cache, but the Amvera layer can only be truly confirmed by re-testing against `gigly-m0jo.amvera.io` after deploy. The fix is correct regardless of whether the proxy is the cause, which is why it ships either way.
