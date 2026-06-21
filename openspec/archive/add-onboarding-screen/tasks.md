# Tasks — add-onboarding-screen

Reconcile the onboarding wizard (`/register`) to `gigly_full_design/Онбординг.dc.html` — close the un-reconciled gaps the
diff surfaced (footer legal links, step-3 consent disclaimer, step-3 CTA «Продолжить»), keeping the already-faithful
flow/headings/step-dots/role-awareness and the richer schema-backed field sets (owner-confirmed). Friction: **low** (a
small new block + wizard-chrome edits; `registerUser`/schema untouched).

## 1. AuthFooter block
- [x] `app/components/blocks/AuthFooter.tsx`: a token-pure footer of three legal links — «Политика конфиденциальности»,
      «Условия пользования», «Помощь» (a `Stack`/row of links; `#` hrefs for now). Export from `index.ts`.
- **Test:** `domain-blocks.test.tsx` — AuthFooter renders the three links.

## 2. Wizard chrome reconciliation
- [x] `app/register/RegisterWizard.tsx`: pass `<AuthFooter />` into `AuthLayout`'s `footer` slot; on step 3 render the
      consent disclaimer «Нажимая «Продолжить», вы соглашаетесь с Политикой конфиденциальности и Условиями пользования
      платформы»; rename the step-3 submit CTA «Зарегистрироваться» → «Продолжить». Keep the flow, the `AuthHeader`
      headings (incl. role-aware step 3), `AuthStepDots`, `RoleCards`, the credential step, and the schema-backed field
      sets. No className/style.
- **Test:** E2E — the footer links + the step-3 disclaimer + the «Продолжить» CTA render; a full registration succeeds.

## 3. Keep the field sets + registerUser (no change)
- [x] Confirm `registerUser` + the persisted CLIENT (companyName/ИНН/contactPerson/phoneNumber) + SPECIALIST
      (displayName/position/techStack/specialization/experienceLevel/timezone) fields are unchanged (owner-confirmed —
      the prototype's shorter list is illustrative; no data loss). No schema/action edit.
- **Test:** the existing `register-onboarding.test.ts` (registerUser persistence) stays green unchanged.

## 4. Token-purity + composition-purity (F2 / F5)
- [x] No `className=`/`style=`/hex literals in `RegisterWizard.tsx` beyond layout-primitive props; `AuthFooter` (a block)
      stays token-pure.
- **Test:** `lint:composition` PASS (RegisterWizard F5-pure); `lint:tokens` PASS (no new literal).

## 5. Record the decision
- [x] `docs/DESIGN_SYSTEM_SPEC.md` §10.x: the onboarding = `/register` wizard mapping; the reconciled chrome (footer +
      consent disclaimer + «Продолжить»); the kept-richer-fields decision (illustrative prototype list); the `AuthFooter`
      block + the AuthLayout footer slot. Check the Phase-3 item in `full-design-reground.md`.
- **Test:** the note records the structure + the decisions (incl. why it's a revision, not a new screen).

## 6. Tests (add/update)
- [x] `compose-onboarding.spec.ts` (new E2E): the 3-step flow renders; the footer links; the step-3 consent disclaimer;
      the «Продолжить» CTA; a role→credentials→profile registration succeeds → `/dashboard`.
- [x] `domain-blocks.test.tsx`: AuthFooter render.
- [x] `register-page-redesign.spec.ts`: update the step-3 CTA assertion to «Продолжить» if it asserts «Зарегистрироваться»;
      keep the rest green.
- **Test:** all pass.

## 7. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` — PASS.
- [x] `npm run lint:composition` — PASS.
- [x] `npm run build` — PASS (`/register`).
- [x] `npm run clean:test-db && npm run test:unit` — green (incl. AuthFooter + register-onboarding).
- [x] `compose-onboarding` (+ the existing register) E2E green.
- **Acceptance (Fidelity DoD):** F2 token-pure, F1 structural/overlay match to the prototype onboarding steps, F3 flow
  parity (3-step role→credentials→profile registration), F5 composition-pure. F1 ≤1% deferred to Phase 4.

## 8. Planning-status (Phase 3)
- [x] Check `add-onboarding-screen` in `full-design-reground.md` Phase 3 (the final Phase-3 item).
- **Test:** the Phase-3 item reads `[x]`.
