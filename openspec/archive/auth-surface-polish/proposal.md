# Auth Surface Polish — Password Visibility & Register Layout

**Change:** `auth-surface-polish`
**Parent plan:** `openspec/planning/prod-feedback-fixes.md` (Change 7 of 8)
**Status:** PROPOSED

## Why

The Amvera stress-test (round 1, both roles) surfaced two auth-screen defects that make the
onboarding surface feel unfinished before the diploma defense (~2026-07-19):

- **Спец #1** — none of the password fields have a show/hide affordance. A user who mistypes a
  password (especially with the Latin-only strength rules) cannot see what they entered, on either
  the login screen or any onboarding step. This is standard, expected behaviour on any modern auth
  form and its absence reads as low-fidelity.
- **Спец #17** — on the register (onboarding) screen the «Условия пользования» footer link falls
  visually **between** the «Зарегистрироваться» primary button and the «Войти» link. The three
  elements read as one broken cluster (primary action → legal text → secondary action), instead of
  a clean hierarchy of primary action, subordinate secondary action, and clearly-subordinate legal
  text.

Both are cosmetic/UX polish, not functional bugs, but they directly undercut the «high-end B2B
marketplace» positioning on the very first screen a reviewer touches.

## What Changes

All changes are confined to `app/_design/AuthDesign.tsx` (a client component). They are purely
additive / layout — **no** server action, schema, route, middleware, or dependency changes, and the
existing design language (Handjet/Manrope, `app/_design/tokens.css` color tokens) is preserved.

1. **Password visibility toggle (Спец #1).** Every password `<input>` gains an inline show/hide
   control (eye / eye-off icon) that toggles the input's `type` between `password` and `text`. This
   covers:
   - the login screen «Пароль» field,
   - the onboarding step-2 «Пароль» (create) field,
   - the onboarding step-2 «Подтвердите пароль» (confirm) field.

   Each toggle is an accessible `<button type="button">` with an `aria-label` (e.g. «Показать
   пароль» / «Скрыть пароль») so it never submits the form and is usable by keyboard/screen reader.
   Toggling MUST NOT alter the field `name`, `value`, `required`, controlled state, the password
   checklist, or the confirm-match logic.

2. **Register screen action/legal ordering (Спец #17).** Re-layout the onboarding view so the
   primary «Зарегистрироваться» button, the secondary «Войти» link, and the legal «Условия
   пользования» text read as a clean top-to-bottom hierarchy — the legal link MUST NOT sit between
   the two action controls. The legal text stays visually subordinate (smaller / muted, per the
   existing footer link styling). The login screen's own footer (Политика/Условия/Помощь) and the
   step-1 role-picker are unaffected except as needed to stop the sandwiching.

## Non-Goals

- No change to `loginUser` / `registerUser` / `updateProfile` or any validation logic.
- No change to the password strength rules, the checklist, or the confirm-match behaviour.
- No new dependency or icon library — the eye icon is an inline SVG in the existing style.
- No re-grounding of the auth design, no responsive/mobile rework beyond the sandwich fix.

## Impact

- **Affected file:** `app/_design/AuthDesign.tsx` only.
- **Affected specs:** `authentication` (adds two UI requirements; the existing login/register/state-
  machine requirements are unchanged).
- **Verification:** live in the running app (per the plan's process) plus the acceptance scenarios
  below — no automated test suite change is required, though a targeted Playwright check is welcome.
