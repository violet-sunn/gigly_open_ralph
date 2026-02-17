# Implementation Tasks

## Task 1: Add Structured Fields to Application Model

**Description:** Update the Prisma schema to add `approach`, `questions`, and `estimatedEffort` fields to the Application model.

**Implementation Notes:**
- File: `prisma/schema.prisma`
- Add three new fields to the Application model:
  ```prisma
  approach        String   @default("")
  questions       String   @default("")
  estimatedEffort String   @default("")
  ```
- Keep the existing `coverLetter` field for backward compatibility
- Run `npx prisma format` to format the schema
- Run `npx prisma migrate dev --name add_structured_application_fields` to create and apply migration
- Run `npx prisma generate` to update the Prisma client

**Test Plan:**
1. Run `npx prisma validate` - should pass without errors
2. Run `npx prisma migrate dev --name add_structured_application_fields` - should create migration successfully
3. Open Prisma Studio (`npx prisma studio`) and verify Application table has new columns: `approach`, `questions`, `estimatedEffort`
4. Verify existing Application records have empty strings for new fields (default values applied)
5. Create a test application record with new fields populated and verify it saves correctly

**Acceptance Criteria:**
- Migration file created in `prisma/migrations/`
- Application model includes three new String fields with @default("")
- Existing applications remain intact with default values for new fields
- `npx prisma validate` passes

---

## Task 2: Update applyToGig Server Action

**Description:** Modify the `applyToGig` server action to accept and validate structured fields instead of coverLetter.

**Implementation Notes:**
- File: `app/actions/gig.ts`
- In the `applyToGig` function:
  1. Remove `coverLetter` extraction from formData
  2. Add extraction for `approach`, `questions`, `estimatedEffort`:
     ```typescript
     const approach = ((formData.get('approach') as string) || '').trim()
     const questions = ((formData.get('questions') as string) || '').trim()
     const estimatedEffort = ((formData.get('estimatedEffort') as string) || '').trim()
     ```
  3. Add validation for required fields:
     ```typescript
     if (!approach) {
       return { error: 'Technical approach is required.' }
     }
     if (!questions) {
       return { error: 'Clarifying questions are required.' }
     }
     ```
  4. Add minimum length validation:
     ```typescript
     if (approach.length < 100) {
       return { error: 'Technical approach must be at least 100 characters. Please provide more detail about your methodology.' }
     }
     if (questions.length < 50) {
       return { error: 'Clarifying questions must be at least 50 characters. What do you need to know about the requirements?' }
     }
     ```
  5. Add maximum length validation:
     ```typescript
     if (approach.length > 2000) {
       return { error: 'Technical approach is too long. Maximum 2000 characters allowed.' }
     }
     if (questions.length > 1000) {
       return { error: 'Clarifying questions are too long. Maximum 1000 characters allowed.' }
     }
     if (estimatedEffort.length > 200) {
       return { error: 'Estimated effort is too long. Maximum 200 characters allowed.' }
     }
     ```
  6. Update the `prisma.application.create` call:
     ```typescript
     await prisma.application.create({
       data: {
         gigId,
         specialistId: session.userId,
         approach,
         questions,
         estimatedEffort,
         coverLetter: '', // Legacy field, set to empty string
       },
     })
     ```

**Test Plan:**
1. Test missing approach field:
   - Submit application with empty approach
   - Assert error: "Technical approach is required."
2. Test missing questions field:
   - Submit application with empty questions
   - Assert error: "Clarifying questions are required."
3. Test approach too short:
   - Submit application with approach = "Test" (4 chars)
   - Assert error: "Technical approach must be at least 100 characters..."
4. Test questions too short:
   - Submit application with questions = "None" (4 chars)
   - Assert error: "Clarifying questions must be at least 50 characters..."
5. Test approach too long:
   - Submit application with approach = 2001 character string
   - Assert error: "Technical approach is too long..."
6. Test questions too long:
   - Submit application with questions = 1001 character string
   - Assert error: "Clarifying questions are too long..."
7. Test estimatedEffort too long:
   - Submit application with estimatedEffort = 201 character string
   - Assert error: "Estimated effort is too long..."
8. Test successful application without estimatedEffort:
   - Submit with valid approach (100+ chars) and questions (50+ chars), no estimatedEffort
   - Assert redirect to `/dashboard/gigs/{gigId}`
   - Assert Application record created with approach, questions, empty estimatedEffort
9. Test successful application with estimatedEffort:
   - Submit with valid approach, questions, and estimatedEffort
   - Assert redirect to `/dashboard/gigs/{gigId}`
   - Assert Application record created with all three fields populated
10. Test whitespace trimming:
    - Submit with approach/questions that have leading/trailing whitespace
    - Assert values are trimmed before storage

**Acceptance Criteria:**
- All validation errors return clear, actionable messages
- Validation order: required checks, then length checks
- Successful applications create records with new fields
- coverLetter field is set to empty string for new applications
- Existing validation (role check, duplicate check, gig status check) still works

---

## Task 3: Update Application Form Component

**Description:** Replace the generic cover letter field with three structured fields in the application form.

**Implementation Notes:**
- File: `app/dashboard/gigs/[id]/apply-form.tsx`
- Replace the single `coverLetter` textarea with three new textareas
- Add character counters for each field using React state
- Update field names, labels, and placeholders according to UI spec
- Add `minLength` and `maxLength` HTML attributes for client-side validation hints

**Detailed Implementation:**
1. Add state for character counts:
   ```typescript
   const [approachCount, setApproachCount] = useState(0)
   const [questionsCount, setQuestionsCount] = useState(0)
   const [effortCount, setEffortCount] = useState(0)
   ```

2. Replace the form content with three fields:
   ```tsx
   {/* Technical Approach */}
   <div>
     <label htmlFor="approach" className="block text-sm font-medium text-gray-700">
       Technical Approach / Methodology <span className="text-red-500">*</span>
     </label>
     <p className="text-xs text-gray-500 mt-1">
       How will you approach this work? What methodology, tools, or architecture will you use? Be specific about your technical plan.
     </p>
     <textarea
       id="approach"
       name="approach"
       rows={6}
       minLength={100}
       maxLength={2000}
       required
       onChange={(e) => setApproachCount(e.target.value.length)}
       className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
       placeholder="How will you approach this work? What methodology, tools, or architecture will you use? Be specific about your technical plan."
     />
     <p className="text-xs text-gray-500 mt-1">
       {approachCount} / 2000 characters (minimum 100)
     </p>
   </div>

   {/* Clarifying Questions */}
   <div>
     <label htmlFor="questions" className="block text-sm font-medium text-gray-700">
       Clarifying Questions <span className="text-red-500">*</span>
     </label>
     <p className="text-xs text-gray-500 mt-1">
       What questions do you have about the requirements? What needs clarification before you can provide an accurate estimate?
     </p>
     <textarea
       id="questions"
       name="questions"
       rows={4}
       minLength={50}
       maxLength={1000}
       required
       onChange={(e) => setQuestionsCount(e.target.value.length)}
       className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
       placeholder="What questions do you have about the requirements? What needs clarification before you can provide an accurate estimate?"
     />
     <p className="text-xs text-gray-500 mt-1">
       {questionsCount} / 1000 characters (minimum 50)
     </p>
   </div>

   {/* Estimated Effort */}
   <div>
     <label htmlFor="estimatedEffort" className="block text-sm font-medium text-gray-700">
       Estimated Effort <span className="text-gray-400">(optional)</span>
     </label>
     <p className="text-xs text-gray-500 mt-1">
       How long do you estimate this will take?
     </p>
     <textarea
       id="estimatedEffort"
       name="estimatedEffort"
       rows={2}
       maxLength={200}
       onChange={(e) => setEffortCount(e.target.value.length)}
       className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
       placeholder="e.g., '2-3 weeks', '40 hours', 'depends on answers to questions above'"
     />
     <p className="text-xs text-gray-500 mt-1">
       {effortCount} / 200 characters
     </p>
   </div>
   ```

3. Update submit button text from "Apply" to "Submit Application"

**Test Plan:**
1. Navigate to a gig detail page as a SPECIALIST
2. Verify form displays three fields with correct labels and placeholders
3. Type in each field and verify character counters update in real-time
4. Verify "Technical Approach" and "Clarifying Questions" have red asterisks (required)
5. Verify "Estimated Effort" has gray "(optional)" text
6. Submit form with empty fields - verify browser validation triggers (HTML5 required attribute)
7. Submit form with valid data - verify redirect to gig detail page
8. Submit form with approach < 100 chars - verify server error displays
9. Submit form with questions < 50 chars - verify server error displays
10. Verify error messages display in red alert box above form
11. Verify submit button shows "Submitting..." and is disabled during submission

**Acceptance Criteria:**
- Form has three textarea fields with correct labels and placeholders
- Character counters update in real-time
- Required fields marked with red asterisk
- Optional field marked with gray "(optional)"
- Submit button text is "Submit Application"
- Error messages display clearly above form
- Loading state works correctly

---

## Task 4: Update Application Display in Gig Detail Page

**Description:** Update the gig detail page to display structured application fields for new applications and cover letter for legacy applications.

**Implementation Notes:**
- File: `app/dashboard/gigs/[id]/page.tsx`
- In the applications list rendering section (around line 252-296), update the application display logic
- Add conditional rendering based on whether `approach` and `questions` are non-empty
- Display structured fields with emoji icons and clear labels for new applications
- Display cover letter for legacy applications

**Detailed Implementation:**
Replace the current application display (lines 288-290) with:
```tsx
{/* Structured fields for new applications */}
{app.approach && app.questions ? (
  <div className="mt-3 space-y-3">
    <div>
      <h5 className="text-sm font-semibold text-gray-900">🔧 Technical Approach</h5>
      <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{app.approach}</p>
    </div>
    <div>
      <h5 className="text-sm font-semibold text-gray-900">❓ Clarifying Questions</h5>
      <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{app.questions}</p>
    </div>
    {app.estimatedEffort && (
      <div>
        <h5 className="text-sm font-semibold text-gray-500">⏱️ Estimated Effort</h5>
        <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{app.estimatedEffort}</p>
      </div>
    )}
  </div>
) : (
  /* Legacy cover letter for old applications */
  app.coverLetter && (
    <div className="mt-3">
      <h5 className="text-sm font-semibold text-gray-900">Cover Letter</h5>
      <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{app.coverLetter}</p>
    </div>
  )
)}
```

**Test Plan:**
1. Create a new application with structured fields
2. View the gig detail page as the CLIENT owner
3. Verify the application displays:
   - "🔧 Technical Approach" section with approach text
   - "❓ Clarifying Questions" section with questions text
   - "⏱️ Estimated Effort" section (only if estimatedEffort is non-empty)
4. Verify text preserves line breaks and whitespace (whitespace-pre-wrap)
5. Verify estimated effort section is visually de-emphasized (gray text)
6. Test with a legacy application (approach and questions empty):
   - Verify "Cover Letter" section displays if coverLetter is non-empty
   - Verify structured fields do NOT display
7. Test with an application that has no coverLetter and no structured fields:
   - Verify no content section displays (graceful degradation)
8. Verify visual hierarchy: Technical Approach and Questions are prominent, Effort is subtle
9. Verify spacing between applications is adequate
10. Verify long text wraps naturally without horizontal scroll

**Acceptance Criteria:**
- New applications display structured fields with emoji icons
- Legacy applications display cover letter
- Conditional rendering works correctly based on field presence
- Text formatting preserves whitespace and line breaks
- Visual hierarchy emphasizes technical content
- No layout issues with long text

---

## Task 5: Integration Testing

**Description:** Test the complete flow from application submission to display, including edge cases and backward compatibility.

**Test Plan:**

**Test Case 1: New Application Flow (Happy Path)**
1. As SPECIALIST, navigate to an OPEN gig
2. Fill out application form with:
   - Approach: 150 character technical description
   - Questions: 75 character clarifying questions
   - Estimated Effort: "2 weeks"
3. Submit application
4. Verify redirect to gig detail page
5. As CLIENT owner, view the gig detail page
6. Verify application displays with all three structured fields
7. Accept the application
8. Verify gig transitions to IN_PROGRESS

**Test Case 2: New Application Without Estimated Effort**
1. As SPECIALIST, submit application with approach and questions only
2. Verify application is created successfully
3. As CLIENT, verify application displays approach and questions
4. Verify estimated effort section does NOT display

**Test Case 3: Validation Errors**
1. Submit application with approach < 100 chars
2. Verify error message displays
3. Fix approach, submit with questions < 50 chars
4. Verify error message displays
5. Fix questions, submit with valid data
6. Verify success

**Test Case 4: Character Limit Enforcement**
1. Type 2001 characters in approach field
2. Verify HTML maxLength prevents typing beyond 2000
3. Paste 2001 characters (bypassing HTML validation)
4. Submit form
5. Verify server-side validation catches it and returns error

**Test Case 5: Backward Compatibility**
1. Create a legacy application directly in database with:
   - coverLetter: "I'm a great fit!"
   - approach: ""
   - questions: ""
   - estimatedEffort: ""
2. As CLIENT, view gig detail page
3. Verify application displays "Cover Letter" section with coverLetter text
4. Verify structured fields do NOT display

**Test Case 6: Multiple Applications on Same Gig**
1. Create one legacy application (coverLetter only)
2. Create one new application (structured fields)
3. As CLIENT, view gig detail page
4. Verify both applications display correctly in their respective formats

**Test Case 7: Whitespace Handling**
1. Submit application with leading/trailing whitespace in all fields
2. Verify values are trimmed before storage
3. Verify display shows trimmed values

**Test Case 8: Special Characters and Line Breaks**
1. Submit application with:
   - Approach containing line breaks, quotes, and special chars
   - Questions containing bullet points (using line breaks)
2. Verify text is stored correctly
3. Verify display preserves formatting (whitespace-pre-wrap)

**Test Case 9: Duplicate Application Prevention**
1. Submit a valid application
2. Attempt to submit another application to the same gig
3. Verify error: "You have already applied to this gig."

**Test Case 10: Non-OPEN Gig Application**
1. As CLIENT, accept an application (gig becomes IN_PROGRESS)
2. As another SPECIALIST, attempt to apply
3. Verify error: "This gig is no longer accepting applications."

**Acceptance Criteria:**
- All test cases pass
- No console errors or warnings
- Database integrity maintained
- Backward compatibility confirmed
- Error handling works correctly
- UI displays correctly in all scenarios

---

## Task 6: Update Specialist Dashboard (Optional Enhancement)

**Description:** Update the specialist dashboard to show application previews with truncated technical approach instead of cover letter.

**Implementation Notes:**
- File: `app/dashboard/page.tsx` (or wherever specialist applications are listed)
- If the dashboard currently shows application previews, update to show first 100 characters of `approach`
- Add conditional logic to handle legacy applications (show coverLetter preview if approach is empty)

**Test Plan:**
1. As SPECIALIST with multiple applications, view dashboard
2. Verify applications show truncated approach preview (first 100 chars + "...")
3. Verify clicking gig title navigates to full gig detail page
4. Test with legacy application - verify coverLetter preview displays

**Acceptance Criteria:**
- Dashboard shows meaningful preview of application content
- Truncation works correctly
- Links to full gig detail work
- Backward compatibility maintained

**Note:** This task is optional and depends on whether the current dashboard implementation shows application previews. If the dashboard only shows gig titles and statuses, this task can be skipped.
