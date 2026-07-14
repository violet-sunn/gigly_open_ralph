# Implementation Tasks: Responsive Dashboard & «Мои гиги»

Scope: targeted — the shared app shell, the dashboard, and the specialist «Мои гиги» at phone widths
(360–414px), single breakpoint at `1024px`, desktop unchanged at `≥1024px`. All three target files are
already `"use client"`.

## Status: ✅ COMPLETE (verified 2026-07-14)

All 5 tasks done and verified live. Playwright measurement across both roles at 360/390/414px and
1280px: **ALL PASS (12/12)** — `scrollWidth − clientWidth = 0` on `/dashboard` (CLIENT + SPECIALIST)
and `/my-gigs` at every phone width, all screens vertically scrollable, desktop (1280px) visually
unchanged. Screenshots confirmed: mobile dashboard (chips wrapped, WELCOME stacked), off-canvas drawer
(full nav/bell/gear/support reachable), single-column «Мои гиги», and pixel-identical desktop.

Key fix beyond the plan: the single-column grid needed `minmax(0, 1fr)` (not `1fr`) — a `1fr` track's
floor is the card's min-content (~380px, driven by the full-footer row), so the track never shrank and
`flexWrap` never engaged; `minmax(0, 1fr)` lets the track shrink to the available width, wrapping the
footer. Also added `flexWrap: "wrap"` + `minWidth: 0` to the `GigCard` full footer.

The 89 unit-suite failures are the pre-existing English→Russian string-drift greenup (session-tracking
etc.), unrelated to this change — the 73 tests referencing the changed components all pass.

Files changed: `app/_design/useIsNarrow.ts` (new), `app/_design/AppShellDesign.tsx`,
`app/(protected)/dashboard/DashboardDesign.tsx`, `app/(protected)/my-gigs/MyGigsDesign.tsx`,
`app/_design/GigCard.tsx`.

---

## Task 1: Add a shared narrow-viewport mechanism ✅

**Implementation:**
- Add a small client hook, e.g. `app/_design/useIsNarrow.ts`:
  - Back it with `window.matchMedia("(max-width: 1023px)")`; subscribe on mount, unsubscribe on unmount.
  - Return `false` until mounted (SSR + first client render) so the **desktop branch is the default** and there is no hydration flash / `!important` fight.
- Export a single `NARROW_QUERY` / breakpoint constant so all three components share `1024px`.
- (Optional) If a grid template is cleaner as a CSS class, add scoped rules under a `@media (max-width: 1023px)` block in `app/_design/tokens.css` — but these MUST NOT change the `≥1024px` result.

**Test Plan:**
```bash
npx tsc --noEmit
grep -n "max-width: 1023px" app/_design/useIsNarrow.ts
```

**Acceptance Criteria:**
- Hook compiles, returns `false` before mount, and flips to `true` under 1024px after mount.
- Single shared breakpoint constant reused by tasks 2–4.

---

## Task 2: Reflow the app shell and collapse the sidebar at narrow widths ✅

**Implementation (`app/_design/AppShellDesign.tsx`):**
- Consume `useIsNarrow()`.
- At narrow widths, switch the root shell from `flexDirection: "row"` to a column (or render the sidebar as a top bar / off-canvas drawer / icon-only rail) so the `<aside>` no longer occupies fixed horizontal space beside `<main>`; give the main column full viewport width.
- Reduce the fixed header/content horizontal paddings (`40px 48px 0 24px`, `24px 48px 48px 24px`) at narrow widths so content fits 360–414px.
- Let the header search + filter row wrap: allow the four `HeaderFilter` chips to `flexWrap` (or move them behind a control) instead of staying `flex: "none"` in one row.
- Preserve all wiring: nav (`buildSidebarNav`/`markActive`), `NotificationBell`, theme toggle, `SettingsModal` gear, search, logout, `#main-content` focus target, and the existing `collapsed` localStorage toggle (which is a separate desktop affordance — do not conflate with the narrow-width adaptation).
- Keep the `≥1024px` branch byte-for-byte as today.

**Test Plan:**
- Live at 390px: sidebar is collapsed/adapted, not a 283px in-row column; `documentElement.scrollWidth ≈ clientWidth`; nav/bell/settings/logout reachable.
- Live at 1280px: shell identical to current (sidebar 283px in-row, header/filter row unchanged).
```bash
npx tsc --noEmit
```

**Acceptance Criteria:**
- No page-level horizontal overflow attributable to the shell at 390px.
- Sidebar affordances reachable at narrow widths.
- Desktop shell unchanged at `≥1024px`.

---

## Task 3: Reflow the dashboard to a single column at narrow widths ✅

**Implementation (`app/(protected)/dashboard/DashboardDesign.tsx`):**
- Consume `useIsNarrow()`.
- WELCOME row: drop the fixed `width: 317` left column to full width and stack it above the tiles (or stack the tiles) at narrow widths.
- BOARD row: stack the `flex: 1` feed column above the `width: 400, flex: "none"` right rail, both full width.
- Both gig feeds: switch `gridTemplateColumns: "1fr 1fr"` → `"1fr"` at narrow widths.
- Keep «Требует внимания» as an intentional `overflowX: auto` rail (do not let it overflow the page).
- Preserve tab filtering, header-chip filtering (`applyGigFilters`), role panels, and all links.
- Keep the `≥1024px` layout unchanged.

**Test Plan:**
- Live at 390px, both roles: WELCOME/BOARD stacked, gig grid single-column, `scrollWidth ≈ clientWidth`, all sections reachable by vertical scroll.
- Live at 1280px: dashboard identical to current.

**Acceptance Criteria:**
- No horizontal overflow on `/dashboard` at 390px (CLIENT and SPECIALIST).
- All sections reachable by vertical scroll; attention rail does not overflow the page.
- Desktop dashboard unchanged at `≥1024px`.

---

## Task 4: Reflow the specialist «Мои гиги» grid at narrow widths ✅

**Implementation (`app/(protected)/my-gigs/MyGigsDesign.tsx`):**
- Consume `useIsNarrow()`.
- Switch the card grid `gridTemplateColumns: "1fr 1fr"` → `"1fr"` at narrow widths.
- Tab row already `flexWrap: "wrap"` — verify it stays usable; the empty state's fixed `width: 420` must not overflow (cap to `min(420, 100%)` / `maxWidth: "100%"`).
- Preserve tab filtering and header-chip filtering.
- Keep the `≥1024px` two-column layout unchanged.

**Test Plan:**
- Live at 390px: single-column cards, `scrollWidth ≈ clientWidth`, every card reachable by vertical scroll; empty state fits.
- Live at 1280px: two-column grid identical to current.

**Acceptance Criteria:**
- No horizontal overflow on `/my-gigs` at 390px.
- Every card and the empty state reachable/visible at narrow widths.
- Desktop grid unchanged at `≥1024px`.

---

## Task 5: Verify live at mobile and desktop, guard the range edges, regression ✅

**Implementation:**
- Drive the app live (seed login `TestPass123`; specialist `alexey.ivanov@mail.ru`, client `ivan.petrov@techcorp.ru`) and measure with a Playwright/DevTools snippet at 360, 390, and 414px, plus 1280px.
- Measurement per screen:
  ```js
  const de = document.documentElement;
  ({ scrollWidth: de.scrollWidth, clientWidth: de.clientWidth,
     overflow: de.scrollWidth - de.clientWidth });
  ```
  Ad-hoc verify scripts MUST live inside the project dir (ESM/@playwright/test resolution).
- Confirm vertical scroll reaches the last section/card on each mobile screen.

**Test Plan:**
```bash
npx tsc --noEmit
npm run test:unit   # existing suite must pass unchanged
```
- Manual/scripted live checks at 360/390/414px (dashboard both roles + `/my-gigs`) → `overflow ≤ ~2px`.
- Live check at 1280px → both screens + shell visually unchanged.

**Acceptance Criteria:**
- `scrollWidth − clientWidth ≤ ~2px` on `/dashboard` (both roles) and `/my-gigs` at 360, 390, and 414px.
- All content reachable by vertical scroll at phone widths.
- Desktop (`≥1024px`) layout unchanged.
- Existing tests pass without modification.
