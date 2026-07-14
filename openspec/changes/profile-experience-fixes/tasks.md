# Tasks — profile-experience-fixes

Ordered so the schema/data layer lands before the UI that reads it. Verify **live in both roles**
(specialist + client) after the functional tasks, not tests-only. One commit for the change.

## 1. Schema: add `User.lastSeenAt`
- [x] Add `lastSeenAt DateTime?` to `model User` in `prisma/schema.prisma` (nullable, no default —
      additive, backward-compatible; existing rows read `null` ⇒ offline).
- [x] `npx prisma db push` (SQLite; no data migration) and regenerate the client.
- **Test plan:** `npx prisma db push` succeeds with no destructive prompt; `prisma.user` type includes
  `lastSeenAt`. Confirm existing seed rows load with `lastSeenAt === null`.

## 2. Heartbeat server action
- [x] Add a `heartbeat` Server Action (e.g. `app/actions/presence.ts`, `'use server'`): read
      `getSession()`; if unauthenticated → **no-op return** (no write, no redirect); else
      `prisma.user.update({ where: { id: session.userId }, data: { lastSeenAt: new Date() } })`.
- [x] Keep it dependency-free (no realtime/SaaS). Swallow/absorb errors (fire-and-forget; a failed
      ping must never surface an error to the user).
- **Test plan:** integration — invoking `heartbeat` as an authenticated user sets `lastSeenAt` to
  ~now; invoking unauthenticated writes nothing and does not throw a redirect/error.

## 3. Shell heartbeat ping (client)
- [x] Add a tiny client component (e.g. `app/_design/Heartbeat.tsx`, `"use client"`) that calls the
      `heartbeat` action once on mount and then every ~60s via `setInterval` (cleared on unmount).
      Pause when `document.hidden` if trivial; otherwise a plain interval is acceptable for MVP.
- [x] Mount it once in the authenticated shell (`app/_design/AppShellDesign.tsx` or the protected
      layout) so it runs on every logged-in page. No visual output.
- **Test plan:** live — load any authenticated page, observe `lastSeenAt` advancing (~1/min) in Prisma
  Studio / a quick query; no console errors; unmounting stops the interval.

## 4. `getProfile` — real online computation
- [x] In `lib/view-models.ts` `getProfile`, load `showOnlineStatus` and `lastSeenAt` for the target
      user (add to the `user` select/include).
- [x] Add a shared `ONLINE_WINDOW_MS = 5 * 60_000` and compute
      `online = user.showOnlineStatus && !!user.lastSeenAt && (Date.now() − user.lastSeenAt.getTime()) < ONLINE_WINDOW_MS`.
- [x] Set `header.online = online` in **both** the SPECIALIST branch (`:919`) and the CLIENT branch
      (`:984`); remove the hardcoded `online: false`.
- **Test plan:** integration in `__tests__/integration/profile-evolution.test.ts` — (i)
  `showOnlineStatus=true` + `lastSeenAt=now` ⇒ `header.online === true`; (ii) `lastSeenAt` 6 min ago ⇒
  `false`; (iii) `lastSeenAt=null` ⇒ `false`; (iv) `showOnlineStatus=false` + `lastSeenAt=now` ⇒
  `false`.

## 5. `ProfileDesign` — render the real online pill
- [x] Replace the hardcoded offline pill (`ProfileDesign.tsx:270–273`) with markup driven by
      `data.header.online`: dot colour + label (online → accent/green dot + «онлайн»; offline →
      grey dot + «offline», preserving current styling tokens).
- **Test plan:** live — an active owner with `showOnlineStatus` on shows online; toggling
  `showOnlineStatus` off in `/settings` shows offline. Visual matches the existing pill style.

## 6. (a) Unmistakable edit affordance
- [x] Give the `Pencil` control (and any other bare edit icons) an accessible label + `title`
      («Редактировать») and a clear hover/cursor affordance; confirm it opens the modal and never
      saves on click. Displayed fields must not save on click.
- [x] Confirm each modal persists only via its explicit «Сохранить», and dismiss discards.
- **Test plan:** live in both roles — pencil opens the edit modal (no save occurs); editing + Save
  persists and closes; ✕/overlay dismiss discards. Screen-reader label reads "Редактировать".

## 7. (b) Obvious client-profile edit button
- [x] In the CLIENT branch of `ProfileDesign`, add a clearly labeled «Редактировать» button (owner-only)
      as the edit entry point, opening the existing `CompanyModal` (requisites). Keep the bare pencil
      or fold it into the button — the labeled control is the obvious affordance.
- [x] Align the specialist affordance so both roles read consistently (labeled, obvious). Ensure
      non-owner viewers see no edit control.
- **Test plan:** live — a CLIENT owner sees an obvious «Редактировать» button that opens the requisites
  modal; a non-owner viewing the profile sees no edit control; specialist affordance is consistent.

## 8. (c) Experience-level selector + display
- [x] Add an explicit Middle / Senior selector (radio/segmented, pre-set from `editFields.experienceLevel`)
      to a specialist edit modal (extend the «Опыт»/bio modal or add a small level control), submitting
      `experienceLevel` through `updateProfile` (already validated/persisted — no action change).
      Keep the `HiddenFields` round-trip correct so the level is no longer only a hidden field.
- [x] Display the chosen level explicitly on the specialist profile alongside Стек/Опыт (labeled
      badge/field); empty level renders nothing misleading.
- **Test plan:** integration — save `experienceLevel: 'SENIOR'` via `updateProfile`, `getProfile`
  round-trips it. Live — the modal shows a Middle/Senior selector; setting Senior displays it on the
  profile; empty level is graceful.

## 9. Verify & regression
- [x] `npx tsc --noEmit` (app source) clean.
- [x] `npm run clean:test-db && npm run test:unit` — profile/settings integration green (see
      `[[test-db-pollution]]`: run the clean first).
- [x] Live click-through in **both roles** (specialist + client): pencil = edit (not save); explicit
      Save persists; client has an obvious edit button; experience level settable + displayed; active
      user shows online; `showOnlineStatus` off ⇒ offline. Zero console errors.
- [x] One commit; update `openspec/planning/prod-feedback-fixes.md` item #6 → IMPLEMENTED with a
      summary; do not archive until the initiative reconciles the canonical `profile/spec.md`.

## Notes / guardrails
- Reground rules: build on the prototype's inline-styled markup + `app/_design/tokens.css`; do not
  reintroduce kit primitives (`[[gig-detail-rebuilt-on-design-code]]`).
- Do not build a parallel edit screen — extend the existing modals in `ProfileDesign`
  (`[[fix-at-source-not-parallel-screen]]`, `[[compose-screen-inline-islands]]`).
- Don't build over a live dev server (`[[build-vs-dev-next-corruption]]`): kill `:3000` before any
  `npm run build`.
