# add-onboarding-screen

**Type:** Regular change (UI reconciliation — the onboarding wizard `/register` to `Онбординг.dc.html`)
**Created:** 2026-06-21
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (final item; authored fresh from the prototype)
**Capability:** `ui`
**Depends on:** `reconcile-auth-and-onboarding` (archived — built the 3-step `RegisterWizard` + `AuthHeader`/`AuthStepDots`/
`RoleCards`, and `AuthLayout` which already has an unused `footer` slot).

## Why

The prototype `gigly_full_design/Онбординг.dc.html` is the onboarding flow: a **3-step wizard** (1 — pick role; 2 —
email + password + confirm; 3 — role-aware profile) with a 3-dot step indicator and the role-aware step-3 headings
(«ДОБРО ПОЖАЛОВАТЬ» / «НАСТРОЙТЕ СВОЙ АККАУНТ»). That flow **already exists** at `/register` (`RegisterWizard.tsx`), and
a direct diff confirms its **flow, step dots, role-awareness, and headings already match the prototype**.

But — per the project principle that pre-/early-reground UI that merely *exists* still needs a real revision to the
design bar — the diff surfaced **genuine un-reconciled gaps** the prototype shows and the wizard lacks:
1. **Footer legal links** on every step — «Политика конфиденциальности» · «Условия пользования» · «Помощь» (the
   `AuthLayout` `footer` slot is present but unused → the wizard renders no footer).
2. **Step-3 consent disclaimer** — «Нажимая «Продолжить», вы соглашаетесь с Политикой конфиденциальности и Условиями
   пользования платформы» (absent).
3. **Step-3 CTA copy** — the prototype's final action is **«Продолжить»**; the wizard says «Зарегистрироваться».

The **field sets** also differ (the prototype shows a shorter illustrative list), but per the product-owner decision the
wizard **keeps its richer, schema-backed fields** (CLIENT: ИНН/контакт/телефон; SPECIALIST: стек/уровень/часовой пояс) —
they persist real B2B/specialist data the app consumes; the prototype's field list is treated as illustrative.

## What

- **New `AuthFooter` block** — the three legal links («Политика конфиденциальности», «Условия пользования», «Помощь»),
  token-pure. Rendered via the existing `AuthLayout` `footer` slot.
- **`RegisterWizard`** — pass `<AuthFooter />` to `AuthLayout`; add the **step-3 consent disclaimer** (`Notice`/text,
  shown on step 3 above/with the submit); rename the **step-3 submit CTA** «Зарегистрироваться» → **«Продолжить»**.
  The flow, the `AuthHeader` headings (incl. the role-aware step-3 «Добро пожаловать»/«Настройте свой аккаунт»), the
  `AuthStepDots`, `RoleCards`, the credential step, and the **schema-backed field sets** are kept (already faithful /
  owner-confirmed).
- **`registerUser` is unchanged** — same fields persisted, same `redirect('/dashboard')` on success.

No screen carries off-token literals (F2) or bespoke markup (F5). All on-screen text is Russian, exactly as the
prototype shows it.

## Key facts / decisions (derived from the diff)

- **The onboarding flow IS the `/register` wizard** — `Онбординг.dc.html` maps to it (role → credentials → profile + step
  dots + role-aware welcome), already reconciled by `reconcile-auth-and-onboarding`. This change is a **fidelity revision**
  of the remaining gaps, NOT a new screen (the prototype has no separate post-register screen — its «welcome» is step 3).
- **Field sets kept (owner-confirmed):** the wizard's richer schema-backed fields stay; the prototype's shorter list is
  an illustrative mock. Recorded as a sanctioned deviation — no `registerUser`/schema change, no data loss.
- **The footer goes in `AuthLayout`'s existing `footer` slot** via a small reusable `AuthFooter` block (so login/auth can
  adopt it later — flagged; this change wires it on the onboarding wizard only).
- **`registerUser` redirect unchanged** (`/dashboard`) — onboarding completion still lands on the dashboard (whose
  onboarding cards continue the first-run guidance).
- **F1 baselines on the prototype frame** (`Онбординг.dc.html` steps 1–3); fonts resolved. F1 = structural/overlay match;
  the absolute ≤1% gate is Phase 4 (`refidelity-from-full-design`).

## Scope

- **New block:** `app/components/blocks/AuthFooter.tsx` (+ barrel export; a fixture if the workbench catalogs it).
- **Screen:** `app/register/RegisterWizard.tsx` — `AuthFooter` via `AuthLayout.footer`; the step-3 consent disclaimer;
  the «Продолжить» CTA.
- **Tests:** `__tests__/e2e/compose-onboarding.spec.ts` (the 3-step flow renders + the footer links + the step-3 consent
  disclaimer + the «Продолжить» CTA; a full role→credentials→profile registration still succeeds → `/dashboard`);
  `__tests__/unit/components/domain-blocks.test.tsx` (AuthFooter renders the three links). Keep the existing
  `register-page-redesign.spec.ts` green (update the step-3 CTA assertion if it asserts «Зарегистрироваться»).
- **Docs:** the note in `docs/DESIGN_SYSTEM_SPEC.md`; check the Phase-3 item in `full-design-reground.md`.

## Non-goals

- A separate post-register `/onboarding` route/screen (the prototype has none — its onboarding IS the register wizard).
- Changing `registerUser`, the persisted fields, the schema, or the role-aware field sets (owner-confirmed: kept).
- Reducing the wizard to the prototype's shorter illustrative field list (would drop ИНН / стек / уровень — data the app
  uses).
- Adding the footer to `/login` + `/auth` (possible follow-up; this change scopes it to the onboarding wizard).
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/Онбординг.dc.html` (steps 1–3: role L18–52, credentials L54–88, profile L90–136; the footer links
L47–51/L83–86, the step-3 consent disclaimer L133–135, the «Продолжить» CTA L129; role-aware step-3 L154–156). The
current `app/register/RegisterWizard.tsx` + `app/register/page.tsx`; `app/components/templates/AuthLayout.tsx` (the
`footer` slot, L8/L33); `AuthHeader`/`AuthStepDots`/`RoleCards`; `registerUser` (`app/actions/auth.ts`).
