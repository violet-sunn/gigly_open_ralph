# Implementation Tasks

## Task 1: Add isExample field to Gig model

**Description:**
Add a boolean `isExample` field to the Gig model in the Prisma schema to distinguish example gigs from real gigs.

**Implementation Notes:**
- Open `prisma/schema.prisma`
- Add `isExample Boolean @default(false)` field to the Gig model
- Run `npx prisma format` to format the schema
- Run `npx prisma migrate dev --name add-is-example-to-gig` to create and apply migration
- Verify migration creates the column with default value false

**Files to Modify:**
- `prisma/schema.prisma`

**Test Plan:**
1. Run `npx prisma validate` - should pass without errors
2. Run `npx prisma migrate dev --name add-is-example-to-gig` - should create migration successfully
3. Open Prisma Studio (`npx prisma studio`) and verify:
   - Gig table has `isExample` column
   - Existing gigs have `isExample = false`
4. Create a test gig via the platform - verify `isExample` defaults to false

---

## Task 2: Create seed script with example gigs

**Description:**
Create a Prisma seed script that generates 3-5 high-quality example gigs demonstrating excellent requirements across different project types.

**Implementation Notes:**
- Create `prisma/seed.ts` file
- Import `@prisma/client` and `bcryptjs`
- Create a seed CLIENT user (email: `example-client@gigly.ru`, password hashed)
- Create 5 example gigs with `isExample = true`:
  1. **Backend API Development**: REST API for user management system
  2. **Frontend Component**: React dashboard with data visualization
  3. **DevOps Automation**: CI/CD pipeline setup for Node.js application
  4. **Database Optimization**: PostgreSQL query performance tuning
  5. **Testing Infrastructure**: E2E test suite setup with Playwright
- Each gig must have:
  - Realistic title (concise, descriptive)
  - Detailed description (200-400 words)
  - Clear goal (50-150 chars, desired outcome)
  - Specific deliverables (100-300 chars, bullet points or numbered list)
  - Realistic constraints (50-200 chars, tech stack, timeline, preferences)
  - Comprehensive acceptance criteria (200-500 chars, testable success criteria)
  - Budget: 150,000-200,000 RUB (stored as kopecks: 15,000,000-20,000,000)
  - Appropriate tags (comma-separated)
  - Status: "OPEN"
- Use `prisma.user.upsert()` for seed user (idempotent)
- Use `prisma.gig.upsert()` for example gigs (idempotent, match on unique title or custom logic)
- Add `prisma.seed` configuration to `package.json`:
  ```json
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
  ```

**Files to Create:**
- `prisma/seed.ts`

**Files to Modify:**
- `package.json` (add prisma.seed config)

**Example Gig Content (Backend API):**
```typescript
{
  title: "REST API для системы управления пользователями",
  description: "Требуется разработать RESTful API для управления пользователями в корпоративном приложении. API должен поддерживать CRUD операции, аутентификацию через JWT, ролевую модель доступа (admin, manager, user). Ожидается чистый, хорошо документированный код с покрытием тестами не менее 80%.",
  goal: "Создать надежный и масштабируемый API для управления пользователями с поддержкой аутентификации и авторизации.",
  deliverables: "1. REST API с эндпоинтами для CRUD операций над пользователями\n2. JWT-аутентификация с refresh tokens\n3. Middleware для проверки ролей\n4. OpenAPI/Swagger документация\n5. Unit и integration тесты (покрытие 80%+)\n6. README с инструкциями по запуску",
  constraints: "Стек: Node.js + Express/Fastify, PostgreSQL, TypeScript. Срок: 2-3 недели. Код должен следовать ESLint правилам проекта.",
  acceptanceCriteria: "API успешно проходит все тесты. Swagger документация доступна по /api-docs. Все эндпоинты возвращают корректные HTTP статусы и JSON. JWT токены работают корректно (access + refresh). Middleware проверяет роли и блокирует неавторизованный доступ. Код проходит code review без критических замечаний.",
  budget: 18000000, // 180,000 RUB in kopecks
  serviceFee: 3600000, // 20% of budget
  totalAmount: 21600000,
  tags: "Node.js,TypeScript,PostgreSQL,REST API,JWT",
  status: "OPEN",
  isExample: true,
  clientId: seedUser.id
}
```

**Test Plan:**
1. Install `tsx` if not already installed: `npm install -D tsx`
2. Run `npx prisma db seed` - should execute without errors
3. Open Prisma Studio and verify:
   - Seed user exists with email `example-client@gigly.ru` and role "CLIENT"
   - 5 example gigs exist with `isExample = true`
   - All example gigs have non-empty goal, deliverables, constraints, acceptanceCriteria
   - Budgets are in the 15M-20M kopeck range (150k-200k RUB)
   - Tags are appropriate for each project type
4. Run seed script again - should not create duplicates (idempotent)
5. Visit `/dashboard/gigs` - should see example gigs in the list

---

## Task 3: Prevent applications to example gigs

**Description:**
Update the `applyToGig` server action to reject applications to example gigs with a clear error message.

**Implementation Notes:**
- Open `app/actions/gig.ts`
- In `applyToGig` function, after fetching the gig, add validation:
  ```typescript
  if (gig.isExample) {
    return {
      error: 'This is an example gig for demonstration purposes. You cannot apply to example gigs.'
    };
  }
  ```
- Place this check AFTER the "gig not found" check but BEFORE role and status checks
- Ensure the gig query includes the `isExample` field

**Files to Modify:**
- `app/actions/gig.ts`

**Test Plan:**
1. Log in as a SPECIALIST user
2. Navigate to an example gig detail page (e.g., `/dashboard/gigs/[example-gig-id]`)
3. Attempt to submit the apply form (if visible)
4. Verify error message appears: "This is an example gig for demonstration purposes. You cannot apply to example gigs."
5. Verify no Application record is created in the database
6. Test applying to a real gig (isExample = false) - should work normally
7. Run integration test script if available

---

## Task 4: Display example badge on gig browse page

**Description:**
Update the gig browse page to display a visual "Example" badge for example gigs.

**Implementation Notes:**
- Open `app/dashboard/gigs/page.tsx`
- Ensure the Prisma query includes `isExample` field:
  ```typescript
  const gigs = await prisma.gig.findMany({
    where: { status: 'OPEN', closedByAdmin: false },
    include: { client: { include: { clientProfile: true } } },
    orderBy: { createdAt: 'desc' }
  });
  ```
- In the gig list rendering, add conditional badge:
  ```tsx
  {gig.isExample && (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
      ✨ Example
    </span>
  )}
  ```
- Position the badge next to the gig title or in the tags area
- Ensure badge is visually distinct from status badges

**Files to Modify:**
- `app/dashboard/gigs/page.tsx`

**Test Plan:**
1. Log in as any user (CLIENT or SPECIALIST)
2. Navigate to `/dashboard/gigs`
3. Verify example gigs display "✨ Example" badge with indigo background
4. Verify real gigs do NOT display the example badge
5. Verify badge is clearly visible and positioned near the title
6. Test responsive layout - badge should display correctly on mobile
7. Click on an example gig - should navigate to detail page

---

## Task 5: Update gig detail page for example gigs

**Description:**
Update the gig detail page to display an "Example Gig" banner and hide the apply form for example gigs.

**Implementation Notes:**
- Open `app/dashboard/gigs/[id]/page.tsx`
- Ensure the Prisma query includes `isExample` field in the gig query
- Add example gig banner at the top of the page (after title, before description):
  ```tsx
  {gig.isExample && (
    <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
      <div className="flex items-start">
        <span className="text-2xl mr-3">✨</span>
        <div>
          <h3 className="text-sm font-semibold text-indigo-900 mb-1">
            Example Gig
          </h3>
          <p className="text-sm text-indigo-700">
            This is an example gig demonstrating best practices for writing clear requirements.
            Use this as a reference when creating your own gigs.
          </p>
        </div>
      </div>
    </div>
  )}
  ```
- Update the apply form conditional rendering for SPECIALIST users:
  ```tsx
  {session.role === 'SPECIALIST' && !gig.isExample && (
    // existing apply form code
  )}

  {session.role === 'SPECIALIST' && gig.isExample && (
    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-sm text-gray-700">
        This is an example gig for demonstration purposes. You cannot apply to example gigs.
      </p>
      <p className="text-sm text-gray-600 mt-2">
        Use this example to understand what clear requirements look like when posting your own gigs.
      </p>
    </div>
  )}
  ```
- Ensure all structured requirement fields (goal, deliverables, constraints, acceptance criteria) are visible and well-formatted for example gigs

**Files to Modify:**
- `app/dashboard/gigs/[id]/page.tsx`

**Test Plan:**
1. Log in as a SPECIALIST user
2. Navigate to an example gig detail page
3. Verify:
   - "Example Gig" banner displays at the top with indigo background
   - Banner includes ✨ emoji and explanatory text
   - Apply form is NOT displayed
   - Informational message is shown instead explaining this is an example
   - All structured fields (goal, deliverables, constraints, acceptance criteria) are visible
4. Log in as a CLIENT user
5. Navigate to the same example gig detail page
6. Verify:
   - "Example Gig" banner displays
   - No apply form (CLIENT users never see apply forms)
   - All gig details are visible
7. Navigate to a real gig (isExample = false)
8. Verify:
   - No example banner displays
   - Apply form works normally for SPECIALIST
   - All existing functionality unchanged

---

## Task 6: Manual testing and validation

**Description:**
Perform end-to-end manual testing to ensure example gigs work correctly across all user flows.

**Test Plan:**
1. **Database verification:**
   - Open Prisma Studio
   - Verify 5 example gigs exist with `isExample = true`
   - Verify all example gigs have complete, high-quality content in all fields
   - Verify seed user exists

2. **Gig browsing (SPECIALIST):**
   - Log in as SPECIALIST
   - Navigate to `/dashboard/gigs`
   - Verify example gigs display with "✨ Example" badge
   - Verify real gigs do not have the badge
   - Click on an example gig - should navigate to detail page

3. **Gig browsing (CLIENT):**
   - Log in as CLIENT
   - Navigate to `/dashboard/gigs`
   - Verify example gigs display with badge
   - Click on an example gig - should navigate to detail page

4. **Example gig detail (SPECIALIST):**
   - Navigate to example gig detail page
   - Verify "Example Gig" banner displays prominently
   - Verify apply form is hidden
   - Verify informational message is shown
   - Verify all structured fields are visible and well-formatted
   - Verify cannot apply (no form submission possible)

5. **Example gig detail (CLIENT):**
   - Navigate to example gig detail page
   - Verify "Example Gig" banner displays
   - Verify all gig details are visible
   - Verify can read and learn from the example

6. **Real gig functionality (unchanged):**
   - Create a new real gig as CLIENT
   - Verify `isExample = false` in database
   - Apply to a real gig as SPECIALIST
   - Verify application works normally
   - Verify no example badges appear on real gigs

7. **Edge cases:**
   - Attempt to apply to example gig via direct API call (if possible) - should be rejected
   - Verify example gigs remain in OPEN status (not part of lifecycle)
   - Verify example gigs appear in search/filter results (if filtering is implemented)

8. **Seed script idempotency:**
   - Run `npx prisma db seed` multiple times
   - Verify no duplicate example gigs are created
   - Verify existing example gigs are not modified (or updated correctly if using upsert)

**Success Criteria:**
- All example gigs are visible and clearly marked
- SPECIALIST users cannot apply to example gigs
- Example gigs serve as clear, helpful references for writing requirements
- No regressions in existing gig functionality
- Seed script is idempotent and reliable
