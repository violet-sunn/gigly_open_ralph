# reconcile-gig-detail-apply

**Type:** Regular change (UI / screen reconciliation — gig detail + apply)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (screen reconciliation, **authored fresh from the
prototype** — not the deleted pre-design draft)
**Capability:** `ui`
**Depends on:** `add-bio-block` (archived — the company `Bio` is the conditions lead), `reconcile-data-model-to-design`
(archived — `under_review` display, dispute data). The kit blocks it composes all exist.

## Why

`/gigs/[id]` (`app/(protected)/gigs/[id]/GigDetail.tsx`) is kit-composed but its layout was built before the real
design and last touched by `add-bio-block`. The authoritative source is now the **prototype** (`gigly_full_design/Gigly
App.dc.html`, the `gigDetail` route). Reading it directly (not the superseded `docs/figma-screens-export.md` export)
gives the real composition — and it **corrects a wrong assumption** the deleted draft carried (a 4-chip "files"
section). The real screen is a 2-column BLOCK:

**col1 (flex-1):**
- `main` — heading (title) + tags + the long **description**.
- **«Технические требования»** — a `SectionHeader` (mono, with a **count badge**) over a **2-column grid** of 3
  requirement tiles (inset-stroke, title + desc).
- **«Критерии успеха»** — a `SectionHeader` (count) over **numbered** criterion rows (a brand-accent number block +
  title + desc).
- **No «Файлы»/attachments section exists** in the design (the only file references are gig-description prose +
  dispute evidence) — so there is **nothing to render and nothing to "omit pending a backend"**; the prior draft's
  files claim was simply wrong.

**col2 (440px — «УСЛОВИЯ»):**
- the company **`Bio`** (avatar + name + verify-patch + ★ + rating count) + the company description.
- a single **sunken conditions panel**: a **TermsTabs** toggle («Условия {company}» / «Мои условия») → **Статус** row →
  **Срок выполнения** (a large Manrope/`grotesk` number + «[1 этап]») → **Бюджет проекта** (a large `grotesk` number +
  «фикс. цена»; for the **company** viewer, a **Сервисный сбор (10%) + Итого к оплате** breakdown) → the role action:
  the SPECIALIST **«Ваш отклик»** apply form (approach + questions + estimate → «Отправить заявку», or the «Заявка
  отправлена ✓» + «Отозвать заявку» states) / the owner's **«Смотреть отклики (N)»** + the lifecycle buttons
  (Сдать работу / Принять работу / Вернуть на доработку) + **«Открыть спор»**.
- the **chat** («Сообщения» thread + composer).

Most blocks this needs exist (`GigHeader`/main, `SectionHeader`, `RequirementCard`, `CriteriaList`, `Bio`,
`ApplyPanel`, `ChatPanel`, `Notice`). **Implementation correction:** the col2 «УСЛОВИЯ» panel needed **one new block**
— `ConditionsPanel` — because the prototype's tabs + Статус + grotesk Срок/Бюджет + fee shape cannot be rendered
token-purely by the generic term-row `TermsTabs` inside an F5-pure screen. `TermsTabs` stays in the kit untouched. The
rest is a fresh re-composition to the prototype + the `grotesk`/fee/no-files corrections + the VM fields they bind.
(See `tasks.md` → Implementation deviations, and DESIGN_SYSTEM_SPEC §10.13 RC-S15.)

## What

- **col1** — `main` (title + category tags + the gig **description**), then a `SectionHeader` «Технические требования»
  (with the requirement count) over the **2-col `RequirementCard` grid** (Цель/Результаты/Ограничения → the design's
  reqs), then a `SectionHeader` «Критерии успеха» (count) over the **numbered `CriteriaList`** (`acceptanceCriteria`).
  **No files section.**
- **col2 «УСЛОВИЯ» (440px)** — the company **`Bio`** (`data.bio`, from `add-bio-block`) + a company-description line;
  then the conditions panel: `TermsTabs` («Условия {company}» / «Мои условия») + a **Статус** row + **Срок** + **Бюджет**
  rendered as large **`font-grotesk`** numbers (Manrope, from `adopt-design-fonts`) with the «[1 этап]» / «фикс. цена»
  sublabels, and — for the **company** viewer — the **Сервисный сбор 10% + Итого** breakdown (from the gig's
  `serviceFee`/`totalAmount`). Then the **role action panel** (specialist `ApplyPanel` apply/withdraw/state; owner
  «Смотреть отклики (N)» + the applications list + accept/reject; assigned/owner lifecycle submit/approve/return-to-
  rework/pay) + **«Открыть спор»**, then a `SectionHeader` «Сообщения» + the `ChatPanel` thread + composer.
- **Extend the VM** — `getGigDetail` adds what the design binds and the kit lacks: `header.description` (already added
  by the deleted draft? re-add if absent), a company-description on `bio`/`client`, the срок/бюджет/fee figures
  (`serviceFee`/`totalAmount` already on the gig), and the owner «Смотреть отклики» count. `GigHeader`'s redundant
  budget/deadline/posted row is dropped (срок/бюджет live in col2). Every other field is unchanged.
- **Preserve every server-action flow verbatim** — apply, withdraw, accept/reject, submit/approve, **return-to-rework**
  («Вернуть на доработку»), mark-as-paid, messaging, open-dispute, admin history — only their column/position changes.

No screen carries off-token literals (F2) or bespoke markup (F5) — it stays `Template + Blocks + data`. Срок/бюджет
numbers use the `font-grotesk` token (the design's Manrope for numerics).

## Key facts / decisions (all derived from the prototype, not the old export)

- **No files section.** The real gig-detail has none — `main` + Требования + Критерии успеха only. The deleted draft's
  "4 file chips / sanctioned omission until attachments exist" was a wrong reading of a different node; this change
  records the correction (no files section, full stop).
- **col2 is one «УСЛОВИЯ» panel**, not separate cards: Bio + (TermsTabs + Статус + Срок + Бюджет + action) + chat.
- **Срок/Бюджет are large `grotesk` (Manrope) numbers** — the design's numeric face; bind them to `font-grotesk`.
- **The company sees a fee breakdown** (Сервисный сбор 10% + Итого) in the budget block; the specialist does not.
- **«Вернуть на доработку»** (REVIEW → IN_PROGRESS) appears in the prototype's owner action set — verify the coded
  action exists; if not, it's flagged (the lifecycle action set is otherwise preserved as-is).
- **«Смотреть отклики (N)»** is the owner's affordance; the dedicated applications screen is `build-applications-screen`
  — gig-detail keeps the inline owner applications list (today's behaviour) and/or the link, not a new screen here.
- **F1 baselines on the prototype frame** (`Gigly Развёртка.dc.html` gigDetail), fonts resolved; the absolute ≤1% gate
  is Phase 4 (`refidelity-from-full-design`). F1 here = structural/overlay match.

## Scope

- **Reconciled screen:** `app/(protected)/gigs/[id]/GigDetail.tsx`.
- **Block:** `app/components/blocks/GigHeader.tsx` (+ `GigHeaderVM.description`) — `main` shape (drop the budget/
  deadline/posted row).
- **Data layer:** `lib/view-models.ts` `getGigDetail` — `header.description`, company description on the bio, the
  срок/бюджет/fee figures, the applicants count.
- **Tests:** `__tests__/e2e/compose-gig-detail-apply.spec.ts` (assert the col1 Требования/Критерии успеха headers +
  the description + **no files section**; col2 Bio + TermsTabs + срок/бюджет + the apply/owner/lifecycle actions; the
  company fee breakdown; keep all behavioural flows — apply→withdraw, owner accept→В работе, submit→На проверке,
  messaging, example-can't-apply); `domain-blocks.test.tsx` (GigHeader description); `gig-detail-vm.test.ts`.
- **Docs:** the reconciliation note in `docs/DESIGN_SYSTEM_SPEC.md` (the prototype structure + the no-files correction);
  check the Phase-3 item in `full-design-reground.md`.

## Non-goals

- New blocks/primitives (none needed). The dedicated **applications** screen (`build-applications-screen`). The
  dispute **resolve** UI (`reconcile-disputes-flow`). A file-upload backend (the design has no files section here).
- Changing any server action, the gig lifecycle, or the messaging/application semantics.
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/Gigly App.dc.html` — the `gigDetail` route template (col1 Требования/Критерии успеха ~L458–491; col2
«УСЛОВИЯ» bio + conditions + apply ~L494–574) + the data (`GIG_REQS`, `GIG_CRITS`, `APPLICATIONS`, the срок/бюджет/fee
figures); `Gigly Развёртка.dc.html` (the F1 frame). The screen `GigDetail.tsx` + `lib/view-models.ts` (`getGigDetail`,
`GigDetailData`, `GigHeaderVM`, `bio`); blocks `Bio`/`SectionHeader`/`RequirementCard`/`CriteriaList`/`TermsTabs`/
`ApplyPanel`/`ChatPanel`; the `font-grotesk` token.
