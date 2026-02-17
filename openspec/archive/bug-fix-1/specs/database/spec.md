# Database Specification Delta: bug-fix-1

## MODIFIED Requirements

### Requirement: Prisma Query Patterns

**Context:** This requirement clarifies the correct usage of Prisma's `select` and `include` options to prevent validation errors.

#### Scenario: Querying relations with include
- GIVEN a Prisma query that needs to fetch related data
- WHEN using `include` to fetch relations
- THEN nested relations MUST also use `include` (not `select`)
- AND all fields of the included relation will be fetched

**Example (Correct):**
```typescript
prisma.gig.findUnique({
  where: { id },
  include: {
    client: {
      include: { clientProfile: true }
    }
  }
})
```

**Example (Incorrect - will throw validation error):**
```typescript
prisma.gig.findUnique({
  where: { id },
  include: {
    client: {
      select: { email: true },  // ❌ Cannot mix select with include
      include: { clientProfile: true }
    }
  }
})
```

#### Scenario: Querying relations with select
- GIVEN a Prisma query that needs specific fields only
- WHEN using `select` to fetch specific fields
- THEN nested relations MUST use `select` with explicit field enumeration
- AND all scalar fields must be explicitly listed

**Example (Correct):**
```typescript
prisma.gig.findUnique({
  where: { id },
  select: {
    id: true,
    title: true,
    client: {
      select: {
        email: true,
        clientProfile: {
          select: { companyName: true }
        }
      }
    }
  }
})
```

#### Scenario: Conditional includes based on user role
- GIVEN a query that conditionally includes relations based on authorization
- WHEN the condition is false
- THEN the include value MUST be `false` (not `undefined` or `null`)

**Example (Correct):**
```typescript
prisma.gig.findUnique({
  where: { id },
  include: {
    moderations: session.role === 'ADMIN' ? {
      include: { admin: true }
    } : false  // ✅ Use false, not undefined
  }
})
```

**Acceptance Criteria:**
- All Prisma queries in the codebase follow consistent `include` or `select` usage
- No queries mix `select` and `include` at the same nesting level
- Conditional includes use `false` for the negative case
- `npx prisma validate` passes
- No `PrismaClientValidationError` at runtime
