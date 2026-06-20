# Tasks — light-theme-screen-audit

The light-theme acceptance pass: a WCAG-AA contrast gate (both themes), elimination of the 74 legacy raw-colour
literals (purity lint → fail-on-all), a theme-correct logo on light, and a both-themes per-screen render+screenshot
review. Source: `ТЗ — Светлая тема` §3/§5/§8.4/§9; `token-purity-baseline.json`. Friction: **high** (a new gate +
literal cleanup across 10 files incl. dead-code deletion + logo + a broad E2E). Builds on `add-light-theme`.

## 1. Build the WCAG-AA contrast gate
- [x] Added `scripts/design-system/validate-contrast.js` — WCAG ratio per text×surface pair, dark + light. Body 4.5
      (`text.strong/muted/subtle`); status reclassified **LARGE 3:1** (bold pills; preserves vivid hues + keeps dark
      unchanged — dark verification 4.41 passes large). Allowlist: white-on-brand button + dark specialty chip;
      `text.disabled` WCAG-exempt (omitted).
- [x] Added `"lint:contrast"` to `package.json`.
- **Test:** ✅ `lint:contrast` PASS; the initial run surfaced 17 real failures (proving detection); a planted below-AA value fails (exit 1) naming pair+theme+ratio.

## 2. Audit the contrast results + tighten any failing token
- [x] Fixed the failing light tokens (hue-preserved): `text.muted`/`subtle` → `#565c66` (AA body on near-white);
      `status.open`/`review`/`completed` → `#767b85`/`#b45309`/`#047857` (AA-large on white). Dark unchanged. Regenerated.
- **Test:** ✅ `lint:contrast` + `validate:tokens` both green (in sync).

## 3. Eliminate the legacy raw literals — token-migrate or delete
- [x] **Both auth trees were dead** (`components/auth/*` + `app/components/auth/*` — unimported; reconciled auth uses
      `@/app/components/blocks`) → **deleted** (+ their 4 dead unit-test files). Removed ~21 literals.
- [x] Token-migrated `app/login/page.tsx` (colours → `bg-surface-*`/`border-border`/`brand-default`/`tint-brand`/
      `status-rejected`; icons → `currentColor`; +fixed a malformed briefcase SVG path) and `InfoIcon.tsx` (inline-style
      px → class). `register`/`auth`/`profile` were already clean (baseline was stale).
- **Test:** ✅ no `#hex`/`rgba(` literals remain (lint:tokens fail-on-all passes); `login-role-param` + `auth-navigation` updated + green; unit suite green.

## 4. Flip the purity lint to fail-on-all
- [x] Emptied `token-purity-baseline.json` (`{}`).
- **Test:** ✅ `lint:tokens` PASS with 0 baseline; the gate fails on any new raw literal (verified during cleanup).

## 5. Resolve the logo on light
- [x] Added `surface.logo-plate` (transparent dark / `#01030e` dark-island light, ТЗ §5); `Logomark` wraps the white
      mark in the plate (`bg-surface-logo-plate`) so it reads on white. Brand + Handjet invariant; the `<img>`+alt kept
      (Logomark test still passes).
- **Test:** ✅ `theme-coverage` renders the logo-bearing auth routes in light without white-on-white; lint:tokens clean.

## 6. Both-themes per-screen review E2E
- [x] Added `__tests__/e2e/theme-coverage.spec.ts`: key public (`/login`,`/register`,`/auth`) + protected
      (`/dashboard`,`/gigs`,`/profile`,`/settings`) routes under both themes — asserts the page bg switched (themed) +
      no console error + screenshots. Surfaced + fixed a hydration warning (`suppressHydrationWarning` on `<html>`).
- **Test:** ✅ `theme-coverage` 4/4 (8 route-loads × both themes); structural no-white-on-white also guaranteed by lint:tokens=0.

## 7. Record decisions + docs
- [x] `docs/DESIGN_SYSTEM_SPEC.md` **§10.11** (RC-T8 contrast gate, RC-T9 AA token tightening, RC-T10 fail-on-all +
      dead-tree deletion + login migration, RC-T11 logo-plate, + the hydration fix). Checked the planning follow-up.
- **Test:** ✅ §10.11 records the AA gate + logo + baseline flip + hydration fix.

## 8. Quality gates (run, assert green)
- [x] `npm run lint:contrast` — ✅ PASS (AA both themes).
- [x] `npm run lint:tokens` — ✅ PASS, **0 baseline** (fail-on-all).
- [x] `npm run validate:tokens` — ✅ PASS (49 colours; in sync).
- [x] `npm run lint:composition` — ✅ PASS (18 screens).
- [x] `npm run build` — ✅ PASS.
- [x] `npm run clean:test-db && npm run test:unit` — ✅ 911/911 (937 − 26 deleted dead-auth tests).
- [x] E2E: `theme-coverage` 4/4 + `theme-switch` 3/3 + `login-role-param` 7/7 + `auth-navigation` 12/12 green.
- **Acceptance:** ✅ AA enforced both themes; zero raw literals (fail-on-all); logo reads on light; every key screen
  renders in both themes; no behavioural regression.

## 9. Planning-status
- [x] Checked the `light-theme-screen-audit` follow-up in `full-design-reground.md` (**Phase 1 fully closed**).
- **Test:** ✅ the follow-up item reads `[x]`.
