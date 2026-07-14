# Tasks — auth-surface-polish

All work is in `app/_design/AuthDesign.tsx`. No server action, schema, route, middleware, or
dependency changes. Preserve the existing design language (Handjet `MONO`, Manrope `GROTESK`,
`SANS`, and `app/_design/tokens.css` color tokens). One commit for the change.

## 1. Add an eye/eye-off icon + a reusable password field with visibility toggle

- [x] Add two inline SVG icon components (`EyeIcon`, `EyeOffIcon`) in the shared-bits section
      (alongside `PersonIcon`), `fill="currentColor"`, `aria-hidden="true"`, sized ~18px to match
      the field.
- [x] Introduce a small `PasswordField` helper (or an inline wrapper) that renders the existing
      `fieldStyle` `<input>` with a trailing toggle button positioned inside the field on the right
      (e.g. a `position: relative` wrapper + an absolutely-positioned `<button type="button">`).
      - Local `useState` `visible` per field; `type = visible ? "text" : "password"`.
      - Button `aria-label = visible ? "Скрыть пароль" : "Показать пароль"`; `title` optional.
      - Button styling: `background:none; border:none; cursor:pointer`, color `var(--text-3)`,
        `pointerEvents:auto`; keep the input's right padding clear of the icon (add right padding so
        text doesn't run under the icon).
      - MUST accept and forward all existing input props used at each call site: `name`,
        `placeholder`, `required`, `value`, `onChange`, and per-field style overrides (the confirm
        field's mismatch `borderColor`).
- [x] **Do NOT** change field `name`, `value`, `required`, or the controlled `value/onChange`
      wiring. The toggle only flips `type`.

**Test plan:** render each screen; confirm the input still posts under its original `name` and the
toggle button is `type="button"` (does not submit).

## 2. Wire the toggle into all three password inputs

- [x] **Login** (`LoginView`, ~line 374): replace the «Пароль» `<input type="password">` with the
      toggle-enabled field. Keep the «Забыли пароль?» link exactly as-is below it.
- [x] **Onboarding step-2 create** (`OnboardingStep2`, ~line 501): replace the controlled «Пароль»
      input (`value={pass}` / `onChange={onPass}`). The `PasswordChecklist` and the `extraError`
      note MUST still render immediately after, unchanged.
- [x] **Onboarding step-2 confirm** (~line 512): replace the controlled «Подтвердите пароль» input
      (`value={confirm}` / `onChange={onConfirm}`), preserving the mismatch `borderColor` override
      and the «Пароли не совпадают.» note.
- [x] Verify each field's visibility state is independent (revealing one does not reveal the other).

**Test plan (live):** on `/login` type a password → toggle reveals then re-hides it. On the register
step-2 screen, toggle each of the two password fields independently; confirm the checklist and the
mismatch indicator still behave; confirm «Зарегистрироваться» still submits and creates the account.

## 3. Re-layout the register screen actions + legal link (Спец #17)

- [x] Reproduce the defect live first: on the onboarding step-2 register screen, confirm the
      `Footer`'s centered «Условия пользования» falls visually between the «Зарегистрироваться»
      button and the «Войти» link (the source of the "looks broken" report).
- [x] Re-order so the primary «Зарегистрироваться» button and the secondary «Войти» link read as an
      adjacent pair, with the legal «Условия пользования» text clearly subordinate and NOT between
      them. Preferred approach (decide live, least-invasive first):
      - Keep «Войти» directly under the button cluster (tighten spacing) so the two actions are
        adjacent; and
      - Ensure the footer legal links (or a dedicated onboarding legal line) sit clearly below the
        action pair rather than overlapping it — e.g. suppress/relocate the 3-column `Footer` on the
        onboarding steps the way it's already suppressed differently on step 3 (`single` variant),
        or render the terms line as a subordinate element within the form flow.
- [x] Keep the legal link styled as subordinate (muted `var(--text-3)`, footer link size), matching
      the existing `Footer` `linkStyle`.
- [x] Do NOT alter the login-screen footer (Политика/Условия/Помощь) or the step-1 role picker
      beyond what's required to remove the sandwiching.

**Test plan (live):** on the register screen, the «Условия пользования» text is no longer wedged
between «Зарегистрироваться» and «Войти»; the three elements read as primary action → secondary
action → subordinate legal text; «Войти» still switches to login; the legal link is still present.

## 4. Verify & typecheck

- [x] App-source typecheck clean (no new TS errors in `app/_design/AuthDesign.tsx`).
- [x] Live click-through (per plan process, existing Playwright/dev flow), seed login
      `alexey.ivanov@mail.ru` / `TestPass123`:
      - Login «Пароль» toggle reveals/hides; value preserved; login still works.
      - Register step-2: both password toggles work independently; checklist + mismatch intact;
        «Зарегистрироваться» creates the account and advances to step 3.
      - Register screen layout reads cleanly — legal link not between the two actions.
      - Zero new console errors.
- [x] Update `openspec/planning/prod-feedback-fixes.md`: mark Change 7 (auth-surface-polish)
      IMPLEMENTED and tick the Status checklist.
