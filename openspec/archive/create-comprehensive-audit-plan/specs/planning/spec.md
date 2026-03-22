# Planning Specification Reference

This change creates a planning document following the specification defined in:

**Reference:** `openspec/specs/planning/spec.md`

## Key Requirements

This planning document MUST:

1. **Follow Standard Format**:
   - Problem section (2-5 sentences)
   - Why This Matters section (2-5 sentences, reference project.md)
   - Scope section (affected systems, dependencies, risks)
   - Changes section (ralphy-plan commands, ordered by dependency)
   - Status section (PLANNED/IN_PROGRESS/COMPLETED, checkboxes, dates)

2. **Provide Executable Commands**:
   - Each change includes a copy-pasteable ralphy-plan command
   - Commands include brief description and requirements
   - Commands are ordered by dependency (prerequisites first)

3. **Be Actionable**:
   - Findings are specific, not vague
   - Priority is justified (impact, alignment, risk)
   - Scope is realistic (incremental improvements, not rewrites)

4. **Support Two Modes**:
   - This is **suggestive planning** (AI-directed)
   - AI analyzes project.md vision and current state
   - AI identifies gaps and next logical steps
   - AI explains why each suggestion matters

## Planning Document Location

The planning document will be created at:

`openspec/planning/comprehensive-project-audit.md`

## Lifecycle

1. **Creation**: Via this change (`create-comprehensive-audit-plan`)
2. **Usage**: User executes ralphy-plan commands from the document
3. **Tracking**: User marks completed changes with checkboxes
4. **Completion**: When all changes done, move to `openspec/planning/archive/`

## Integration with OpenSpec

- Planning document references existing specs in `openspec/specs/`
- Changes created from planning document may reference it in proposals
- Planning document does NOT duplicate spec content
- Planning document focuses on strategic analysis and execution order
