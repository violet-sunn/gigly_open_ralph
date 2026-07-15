# Proposal — apply-terms-lock

> **Name retained for traceability** with round-3 cluster **C3** and the tester's item. The fix turned out to be about
> making «Мои условия» *mean something*, not about locking fields — nothing needs locking (see below).

## Why

Round-3 stress test, item #3. The user's words: «Отклик на условиях заказчика подразумевает, что поля с ценой и сроками должны быть зафиксированы. В текущей версии эти поля можно редактировать… **Что убивает смысл вкладки со своими условиями**.» (They also flagged it themselves as «верно наполовину».)

**The PRD's stated root cause does not survive contact with the code.** Verified live and in source:

| PRD claim | Reality |
| --- | --- |
| The apply UI leaves price/deadline editable on **both** the «Предложено» and «От заказчика» tabs | **False.** The terms panel contains **zero inputs** — live probe: the page has an identical 11 inputs on both tabs. The tabs are a read-only *display* toggle. |
| The tabs are «Предложено» / «От заказчика» | **False.** Those labels belong to the unused `TermsTabs` block. `GigDetail` renders its own inline tabs: «Условия {company}» / «Мои условия». |
| «От заказчика» must be made READ-ONLY | **Already is.** It renders `data.conditions.client` (the gig's fixed budget/срок) as static rows. Nothing to lock. |
| Reset the form — no stale prefilled proposed terms on re-apply | **Contradicts a shipped MUST.** `gig/spec.md:1243-1248` requires the re-apply form to be **pre-filled** with the preserved counter, *specifically so a blank re-submit does not silently drop it*. Reversing it reintroduces the bug that requirement exists to prevent. **Decision (2026-07-15): keep the specced pre-fill — out of scope.** |

**The actual defect** — and it is a **violation of an existing requirement**, not a new feature:

`lib/view-models.ts:721-722` builds the proposed-terms tab with a fallback to the gig's own values:
```ts
const proposedBudget   = myApp?.proposedBudget      ?? gig.budget
const proposedDeadline = myApp?.proposedDeadlineDays ?? gig.deadlineDays
```
So until a specialist proposes something, **«Мои условия» renders the client's numbers** — screenshot-confirmed: with the «Мои условия» tab active, the panel shows the gig's own `25 дней / 140 000 ₽`, character-for-character identical to «Условия СофтПро». The tab looks like a duplicate of the client's tab, which is precisely «убивает смысл вкладки».

This breaks **`gig/spec.md:1199` "Gig-Detail Terms Tabs Reflect the Counter"**:
- *"«Мои условия» MUST reflect their own submitted counter **distinctly** from «Условия {компания}», with an **explicit state when they proposed nothing**"*
- *"…rather than **silently showing identical numbers** with no explanation"* (scenario at :1208)

A hint line *is* rendered («Предложите свои условия в форме отклика ниже — иначе действуют условия заказчика»), so it is not strictly *silent* — but the figures still masquerade as the specialist's own, which is the part that misleads.

Second, smaller gap: the tab is **disconnected from the form**. A specialist can type `120 000 ₽` into «Мои условия» in the apply form and the «Мои условия» tab above still shows the client's `140 000 ₽`, because the tab reads server VM state and the form holds local state. There is no feedback that the counter registered.

## What

1. **«Мои условия» shows the specialist's terms — or an explicit "not proposed" state, never the client's numbers in disguise.** Drop the `?? gig.budget` / `?? gig.deadlineDays` fallback at the VM (the source), so the tab reflects only a real counter. With no counter, render an explicit «— не предложено» per field plus the existing «действуют условия заказчика» note.
2. **The tab live-reflects what is typed in the apply form.** Lift the proposed budget/срок state out of `ApplyBlock` into `GigDetail` (both already live in the same component tree) so typing a counter updates the «Мои условия» tab immediately — making the tab the running answer to "what am I actually proposing?".
3. **«Условия {company}» stays exactly as-is** — it is already the fixed, read-only reference. No change.
4. **The re-apply pre-fill stays exactly as-is** — specced, deliberate, and protective. No change.

## Constraints

- **Do not change apply/counter semantics.** Empty «Мои условия» still = apply on the client's terms; `applyToGig` already treats the counter as optional and is correct. No server-action change.
- **Do not touch the re-apply pre-fill** (`gig/spec.md:1243-1248`). It is out of scope and must remain.
- Token-pure / `gigly_full_design` skin — no visual redesign of the terms panel.
- The owner-side tab gating (`showTermsTabs = !data.isOwner`) already satisfies `gig/spec.md:1213` and must keep working.

## Non-goals

- Locking or hiding the apply form's price/деadline fields — they are the specialist's *own optional counter* and are correctly editable. There is no field to "lock".
- Making the tabs a **mode selector** that drives the form (considered and rejected 2026-07-15: it re-purposes a display toggle into a form control, a larger rework for the same user-visible outcome).
- Clearing the re-apply prefill (rejected — contradicts a shipped MUST and reintroduces silent counter-drop).
- Any change to `applyToGig`, `acceptApplication`, or the terms reconciliation on accept.
- Round-3 C5 (`examples-for-clients`).

## Risks

- **`ConditionsTermsVM` contract change.** Making `deadline`/`budget` nullable touches `app/components/blocks/ConditionsPanel.tsx` and `fixtures.ts`. Blast radius is small and verified: `ConditionsPanel` is **not used by any real route** (workbench/blocks only) — `GigDetail` has its own inline markup. Still must keep the workbench and F5 composition lint green.
- **Lifting form state** into `GigDetail` risks re-rendering the apply form on each keystroke. The fields are already controlled `useState` inside `ApplyBlock`; moving them one level up keeps the same shape, but the surrounding panel now re-renders too — watch for input lag.
- The tester's original complaint is interpreted, not quoted precisely. The chosen reading («Мои условия» duplicating the client's figures) is the one that matches both the screenshot and an existing spec MUST, but it should be re-confirmed with the tester on the next pass.
