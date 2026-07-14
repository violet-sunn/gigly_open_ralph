# Remove the role-switcher panel from the app shell sidebar

**Change:** `remove-role-switcher-panel`
**Created:** 2026-07-14
**Status:** ARCHIVED (2026-07-14) — removed the non-interactive demo role-switcher panel (`roleSegs`/`activeRole` state + 3-segment render block, 31-line deletion in `app/_design/AppShellDesign.tsx`). Nav/titles unaffected (driven by `role`/`admin` props); profile card + role label intact. Verified live across all three roles (SPECIALIST→/dashboard, CLIENT→/dashboard, ADMIN→/admin): no switcher, card + nav render, zero console errors; app-source typecheck clean; grep confirms dead state gone. Spec merged into `openspec/specs/ui/spec.md` («Sidebar Reconciled…» role-framing scenario replaced + new «MUST NOT present a role switcher» requirement). No schema/server/dependency change.
**Planning:** `openspec/planning/prod-feedback-fixes.md` (Change 4)

## Why

Stress-testing surfaced a demo control that leaked into the production UI (Спец #3): the sidebar
profile card shows a three-segment **«Специалист / Компания / Админ»** panel that looks like a
role switcher. It comes straight from the design prototype (`Gigly App.dc.html`), where showing all
three roles at once demonstrated the different shells. In the real app a user's role is **fixed by
their account** — a specialist is never a company, never an admin — so a role selector (even a
non-interactive one that merely highlights the active role) is misleading: it reads as "click to
change who I am", invites confusion, and exposes the internal role taxonomy to end users for no
benefit. It must not appear in the shipped product.

The panel is currently **non-interactive** (the segments are plain `<div>`s that highlight the
active role but do nothing on click), so removing it changes no behavior — only the misleading
affordance disappears. The user's actual role is already communicated by the **role label**
(`profile.sub`) inside the profile card and, correctly, by which navigation items appear.

## What Changes

1. **Remove the role-indicator panel** from `app/_design/AppShellDesign.tsx` — the JSX block that
   renders the three `roleSegs` segments (currently lines ~243–262, the `<div>` with the
   `Специалист/Компания/Админ` map). Also remove the now-dead state that only fed it: the
   `activeRole` derivation and the `roleSegs` array (currently lines ~129–137) and the
   `// role indicator` comment.
2. **Preserve the rest of the profile card and shell.** The profile card (avatar, name, the
   `profile.sub` role label, notification bell, settings gear) stays exactly as-is. The
   sidebar navigation, page titles, search/filter header, support card, and logout are all driven
   independently from the `role`/`admin` props (via `buildSidebarNav`/`buildAdminNav`) and must be
   unaffected — nav items and the derived page title continue to reflect the account's real role.
3. **No visual regression from the removed spacing.** The panel carried a `marginTop: -12` that
   pulled it up toward the profile card; with it gone, the sidebar's `gap: 24` governs the space
   between the profile card and the nav. Confirm the sidebar still reads cleanly (no doubled gap,
   no jump) for all three roles.

## Non-goals / Constraints

- **No role-switching feature.** This does not add an admin "view as" or impersonation control; the
  panel is simply deleted, not rewired.
- **No change to how role is determined or displayed elsewhere** — `profile.sub`, `buildSidebarNav`,
  `buildAdminNav`, and `markActive` are untouched.
- **No redesign** of the sidebar, profile card, or any other shell chrome — reuse the existing
  markup and `app/_design/tokens.css` tokens; only the switcher block is removed.
- **No new dependencies, no schema change, no server-side change.** This is a client-only view edit
  in one file (`app/_design/AppShellDesign.tsx`).

## Verification

Verified live (not only by grep): log in as each of the three roles — a **SPECIALIST**, a
**CLIENT/Компания**, and an **admin** — and confirm the sidebar renders with **no**
`Специалист/Компания/Админ` panel; the profile card (avatar, name, role label, bell, gear) is
intact; the correct role-specific nav items and page titles still appear and navigate correctly;
the browser console shows **no** errors or warnings introduced by the change; and a repo grep for
`roleSegs`/`activeRole`/the three-role segment map returns nothing in `app/`.
