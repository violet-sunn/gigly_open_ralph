# Implementation Tasks: bug-fix-1

## Task 1: Fix Prisma query in gig detail page

**File:** `app/dashboard/gigs/[id]/page.tsx`

**Implementation:**

Refactor the `prisma.gig.findUnique()` query (lines 23-67) to remove all `select` statements nested within `include` blocks.

### Changes Required:

1. **`client` relation** (lines 26-32):
   - Remove `select: { email: true, id: true }`
   - Keep `include: { clientProfile: true }`
   - Result: Include full User object with clientProfile

2. **`applications.specialist` relation** (lines 36-42):
   - Remove `select: { email: true, id: true }`
   - Keep `include: { specialistProfile: true }`
   - Result: Include full User object with specialistProfile

3. **`messages.sender` relation** (lines 48-54):
   - Remove `select: { email: true, id: true }`
   - Keep `include: { clientProfile: {...}, specialistProfile: {...} }`
   - Result: Include full User object with both profile types

4. **`moderations.admin` relation** (lines 60-62):
   - Remove `select: { email: true }`
   - Change to `include: { admin: true }` or just include admin without select
   - Result: Include full User object for admin

### Updated Query Structure:

```typescript
const gig = await prisma.gig.findUnique({
  where: { id },
  include: {
    client: {
      include: { clientProfile: true }
    },
    assignedSpecialist: true,
    applications: {
      include: {
        specialist: {
          include: { specialistProfile: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    },
    messages: {
      include: {
        sender: {
          include: {
            clientProfile: true,
            specialistProfile: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    },
    moderations: session.role === 'ADMIN' ? {
      include: {
        admin: true
      },
      orderBy: { createdAt: 'desc' }
    } : false,
  },
})
```

**Test Plan:**

1. Start the development server: `npm run dev`
2. Log in as CLIENT user
3. Navigate to `/dashboard/gigs/[id]` for an existing gig
4. Verify page loads without Prisma error
5. Verify all sections display correctly:
   - Gig details (title, description, budget, client info)
   - Applications list with specialist profiles
   - Messages section (if specialist assigned)
6. Log in as SPECIALIST user
7. Navigate to a gig detail page
8. Verify page loads and displays correctly
9. Log in as ADMIN user
10. Navigate to a gig with moderation history
11. Verify moderation logs display correctly
12. Run existing test scripts:
    - `npx tsx scripts/test-gig-lifecycle.ts`
    - `npx tsx scripts/test-messaging-iteration-2.ts`
    - `npx tsx scripts/validate-messaging-iteration-2.ts`

**Acceptance Criteria:**

- ✅ Gig detail page loads without `PrismaClientValidationError`
- ✅ All user data (email, profiles) displays correctly in UI
- ✅ Applications list shows specialist names and tech stacks
- ✅ Messages show sender names (client company name or specialist display name)
- ✅ Admin moderation logs show admin email
- ✅ No TypeScript compilation errors
- ✅ Existing test scripts pass

---

## Task 2: Verify no other files have similar issues

**Implementation:**

Search codebase for other instances of mixed `select`/`include` patterns.

**Commands:**

```bash
# Search for files with Prisma queries
npx tsx -e "console.log('Checking for mixed select/include patterns...')"

# Manual review of key files:
# - app/actions/gig.ts
# - app/actions/moderation.ts
# - app/dashboard/page.tsx
# - Any other files with prisma.*.findUnique or prisma.*.findMany
```

**Test Plan:**

1. Review each file with Prisma queries
2. Look for patterns where `include` contains `select` or vice versa
3. If found, apply same fix pattern as Task 1

**Acceptance Criteria:**

- ✅ All Prisma queries in codebase follow consistent `include` or `select` usage
- ✅ No other pages throw similar validation errors

---

## Task 3: Document the pattern in project conventions

**File:** `openspec/project.md` (optional enhancement)

**Implementation:**

Add a note to the Conventions section about Prisma query patterns:

```markdown
## Prisma Query Conventions

- Use `include` for relations when you need the full related object
- Use `select` when you need specific fields only
- NEVER mix `select` and `include` at the same nesting level
- Prefer `include` for simplicity unless performance requires field selection
```

**Test Plan:**

N/A - documentation only

**Acceptance Criteria:**

- ✅ Convention documented for future reference
