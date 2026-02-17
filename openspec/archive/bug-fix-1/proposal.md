# Change Proposal: Fix Prisma Query Validation Error in Gig Detail Page

## Change ID
`bug-fix-1`

## Type
Bug Fix

## Priority
High (blocks gig detail page functionality)

## Problem Statement

The gig detail page (`app/dashboard/gigs/[id]/page.tsx`) throws a runtime `PrismaClientValidationError` when loading gig data:

```
Invalid `prisma.gig.findUnique()` invocation:
Please either use `include` or `select`, but not both at the same time.
```

### Root Cause

The Prisma query at line 23-67 in `app/dashboard/gigs/[id]/page.tsx` violates Prisma's constraint that **`select` and `include` cannot be mixed at the same nesting level**. The query attempts to:

1. Use `include` at the top level for relations like `client`, `applications`, `messages`
2. Use `select` within those included relations (e.g., `client: { select: {...}, include: {...} }`)

This pattern appears in multiple places:
- `client` relation: uses both `select` and `include`
- `applications.specialist` relation: uses both `select` and `include`
- `messages.sender` relation: uses both `select` and `include`
- `moderations.admin` relation: uses `select` inside `include`

### Impact

- **Severity:** Critical - page completely broken
- **Affected users:** All users (CLIENT, SPECIALIST, ADMIN) trying to view gig details
- **Scope:** Single page (`/dashboard/gigs/[id]`)

## Proposed Solution

Refactor the Prisma query to use **only `include`** throughout the nested relations. When we need to limit fields, we'll include the entire relation and let TypeScript/UI layer handle field selection, or restructure the query to use `select` consistently with explicit field enumeration.

### Approach

**Option A (Recommended): Use `include` only**
- Remove all `select` statements within `include` blocks
- Include full relation objects
- Minimal code change, maintains existing data flow

**Option B: Use `select` consistently**
- Convert all `include` to `select` with explicit field enumeration
- More verbose but gives precise control over fetched data
- Requires listing all scalar fields explicitly

**Decision:** Use Option A for simplicity and maintainability.

## Constraints

- MUST NOT change the data structure returned to UI components
- MUST maintain existing authorization checks (role-based moderation data)
- MUST preserve all existing functionality (messaging, applications, profiles)
- SHOULD minimize query changes to reduce regression risk

## Non-Goals

- Performance optimization of the query (separate concern)
- Refactoring UI components
- Adding new fields or relations

## Testing Strategy

1. Manual testing: Load gig detail page as CLIENT, SPECIALIST, and ADMIN
2. Verify all data displays correctly (applications, messages, profiles, moderation logs)
3. Run existing validation scripts that exercise gig queries
4. Check that no TypeScript errors are introduced

## Rollback Plan

If issues arise, revert the single file change to `app/dashboard/gigs/[id]/page.tsx`.
