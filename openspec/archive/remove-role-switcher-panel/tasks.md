# Tasks — remove-role-switcher-panel

Client-only view edit in a single file (`app/_design/AppShellDesign.tsx`). No server, schema, or
dependency change.

## 1. Remove the role-indicator panel markup

- [x] In `app/_design/AppShellDesign.tsx`, delete the JSX block that renders the role segments —
      the `{/* role indicator … */}` comment plus the `<div>` (background `--surface-deep`,
      `marginTop: -12`) that maps over `roleSegs` to render the three
      «Специалист / Компания / Админ» `<div>` segments (currently ~lines 243–262).
- **Notes:** This block sits between the profile card `</div>` and the `{/* nav */}` `<nav>`.
  Remove the whole block, not just the inner map. Leave the profile card and the nav untouched.

**Test plan:** After the edit, the file has no JSX referencing `roleSegs`. `npx tsc --noEmit`
(or the project typecheck) passes.

## 2. Remove the dead role-preview state

- [x] Delete the now-unused derivations that only fed the panel: the `activeRole` const and the
      `roleSegs` array (currently ~lines 129–137), together with the
      `// The prototype's sidebar always shows all three role segments …` comment.
- **Notes:** Confirm `role` and `admin` are still used elsewhere (they drive
      `buildSidebarNav`/`buildAdminNav` at line ~85 and the profile card) — do **not** remove the
      props themselves, only the switcher-only `activeRole`/`roleSegs`. No other symbol references
      these two constants.

**Test plan:** `grep -rn "roleSegs\|activeRole" app/` returns nothing. Typecheck/lint clean
(no unused-variable errors).

## 3. Confirm nothing else depended on the panel; verify spacing

- [x] Grep the repo to confirm the switcher was self-contained:
      `grep -rn "roleSegs\|activeRole\|Специалист.*Компания.*Админ" app/ lib/` → no remaining hits.
- [x] Confirm the sidebar layout still reads cleanly with the panel's `marginTop: -12` gone: the
      space between the profile card and the nav is now governed by the aside's `gap: 24`. Eyeball
      that there is no doubled gap or visual jump.
- **Notes:** Nav items, page titles, search/filter header, support card, and logout are all driven
      from `role`/`admin` independently of the removed state, so they should be visibly unchanged.

**Test plan:** `npm run build` succeeds; no new lint failures attributable to this change (compare
against the known pre-existing baseline noted in `prod-feedback-fixes.md`).

## 4. Live verification in all three roles

- [x] Run the app (`npm run dev`) and log in as a **SPECIALIST**: sidebar shows **no**
      «Специалист / Компания / Админ» panel; profile card (avatar, name, role label, bell, gear)
      intact; specialist nav items + page titles render and navigate; console has no new
      errors/warnings.
- [x] Repeat as a **CLIENT / Компания**: no panel; client nav + titles correct; card intact.
- [x] Repeat as an **admin** (`admin = true` shell): no panel; admin nav (`buildAdminNav`) + admin
      titles correct.
- **Notes:** Per project memory, avoid running `npm run build` against a live `npm run dev` server
      (corrupts `.next`); verify live on the dev server, and if a production build is needed, stop
      dev first.

**Test plan:** Manual click-through per role. Acceptance = every ADDED-requirement scenario in
`specs/ui/spec.md` holds; the REMOVED panel is absent in all three shells.

## 5. Wrap up

- [x] Mark Change 4 (`remove-role-switcher-panel`) complete in
      `openspec/planning/prod-feedback-fixes.md` (Status checklist + progress count).
- [x] Commit (single-file view change) and, per the established feedback-round workflow, push to
      `origin/master` when the user confirms.
