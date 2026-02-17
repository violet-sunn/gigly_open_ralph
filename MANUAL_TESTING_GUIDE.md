# Manual Testing Guide: Structured Application Fields

## Prerequisites
1. Start the development server: `npm run dev`
2. Test users are already created by the integration tests:
   - Client: `client-test@example.com` (password: `password123`)
   - Specialist: `specialist-test@example.com` (password: `password123`)

## Test Scenario 1: New Application Flow (Happy Path)

### Step 1: Login as Specialist
1. Navigate to http://localhost:3000/login
2. Login with `specialist-test@example.com` / `password123`
3. ✅ Verify: Redirected to specialist dashboard

### Step 2: Browse and View Gig
1. Click "Browse Gigs" button
2. Find "Test Gig for Structured Applications"
3. Click on the gig to view details
4. ✅ Verify: Gig detail page displays with all information

### Step 3: Submit Application with Structured Fields
1. Scroll to "Apply to this Gig" section
2. ✅ Verify form has three fields:
   - "Technical Approach / Methodology" with red asterisk (required)
   - "Clarifying Questions" with red asterisk (required)
   - "Estimated Effort (optional)" in gray
3. ✅ Verify each field has:
   - Descriptive placeholder text
   - Character counter (updates as you type)
4. Fill in the form:
   - **Approach** (100+ chars): "I will implement this using React with TypeScript, following a component-based architecture. First, I'll analyze the existing codebase and identify reusable patterns. Then I'll create modular components with proper type safety and comprehensive unit tests."
   - **Questions** (50+ chars): "What is the current state management solution? Are there specific design system requirements? What browsers need to be supported?"
   - **Effort** (optional): "2-3 weeks"
5. ✅ Verify character counters update in real-time
6. Click "Submit Application"
7. ✅ Verify: Redirected back to gig detail page
8. ✅ Verify: Success message or no error displayed

### Step 4: View Application as Client
1. Logout (or open incognito window)
2. Login with `client-test@example.com` / `password123`
3. Navigate to dashboard
4. Click on "Test Gig for Structured Applications"
5. Scroll to "Applications" section
6. ✅ Verify application displays:
   - Specialist email/name
   - Tech stack tags (if profile completed)
   - **🔧 Technical Approach** section with full text
   - **❓ Clarifying Questions** section with full text
   - **⏱️ Estimated Effort** section with "2-3 weeks"
   - Application date
   - Accept/Reject buttons (if status is PENDING)
7. ✅ Verify text preserves line breaks and formatting

## Test Scenario 2: Validation Errors

### Step 1: Test Empty Required Fields
1. Login as specialist
2. Navigate to a gig
3. Try to submit application with empty approach
4. ✅ Verify: Error message "Technical approach is required."
5. Fill approach with 50 characters
6. Try to submit with empty questions
7. ✅ Verify: Error message "Clarifying questions are required."

### Step 2: Test Minimum Length Validation
1. Fill approach with exactly 99 characters
2. Fill questions with valid text (50+ chars)
3. Submit application
4. ✅ Verify: Error message "Technical approach must be at least 100 characters. Please provide more detail about your methodology."
5. Fix approach (100+ chars)
6. Change questions to 49 characters
7. Submit application
8. ✅ Verify: Error message "Clarifying questions must be at least 50 characters. What do you need to know about the requirements?"

### Step 3: Test Maximum Length Validation
1. Try to type 2001 characters in approach field
2. ✅ Verify: HTML maxLength prevents typing beyond 2000
3. Paste 2001 characters (bypassing HTML validation)
4. Submit application
5. ✅ Verify: Server error "Technical approach is too long. Maximum 2000 characters allowed."

### Step 4: Test Optional Field
1. Fill approach and questions with valid text
2. Leave estimated effort empty
3. Submit application
4. ✅ Verify: Application submitted successfully
5. View as client
6. ✅ Verify: Estimated effort section does NOT display

## Test Scenario 3: Backward Compatibility

### Step 1: View Legacy Application
1. The integration test created a legacy application with only coverLetter
2. Login as `client-test@example.com`
3. Navigate to the test gig
4. ✅ Verify: Legacy application displays:
   - "Cover Letter" section (not structured fields)
   - Cover letter text
   - No approach/questions/effort sections

### Step 2: Verify Both Formats Coexist
1. On the same gig, verify both applications display correctly:
   - New application: Shows structured fields
   - Legacy application: Shows cover letter
2. ✅ Verify: No layout issues or overlapping content

## Test Scenario 4: Character Counters

### Step 1: Real-time Updates
1. Navigate to application form
2. Type in approach field
3. ✅ Verify: Counter updates with each keystroke
4. ✅ Verify: Counter shows "X / 2000 characters (minimum 100)"
5. Type in questions field
6. ✅ Verify: Counter shows "X / 1000 characters (minimum 50)"
7. Type in effort field
8. ✅ Verify: Counter shows "X / 200 characters" (no minimum)

## Test Scenario 5: UI/UX Details

### Step 1: Form Styling
1. ✅ Verify: Required fields have red asterisk (*)
2. ✅ Verify: Optional field has gray "(optional)" text
3. ✅ Verify: Submit button says "Submit Application" (not "Apply")
4. ✅ Verify: Submit button shows "Submitting..." when clicked
5. ✅ Verify: Submit button is disabled during submission

### Step 2: Application Display Styling
1. ✅ Verify: Technical Approach and Questions use bold black text
2. ✅ Verify: Estimated Effort uses gray text (de-emphasized)
3. ✅ Verify: Emoji icons display correctly (🔧 ❓ ⏱️)
4. ✅ Verify: Text wraps naturally, no horizontal scroll
5. ✅ Verify: Adequate spacing between sections

## Test Scenario 6: Edge Cases

### Step 1: Whitespace Handling
1. Fill approach with "   test   " (leading/trailing spaces)
2. Submit application
3. ✅ Verify: Error about minimum length (whitespace trimmed)
4. Fill with valid text including leading/trailing spaces
5. Submit successfully
6. View as client
7. ✅ Verify: Text is trimmed (no extra spaces at start/end)

### Step 2: Line Breaks and Formatting
1. Fill approach with multi-line text (press Enter to create line breaks)
2. Submit application
3. View as client
4. ✅ Verify: Line breaks are preserved in display

### Step 3: Special Characters
1. Fill fields with special characters: quotes, apostrophes, emojis
2. Submit application
3. View as client
4. ✅ Verify: All characters display correctly

## Acceptance Criteria Checklist

### Database (Task 1)
- [x] Migration created successfully
- [x] Application model has approach, questions, estimatedEffort fields
- [x] All fields have @default("")
- [x] Existing applications have default values
- [x] `npx prisma validate` passes

### Server Action (Task 2)
- [x] applyToGig accepts new fields
- [x] Required field validation works
- [x] Minimum length validation works (approach: 100, questions: 50)
- [x] Maximum length validation works (approach: 2000, questions: 1000, effort: 200)
- [x] Error messages are clear and actionable
- [x] coverLetter set to empty string for new applications

### Form Component (Task 3)
- [x] Three textarea fields with correct labels
- [x] Character counters update in real-time
- [x] Required fields marked with red asterisk
- [x] Optional field marked with gray text
- [x] Submit button text is "Submit Application"
- [x] Loading state works correctly

### Application Display (Task 4)
- [x] New applications show structured fields
- [x] Legacy applications show cover letter
- [x] Conditional rendering works correctly
- [x] Text formatting preserved (whitespace-pre-wrap)
- [x] Visual hierarchy emphasizes technical content

### Integration Testing (Task 5)
- [x] All integration tests pass
- [x] Database schema tests pass
- [x] Backward compatibility verified
- [x] Build succeeds without errors

## Summary

All core functionality has been implemented and tested:
✅ Database schema updated with new fields
✅ Server action validation implemented
✅ Application form redesigned with structured fields
✅ Application display updated with backward compatibility
✅ Integration tests passing
✅ Build successful

The implementation is complete and ready for production use.
