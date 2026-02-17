# Implementation Tasks

## Task 1: Create AcceptanceCriteriaQualityWarning Component

**Implementation Notes:**
- Create new file: `app/components/AcceptanceCriteriaQualityWarning.tsx`
- Component should be a simple presentational component (no state)
- Accept props: `characterCount: number`, `hasInteracted: boolean`
- Render conditionally based on: `characterCount >= 50 && characterCount < 150 && hasInteracted`
- Use Tailwind classes for styling:
  - Container: `bg-amber-50 border border-amber-300 text-amber-800 rounded-md p-3 mb-2`
  - Add transition classes: `transition-opacity duration-200`
- Include `aria-live="polite"` for accessibility
- Message text: "💡 Consider adding more detail to prevent disputes. What specific deliverables, quality standards, or success metrics define 'done'?"

**Code Structure:**
```typescript
interface AcceptanceCriteriaQualityWarningProps {
  characterCount: number;
  hasInteracted: boolean;
}

export function AcceptanceCriteriaQualityWarning({
  characterCount,
  hasInteracted
}: AcceptanceCriteriaQualityWarningProps) {
  const shouldShow = characterCount >= 50 && characterCount < 150 && hasInteracted;

  if (!shouldShow) return null;

  return (
    <div
      className="bg-amber-50 border border-amber-300 text-amber-800 rounded-md p-3 mb-2 transition-opacity duration-200"
      aria-live="polite"
      role="status"
    >
      💡 Consider adding more detail to prevent disputes. What specific deliverables, quality standards, or success metrics define 'done'?
    </div>
  );
}
```

**Test Plan:**
- **Manual test**: Import component in a test page, pass different characterCount values
- **Assert**: Component renders only when `characterCount >= 50 && characterCount < 150 && hasInteracted === true`
- **Assert**: Component returns null when conditions not met
- **Assert**: Component has correct styling classes
- **Assert**: Component has `aria-live="polite"` attribute
- **Assert**: Message text matches specification exactly

---

## Task 2: Add State Tracking to Gig Creation Form

**Implementation Notes:**
- Modify file: `app/dashboard/gigs/new/page.tsx`
- Add state to track whether user has interacted with acceptanceCriteria field
- Use `useState` hook: `const [acHasInteracted, setAcHasInteracted] = useState(false)`
- Update the acceptanceCriteria textarea's onChange handler to set `acHasInteracted` to true on first interaction
- Pass both `characterCount` and `acHasInteracted` to the warning component

**Code Changes:**
```typescript
// Add state near other useState declarations
const [acHasInteracted, setAcHasInteracted] = useState(false);

// Modify acceptanceCriteria onChange handler
onChange={(e) => {
  setAcceptanceCriteriaCount(e.target.value.length);
  if (!acHasInteracted) {
    setAcHasInteracted(true);
  }
}}
```

**Test Plan:**
- **Manual test**: Load `/dashboard/gigs/new` page
- **Assert**: Warning does NOT appear on initial page load (hasInteracted is false)
- **Manual test**: Type one character in acceptanceCriteria field
- **Assert**: `acHasInteracted` state becomes true (verify with React DevTools)
- **Manual test**: Delete all characters and type again
- **Assert**: `acHasInteracted` remains true (doesn't reset)

---

## Task 3: Integrate Warning Component into Form Layout

**Implementation Notes:**
- Modify file: `app/dashboard/gigs/new/page.tsx`
- Import the new `AcceptanceCriteriaQualityWarning` component
- Position the warning component in the acceptanceCriteria field section:
  - After the `<textarea>` element
  - Before the character counter display
- Pass props: `characterCount={acceptanceCriteriaCount}` and `hasInteracted={acHasInteracted}`
- Ensure existing layout and styling remain unchanged

**Code Structure:**
```typescript
import { AcceptanceCriteriaQualityWarning } from '@/components/AcceptanceCriteriaQualityWarning';

// In the form JSX, within the acceptanceCriteria field section:
<textarea
  name="acceptanceCriteria"
  required
  rows={5}
  // ... existing props
  onChange={(e) => {
    setAcceptanceCriteriaCount(e.target.value.length);
    if (!acHasInteracted) setAcHasInteracted(true);
  }}
/>

<AcceptanceCriteriaQualityWarning
  characterCount={acceptanceCriteriaCount}
  hasInteracted={acHasInteracted}
/>

<div className="flex justify-between items-center text-sm">
  {/* Existing character counter */}
</div>
```

**Test Plan:**
- **Manual test**: Navigate to `/dashboard/gigs/new` as CLIENT user
- **Assert**: Page loads without errors
- **Assert**: Form layout looks correct (no visual regressions)
- **Assert**: Warning component is positioned between textarea and character counter
- **Manual test**: Type 60 characters in acceptanceCriteria
- **Assert**: Warning appears with correct styling
- **Manual test**: Type to 150 characters
- **Assert**: Warning disappears smoothly
- **Assert**: Character counter remains visible and functional

---

## Task 4: End-to-End Testing

**Implementation Notes:**
- Test the complete user flow from page load to form submission
- Verify all scenarios from the specification
- Test accessibility with keyboard navigation and screen reader
- Test edge cases (copy-paste, rapid typing, form reset)

**Test Plan:**

**Test 4.1: Warning appears for brief criteria**
- Navigate to `/dashboard/gigs/new` as CLIENT
- Type exactly 50 characters in acceptanceCriteria
- **Assert**: Warning appears
- Type to 149 characters
- **Assert**: Warning still visible
- Type to 150 characters
- **Assert**: Warning disappears

**Test 4.2: Warning does not appear on page load**
- Navigate to `/dashboard/gigs/new` as CLIENT
- **Assert**: No warning visible initially
- **Assert**: Character counter shows "0 / 50 characters (minimum)" in red

**Test 4.3: Warning does not appear below hard minimum**
- Type 30 characters in acceptanceCriteria
- **Assert**: No warning visible
- **Assert**: Character counter is red (text-red-600)
- Type to 50 characters
- **Assert**: Warning appears
- **Assert**: Character counter turns gray (text-gray-600)

**Test 4.4: Warning does not block submission**
- Fill all required fields (title, description, budget)
- Type exactly 75 characters in acceptanceCriteria (triggers warning)
- **Assert**: Warning is visible
- Click "Post Gig" button
- **Assert**: Form submits successfully
- **Assert**: Gig is created in database
- **Assert**: Redirected to `/dashboard`
- **Assert**: New gig appears in "My Gigs" list

**Test 4.5: Warning works with copy-paste**
- Copy text with 100 characters
- Paste into acceptanceCriteria field
- **Assert**: Warning appears immediately
- Copy text with 200 characters
- Paste into acceptanceCriteria field (replacing previous)
- **Assert**: Warning disappears immediately

**Test 4.6: Accessibility testing**
- Use keyboard navigation (Tab key) to focus acceptanceCriteria field
- Type to trigger warning
- **Assert**: Screen reader announces warning text (test with NVDA/JAWS)
- **Assert**: Warning has `role="status"` and `aria-live="polite"`
- Continue typing to 150 characters
- **Assert**: Screen reader announces warning dismissal

**Test 4.7: Visual regression testing**
- Compare form layout before and after changes
- **Assert**: No layout shifts or broken styling
- **Assert**: Warning transitions smoothly (no jank)
- **Assert**: All other form fields unchanged
- **Assert**: Optional fields (goal, deliverables, constraints) still work correctly

**Test 4.8: Form state persistence**
- Type 80 characters in acceptanceCriteria (warning visible)
- Click into budget field
- Click back into acceptanceCriteria field
- **Assert**: Warning still visible
- **Assert**: Character count preserved

**Test 4.9: Multiple form interactions**
- Fill form partially, trigger warning
- Navigate away from page (click "Dashboard" link)
- Navigate back to `/dashboard/gigs/new`
- **Assert**: Form is reset (empty)
- **Assert**: Warning not visible on fresh load
- **Assert**: hasInteracted state is reset

**Test 4.10: Non-CLIENT user access**
- Log in as SPECIALIST user
- Attempt to navigate to `/dashboard/gigs/new`
- **Assert**: Redirected to `/dashboard` (existing behavior)
- **Assert**: No errors in console

---

## Task 5: Documentation and Cleanup

**Implementation Notes:**
- Update any relevant comments in code
- Verify no console warnings or errors
- Ensure TypeScript types are correct
- Check that all imports are used

**Test Plan:**
- Run `npm run build` to check for TypeScript errors
- **Assert**: No type errors
- **Assert**: No unused imports
- Run `npm run lint` to check for linting issues
- **Assert**: No linting errors
- Check browser console during manual testing
- **Assert**: No warnings or errors logged

---

## Summary

**Files to Create:**
- `app/components/AcceptanceCriteriaQualityWarning.tsx`

**Files to Modify:**
- `app/dashboard/gigs/new/page.tsx`

**No Backend Changes Required** - This is purely a client-side UX enhancement.

**Estimated Effort:** 1-2 hours for implementation + testing

**Risk Level:** Low - Changes are isolated to gig creation form, no backend changes, existing validation unchanged
