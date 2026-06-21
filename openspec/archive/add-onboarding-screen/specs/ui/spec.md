# Spec delta — ui (add-onboarding-screen)

Reconciles the onboarding wizard (`/register`) to `gigly_full_design/Онбординг.dc.html` by closing the remaining fidelity
gaps — the footer legal links, the step-3 consent disclaimer, and the step-3 CTA copy — while keeping the already-faithful
flow/headings/step-dots/role-awareness and the richer schema-backed field sets. Token-pure (F2) + composition-pure (F5).

## MODIFIED Requirements

### Requirement: Onboarding Wizard Reconciled to the Prototype
The `/register` onboarding wizard MUST remain a composition-pure `@composed-screen` inside `AuthLayout`, reconciled to
`Онбординг.dc.html` as a 3-step flow — step 1 role («Создайте свой аккаунт» / «Выберите свою роль в Gigly.», `RoleCards`),
step 2 credentials (email + password + confirm), step 3 the role-aware profile (CLIENT «Добро пожаловать» / SPECIALIST
«Настройте свой аккаунт») — with the `AuthHeader` + `AuthStepDots` 3-dot indicator. It MUST additionally render: the
**footer legal links** («Политика конфиденциальности» · «Условия пользования» · «Помощь») via the `AuthLayout` footer
slot, the **step-3 consent disclaimer** «Нажимая «Продолжить», вы соглашаетесь с Политикой конфиденциальности и Условиями
пользования платформы», and the step-3 submit CTA **«Продолжить»**. The role-aware **field sets are kept** (CLIENT:
companyName/ИНН/contactPerson/phoneNumber; SPECIALIST: displayName/position/techStack/specialization/experienceLevel/
timezone) and `registerUser` is unchanged (same persistence, redirect to `/dashboard`). The screen MUST be token-pure
(F2) and composition-pure (F5); all on-screen text Russian.

#### Scenario: The wizard renders the reconciled chrome
- GIVEN a visitor on `/register`
- WHEN the wizard renders
- THEN the footer MUST show «Политика конфиденциальности», «Условия пользования», «Помощь»
- AND on step 3 it MUST show the consent disclaimer and a «Продолжить» submit CTA
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: The 3-step flow still registers successfully
- GIVEN a visitor completing role → credentials → role-specific profile
- WHEN they submit «Продолжить»
- THEN `registerUser` MUST create the account with the role-specific fields and redirect to `/dashboard`

#### Scenario: Field sets are kept (no data loss)
- GIVEN the step-3 profile for each role
- THEN the CLIENT fields MUST include ИНН + контакт + телефон and the SPECIALIST fields MUST include стек + уровень +
  часовой пояс (the prototype's shorter list is illustrative; the richer schema-backed set is kept)

## ADDED Requirements

### Requirement: AuthFooter Block
A new `AuthFooter` block MUST render the three onboarding legal links — «Политика конфиденциальности», «Условия
пользования», «Помощь» — token-pure, suitable for the `AuthLayout` footer slot.

#### Scenario: AuthFooter renders the legal links
- GIVEN the `AuthFooter` block
- WHEN it renders
- THEN it MUST show the three links and contain no `className=`/`style=`/hex literals beyond its kit primitives

### Requirement: Onboarding Reconciliation Keeps the Suite Green
The change MUST add the AuthFooter render test + an onboarding E2E and keep the existing register tests + the build,
token-purity, composition, and unit/E2E suites green.

#### Scenario: Tests green
- GIVEN `compose-onboarding.spec.ts`, `domain-blocks.test.tsx`, and the existing `register-page-redesign.spec.ts`
- WHEN they run
- THEN they MUST assert the footer links + the step-3 consent disclaimer + the «Продолжить» CTA + a successful
  registration, and the AuthFooter render
- AND `npm run build`, `npm run lint:tokens`, `npm run lint:composition`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- `/register` reconciled to `Онбординг.dc.html`: footer legal links (via `AuthLayout.footer`) + step-3 consent disclaimer + «Продолжить» CTA; flow/headings/step-dots/role-awareness kept
- new `AuthFooter` block (3 legal links) + render test; richer schema-backed field sets kept (owner-confirmed; no `registerUser`/schema change)
- F2 + F5 lints + `build` + `test:unit` + `compose-onboarding` E2E green; the existing register E2E kept green; F1 = structural vs the prototype onboarding frame (≤1% Phase 4)
