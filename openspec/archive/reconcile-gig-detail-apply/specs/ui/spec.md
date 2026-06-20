# Spec delta — ui (reconcile-gig-detail-apply)

Reconciles `/gigs/[id]` to the **`gigly_full_design` prototype** `gigDetail` route (read directly, not the superseded
export): col1 = `main` (heading + tags + description) + `SectionHeader`-led «Технические требования» (2-col
`RequirementCard` grid) + «Критерии успеха» (numbered `CriteriaList`), **no files section**; col2 «УСЛОВИЯ» (440px) =
the company `Bio` + a sunken conditions panel (`TermsTabs` + Статус + Срок/Бюджет as `grotesk` numbers + company fee
breakdown + the role action panel) + the `ChatPanel`. Token-pure (F2) + composition-pure (F5); every server-action
flow preserved.

## MODIFIED Requirements

### Requirement: Gig Detail Screen Reconciled to the Prototype
The `/gigs/[id]` screen MUST remain a composition-pure `@composed-screen` inside `AppShell`, reconciled to the
`gigly_full_design` `gigDetail` prototype as a 2-column layout: **col1** = a `main` overview (title + category tags +
the gig **description**) followed by a `SectionHeader` «Технические требования» (with a count) over a **2-column
`RequirementCard` grid**, and a `SectionHeader` «Критерии успеха» (count) over a **numbered `CriteriaList`**;
**col2 «УСЛОВИЯ»** = the company `Bio` (+ company description) followed by a conditions panel (`ConditionsPanel` — a
two-tab toggle «Условия {company}»/«Мои условия» + a Статус row + Срок + Бюджет + the role action panel) and a
`SectionHeader` «Сообщения» over the `ChatPanel`. *(Implementation note: the conditions panel is a dedicated
`ConditionsPanel` block, NOT the generic term-row `TermsTabs` — the grotesk numerics + fee shape requires it; RC-S15.)*
The screen MUST
be token-pure (F2) and composition-pure (F5), and MUST preserve every server-action flow (apply, withdraw,
accept/reject, submit, approve, return-to-rework, mark-as-paid, messaging, open-dispute, admin history).

#### Scenario: col1 renders main + Требования + Критерии успеха (no files section)
- GIVEN the gig detail screen
- WHEN it renders
- THEN col1 MUST show the title + tags + the gig **description**, a `SectionHeader` «Технические требования» over the
  2-col `RequirementCard` grid, and a `SectionHeader` «Критерии успеха» over the numbered `CriteriaList`
- AND it MUST NOT render any «Файлы»/attachments section (the prototype has none)

#### Scenario: col2 «УСЛОВИЯ» renders the bio, conditions, action panel, and chat
- GIVEN the gig detail screen
- WHEN it renders
- THEN col2 MUST render the company `Bio` (+ company description), then a `ConditionsPanel` (the two-tab toggle, a
  Статус row, and Срок + Бюджет), then the role action panel, then a `SectionHeader` «Сообщения» over the `ChatPanel`
- AND the `GigHeader`/`main` block MUST NOT render the former budget/deadline/posted meta row (срок/бюджет live in col2)

#### Scenario: All server-action flows preserved; composition-pure
- GIVEN the screen across roles
- WHEN it is interacted with
- THEN a SPECIALIST applies (+ withdraws); the owner sees the applications + accepts/rejects; the assigned specialist
  submits, the owner approves / returns-to-rework / pays; messaging works once assigned; example/closed/dispute/admin
  notices behave as before
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

### Requirement: Срок/Бюджет Are Grotesk Numerics; the Company Sees the Fee Breakdown
The conditions panel MUST render **Срок выполнения** and **Бюджет проекта** as large **`font-grotesk`** (Manrope)
numbers with the «[1 этап]» / «фикс. цена» sublabels. For the **company** viewer, the budget block MUST additionally
show the **Сервисный сбор (10%)** and **Итого к оплате** breakdown (from the gig's `serviceFee` / `totalAmount`); the
specialist MUST NOT see it.

#### Scenario: Numerics use grotesk; company-only fee breakdown
- GIVEN the conditions panel
- WHEN it renders for a specialist and for the gig owner (company)
- THEN Срок + Бюджет MUST use the `font-grotesk` token, and the **company** view MUST show the 10% fee + total while
  the specialist view MUST NOT

### Requirement: GigHeader Reconciled to the main Shape (with description)
`GigHeaderVM` MUST carry `description` and the `GigHeader`/`main` block MUST render it; in the gig-detail composition
the block MUST NOT render the budget/deadline/posted meta row. `getGigDetail` MUST bind `header.description` from the
gig.

#### Scenario: main renders the description, not the meta row
- GIVEN `getGigDetail(gigId, viewer)`
- THEN `header.description` MUST equal the gig description and the `main` block MUST render it
- AND the budget/deadline/posted meta row MUST NOT appear in `main`

## ADDED Requirements

### Requirement: The Files-Section Omission Is a Design Fact, Not a Deferral
The screen MUST NOT render a files/attachments section, recorded as a **design fact** (the prototype `gigDetail` has no
such section) — explicitly correcting the prior export-based "4 file chips / sanctioned omission pending a backend"
claim. The decision MUST be recorded in the reconciliation note.

#### Scenario: No files section, correction recorded
- GIVEN the reconciled screen
- THEN there MUST be no files/attachments section, and `docs/DESIGN_SYSTEM_SPEC.md` MUST record that the prototype has
  none (superseding the earlier export-based claim)

### Requirement: Gig Detail Reconciliation Keeps the Suite Green
The reconciliation MUST update the affected E2E/unit/VM assertions to the prototype composition while preserving every
behavioural assertion, and keep the build, token-purity lint, composition lint, and unit/E2E suites green.

#### Scenario: Tests updated to the prototype composition, suite green
- GIVEN `compose-gig-detail-apply.spec.ts`, `domain-blocks.test.tsx`, `gig-detail-vm.test.ts`
- WHEN they run after the reconciliation
- THEN they MUST assert the col1 description + Требования/Критерии успеха headers + **no files section** + the col2
  Bio/TermsTabs/Срок/Бюджет/company-fee + the «Сообщения» chat, and the `GigHeader` description
- AND the behavioural assertions (apply → «Отозвать заявку», owner accept → «В работе», submit → «На проверке»,
  messaging echo, example «Откликаться на примеры нельзя») MUST still pass
- AND `npm run build`, `npm run lint:tokens`, `npm run lint:composition`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- col1 = main (title+tags+description) + «Технические требования» (2-col RequirementCard) + «Критерии успеха» (numbered CriteriaList); **no files section**
- col2 «УСЛОВИЯ» = company `Bio` + conditions panel (TermsTabs + Статус + Срок/Бюджет as `font-grotesk`, company fee breakdown) + role action panel + «Сообщения» ChatPanel
- `GigHeader` renders `description`, drops the meta row; `getGigDetail` binds it; срок/бюджет use `font-grotesk`
- every server-action flow preserved (incl. return-to-rework + open-dispute); F2 + F5 lints green; the no-files correction recorded
- `build` + `lint:tokens` + `lint:composition` + `test:unit` + `compose-gig-detail-apply` E2E green; F1 = structural vs the prototype (≤1% deferred to Phase 4)
