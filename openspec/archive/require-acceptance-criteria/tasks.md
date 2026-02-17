# Implementation Tasks

## Task 1: Update Database Schema
**Description**: Add `acceptanceCriteria` field to Gig model in Prisma schema.

**Implementation Notes**:
- Add `acceptanceCriteria String?` field to Gig model in `prisma/schema.prisma`
- Make it nullable to support existing gigs (they will show "Not specified")
- Run `npx prisma migrate dev --name add-acceptance-criteria` to create migration
- Run `npx prisma generate` to update Prisma client

**Test Plan**:
```bash
# Verify migration created successfully
ls prisma/migrations/ | grep add-acceptance-criteria

# Verify Prisma client updated
npx prisma studio
# Open Gig table and verify acceptanceCriteria field exists
```

**Acceptance Criteria**:
- [ ] `acceptanceCriteria String?` field added to Gig model
- [ ] Migration file created in `prisma/migrations/`
- [ ] Prisma client regenerated
- [ ] Field visible in Prisma Studio

---

## Task 2: Update createGig Server Action
**Description**: Add validation for acceptanceCriteria field in the createGig server action.

**Implementation Notes**:
- File: `app/actions/gig.ts`
- Extract `acceptanceCriteria` from formData
- Trim the value: `const trimmedCriteria = acceptanceCriteria.trim()`
- Validate:
  - Required: `if (!trimmedCriteria) return { error: 'Title, description, and acceptance criteria are required.' }`
  - Min length: `if (trimmedCriteria.length < 50) return { error: 'Acceptance criteria must be at least 50 characters.' }`
- Include in Prisma create: `acceptanceCriteria: trimmedCriteria`

**Test Plan**:
```bash
# Run integration test script
npx tsx scripts/test-gig-creation.ts

# Manual test via UI:
# 1. Login as CLIENT
# 2. Navigate to /dashboard/gigs/new
# 3. Try to submit without acceptance criteria → should show error
# 4. Try to submit with "test" (4 chars) → should show error "must be at least 50 characters"
# 5. Submit with valid 50+ char criteria → should succeed and redirect to /dashboard
```

**Acceptance Criteria**:
- [ ] acceptanceCriteria extracted from formData
- [ ] Value trimmed before validation
- [ ] Required validation returns appropriate error
- [ ] Min length (50 chars) validation returns appropriate error
- [ ] Trimmed value stored in database
- [ ] Successful creation includes acceptanceCriteria

---

## Task 3: Update Gig Creation Form UI
**Description**: Add acceptance criteria textarea to the gig creation form with helpful guidance.

**Implementation Notes**:
- File: `app/dashboard/gigs/new/page.tsx`
- Add textarea field between description and budget:
  ```tsx
  <div>
    <label htmlFor="acceptanceCriteria" className="block text-sm font-medium text-gray-700">
      Definition of Done (Acceptance Criteria) *
    </label>
    <textarea
      id="acceptanceCriteria"
      name="acceptanceCriteria"
      required
      rows={5}
      placeholder="What does 'done' look like? Be specific: deliverables, quality standards, success metrics. Example: 'API returns user data in JSON format with <200ms response time, includes unit tests with >80% coverage, deployed to staging environment.'"
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
    <p className="mt-1 text-sm text-gray-500">
      Minimum 50 characters. Clear criteria prevent disputes and scope creep.
    </p>
  </div>
  ```

**Test Plan**:
```bash
# Start dev server
npm run dev

# Manual UI test:
# 1. Navigate to http://localhost:3000/dashboard/gigs/new (as CLIENT)
# 2. Verify "Definition of Done (Acceptance Criteria)" field is visible
# 3. Verify placeholder text is helpful and includes example
# 4. Verify helper text "Minimum 50 characters..." is displayed below field
# 5. Verify field is marked as required (*)
# 6. Verify field has 5 rows (adequate space for content)
# 7. Test form submission with empty field → HTML5 validation should prevent submit
# 8. Test form submission with short text → server error should display
# 9. Test form submission with valid criteria → should succeed
```

**Acceptance Criteria**:
- [ ] Textarea field added with name="acceptanceCriteria"
- [ ] Label: "Definition of Done (Acceptance Criteria)" with asterisk
- [ ] Placeholder text with helpful example
- [ ] Helper text below field about 50 char minimum
- [ ] Field marked as required (HTML5 validation)
- [ ] Field has 5 rows for adequate space
- [ ] Consistent styling with other form fields

---

## Task 4: Display Acceptance Criteria on Gig Detail Page
**Description**: Show acceptance criteria prominently on gig detail pages for all users.

**Implementation Notes**:
- File: `app/dashboard/gigs/[id]/page.tsx`
- Add acceptance criteria section after description, before budget/tags:
  ```tsx
  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Definition of Done
    </h3>
    <p className="text-gray-700 whitespace-pre-wrap">
      {gig.acceptanceCriteria || 'Not specified'}
    </p>
  </div>
  ```
- Use `whitespace-pre-wrap` to preserve line breaks
- Handle null values gracefully (show "Not specified" for legacy gigs)

**Test Plan**:
```bash
# Manual UI test:
# 1. Create a new gig with acceptance criteria
# 2. Navigate to gig detail page
# 3. Verify "Definition of Done" section is visible
# 4. Verify section has visual distinction (blue border/background)
# 5. Verify acceptance criteria text is displayed with preserved whitespace
# 6. Verify section is positioned prominently (before budget/tags)

# Test legacy gig handling:
# 1. Use Prisma Studio to set acceptanceCriteria to null for an existing gig
# 2. View that gig's detail page
# 3. Verify "Not specified" is displayed (not blank or error)
```

**Acceptance Criteria**:
- [ ] Acceptance criteria section added to gig detail page
- [ ] Section heading: "Definition of Done"
- [ ] Visually distinct styling (border, background color)
- [ ] Positioned prominently (after description, before budget)
- [ ] Whitespace preserved with `whitespace-pre-wrap`
- [ ] Null values handled gracefully ("Not specified")
- [ ] Visible to both CLIENT and SPECIALIST users

---

## Task 5: End-to-End Testing
**Description**: Verify the complete flow works correctly and all edge cases are handled.

**Implementation Notes**:
- Test the full gig creation and viewing flow
- Test validation edge cases
- Test legacy gig handling
- Verify no regressions in existing functionality

**Test Plan**:
```bash
# Full flow test:
# 1. Login as CLIENT
# 2. Navigate to /dashboard/gigs/new
# 3. Fill all fields including 50+ char acceptance criteria
# 4. Submit form → should redirect to /dashboard
# 5. Click on newly created gig → should show acceptance criteria prominently
# 6. Logout and login as SPECIALIST
# 7. Browse gigs → click on the gig
# 8. Verify acceptance criteria is visible before applying
# 9. Apply to gig
# 10. Verify acceptance criteria still visible after application

# Edge case tests:
# - Empty acceptance criteria → error message
# - 49 characters → error message "must be at least 50 characters"
# - 50 characters → success
# - Whitespace-only → error (trimmed to empty)
# - Leading/trailing whitespace → trimmed and stored without extra spaces
# - Multi-line text → preserved with line breaks on detail page

# Regression tests:
# - Existing gig creation flow still works
# - Gig browsing still works
# - Application flow still works
# - All existing tests pass: npm test (if tests exist)
```

**Acceptance Criteria**:
- [ ] Full gig creation flow works end-to-end
- [ ] Validation errors display correctly
- [ ] Acceptance criteria visible on detail page
- [ ] Legacy gigs (null acceptanceCriteria) display "Not specified"
- [ ] No regressions in existing functionality
- [ ] All edge cases handled correctly

---

## Summary

**Total Tasks**: 5
**Estimated Time**: 1-2 hours
**Dependencies**: Tasks must be completed in order (1 → 2 → 3 → 4 → 5)

**Critical Success Factors**:
1. Database migration runs cleanly without data loss
2. Validation prevents gigs without meaningful acceptance criteria
3. UI provides helpful guidance to clients
4. Acceptance criteria is prominently displayed for specialists
5. Legacy gigs continue to work without errors
