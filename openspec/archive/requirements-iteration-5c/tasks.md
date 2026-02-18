# Implementation Tasks

## Task 1: Refactor GigForm component to add section structure

**Implementation Notes:**
- Open `app/dashboard/gigs/new/gig-form.tsx`
- Wrap existing fields in three section containers (`<div>` elements)
- Each section should have:
  - Container div with classes: `bg-gray-50 border border-gray-200 rounded-lg p-6`
  - Section heading (h3) with classes: `text-lg font-semibold text-gray-900 mb-2`
  - Section description (p) with classes: `text-sm text-gray-600 mb-4`
  - Field group div with classes: `space-y-6` (for vertical spacing between fields)
- Add spacing between sections using `space-y-6` on the form element or `mb-6` on each section
- Keep the submit button outside the sections (at the bottom of the form)

**Section 1: Basic Information**
- Heading: "Basic Information"
- Description: "Provide a clear title and overview of the work"
- Fields: title, description

**Section 2: Requirements & Success Criteria**
- Heading: "Requirements & Success Criteria"
- Description: "Define what success looks like and help specialists understand your needs"
- Fields: acceptanceCriteria (with character counter and quality warning), goal, deliverables, constraints
- Remove the existing "Additional Details (Optional)" heading and border-t divider (lines 112-116)
- Keep all character counters and the AcceptanceCriteriaQualityWarning component functional

**Section 3: Budget & Details**
- Heading: "Budget & Details"
- Description: "Set your budget and add tags to help specialists find your gig"
- Fields: budget, fee preview (conditional rendering), tags

**Test Plan:**
1. Start the development server: `npm run dev`
2. Navigate to `/dashboard/gigs/new` as a CLIENT user
3. Verify three visual sections are rendered with clear boundaries
4. Verify each section has the correct heading and description text
5. Verify all fields are present in the correct sections
6. Verify character counters still update in real-time
7. Verify AcceptanceCriteriaQualityWarning still appears/disappears correctly
8. Verify fee preview still calculates and displays correctly
9. Verify form submission still works (create a test gig)
10. Check browser console for any React errors or warnings

---

## Task 2: Test mobile responsiveness

**Implementation Notes:**
- No code changes required (Tailwind responsive utilities should handle this)
- If issues are found, adjust padding/spacing for mobile breakpoints
- Consider using responsive classes like `p-4 sm:p-6` if needed

**Test Plan:**
1. Open the gig creation form in Chrome DevTools with mobile viewport
2. Test at 320px width (iPhone SE)
3. Test at 375px width (iPhone 12)
4. Test at 768px width (iPad)
5. Verify sections stack vertically without horizontal scrolling
6. Verify all fields are accessible and usable
7. Verify section padding and spacing look appropriate on small screens
8. Verify character counters don't overflow or break layout
9. Verify fee preview box doesn't overflow
10. Test form submission on mobile viewport

**Acceptance:**
- Form is fully functional on all tested viewport sizes
- No horizontal scrolling occurs
- All text is readable and fields are tappable
- Visual hierarchy remains clear on mobile

---

## Task 3: Verify accessibility with screen reader

**Implementation Notes:**
- No code changes expected (semantic HTML should be sufficient)
- If issues are found, add appropriate ARIA labels or landmarks

**Test Plan:**
1. Open the gig creation form in a browser with screen reader enabled (NVDA on Windows, VoiceOver on Mac)
2. Navigate through the form using Tab key
3. Verify section headings are announced correctly
4. Verify heading hierarchy is logical (h3 for sections, no skipped levels)
5. Verify all form labels are announced
6. Verify character counters are announced (should have aria-live="polite")
7. Verify quality warning is announced when it appears
8. Verify error messages are announced when form submission fails
9. Test form submission with screen reader active

**Acceptance:**
- All section headings are announced by screen reader
- Tab order is logical and follows visual order
- All interactive elements are accessible via keyboard
- Dynamic content (character counters, warnings) is announced appropriately

---

## Task 4: Verify all existing functionality remains intact

**Implementation Notes:**
- This is a regression testing task
- No code changes expected unless bugs are found

**Test Plan:**
1. **Character counters:**
   - Type in acceptanceCriteria field, verify counter updates in real-time
   - Verify color changes (red when <50, gray when ≥50)
   - Type in goal/deliverables/constraints fields, verify counters update
   - Verify color changes (gray when <900, orange when ≥900)

2. **Quality warning:**
   - Type 50-149 characters in acceptanceCriteria
   - Verify warning appears with correct message and styling
   - Type 150+ characters, verify warning disappears
   - Refresh page, verify warning doesn't appear on initial load

3. **Fee preview:**
   - Enter budget value (e.g., 100000)
   - Verify preview box appears with correct calculations
   - Verify formatting (commas, ₽ symbol)
   - Change budget, verify preview updates immediately

4. **Form validation:**
   - Submit form with empty required fields, verify HTML5 validation prevents submission
   - Submit form with acceptanceCriteria <50 chars, verify server error is displayed
   - Submit form with valid data, verify gig is created and user is redirected to /dashboard

5. **Error display:**
   - Trigger a validation error (e.g., short acceptanceCriteria)
   - Verify error message appears in red box at top of form
   - Verify form remains visible and editable

**Acceptance:**
- All character counters work correctly
- Quality warning appears/disappears as expected
- Fee preview calculates correctly
- Form validation works (client-side and server-side)
- Error messages display correctly
- Successful submission redirects to dashboard

---

## Task 5: Visual QA and polish

**Implementation Notes:**
- Review the visual design for consistency and polish
- Make minor adjustments to spacing, colors, or typography if needed
- Ensure the design feels cohesive with the rest of the application

**Test Plan:**
1. Compare the new form layout with other pages in the application
2. Verify color scheme is consistent (gray-50, gray-200, blue-600, etc.)
3. Verify spacing is consistent (using Tailwind's spacing scale)
4. Verify typography is consistent (font sizes, weights, line heights)
5. Check for any visual glitches or alignment issues
6. Test in multiple browsers (Chrome, Firefox, Safari)
7. Take screenshots and compare with design expectations

**Acceptance:**
- Form looks polished and professional
- Visual design is consistent with the rest of the application
- No obvious visual bugs or glitches
- Design works well in all major browsers

---

## Summary

Total tasks: 5
Estimated effort: 2-3 hours

**Dependencies:**
- Task 1 must be completed first (core implementation)
- Tasks 2-5 can be done in parallel after Task 1

**Rollback Plan:**
If issues are found that cannot be quickly resolved, revert the changes to `gig-form.tsx` using git:
```bash
git checkout HEAD -- app/dashboard/gigs/new/gig-form.tsx
```
