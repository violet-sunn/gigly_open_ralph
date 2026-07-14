# Tasks: shell-nav-support-fixes

All work is in `app/_design/AppShellDesign.tsx` and `app/components/NotificationDropdown.tsx`. Preserve
the captured visual design of every control — behavior/positioning only.

## 1. Спец #14 — Make the GIGLY wordmark link home

- [x] In `AppShellDesign.tsx`, replace the wordmark `<div>` (`~line 164`) with a `next/link` `<Link>` to
      the role-appropriate home: `admin ? "/admin" : "/dashboard"`.
- [x] Keep the exact wordmark styling (Handjet, `fontWeight: 700`, `fontSize: 30`, `letterSpacing: 2`,
      `color: var(--text-1)`, `lineHeight: 1`); set `textDecoration: "none"`, `color: "inherit"` on the link.
- [x] Add an accessible label (e.g. `aria-label="На главную"`).
- **Test plan:** Live desktop — as CLIENT and SPECIALIST, click GIGLY → lands on `/dashboard`; in the
      admin shell, click GIGLY → lands on `/admin`. Confirm wordmark looks pixel-identical (typography
      unchanged). `npx tsc --noEmit` clean for the file.

## 2. Спец #7 — Wire the sidebar collapse chevron

- [x] Add `collapsed` state initialized from `localStorage` (`gigly.sidebar.collapsed`), inside a
      `useEffect` (SSR-safe; default expanded when no stored value).
- [x] Replace the inert chevron `<div>` (`~line 167`) with a real `<button type="button">` (accessible
      label, e.g. `aria-label="Свернуть меню"` / `"Развернуть меню"`), preserving the chevron glyph
      styling; flip the glyph («»» when collapsed, «« when expanded).
- [x] On toggle: set state and persist to `localStorage`.
- [x] When collapsed: narrow the `<aside>` (e.g. width ~72px), hide nav labels/counts, profile name/sub
      text, and the support-card body copy (keep icons/avatar). Keep the expanded layout exactly as-is
      (default state must not regress).
- [x] Ensure the main content reflows to the reclaimed width without clipping.
- **Test plan:** Live desktop — click chevron collapses to an icon rail; glyph flips; click again
      restores full sidebar. Reload → state persists (check `localStorage.gigly.sidebar.collapsed`).
      Tab to chevron, press Enter/Space → toggles. `npx tsc --noEmit` clean. Verify expanded default is
      visually unchanged from the captured reference.

## 3. Спец #13 — Anchor the notifications dropdown within the viewport

- [x] In `NotificationDropdown.tsx`, change the panel positioning (`~line 75`, currently
      `absolute right-0 mt-2 w-80`) so the panel opens attached to the bell and stays on-screen: since the
      bell is in the left sidebar, open toward the content area (e.g. anchor left / open rightward-and-down)
      and constrain so the panel's left/right edges stay within the viewport.
- [x] Do NOT change dropdown content, per-type accent borders, empty/loading/error states, internal
      `max-h-96 overflow-y-auto` scroll, or the bell's click-outside/Escape close logic.
- **Test plan:** Live desktop (≥1024px) — open the bell; the panel is fully visible (no left/right/bottom
      clipping) and visually attached to the bell. Open on a route with many notifications → internal
      scroll still works. Confirm click-outside and Escape still close it. `npx tsc --noEmit` clean.

## 4. Спец #2 — Wire the «Что случилось?» support control

- [x] In `AppShellDesign.tsx`, replace the inert support `<button>` (`~line 300`) with a `next/link`
      `<Link href="/help">` (or wrap the control) so activating it navigates to the existing `/help`
      support page. Keep the exact pill styling (`--surface-sunken` bg, hairline shadow, «Что случилось?»
      label, send icon).
- [x] Keep an accessible label (e.g. `aria-label="Что случилось?"`).
- **Test plan:** Live desktop — click «Что случилось?» → lands on `/help` (mailto + FAQ visible). Tab to
      the control and press Enter → same navigation. Confirm the «Поддержка» card looks unchanged.

## 5. Verification & regression sweep

- [x] `npx tsc --noEmit` — no new type errors in `app/_design/AppShellDesign.tsx` /
      `app/components/NotificationDropdown.tsx`.
- [~] `npm run build` — NOT run: a dev server is live on :3000, and building over it corrupts the shared
      `.next` (known failure mode). Substituted by dev-mode live verification below (Next compiled every
      affected route on demand with zero console errors), which exercises the same code paths. Run
      `npm run build` in a clean tree (dev server stopped) before shipping if a production build gate is
      required.
- [x] Live click-through across all three roles (CLIENT, SPECIALIST, admin): wordmark → home; chevron →
      collapse/expand + persist; bell → on-screen dropdown; support → `/help`. No new console
      errors/warnings. (Automated Playwright run: 36/36 assertions PASS, 0 console errors.)
- [x] Confirm the header, search bar, filters, theme toggle, gear (`/settings`), and logout are all still
      wired and visually unchanged (no regression to already-working controls).
- [x] Grep `app/_design/AppShellDesign.tsx` to confirm no remaining `cursor: "pointer"` element without a
      handler and no `<button>` without an action.
