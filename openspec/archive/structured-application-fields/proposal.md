# Change Proposal: Structured Application Fields

## Problem Statement

Currently, the application form uses a single optional "Cover Letter" field with a generic prompt ("Tell the client why you're a great fit..."). This encourages the exact type of "salesy" freelancing that the SPECIALIST persona dislikes.

From project.md SPECIALIST persona:
- **Tired of "salesy" freelancing**: Hate writing generic cover letters ("Hire me, I'm a rockstar!"), prefer concrete technical discussions.
- **A way to demonstrate competence through substance, not marketing**: Show their approach and ask clarifying questions instead of generic pitches.

The current form:
1. Doesn't guide specialists to think critically about the requirements
2. Doesn't help clients evaluate technical competence
3. Allows low-effort applications that waste everyone's time
4. Doesn't surface clarifying questions that could prevent scope creep

## Proposed Solution

Replace the generic "Cover Letter" field with three structured fields:

1. **Technical Approach** (required): How will you solve this? What methodology will you use?
2. **Clarifying Questions** (required): What questions do you have about the requirements?
3. **Estimated Effort** (optional): How long do you estimate this will take?

### Why This Works

**For Specialists:**
- Demonstrates competence through concrete technical thinking, not marketing fluff
- Aligns with their preference for substance over sales pitches
- Filters out gigs with unclear requirements (if they can't formulate questions, requirements might be too vague)

**For Clients:**
- See who actually read and understood the requirements
- Identify specialists who think critically before committing
- Surface potential scope issues early through clarifying questions
- Get realistic effort estimates to inform decisions

**For Platform:**
- Creates "good friction" that filters for quality on both sides
- Reduces low-effort spam applications
- Improves match quality and reduces disputes
- Reinforces positioning as quality-focused marketplace

## Constraints

- **Backward compatibility**: Existing applications with only `coverLetter` must display gracefully
- **Migration strategy**: Existing `coverLetter` field remains in database, new fields added alongside
- **Validation**: `approach` and `questions` are required (non-empty after trimming), `estimatedEffort` is optional
- **Character limits**: Reasonable limits to prevent abuse (approach: 2000 chars, questions: 1000 chars, effort: 200 chars)
- **UI placement**: New fields must be prominently displayed in applications list for client review

## Non-Goals

- Removing the `coverLetter` field from the database (keep for backward compatibility)
- Adding file upload capabilities for portfolios or work samples
- Implementing structured templates or dropdowns (keep free-form text for flexibility)
- Auto-calculating effort estimates or providing effort estimation tools

## Success Metrics

- Reduction in "empty bar" problem (gigs with 0 applications) - specialists can better evaluate if they understand requirements
- Increase in application quality (measured by client acceptance rate)
- Reduction in disputes (measured by admin intervention rate) - clarifying questions surface issues early
- Specialist satisfaction with application process (qualitative feedback)
