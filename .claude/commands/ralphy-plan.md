# /ralphy-plan (PRD -> OpenSpec change)

You are an AI coding assistant. Convert the user's PRD/requirements into an OpenSpec change proposal with clear, testable acceptance criteria.

## Two Modes

### Mode 1: Regular Change (Default)
Create an OpenSpec change for implementing a feature.

### Mode 2: Planning Document Creation
Create a change that generates a strategic planning document.

**Detect planning mode when:**
- Change name starts with `create-` and ends with `-plan`
- User asks "what should we build next" or similar
- User requests strategic analysis or planning

## Deliverables (create/modify files)

### For Regular Changes:
- `openspec/changes/<change-name>/proposal.md`
- `openspec/changes/<change-name>/tasks.md`
- `openspec/changes/<change-name>/specs/<domain>/spec.md` (and others as needed)

### For Planning Document Changes:
- `openspec/changes/create-<name>-plan/proposal.md`
- `openspec/changes/create-<name>-plan/tasks.md`
- `openspec/changes/create-<name>-plan/specs/planning/spec.md` (reference existing)

## Rules
- Use MUST/SHALL language for requirements.
- Every `### Requirement:` MUST include at least one `#### Scenario:`.
- Include acceptance criteria that can be validated by tests or deterministic commands.
- Keep scope explicit; list non-goals.

## Procedure

### For Regular Changes:
1. Read `openspec/project.md` and relevant specs under `openspec/specs/`.
2. Propose a kebab-case change name (e.g. `add-profile-filters`).
3. Create `proposal.md` explaining why/what and the constraints.
4. Write spec deltas under `specs/` using:
   - `## ADDED Requirements`
   - `## MODIFIED Requirements`
   - `## REMOVED Requirements`
5. Write `tasks.md` as a numbered checklist. Each task includes:
   - Implementation notes
   - Test plan (what to run, what to assert)

### For Planning Document Changes:
1. Read `openspec/project.md`, `openspec/specs/planning/spec.md`, and current state.
2. Propose a planning document name (e.g. `ui-dark-theme-refactor`).
3. Create `proposal.md` explaining:
   - What will be analyzed
   - What the planning document will contain
   - Why this planning is needed
4. Reference `openspec/specs/planning/spec.md` (don't duplicate).
5. Write `tasks.md` with:
   - Task 1: Analyze project context (read project.md, specs, archive)
   - Task 2: Identify affected systems and dependencies
   - Task 3: Create planning document in `openspec/planning/<name>.md`
   - Task 4: Generate ralphy-plan commands for each change
   - Test plan: Verify planning document follows spec format

## Output
Summarize created files and tell the user what to run next (typically implementation).

