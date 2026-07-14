# Change: login-error-ux

## Why

**Гигли баги #3** — reported and verified live: on a failed login the form is unusable to recover from.

1. **Fields wipe on failure.** After a wrong password the URL stays `/login`, but both `input[name=email]` and the password field re-render **empty** (both read `''`), forcing the user to re-type everything to try again. Root cause: the login inputs in `app/_design/AuthDesign.tsx` (`LoginView`, ~L433–438) are **uncontrolled** with no `value`/`defaultValue`. The `<form action={loginAction}>` submission triggers React 19's automatic form reset after the Server Action resolves, and because nothing binds the fields they reset to empty. (The onboarding step-2 fields already avoid this by being controlled — login was left uncontrolled.)

2. **The error looks broken.** The `«Неверный email или пароль…»` message is rendered by `ErrorNote` as a **bare red `<p>`** with no background, border, or padding. Sitting in the form flow above the «Войти» button and over the absolutely-positioned decorative pixel-wave, the loose red text visually **overlaps** the button and the decoration — reading as a rendering glitch rather than a deliberate alert.

This is a first-impression, high-frequency flow (every mistyped password hits it), so the broken-looking, retype-everything experience is disproportionately damaging.

## What Changes

1. **Preserve entered credentials across a failed submit.** Convert the login `Email` and `Пароль` fields in `LoginView` to **controlled inputs** backed by local React state. Because controlled values are driven by state (not the form's DOM defaults), they survive React's post-action form reset, so a failed login leaves both fields populated for the user to review and correct. This keeps the password entirely client-side — the Server Action does **not** need to echo credentials back (avoiding sending the password in the action response payload).

2. **Restyle the login error into a self-contained alert.** Replace the bare red text on the login screen with a bounded alert block: tinted red background, red hairline border, padding, and rounded corners, occupying **its own row** in the form flow above «Войти». Its opaque/tinted background cleanly occludes the pixel-wave beneath it (the form already sits above the decoration in the stacking context) so nothing overlaps the button or the decoration. It keeps the Handjet/Manrope token design language and readable contrast.

### Non-Goals

- No change to authentication logic, session handling, rate limiting, or the Russian error copy itself.
- No change to the onboarding (register) step-2/3 error presentation or their already-controlled fields — this change is scoped to the **login** view. (An identical alert treatment MAY be reused there later, but is out of scope here.)
- The `loginUser` Server Action signature and return shape are **unchanged** (controlled inputs make an echo-back unnecessary); this is called out only as a rejected alternative.
- No implementation of the «Забыли пароль?» reset flow (remains a placeholder).

## Impact

- **Affected specs:** `authentication` (two ADDED requirements).
- **Affected code:**
  - `app/_design/AuthDesign.tsx` — `LoginView` (controlled email/password state + wiring), and the login error alert presentation (new alert block or a login-specific variant; the shared `ErrorNote` used elsewhere is left intact).
- **Affected code (likely none):** `app/actions/auth.ts` `loginUser` — expected to need **no change**; retained in scope only as a fallback if value-preservation cannot be achieved client-side.
- **Risk:** Low. UI-only, additive, no data-model or auth-flow changes.
