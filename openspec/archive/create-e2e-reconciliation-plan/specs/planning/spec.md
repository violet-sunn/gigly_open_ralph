# Planning Specification Reference

This change creates a planning document following the format defined in:

**`openspec/specs/planning/spec.md`**

The planning document will be created at:

**`openspec/planning/e2e-reconciliation.md`**

## Requirements

All requirements from `openspec/specs/planning/spec.md` apply, including:

- Planning Document Format (required sections: Problem, Why This Matters, Scope, Changes, Status)
- Planning Document Creation (via the OpenSpec workflow)
- Two Modes of Planning (this is imperative / user-directed planning)
- Planning Document Lifecycle (PLANNED → IN_PROGRESS → COMPLETED)
- Planning Document Naming (kebab-case, descriptive, no dates/versions)
- Integration with OpenSpec (references specs, provides ralphy-plan commands)

## ADDED Requirements

### Requirement: Complete E2E Suite Triage
The planning document MUST classify every `__tests__/e2e/*.spec.ts` file into exactly one disposition bucket, grounded in the actual spec contents (not file names).

#### Scenario: Every spec is triaged
**Given** the ~45 E2E spec files in `__tests__/e2e/`
**When** reviewing the planning document's Scope section
**Then** the document MUST contain a triage table listing every spec file
**And** each spec MUST be assigned exactly one of: PASS-AS-IS, REWRITE-TO-NEW-DOM, DELETE-OBSOLETE-FEATURE, RE-EVALUATE-FIDELITY
**And** no spec file may be omitted

#### Scenario: Deletions carry a rationale
**Given** a spec classified as DELETE-OBSOLETE-FEATURE
**When** reviewing its triage row
**Then** the row MUST name the intentionally-removed feature it covered (e.g. breadcrumbs, back-buttons, the old shell)
**And** deletion MUST be justified by the feature's removal, not by test difficulty

### Requirement: Concrete, Grounded DOM Deltas
The planning document MUST give the rewrites concrete old→new assertion deltas grounded in the shipped `*Design.tsx` markup.

#### Scenario: Per-screen deltas are mechanical
**Given** a REWRITE-TO-NEW-DOM change for a rebuilt screen
**When** reading its entry in the Changes section
**Then** the entry MUST list the specific old label/selector → new label/selector changes (e.g. «Откликнуться» → «Отправить заявку»)
**And** each delta MUST be traceable to the shipped design component
**And** shell-wide deltas (header title, removed breadcrumbs/back-buttons, removed gig-detail chat) MUST be captured once and referenced

### Requirement: Executable, Ordered Changes with Deterministic Acceptance
The planning document MUST provide copy-pasteable `/ralphy-plan` commands, ordered by dependency, each with a deterministic per-spec test plan.

#### Scenario: One change per screen/cluster covering all affected specs
**Given** the Changes section
**When** reviewing the change list
**Then** every REWRITE/DELETE/RE-EVALUATE spec from the triage MUST be covered by exactly one change
**And** each change MUST be a copy-pasteable `/ralphy-plan` command with requirements + the DOM deltas + the reused harness (`setE2ESession`, seeded `file:./test.db`, `DISABLE_RATE_LIMIT`)
**And** changes MUST be ordered so any shared-helper groundwork precedes the per-screen rewrites

#### Scenario: Acceptance is deterministic
**Given** any change in the document
**When** reading its test plan
**Then** the test plan MUST name the specific spec(s) and assert them green via `npm run test:e2e`
**And** the initiative's overall acceptance MUST be the whole Playwright suite green (with obsolete specs deleted under documented rationale)

### Requirement: No Behavior or Unit-Suite Changes
The planning document MUST scope the work to the E2E suite only.

#### Scenario: Non-goals are explicit
**Given** the planning document
**When** reviewing scope/non-goals
**Then** the document MUST state that `app/`/`lib/` behavior, the kit, and the unit/integration suite (951/951 green) MUST NOT change
**And** the document MUST NOT propose re-introducing the deleted kit screens
