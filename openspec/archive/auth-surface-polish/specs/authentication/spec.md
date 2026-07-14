# Authentication Specification Delta — auth-surface-polish

## ADDED Requirements

### Requirement: Password Field Visibility Toggle
Every password `<input>` rendered by `AuthDesign` MUST provide an inline show/hide control that
toggles the input's `type` between `password` (masked) and `text` (revealed). This applies to the
login «Пароль» field, the onboarding step-2 «Пароль» (create) field, and the onboarding step-2
«Подтвердите пароль» (confirm) field. The control MUST be an accessible `<button type="button">`
(so it never submits the form) with an `aria-label` that reflects the current action («Показать
пароль» when masked, «Скрыть пароль» when revealed). Toggling MUST NOT change the field's `name`,
`value`, `required`, controlled state, the password checklist, or the confirm-match logic. The
control MUST use the existing design language (Handjet/Manrope, `app/_design/tokens.css` color
tokens) and an inline SVG eye/eye-off icon — no new dependency.

#### Scenario: Login password can be revealed and re-hidden
- GIVEN a user on `/login` has typed a value into the «Пароль» field (rendered as dots)
- WHEN they activate the visibility toggle on that field
- THEN the field `type` MUST become `text` and the typed characters MUST be visible
- AND WHEN they activate the toggle again
- THEN the field `type` MUST return to `password` and the value MUST be masked again
- AND the field's `name="password"` and its value MUST be unchanged throughout

#### Scenario: Both onboarding step-2 password fields have independent toggles
- GIVEN a user on the onboarding step-2 «СОЗДАЙТЕ СВОЙ АККАУНТ» screen
- WHEN they view the «Пароль» and «Подтвердите пароль» fields
- THEN each field MUST have its own visibility toggle
- AND revealing one field MUST NOT change the masking of the other
- AND revealing the «Пароль» field MUST NOT hide or alter the password-strength checklist
- AND the confirm-mismatch indicator MUST still fire when the two values differ

#### Scenario: Toggle is accessible and non-submitting
- GIVEN any password field with a visibility toggle
- WHEN the toggle is inspected
- THEN it MUST be a `<button type="button">` (MUST NOT submit the surrounding `<form>`)
- AND it MUST expose an `aria-label` describing the action (show vs hide)
- AND it MUST be reachable and operable by keyboard

**Acceptance Criteria:**
- All three password inputs in `app/_design/AuthDesign.tsx` (login, step-2 create, step-2 confirm)
  render a show/hide toggle
- Toggle flips `type` between `password` and `text`; per-field independent state
- Toggle is `<button type="button">` with a state-reflecting `aria-label`; keyboard-operable
- No change to field `name`/`value`/`required`, checklist rendering, or confirm-match behaviour
- Icon is an inline SVG in the existing token/font style; no new package added

---

### Requirement: Register Screen Action and Legal-Link Ordering
The `AuthDesign` onboarding (register) view MUST present the primary «Зарегистрироваться» action,
the secondary «Войти» link, and the legal «Условия пользования» text as a clean, legible top-to-
bottom hierarchy. The legal link MUST NOT be positioned visually between the two action controls
(the sandwiched layout reported as Спец #17). The legal text MUST remain visually subordinate
(smaller / muted, consistent with the existing footer link styling). The existing design language
and the login-screen footer/step-1 role picker MUST be preserved except as needed to remove the
sandwiching.

#### Scenario: Legal link is not between the two register actions
- GIVEN a user on the onboarding step-2 register screen
- WHEN the screen renders
- THEN the «Зарегистрироваться» primary button and the «Войти» secondary link MUST read as an
  adjacent action pair
- AND the «Условия пользования» legal text MUST NOT appear vertically between «Зарегистрироваться»
  and «Войти»
- AND the legal text MUST be styled as subordinate (muted/smaller), not as a third peer action

#### Scenario: Register actions remain fully functional after re-layout
- GIVEN the re-laid-out onboarding step-2 screen
- WHEN the user submits «Зарегистрироваться» with a valid account
- THEN `registerUser` MUST still be invoked and onboarding MUST advance to step 3
- AND clicking «Войти» MUST still switch to the login view
- AND the «Условия пользования» link MUST still be present and navigable

**Acceptance Criteria:**
- On the register/onboarding view, primary button + «Войти» form an adjacent pair; the legal link is
  not sandwiched between them
- Legal link retains subordinate (muted/smaller) styling from the existing footer link style
- `registerUser` submit → step 3, and «Войти» → login, both unchanged
- Change confined to `app/_design/AuthDesign.tsx`; login footer / step-1 picker otherwise intact
