# Tasks: login-error-ux

## 1. Make the login Email + Пароль fields controlled (preserve values across failed submit)

- [x] In `app/_design/AuthDesign.tsx`, `LoginView`: add local state `const [email, setEmail] = useState("")` and
      `const [password, setPassword] = useState("")`.
- [x] Bind the `Email` `<input>` (~L434) to `value={email}` + `onChange={(e) => setEmail(e.target.value)}` (keep
      `name="email"`, `type="email"`, `required`, placeholder, `style={fieldStyle}`).
- [x] Bind the `PasswordField` (~L438) to `value={password}` + `onChange={setPassword}` (the component already forwards
      `value`/`onChange` for controlled use — same path the onboarding step-2 fields use). Keep `name="password"`,
      `required`, placeholder.
- [x] Confirm the `<form action={action}>` still submits via the Server Action (controlled inputs still post their
      `name`/`value` in the FormData — no change to submission).
- [x] Do NOT touch `loginUser` in `app/actions/auth.ts` — value preservation is client-side; no server echo of the
      password. (Only revisit if live verification shows values still don't persist.)

**Implementation notes:** React 19 auto-resets `<form>` fields after a Server Action resolves; uncontrolled fields
reset to empty, which is the bug. Controlled fields are driven by React state and are unaffected by the DOM form reset,
so a failed submit leaves them populated. The visibility toggle in `PasswordField` flips only `type` and is orthogonal
to the controlled `value`.

**Test plan:**
- Unit/DOM (if a component test harness is used for AuthDesign): render `LoginView` with an `error`, simulate typing
  into both fields, assert the inputs are controlled (value reflects state).
- Primary verification is live (Task 3).

## 2. Restyle the login error into a self-contained alert

- [x] Add a login-scoped alert block (either a small `LoginErrorAlert({ error })` component or an inline block in
      `LoginView`) that renders only when `error` is truthy. Leave the shared `ErrorNote` (used by onboarding) intact.
- [x] Style the alert with the token design language: tinted red background (derive from `var(--accents-red, #ff383c)`,
      e.g. a low-alpha fill), `1px solid` red border, padding (~12px), `border-radius: 8`, red text, `fontFamily`
      Manrope (`GROTESK`), `fontSize` ~13–14, `width: 100%`, `boxSizing: border-box`.
- [x] Place the alert on its own row inside the login `<form>` flow, above the «Войти» button (replace the current
      `<ErrorNote error={error} />` at ~L452 in `LoginView`).
- [x] Verify stacking: the form lives in `centerColumn` (`zIndex: 4`) above the pixel-wave (`zIndex: 1`); the alert's
      opaque/tinted fill must occlude the decoration rather than let red text bleed over it. Ensure no negative margins
      or absolute positioning cause it to overlap «Войти».
- [x] When `error` is falsy, render nothing (no empty box / reserved space).

**Implementation notes:** Keep the alert bounded and self-contained so it reads as an intentional alert, not stray
text. Use existing tokens only — no new color constants or dependencies. Match the auth surface's rounded/soft styling.

**Test plan:** Live verification (Task 3) — confirm bounded alert, readable contrast, no overlap with button or
pixel-wave.

## 3. Live verification (required)

- [x] Start the dev server (`npm run dev`) on `:3000`. If a stale `.next` / server is suspected, kill `:3000` and
      restart clean (do NOT `npm run build` over a live dev server).
- [x] Navigate to `/login`. Type a valid seed email (`alexey.ivanov@mail.ru`) and a WRONG password; submit.
  - [x] Assert URL stays `/login`.
  - [x] Assert the `Email` field still shows `alexey.ivanov@mail.ru` and the `Пароль` field still contains the typed
        wrong password (both non-empty).
  - [x] Assert the error renders as a bounded alert on its own row, legible, NOT overlapping «Войти» or the pixel-wave.
- [x] Without re-typing the email, correct the password to the seed value (`TestPass123`) and submit.
  - [x] Assert successful login and redirect to `/dashboard`.
- [x] (Optional) A Playwright script for this flow must live INSIDE the project dir (ESM/@playwright/test resolution),
      not the scratchpad.

## 4. Regression sanity

- [x] Onboarding (register) step-2/step-3 error handling and the controlled password/confirm fields are unchanged
      (shared `ErrorNote` untouched).
- [x] `npx tsc --noEmit` (or the project's typecheck) is clean for the touched file.
- [x] Existing auth unit/integration tests still pass (the `loginUser` action is unchanged, so its tests should be
      unaffected): run the auth-related suites.

## 5. Validate & wrap up

- [x] Run `/ralphy-validate` against this change's acceptance criteria.
- [x] Confirm both ADDED requirements' scenarios are satisfied by the live run.
