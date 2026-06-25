# Tasks — e2e-gig-detail

## 1. Re-confirm the grounding (labels + lifecycle in the rebuilt screen)

- [x] Confirm the rendered labels in `app/(protected)/gigs/[id]/GigDetail.tsx`:
  - `grep -nE "Отправить заявку|Заявка отправлена ✓|Отозвать заявку|Сдать работу на проверку|Отметить как оплаченный|Принять работу|Вернуть на доработку|Смотреть отклики" app/\(protected\)/gigs/\[id\]/GigDetail.tsx` → all present.
  - The conditions tabs are `<div onClick=…>` (`Условия …` / `Мои условия`), **not** `role="tab"`; there is **no** message composer and **no** «Файлы» section.
  - Apply fields select by `name`: `textarea[name="approach"]`, `textarea[name="questions"]`, `input[name="estimatedEffort"]`.
- [x] Confirm the lifecycle/status facts in `lib/view-models.ts`:
  - `canApply` includes `!gig.isExample` (≈ line 760) → example gigs render no apply form.
  - `STATUS_LABEL_RU`: `in-progress`→`В работе`, `verification`→`На проверке` (≈ line 61); component shows `Оплачен` for PAID.

**Test plan:** the grep lists every new label; the VM confirms the example-gate + status labels — the premises behind every assertion delta.

## 2. Rewrite `compose-gig-detail-apply.spec.ts`

- [x] **Test 1 (apply):** `button «Откликнуться»` → `«Отправить заявку»` (both the assertion and the click); `getByRole('tab', {name:'Мои условия'})` → `getByText('Мои условия')`; **remove** `getByText('Файлы').toHaveCount(0)`; after applying assert `getByText('Заявка отправлена ✓')` is visible **and** `getByRole('button', {name:'Отозвать заявку'})` (was `«Отозвать отклик»`). Keep `textarea[name="approach"]`/`[name="questions"]` fills and the `Технические требования`/`Цель проекта`/`Критерии успеха`/`Бюджет проекта`/`Срок выполнения` assertions. Drop the stale "title also in the breadcrumb" comment (no breadcrumb; the title renders once in the `<h1>`).
- [x] **Test 2 (owner accept):** keep as-is — verify `Сервисный сбор (10%)` + `/Смотреть отклики/` → `/gigs/[id]/applications` → `Тест Спец` → `Принять` → back on gig-detail `В работе`. (Cross-screen into the `/applications` screen — change #7 — using its current labels.)
- [x] **Test 3 (submit):** `button «Отправить работу»` → `«Сдать работу на проверку»`; keep the `«На проверке»` status assertion.
- [x] **Test 4 (messaging):** **delete** the test — the rebuilt gig-detail embeds no chat composer (`textbox «Сообщение»` is gone). Messaging coverage is change #9 (`/chats`).
- [x] **Test 5 (example):** remove the `«Откликаться на примеры нельзя»` text assertion; assert `getByRole('button', {name:'Отправить заявку'}).toHaveCount(0)`.
- [x] Update the file's top comment to describe the rebuilt screen (drop the «Сообщения»/files/breadcrumb references). No reference to removed kit components.

**Test plan:** `npm run clean:test-db && npm run test:e2e compose-gig-detail-apply` → all remaining tests green (4 tests: apply, owner-accept, submit, example).

## 3. Rewrite `application-withdrawal.spec.ts` to the modern harness

- [x] Replace the entire kit `/register`→role-radio→`/login`→`Archive` flow + English labels with Prisma seeding (`new PrismaClient({ adapter: new PrismaLibSql({ url: 'file:./test.db' }) })`) + `setE2ESession`, mirroring `compose-gig-detail-apply.spec.ts`.
- [x] Seed: an OPEN gig (owner CLIENT) + a SPECIALIST + that specialist's **PENDING** `application` (valid `approach`/`questions`, `status: 'PENDING'`).
- [x] **Withdrawal test:** as the specialist, `goto /gigs/[id]` → assert `getByText('Заявка отправлена ✓')` + `getByRole('button', {name:'Отозвать заявку'})` visible → click it → assert `getByRole('button', {name:'Отозвать заявку'})` `.toHaveCount(0)` (the PENDING state ended; assertion is VM-agnostic about whether the apply form re-appears).
- [x] **Remove** the kit-only coverage: `WITHDRAWN`/`Withdrawn on` badges, the dashboard `Archive` tab, and the client-side "sees WITHDRAWN in applications list" (owner-facing applicant state lives on `/applications`, change #7 — not gig-detail).

**Test plan:** `npm run clean:test-db && npm run test:e2e application-withdrawal` → green.

## 4. Verify both specs + suite collection

- [x] `npm run clean:test-db && npm run test:e2e compose-gig-detail-apply && npm run test:e2e application-withdrawal` → both green.
- [x] `npm run test:e2e -- --list` → exits 0, lists both specs, no missing-file/import errors; `grep -rn "Откликнуться\|Отправить работу\|Withdraw Application\|Apply to Gig\|textbox.*Сообщение" __tests__/e2e/compose-gig-detail-apply.spec.ts __tests__/e2e/application-withdrawal.spec.ts` → no matches (old labels gone).
- [x] `git status --short` → only the two e2e specs (+ this change's artifacts + plan) changed; no `app/`/`lib/`/helper edits.

**Test plan:** both targeted runs green; `--list` clean; the old-label grep is empty.

## 5. Update the plan checklist

- [x] Tick `- [x] e2e-gig-detail` in `openspec/planning/e2e-reconciliation.md` and bump **Progress** to `3/16`.

**Test plan:** the planning doc shows `e2e-gig-detail` checked and `Progress: 3/16`.

## Acceptance Criteria (deterministic)

- `compose-gig-detail-apply.spec.ts` asserts the rebuilt labels (`Отправить заявку`, `Заявка отправлена ✓`, `Отозвать заявку`, `Сдать работу на проверку`), uses `getByText('Мои условия')` (not `role="tab"`), has **no** messaging-composer test, **no** «Файлы» check, and **no** breadcrumb reference.
- `application-withdrawal.spec.ts` uses the Prisma-seed + `setE2ESession` harness with Russian labels — **no** `/register`/`/login` flow, **no** English `Apply to Gig`/`Withdraw Application`/`WITHDRAWN`/`Archive` strings.
- `npm run test:e2e compose-gig-detail-apply` and `npm run test:e2e application-withdrawal` are both green (after `clean:test-db`).
- `npm run test:e2e -- --list` collects with no import errors; the old-label grep over the two files is empty.
- No files outside `__tests__/e2e/` and the planning checklist were modified.
