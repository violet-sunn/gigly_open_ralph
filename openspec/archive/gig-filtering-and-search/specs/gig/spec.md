# Gig Specification Delta: Gig Filtering & Search

## Note

This change does not modify the Gig model, database schema, or server actions. All filtering logic is implemented at the query level in the gig browse page component using existing Prisma query capabilities.

No changes to `app/actions/gig.ts` are required.

## Query Pattern Documentation

### Requirement: Dynamic Gig Filtering
The gig browse page MUST support dynamic filtering via Prisma queries without modifying the Gig model.

#### Scenario: Text search query
- GIVEN a search parameter "React"
- WHEN building the Prisma query
- THEN the where clause MUST include:
  ```typescript
  {
    OR: [
      { title: { contains: 'React', mode: 'insensitive' } },
      { description: { contains: 'React', mode: 'insensitive' } }
    ]
  }
  ```

#### Scenario: Tag filtering query
- GIVEN tag parameters ["React", "TypeScript"]
- WHEN building the Prisma query
- THEN the where clause MUST include:
  ```typescript
  {
    OR: [
      { tags: { contains: 'React' } },
      { tags: { contains: 'TypeScript' } }
    ]
  }
  ```
- NOTE: This uses substring matching on the comma-separated tags field

#### Scenario: Budget range query
- GIVEN minBudget=50000 (roubles) and maxBudget=150000 (roubles)
- WHEN building the Prisma query
- THEN the where clause MUST include:
  ```typescript
  {
    budget: {
      gte: 5000000, // 50000 * 100 kopecks
      lte: 15000000 // 150000 * 100 kopecks
    }
  }
  ```

#### Scenario: Combined filters query
- GIVEN multiple active filters (search="backend", tags=["Python", "Go"], minBudget=100000)
- WHEN building the Prisma query
- THEN the where clause MUST use nested AND/OR structure:
  ```typescript
  {
    AND: [
      { status: 'OPEN' },
      {
        OR: [
          { title: { contains: 'backend', mode: 'insensitive' } },
          { description: { contains: 'backend', mode: 'insensitive' } }
        ]
      },
      {
        OR: [
          { tags: { contains: 'Python' } },
          { tags: { contains: 'Go' } }
        ]
      },
      { budget: { gte: 10000000 } }
    ]
  }
  ```
- AND filter types MUST be combined with AND logic (search AND tags AND budget)
- AND within each filter type, OR logic MUST be used (tag1 OR tag2)

**Acceptance Criteria:**
- All queries maintain `status: 'OPEN'` filter
- Filter types are combined with AND logic using `where.AND` array
- Text search uses OR within: title OR description (case-insensitive)
- Tag filtering uses OR within: tag1 OR tag2 OR tag3
- Budget conditions are added to AND array
- Empty/undefined filters are excluded from AND array (no empty objects)
- Tag filtering uses substring matching (sufficient for comma-separated tags)
- Budget values are converted from roubles to kopecks before querying
- Invalid or missing parameters are safely ignored (no query errors)
- Queries include existing relations: `include: { client: { select: { email: true } } }`
