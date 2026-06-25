# Reconcile the Gig-Detail E2E Specs to the Rebuilt `/gigs/[id]`

**Change:** `e2e-gig-detail`
**Created:** 2026-06-22
**Plan:** Change #3 of `openspec/planning/e2e-reconciliation.md`

## Why

`/gigs/[id]` was rebuilt directly on the `gigly_full_design` prototype markup (`app/(protected)/gigs/[id]/GigDetail.tsx`). Two E2E specs still assert the **old kit** gig-detail and have diverged:

1. **`compose-gig-detail-apply.spec.ts`** — already uses the modern Prisma-seed + `setE2ESession` harness, but asserts **kit labels** that the rebuild renamed (`Откликнуться`, `Отозвать отклик`, `Отправить работу`), a `role="tab"` that is now a plain `<div>`, a `«Файлы»` absence check, and an **embedded-chat** composer (`textbox «Сообщение»`) that the rebuilt screen no longer has (messaging moved to `/chats`).
2. **`application-withdrawal.spec.ts`** — fully **kit-era**: it drives the `/register` → role-radio → `/login` → dashboard-`Archive`-tab flow and asserts **English** labels (`Apply to Gig`, `Withdraw Application`, `WITHDRAWN`, `Withdrawn on`, `Accept`/`Reject`) that exist nowhere in the current Russian UI. It cannot pass against any current screen.

Restoring both green re-arms the apply → withdraw → accept → submit → pay regression coverage on the gig lifecycle that `project.md` centres on.

## Grounding (verified against `GigDetail.tsx` + `lib/view-models.ts`)

- **Label deltas (the rebuilt component renders):** `Отправить заявку` (apply submit, `GigDetail.tsx:741`), `Заявка отправлена ✓` (applied banner, `:767`) + `Отозвать заявку` (`:785`), `Сдать работу на проверку` (submit, `:516`), `Принять работу` (`:807`) + new `Вернуть на доработку` (`:825`), `Отметить как оплаченный` (`:870`), owner `Смотреть отклики ({n})` (`:512`).
- **Conditions tabs are `<div onClick>` not ARIA tabs** — `Условия {company}` / `Мои условия` (`:399`/`:416`). The old `getByRole('tab', …)` must become `getByText('Мои условия')`.
- **Apply fields are unchanged by `name`** — `textarea[name="approach"]`, `textarea[name="questions"]`, `input[name="estimatedEffort"]` (`:711`/`:721`/`:733`). KEEP these selectors.
- **KEEP these section labels** — `Технические требования` (`:187`), `Критерии успеха` (`:265`), `Бюджет проекта` (`:453`), `Срок выполнения` (`:439`), `Сервисный сбор (10%)` (owner-only fee, `:483`).
- **No embedded chat / no «Файлы»** — `GigDetail.tsx` renders no message composer and no files section (the VM still builds a `chat` field, but the markup ignores it). Both assertions are removed.
- **Inline back link replaces breadcrumbs** — `← Назад к гигам` (`:108`, navigates to `/gigs`). No breadcrumb exists.
- **Status labels still valid** — `STATUS_LABEL_RU` (`view-models.ts:61`): `in-progress`→**«В работе»**, `verification`→**«На проверке»**; `PAID` shows **«Оплачен»**. The existing `В работе` / `На проверке` assertions hold.
- **Example gigs gate the apply form server-side** — `lifecycle.canApply` requires `!gig.isExample` (`view-models.ts:760`), so an example shows **no** apply UI. The old `«Откликаться на примеры нельзя»` banner does not exist in the rebuild; the test asserts the apply button is **absent** instead.

## What Changes

### `compose-gig-detail-apply.spec.ts` — per-test deltas

| Test | Delta |
|------|-------|
| 1 — renders + SPECIALIST applies | `button «Откликнуться»` → `«Отправить заявку»` (assert + click); `getByRole('tab', {name:'Мои условия'})` → `getByText('Мои условия')`; **drop** `«Файлы».toHaveCount(0)`; after apply assert `«Заявка отправлена ✓»` **and** `button «Отозвать отклик»` → `«Отозвать заявку»`; drop the stale "title also in the breadcrumb" note. KEEP the by-`name` textareas + `Технические требования`/`Цель проекта`/`Критерии успеха`/`Бюджет проекта`/`Срок выполнения`. |
| 2 — owner fee + «Смотреть отклики» → accept | KEEP as-is — `Сервисный сбор (10%)`, `/Смотреть отклики/`, nav to `/applications`, `Тест Спец`, `Принять`, `В работе` are all current labels (the applicant list lives on the `/applications` screen — change #7). |
| 3 — assigned specialist submits | `button «Отправить работу»` → `«Сдать работу на проверку»`; KEEP `«На проверке»`. |
| 4 — messaging composer | **DELETE** — the rebuilt gig-detail has no embedded chat (`textbox «Сообщение»` is gone; messaging is `/chats`, change #9). |
| 5 — example gigs | **drop** the `«Откликаться на примеры нельзя»` text assertion; assert `button «Отправить заявку»` `.toHaveCount(0)`. |

### `application-withdrawal.spec.ts` — full rewrite

Replace the kit `/register`→`/login`→`Archive`-tab/English-label flow with the modern harness (Prisma seed into `file:./test.db` + `setE2ESession`):
- Seed an OPEN gig + a SPECIALIST + that specialist's **PENDING** application.
- As the specialist, `goto /gigs/[id]` → assert `«Заявка отправлена ✓»` + `«Отозвать заявку»` visible.
- Click `«Отозвать заявку»` (→ `withdrawApplication`) → assert the `«Отозвать заявку»` control is gone (the PENDING state ended).

The kit-only assertions — `WITHDRAWN`/`Withdrawn on` badges, the dashboard `Archive` tab, and the **client-side** "sees WITHDRAWN in the applications list" — are dropped: the rebuilt gig-detail has none of them, and owner-facing applicant state lives on the `/applications` screen (change #7), not here.

## Non-Goals / Constraints

- **E2E specs only.** No change to `GigDetail.tsx`, `lib/view-models.ts`, the `@/app/actions/gig` server actions, or the test harness (`__tests__/helpers/*`). Unit/integration suite (951/951) must stay green.
- **Cross-screen dependency, not ownership:** test 2 traverses into `/gigs/[id]/applications` (the `/applications` screen owned by **change #7**) and relies only on its current stable labels (`Тест Спец`, `Принять`). If #7 later renames them, #7 owns that update.
- **Messaging is out of scope** — the deleted composer test is re-homed to `/chats` by **change #9** (`e2e-chats`), not replaced here.
- Keep the apply field `name=` selectors and the gig-lifecycle server actions unchanged (only visible labels moved).

## Impact

- **Specs (`testing`):** `## ADDED` the reconciled gig-detail E2E coverage + `## REMOVED` the embedded-chat and kit-era withdrawal/archive coverages. Per the plan's convention (changes #1–#2), per-screen E2E coverage is not a canonical `testing` requirement, so this is a no-op against `openspec/specs/testing/spec.md` (the archived delta is the record).
- **Code:** 2 files rewritten under `__tests__/e2e/`; zero `app/`/`lib/`/helper changes.
- **Tests:** `npm run test:e2e compose-gig-detail-apply` and `npm run test:e2e application-withdrawal` green; the suite still collects.
- **Plan:** ticks `e2e-gig-detail` in `openspec/planning/e2e-reconciliation.md` → **3/16**.
