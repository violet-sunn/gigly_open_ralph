# Change: shell-nav-support-fixes

## Why

Live desktop click-through of the shared app shell (`app/_design/AppShellDesign.tsx`) surfaced four
inert or broken chrome controls. Each was transported verbatim from the `gigly_full_design` prototype
markup but was never wired to real behavior, so users hit dead controls on every authenticated screen:

- **Спец #7 — sidebar collapse chevron «« is dead.** The chevron renders with `cursor: "pointer"`
  (`AppShellDesign.tsx:167`) but has no handler; clicking it does nothing. Users expect it to collapse
  and expand the sidebar.
- **Спец #14 — the GIGLY wordmark is not clickable.** It renders as a plain `<div>`
  (`AppShellDesign.tsx:164`). Every mature app treats the wordmark as "go home"; here it is inert.
- **Спец #13 — the notifications dropdown opens off-screen.** `NotificationDropdown` uses
  `absolute right-0 mt-2 w-80` (`NotificationDropdown.tsx:75`). Because the bell lives inside the
  left-hand sidebar profile card (~250 px from the left edge), a 320 px-wide panel anchored to the
  bell's right edge extends leftward past the viewport's left edge, so the panel is clipped / runs
  off-screen on desktop.
- **Спец #2 — the «Поддержка / Что случилось?» widget is inert.** The button (`AppShellDesign.tsx:300`)
  has no `onClick`, no `href`, and no `type="submit"` form — it is a fully dead control, despite a
  working `/help` support page (mailto `a.pisotskiy@gmail.com` + FAQ) already existing.

These are behavior/positioning defects only. The visual design of every control must be preserved.

## What Changes

- **Collapse toggle (#7):** Wire the chevron to collapse/expand the sidebar. Collapsed state narrows
  the sidebar to an icon-only rail (labels, counts, profile text, support-card copy, and the search bar
  interplay unaffected — the header is untouched), and the chevron glyph flips to indicate the inverse
  action. Persist the collapsed/expanded state in `localStorage` (`gigly.sidebar.collapsed`) and restore
  it on reload. No layout regression for the expanded (default) state.
- **Wordmark home link (#14):** Make the GIGLY wordmark a `next/link` to the role-appropriate home —
  `/admin` when the shell is in admin mode (`admin === true`), otherwise `/dashboard`. Keep the exact
  wordmark typography (Handjet 30px, letter-spacing 2).
- **Notification dropdown anchoring (#13):** Reposition `NotificationDropdown` so it opens attached to
  the bell and stays fully within the viewport on desktop widths (≥1024 px). Because the bell sits in
  the left sidebar, the panel MUST open toward the content area (rightward/downward) rather than off the
  left edge, and MUST NOT overflow the left, right, or bottom viewport edge. Content and behavior of the
  dropdown are unchanged.
- **Support widget action (#2):** Wire the «Что случилось?» control to a real destination — navigate to
  the existing in-app `/help` page (which carries the `mailto:a.pisotskiy@gmail.com` contact and FAQ).
  Preserve the control's existing visual styling; only its behavior changes. No dead control remains.

## Impact

- Affected specs: `ui`
- Affected code:
  - `app/_design/AppShellDesign.tsx` — collapse state + chevron handler, wordmark `Link`, support
    control `Link` to `/help`
  - `app/components/NotificationDropdown.tsx` — viewport-safe anchoring (positioning classes only)
- **Non-goals:**
  - No visual redesign of any control; only behavior/positioning changes.
  - No change to the header, search bar, filters, theme toggle, gear, or logout — those are already
    wired.
  - No new support/contact form or backend; the support control reuses the existing `/help` page.
  - No mobile-specific shell work (the shell is desktop-only per the existing "desktop-only" wiring).
  - No change to notification data, content, icons, or mark-as-read behavior — dropdown positioning only.
