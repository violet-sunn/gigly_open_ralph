# Tasks — reconcile-gig-detail-apply

Reconcile `/gigs/[id]` (`GigDetail.tsx`) to the **`gigly_full_design` prototype** `gigDetail` route (authored fresh
from `Gigly App.dc.html`, NOT the superseded export): col1 = `main` + «Технические требования» (2-col RequirementCard)
+ «Критерии успеха» (numbered CriteriaList), **no files section**; col2 «УСЛОВИЯ» = company `Bio` + a sunken conditions
panel (TermsTabs + Статус + Срок/Бюджет as `font-grotesk` + company fee breakdown + role action panel) + «Сообщения»
ChatPanel. Friction: **high** (full multi-role re-lay + grotesk/fee + the no-files correction; preserve every action).

## 1. Reconcile GigHeader to the `main` shape (+ description)
- [x] `view-models.ts`: ensure `GigHeaderVM.description?: string`. `GigHeader.tsx`: render the description (body under
      the tag row); **drop the budget/deadline/posted meta row** (срок/бюджет live in col2). Keep status + title + tags.
- **Test:** `domain-blocks.test.tsx` — GigHeader renders `description`, no budget/deadline row.

## 2. Bind the new fields in getGigDetail
- [x] `getGigDetail`: set `header.description = gig.description`; add a company description to `bio`/`client`
      (`clientProfile.about` if present, else a sensible fallback); expose the срок/бюджет/fee figures (`gig.deadlineDays`,
      `money(gig.budget)`, `money(gig.serviceFee)`, `money(gig.totalAmount)`) + the applicants count for «Смотреть отклики».
- **Test:** `gig-detail-vm.test.ts` — `header.description` + the fee figures present.

## 3. Re-compose col1 (main + Требования + Критерии успеха, NO files)
- [x] In `GigDetail.tsx` `Split` col1: `main` `GigHeader` (title + tags + description) → `SectionHeader` «Технические
      требования» (count = requirements.length) + the 2-col `Grid` of `RequirementCard`s → `SectionHeader` «Критерии
      успеха» (count) + the numbered `CriteriaList`. **Do not render a files section** (the prototype has none).
- **Test:** E2E — col1 shows the description + «Технические требования» + «Критерии успеха» + a RequirementCard; NO files section.

## 4. Re-compose col2 «УСЛОВИЯ» (bio + conditions + actions + chat)
- [x] col2 (≈440px): the company `<Bio vm={data.bio} />` + a company-description line → a conditions panel:
      `TermsTabs` («Условия {company}» / «Мои условия») + a Статус row + **Срок** + **Бюджет** as large `font-grotesk`
      numbers (sublabels «[1 этап]» / «фикс. цена»), and for the **company** viewer the **Сервисный сбор 10% + Итого**
      breakdown → the role action panel (specialist `ApplyAction`/withdraw/state; owner «Смотреть отклики (N)» + the
      applications list + `AcceptRejectActions`; assigned+owner `GigAction` submit/approve/return-to-rework/pay) +
      `OpenDisputeAction` → `SectionHeader` «Сообщения» + the `MessageChat`/`ChatPanel`. **All action wiring moved
      verbatim** (same `useActionState` forms, hidden inputs, labels).
- [x] Verify a **«Вернуть на доработку»** (REVIEW→IN_PROGRESS) action exists; if not, flag it (do NOT invent lifecycle
      semantics — note it for a follow-up).
- **Test:** E2E — col2 renders Bio + TermsTabs + Срок/Бюджет (+ company fee) + the apply/owner/lifecycle actions + chat;
  the role×status flows pass (apply→«Отозвать заявку», owner accept→«В работе», submit→«На проверке», example-guard).

## 5. Token-purity + grotesk + composition-purity (F2 / F5)
- [x] Срок/Бюджет numbers use `font-grotesk`; no `className=`/`style=`/hex literals in `GigDetail.tsx` / `GigHeader.tsx`
      beyond layout-primitive props; all sections compose from kit blocks + layout + tokens.
- **Test:** `lint:composition` PASS (GigDetail F5-pure); `lint:tokens` PASS (no new literal).

## 6. Record the reconciliation decisions (+ the no-files correction)
- [x] `docs/DESIGN_SYSTEM_SPEC.md` §10.x (RC-S14): the prototype col1/col2 structure; **no files section** (correcting
      the prior export-based "4 file chips / sanctioned omission" claim); Срок/Бюджет grotesk; company fee breakdown;
      Bio(company) as the conditions lead. Check the Phase-3 item in `full-design-reground.md`.
- **Test:** the note records the structure + the no-files correction (prototype provenance).

## 7. Update the affected tests to the prototype composition
- [x] `compose-gig-detail-apply.spec.ts`: assert col1 description + «Технические требования»/«Критерии успеха» + **no
      files section**; col2 Bio + TermsTabs + Срок/Бюджет (+ company fee); keep ALL existing behavioural tests. Use
      `.first()` where the title/description also appears in the breadcrumb.
- [x] `domain-blocks.test.tsx` (GigHeader description); `gig-detail-vm.test.ts` (`header.description` + fee figures).
- **Test:** updated specs pass; no test asserts a files section or the dropped meta row.

## 8. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` — PASS.
- [x] `npm run lint:composition` — PASS (18 screens).
- [x] `npm run build` — PASS (`/gigs/[id]`).
- [x] `npm run clean:test-db && npm run test:unit` — green.
- [x] `compose-gig-detail-apply` E2E green (existing flows + the new structure assertions).
- **Acceptance (Fidelity DoD):** F2 token-pure, F1 structural/overlay match to the prototype `gigDetail`, F3 flow parity
  (apply + owner accept/reject + lifecycle + messaging + example-guard), F5 composition-pure. F1 ≤1% deferred to Phase 4.

## 9. Planning-status (Phase 3)
- [x] Check `reconcile-gig-detail-apply` in `full-design-reground.md` Phase 3.
- **Test:** the Phase-3 item reads `[x]`.

## Implementation deviations (recorded against the proposal)
- **New `ConditionsPanel` block (vs the proposal's "no new component").** The col2 «УСЛОВИЯ» panel (tabs + Статус +
  grotesk Срок/Бюджет + company fee) does not fit the generic term-row `TermsTabs` and cannot be rendered token-purely
  inside an F5-pure screen, so it is a dedicated block. `TermsTabs` stays in the kit (workbench/tests) untouched. The
  spec/proposal "TermsTabs in col2" is satisfied by `ConditionsPanel` (its tabs are «Условия {company}» / «Мои
  условия»). Recorded in DESIGN_SYSTEM_SPEC §10.13 RC-S15.
- **«Вернуть на доработку» flagged, not built (task 4).** No coded `returnWork` server action exists; per "do not
  invent lifecycle semantics" it is flagged via a `GigDetail.tsx` comment + RC-S18 for a future change. Every other
  lifecycle flow is preserved verbatim.
- **Company description omitted (task 2).** `ClientProfile` has no `about`/description field, so `bio.description` is
  left undefined (no fabrication); `Bio` renders the description line only when a field later supplies one.
