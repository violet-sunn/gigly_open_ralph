# reconcile-auth-and-onboarding

**Type:** Regular change (UI / screen reconciliation)
**Created:** 2026-06-18
**Plan:** `openspec/planning/figma-grounded-ui-reconciliation.md` — Phase 1, change #6 (first screen reconciliation)
**Capability:** `ui` (reconciles the composed auth/onboarding screen in `openspec/specs/ui/spec.md`)
**Depends on:** `add-onboarding-and-auth-blocks` (archived — supplies `AuthStepDots`, `Logomark`), `reconcile-design-tokens-from-figma`, `add-missing-primitives` (archived).

## Why

The 5 Figma auth/onboarding nodes are not separate routes — they are the **three steps of the existing
`/register` wizard** (`app/register/RegisterWizard.tsx`), with steps 2 and 3 having a per-role (specialist /
company) variant (`docs/figma-screens-export.md` §1–2):

| Figma node | Role | Maps to | Composes (authoritative) |
|---|---|---|---|
| create account *(role select)* `3179:3179` | both | RegisterWizard **step 1** | Logomark + H/sub + AuthStepDots(1/3) + roleplay ×2 |
| create account/specialist `3179:3863` | spec | RegisterWizard **step 2** | Logomark + H/sub + AuthStepDots(2/3) + Input ×3 + Button ×2 |
| create account/company `3195:4564` | co | RegisterWizard **step 2** | Logomark + H/sub + AuthStepDots(2/3) + Input ×3 + Button ×2 |
| welcome/specialist `3195:4282` | spec | RegisterWizard **step 3** | H/sub + AuthStepDots(3/3) + Input + Select ×2 + Button ×2 |
| welcome/company `3195:4704` | co | RegisterWizard **step 3** | H/sub + AuthStepDots(3/3) + Input + Select ×2 + Button ×2 |

The wizard already composes purely from the kit (`AuthLayout + RoleCards + form primitives`) but was built
**before Figma access** and therefore drifts on two authoritative points:

1. It uses the labelled **`StepIndicator`** (`["Роль","Доступ","Профиль"]`). The Figma auth screens use the
   minimal **dot `counter`** — now coded as the `AuthStepDots` primitive (Phase-0 #5). `StepIndicator` was
   flagged **superseded for auth**; this change performs the swap the prior change deferred.
2. It has **no `Logomark`** and **no per-step heading/subtitle**. Each Figma node leads with the brand mark
   (steps 1–2) and a heading + subtitle ("Создайте свой аккаунт" / "Выберите свою роль…" etc.).

This is the **reconciliation pass**, not a rebuild: the wizard stays one kit-composed screen; we align its
indicator, brand mark, and headings to the nodes, and keep every behaviour (`registerUser`, client-side
validation, `?role=` preselect, the 3-step flow that lands on `/dashboard`).

## What

Reconcile `RegisterWizard.tsx` so each of its three steps composes to its Figma node:

- **Swap** `StepIndicator` → `AuthStepDots count={3} current={step}` (3-step counter parity: 1/3 → 2/3 → 3/3).
- **Add** `Logomark` (steps 1 & 2 per the nodes; the welcome step 3 leads with the heading only) and a per-step
  **heading + subtitle** matching each node's copy.
- **Keep** `RoleCards` (the `roleplay` ×2 atom, step 1), the credential inputs (step 2), and the role-specific
  profile fields (step 3); all from kit primitives, token-pure, no bespoke markup.
- **Preserve** `registerUser`, the confirm-password mismatch check, `?role=` preselect, the «Войти»/«Назад»
  secondary buttons, and the register→dashboard outcome.

No screen file may carry raw hex/px/styling literals (F2/F5) — the wizard composes `AuthLayout + Blocks +
primitives + data` only.

## Key reconciliation facts

- **Welcome step field-count is a sanctioned content variant.** The Figma welcome node shows `Input + Select ×2`;
  the implemented step 3 carries the **full profile contract** `registerUser` persists (specialist:
  displayName + position + techStack + 3× Select; client: companyName + inn + contactPerson + phoneNumber). The
  **system is the source of truth, not the single screen** — we keep the full validated field set as a
  **content variant** of the node's *layout grammar* (heading + counter + labelled fields + back/primary
  buttons), and record it as a flagged divergence rather than dropping persisted fields. F3 parity is asserted at
  the *layout-grammar + flow* level, not a literal field-count match.
- **`StepIndicator` is retired from the auth path here.** It remains in the kit/catalog for any non-auth use, but
  `RegisterWizard` no longer consumes it. No other consumer exists today.
- **Login is not one of the 5 nodes.** `app/login/page.tsx` is out of scope; `loginUser` is untouched and the
  `?role=` link from the wizard's «Войти» button is preserved.
- **F1 absolute pixel gate stays deferred** to Phase 2 (`refidelity-from-figma-references`) on the documented
  font-licence cap. Here F1 means *composed to structurally match the node* (50%-overlay shows no layout drift);
  the bar this change must clear is F2 (token-pure), F3 (logical/flow parity), F5 (composition-pure) + green tests.

## Scope

- **New block:** `app/components/blocks/AuthHeader.tsx` (+ `AuthHeaderVM`, fixtures, workbench entry, render tests).
  The Figma auth nodes lead with a «HEADER» lockup (Logomark → heading + subtitle → counter); since the F5
  composition lint forbids heading markup/`className` in the `@composed-screen`, that lockup is a block the wizard
  composes — not raw screen markup. (RC-S4, `docs/DESIGN_SYSTEM_SPEC.md` §10.5.)
- **Reconciled screen:** `app/register/RegisterWizard.tsx` (StepIndicator → AuthHeader/AuthStepDots, per-step
  heading VMs, token-pure, composition-pure).
- **Tests updated:** `__tests__/e2e/compose-auth-onboarding.spec.ts` (the step-label assertions move to the
  dot-counter/aria — `StepIndicator` text labels no longer render), `__tests__/e2e/register-page-redesign.spec.ts`
  (assert the reconciled composition), and any register integration test that asserts indicator markup.
- **Possibly touched:** `app/register/page.tsx` (only if a heading currently lives there).

## Non-goals

- Reconciling `app/login/page.tsx` or the `/auth` entry page (not among the 5 nodes; separate work). `loginUser`
  and the role-preselect query param are preserved, not redesigned.
- Removing `StepIndicator` from the kit, or changing `AuthStepDots`/`Logomark`/`RoleCards` behaviour.
- Adding the Figma bottom "wave"/footer graphic beyond the existing exported checkerboard footer (residual,
  optional — not redrawn).
- The absolute F1 ≤1% pixel gate (Phase 2). Changing `registerUser`, validation rules, or the persisted profile
  contract.

## References

`docs/figma-screens-export.md` §1 (logomark `3179:3571`, counter `3179:3997`) + §2 (auth-flow per-screen specs,
nodes `3179:3179` / `3179:3863` / `3195:4564` / `3195:4282` / `3195:4704`); `app/register/RegisterWizard.tsx`;
`app/components/primitives/{AuthStepDots,Logomark,StepIndicator}.tsx`; `app/components/blocks/RoleCards.tsx`;
`app/components/templates/AuthLayout.tsx`; `app/actions/auth.ts` (`registerUser`/`loginUser`); tests
`__tests__/e2e/{compose-auth-onboarding,register-page-redesign}.spec.ts`,
`__tests__/integration/{registration,register-onboarding}.test.ts`.
