# Implementation Tasks

## Task 1: Create CharacterCounter component

**Description:**
Create a reusable `CharacterCounter` component that displays character count with appropriate styling and accessibility attributes.

**Implementation Notes:**
- Create new file: `app/dashboard/gigs/new/character-counter.tsx`
- Component props:
  - `current: number` - current character count
  - `min?: number` - minimum required characters (for required fields)
  - `max?: number` - maximum allowed characters (for optional fields)
  - `label: string` - accessible label for screen readers
- Logic:
  - If `min` is provided: show "X / {min} characters (minimum)"
  - If `max` is provided: show "X / {max} characters"
  - Color logic:
    - Red (text-red-600) when `current < min`
    - Orange (text-orange-600) when `current >= max * 0.9`
    - Gray (text-gray-600) otherwise
- Styling: `text-sm text-right` with conditional color classes
- Accessibility: `aria-live="polite"` and `aria-label` prop

**Test Plan:**
1. Create component file and verify it compiles without errors
2. Test with `min` prop: verify format shows "(minimum)" suffix
3. Test with `max` prop: verify format shows max value
4. Test color transitions:
   - Red when under minimum
   - Orange when approaching maximum (≥90%)
   - Gray in normal range
5. Verify `aria-live="polite"` attribute is present in DOM
6. Test with screen reader (NVDA/JAWS) to confirm announcements

---

## Task 2: Add state management for textarea fields

**Description:**
Add React state hooks to track character count for each of the four textarea fields.

**Implementation Notes:**
- In `app/dashboard/gigs/new/gig-form.tsx`:
  - Add state: `const [acceptanceCriteriaCount, setAcceptanceCriteriaCount] = useState(0)`
  - Add state: `const [goalCount, setGoalCount] = useState(0)`
  - Add state: `const [deliverablesCount, setDeliverablesCount] = useState(0)`
  - Add state: `const [constraintsCount, setConstraintsCount] = useState(0)`
- Each state tracks the `.length` of the corresponding textarea value
- No need to store the actual text content (form handles that)

**Test Plan:**
1. Add console.log statements to verify state updates
2. Type in each textarea and verify corresponding state updates
3. Delete characters and verify count decreases
4. Paste text and verify count updates correctly
5. Clear textarea and verify count resets to 0

---

## Task 3: Add onChange handlers to textarea fields

**Description:**
Add `onChange` handlers to each textarea to update character count state in real-time.

**Implementation Notes:**
- For each textarea, add:
  ```tsx
  onChange={(e) => setAcceptanceCriteriaCount(e.target.value.length)}
  ```
- Apply to all four textareas:
  - acceptanceCriteria
  - goal
  - deliverables
  - constraints
- Handlers should update state immediately (no debouncing)
- Do NOT interfere with form submission (name attribute still needed)

**Test Plan:**
1. Type in acceptanceCriteria field and verify count updates immediately
2. Type in goal field and verify count updates immediately
3. Type in deliverables field and verify count updates immediately
4. Type in constraints field and verify count updates immediately
5. Test rapid typing to ensure no lag or dropped characters
6. Submit form and verify all field values are still captured correctly
7. Test with copy-paste operations

---

## Task 4: Integrate CharacterCounter into form layout

**Description:**
Add CharacterCounter components below each textarea field, integrated with existing helper text.

**Implementation Notes:**
- For acceptanceCriteria field:
  - Wrap existing helper text and counter in a flex container
  - Helper text on left, counter on right
  - Counter props: `current={acceptanceCriteriaCount}`, `min={50}`, `label="Acceptance criteria character count"`
- For optional fields (goal, deliverables, constraints):
  - Same flex layout approach
  - Counter props: `current={goalCount}`, `max={1000}`, `label="Goal character count"`
- Layout structure:
  ```tsx
  <div className="mt-1 flex justify-between items-start text-sm">
    <p className="text-gray-500">Helper text here</p>
    <CharacterCounter current={count} min={50} label="..." />
  </div>
  ```

**Test Plan:**
1. Verify all four textareas have character counters displayed
2. Verify counters are right-aligned
3. Verify helper text is still visible on the left
4. Test responsive layout on mobile (counters should not wrap awkwardly)
5. Verify visual hierarchy: counters are subtle, not dominating
6. Check spacing and alignment with existing form elements

---

## Task 5: Verify accessibility and validation

**Description:**
Test accessibility features and ensure server-side validation is not affected.

**Implementation Notes:**
- No code changes needed, this is a verification task
- Ensure `aria-live="polite"` is working
- Ensure character count does not bypass server validation
- Test with keyboard navigation only

**Test Plan:**
1. **Accessibility testing:**
   - Use screen reader (NVDA on Windows or VoiceOver on Mac)
   - Tab to each textarea field
   - Type characters and verify count is announced
   - Verify announcements are not too frequent (polite mode)
   - Test with keyboard navigation only (no mouse)
2. **Validation testing:**
   - Enter 49 characters in acceptanceCriteria (under minimum)
   - Verify client-side counter shows red and correct count
   - Submit form
   - Verify server returns validation error
   - Verify error message is displayed
3. **Edge cases:**
   - Test with empty textareas (count should show 0)
   - Test with exactly 50 characters in acceptanceCriteria
   - Test with exactly 1000 characters in optional fields
   - Test with special characters (emoji, unicode)
   - Test with line breaks (should count as characters)

---

## Task 6: Manual end-to-end testing

**Description:**
Perform comprehensive manual testing of the complete feature in the browser.

**Implementation Notes:**
- No code changes, this is a testing task
- Test in development environment first
- Use realistic data entry scenarios

**Test Plan:**
1. **Happy path:**
   - Navigate to `/dashboard/gigs/new` as CLIENT user
   - Fill out all fields with valid data
   - Observe character counts updating in real-time
   - Verify color changes at thresholds
   - Submit form successfully
   - Verify gig is created
2. **Error scenarios:**
   - Submit with acceptanceCriteria under 50 chars
   - Verify server validation error
   - Verify character counter still works after error
   - Correct the error and resubmit
3. **Performance:**
   - Type rapidly in all fields
   - Verify no input lag or dropped characters
   - Paste large blocks of text (>1000 chars)
   - Verify counter updates correctly
4. **Browser compatibility:**
   - Test in Chrome, Firefox, Safari
   - Test on mobile device (responsive layout)
5. **Regression testing:**
   - Verify all existing form functionality still works
   - Verify budget calculator still works
   - Verify form submission and redirect still works
   - Verify error display still works

---

## Summary

**Total tasks:** 6
**Estimated effort:** 2-3 hours
**Files to modify:**
- `app/dashboard/gigs/new/gig-form.tsx` (main changes)
- `app/dashboard/gigs/new/character-counter.tsx` (new file)

**Dependencies:**
- No external dependencies needed
- Uses existing React hooks (useState)
- Uses existing Tailwind CSS classes

**Rollback plan:**
If issues arise, simply remove the CharacterCounter components and state hooks. The form will revert to previous behavior without character counts.
