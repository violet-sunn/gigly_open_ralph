# Implementation Tasks: Requirements Iteration 2

## Task 1: Add Structured Requirement Fields to Gig Model

**Description:** Extend the Gig model in Prisma schema with three new optional text fields: goal, deliverables, and constraints.

**Implementation Notes:**
- File: `prisma/schema.prisma`
- Add three new fields to the Gig model:
  ```prisma
  goal         String @default("")
  deliverables String @default("")
  constraints  String @default("")
  ```
- Position these fields after `acceptanceCriteria` field
- All fields are non-nullable String with empty string default
- Run `npx prisma format` to format the schema
- Run `npx prisma validate` to check for errors
- Create migration: `npx prisma migrate dev --name add_structured_requirement_fields`
- Run migration to update database

**Test Plan:**
1. Run `npx prisma validate` - should pass without errors
2. Run `npx prisma migrate dev --name add_structured_requirement_fields` - should create migration successfully
3. Open Prisma Studio: `npx prisma studio`
4. Verify Gig model shows three new fields: goal, deliverables, constraints
5. Check existing gigs in database - all should have empty strings for new fields
6. Try creating a test gig record via Prisma Studio with values in new fields - should save successfully
7. Query a gig via Prisma Client in a test script:
   ```typescript
   const gig = await prisma.gig.findFirst({ include: { client: true } })
   console.log(gig.goal, gig.deliverables, gig.constraints)
   ```
   Should return empty strings for existing gigs, actual values for new test gig

---

## Task 2: Update createGig Server Action

**Description:** Modify the `createGig` server action to accept and store the three new optional fields from form data.

**Implementation Notes:**
- File: `app/actions/gig.ts`
- In `createGig` function, extract new fields from formData:
  ```typescript
  const goal = (formData.get('goal') as string || '').trim()
  const deliverables = (formData.get('deliverables') as string || '').trim()
  const constraints = (formData.get('constraints') as string || '').trim()
  ```
- Add these fields to the `prisma.gig.create()` call:
  ```typescript
  await prisma.gig.create({
    data: {
      // ... existing fields ...
      acceptanceCriteria: acceptanceCriteria.trim(),
      goal,
      deliverables,
      constraints,
      // ... rest of fields ...
    }
  })
  ```
- No validation required for these optional fields (empty strings are valid)
- Ensure trimming happens before storage

**Test Plan:**
1. Start dev server: `npm run dev`
2. Log in as CLIENT user
3. Navigate to `/dashboard/gigs/new`
4. Create a gig WITHOUT filling optional fields:
   - Fill required fields only (title, description, acceptanceCriteria, budget)
   - Submit form
   - Should redirect to `/dashboard` successfully
   - Check database via Prisma Studio - new gig should have empty strings for goal, deliverables, constraints
5. Create a gig WITH optional fields filled:
   - Fill all required fields
   - Fill goal: "Test goal content"
   - Fill deliverables: "Test deliverables content"
   - Fill constraints: "Test constraints content"
   - Submit form
   - Should redirect to `/dashboard` successfully
   - Check database - new gig should have the provided values stored
6. Create a gig with whitespace in optional fields:
   - Fill optional fields with leading/trailing spaces: "  test  "
   - Submit form
   - Check database - values should be trimmed: "test"
7. Verify existing validation still works:
   - Try submitting with acceptanceCriteria < 50 chars
   - Should show error message
   - Optional fields should not interfere with validation

---

## Task 3: Update Gig Creation Form UI

**Description:** Add three new optional textarea fields to the gig creation form with helpful labels, placeholders, and helper text.

**Implementation Notes:**
- File: `app/dashboard/gigs/new/page.tsx`
- Add three new textarea fields after the acceptanceCriteria field, before budget field
- Add optional visual grouping (e.g., `<div className="mt-6 pt-6 border-t"><h3>Additional Details (Optional)</h3>...</div>`)
- For each field, include:
  - Label with clear question format
  - Placeholder with realistic example
  - Helper text emphasizing optional nature
  - `name` attribute matching server action expectations
  - `rows={3}` for consistent sizing
  - NO `required` attribute
- Example structure:
  ```tsx
  <div>
    <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
      Goal / Desired Outcome
    </label>
    <textarea
      id="goal"
      name="goal"
      rows={3}
      placeholder="Example: We need to migrate our user authentication from custom solution to OAuth 2.0 to improve security and reduce maintenance burden."
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
    <p className="mt-1 text-sm text-gray-500">
      Optional: Describe the business or technical problem you're solving. What does success look like?
    </p>
  </div>
  ```
- Ensure mobile-friendly responsive styling

**Test Plan:**
1. Navigate to `/dashboard/gigs/new` as CLIENT user
2. Verify form displays three new fields:
   - Goal/Outcome field with label, placeholder, helper text
   - Deliverables field with label, placeholder, helper text
   - Constraints field with label, placeholder, helper text
3. Verify fields are positioned after "Definition of Done", before budget
4. Verify optional grouping/heading is visible
5. Verify placeholder text appears when fields are empty
6. Verify placeholder disappears when typing
7. Verify helper text is visible below each field
8. Verify fields are NOT marked as required (no red asterisk, no HTML5 validation)
9. Test form submission without filling optional fields - should work
10. Test form submission with optional fields filled - should work
11. Test on mobile viewport (resize browser to 375px width):
    - Fields should be full width
    - Text should be readable
    - No horizontal scrolling
12. Verify existing form functionality unchanged:
    - Fee calculation preview still works
    - Validation errors still display
    - Loading state still works

---

## Task 4: Update Gig Detail Page to Display Structured Fields

**Description:** Modify the gig detail page to query and display the three new structured requirement fields when they contain content.

**Implementation Notes:**
- File: `app/dashboard/gigs/[id]/page.tsx`
- Gig query already fetches all fields (no changes needed to query)
- Add a new section after description, before or alongside "Definition of Done"
- Conditionally render section only if at least one field has content:
  ```tsx
  {(gig.goal || gig.deliverables || gig.constraints) && (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Additional Requirements</h3>

      {gig.goal && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">🎯 Goal / Desired Outcome</h4>
          <p className="text-gray-900 whitespace-pre-wrap">{gig.goal}</p>
        </div>
      )}

      {gig.deliverables && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">📦 Specific Deliverables</h4>
          <p className="text-gray-900 whitespace-pre-wrap">{gig.deliverables}</p>
        </div>
      )}

      {gig.constraints && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">⚙️ Constraints & Preferences</h4>
          <p className="text-gray-900 whitespace-pre-wrap">{gig.constraints}</p>
        </div>
      )}
    </div>
  )}
  ```
- Use `whitespace-pre-wrap` to preserve line breaks
- Position prominently for specialist visibility

**Test Plan:**
1. Create test gigs with different field combinations:
   - Gig A: All three fields filled
   - Gig B: Only goal filled
   - Gig C: Only deliverables and constraints filled
   - Gig D: All fields empty (legacy gig simulation)
2. View Gig A detail page:
   - Should display "Additional Requirements" section
   - Should show all three subsections with headings and content
   - Content should preserve line breaks if multi-line
3. View Gig B detail page:
   - Should display "Additional Requirements" section
   - Should show only Goal subsection
   - Deliverables and Constraints subsections should be hidden
4. View Gig C detail page:
   - Should display "Additional Requirements" section
   - Should show only Deliverables and Constraints subsections
   - Goal subsection should be hidden
5. View Gig D detail page (legacy gig):
   - Should NOT display "Additional Requirements" section at all
   - Page should render normally with existing fields only
6. Test as different roles:
   - CLIENT owner: should see structured fields
   - SPECIALIST (applied): should see structured fields
   - SPECIALIST (not applied): should see structured fields
   - All roles should have same visibility
7. Test positioning:
   - Section should be prominent (high on page, near description)
   - Should be easy to find when scanning the page
8. Test mobile viewport:
   - Section should be readable on mobile
   - No layout issues or overflow
9. Verify existing page functionality unchanged:
   - Applications section still works
   - Messages section still works
   - All buttons and forms still work

---

## Task 5: End-to-End Testing

**Description:** Test the complete flow from gig creation to viewing, ensuring all components work together correctly.

**Implementation Notes:**
- No code changes, this is a comprehensive testing task
- Test with realistic data that mimics actual client usage
- Test edge cases and error scenarios

**Test Plan:**
1. **Happy path - Full structured requirements:**
   - Log in as CLIENT user
   - Navigate to `/dashboard/gigs/new`
   - Fill all required fields:
     - Title: "OAuth 2.0 Integration for User Authentication"
     - Description: "We need to replace our custom authentication system with industry-standard OAuth 2.0..."
     - Definition of Done: "Working OAuth integration with Google and GitHub providers, all existing users migrated without data loss, comprehensive test coverage, deployment to production."
     - Budget: 150000
   - Fill all optional fields:
     - Goal: "Improve security posture and reduce maintenance burden by using battle-tested OAuth libraries instead of custom code."
     - Deliverables: "1. OAuth 2.0 integration with Google and GitHub\n2. Migration script for existing users\n3. Updated documentation\n4. Deployment to staging and production"
     - Constraints: "Must maintain backward compatibility with existing API endpoints. Prefer using Passport.js library. Deadline: end of Q1 2026."
   - Submit form
   - Should redirect to `/dashboard`
   - Navigate to gig detail page
   - Verify all fields display correctly with proper formatting
   - Log out and log in as SPECIALIST
   - Browse gigs and view the created gig
   - Verify structured fields are visible and helpful for understanding requirements

2. **Minimal path - No optional fields:**
   - Log in as CLIENT user
   - Create gig with only required fields (skip all optional fields)
   - Submit form
   - View gig detail page
   - Verify no "Additional Requirements" section appears
   - Verify page looks clean without empty placeholders

3. **Partial path - Some optional fields:**
   - Create gig with only Goal filled (skip Deliverables and Constraints)
   - View gig detail page
   - Verify only Goal subsection appears
   - Verify no empty subsections shown

4. **Edge cases:**
   - Create gig with very long text in optional fields (500+ characters)
   - Verify text displays correctly without layout issues
   - Create gig with multi-line text (using Enter key in textarea)
   - Verify line breaks are preserved in display (`whitespace-pre-wrap`)
   - Create gig with special characters in optional fields (quotes, apostrophes, etc.)
   - Verify text displays correctly without encoding issues

5. **Legacy compatibility:**
   - View existing gigs created before this change
   - Verify they display normally without errors
   - Verify no "Additional Requirements" section appears for legacy gigs

6. **Cross-browser testing:**
   - Test in Chrome, Firefox, Safari (if available)
   - Verify form and display work consistently

7. **Performance check:**
   - Create 10 gigs with various field combinations
   - Browse gigs list - should load quickly
   - View gig details - should load quickly
   - No noticeable performance degradation

**Success Criteria:**
- All test scenarios pass without errors
- Form is intuitive and helpful for non-technical clients
- Structured fields provide clear value to specialists browsing gigs
- No regressions in existing functionality
- Mobile experience is smooth and usable
- Legacy gigs continue to work without issues

---

## Summary

Total tasks: 5
Estimated time: 3-4 hours

**Dependencies:**
- Task 2 depends on Task 1 (database schema must exist before server action can use it)
- Task 3 depends on Task 2 (form should submit to working server action)
- Task 4 depends on Task 1 (page must query fields that exist in database)
- Task 5 depends on Tasks 1-4 (end-to-end testing requires all components)

**Recommended order:**
1. Task 1 (Database) - Foundation
2. Task 2 (Server Action) - Backend logic
3. Task 3 (Form UI) - Input interface
4. Task 4 (Detail Page UI) - Output interface
5. Task 5 (E2E Testing) - Validation

**Rollback plan:**
If issues arise, rollback is straightforward:
- Revert migration: `npx prisma migrate resolve --rolled-back <migration-name>`
- Revert code changes via git
- New fields have default values, so partial rollback is safe (database won't break if code is reverted)
