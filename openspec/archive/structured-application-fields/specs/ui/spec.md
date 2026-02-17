# UI Specification Delta

## MODIFIED Requirements

### Requirement: Application Form Component
The system MUST provide an application form with structured fields that emphasize technical competence over sales pitches.

#### Scenario: Application form displays structured fields
- GIVEN a SPECIALIST views a gig detail page with status "OPEN"
- AND the specialist has not yet applied
- WHEN the application form is rendered
- THEN it MUST display three fields:
  1. "Technical Approach / Methodology" (required, textarea, 100-2000 chars)
  2. "Clarifying Questions" (required, textarea, 50-1000 chars)
  3. "Estimated Effort" (optional, textarea, max 200 chars)
- AND each field MUST have a label, placeholder text, and character limit indicator
- AND the submit button MUST be labeled "Submit Application" (not "Apply")

#### Scenario: Technical Approach field has engineering-focused prompt
- GIVEN the application form is displayed
- WHEN the specialist views the "Technical Approach / Methodology" field
- THEN the label MUST be "Technical Approach / Methodology"
- AND the placeholder MUST be: "How will you approach this work? What methodology, tools, or architecture will you use? Be specific about your technical plan."
- AND there MUST be a character counter showing "X / 2000 characters (minimum 100)"
- AND the field MUST have `minLength={100}` and `maxLength={2000}` attributes

#### Scenario: Clarifying Questions field encourages critical thinking
- GIVEN the application form is displayed
- WHEN the specialist views the "Clarifying Questions" field
- THEN the label MUST be "Clarifying Questions"
- AND the placeholder MUST be: "What questions do you have about the requirements? What needs clarification before you can provide an accurate estimate?"
- AND there MUST be a character counter showing "X / 1000 characters (minimum 50)"
- AND the field MUST have `minLength={50}` and `maxLength={1000}` attributes

#### Scenario: Estimated Effort field is optional
- GIVEN the application form is displayed
- WHEN the specialist views the "Estimated Effort" field
- THEN the label MUST be "Estimated Effort (Optional)"
- AND the placeholder MUST be: "How long do you estimate this will take? (e.g., '2-3 weeks', '40 hours', 'depends on answers to questions above')"
- AND there MUST be a character counter showing "X / 200 characters"
- AND the field MUST have `maxLength={200}` attribute
- AND the field MUST NOT be marked as required

#### Scenario: Form validation provides clear feedback
- GIVEN a SPECIALIST submits the form with invalid data
- WHEN the server action returns an error
- THEN the error message MUST be displayed in a red alert box above the form
- AND the error message MUST be actionable (e.g., "Technical approach must be at least 100 characters. Please provide more detail about your methodology.")

#### Scenario: Form submission shows loading state
- GIVEN a SPECIALIST clicks "Submit Application"
- WHEN the form is submitting
- THEN the submit button MUST be disabled
- AND the button text MUST change to "Submitting..."
- AND the button MUST have reduced opacity (disabled:opacity-50)

**Acceptance Criteria:**
- ApplyForm component at `app/dashboard/gigs/[id]/apply-form.tsx` is updated
- Uses `useActionState` hook with `applyToGig` server action
- Three textarea fields with appropriate labels, placeholders, and character limits
- Character counters update in real-time as user types
- Submit button shows loading state during submission
- Error messages are displayed clearly above the form
- Form styling is consistent with existing Gigly design system (Tailwind CSS)

---

### Requirement: Application Display in Gig Detail Page
The system MUST display application details with structured fields prominently for client review, with backward compatibility for legacy applications.

#### Scenario: New application displays structured fields
- GIVEN a CLIENT views a gig detail page with applications
- AND an application has non-empty `approach` and `questions` fields
- WHEN the application is rendered in the applications list
- THEN it MUST display:
  1. Specialist name/email and experience level (existing)
  2. Tech stack tags (existing)
  3. "Technical Approach" section with the approach text
  4. "Clarifying Questions" section with the questions text
  5. "Estimated Effort" section (only if estimatedEffort is non-empty)
  6. Application date (existing)
  7. Accept/Reject buttons if status is PENDING (existing)
- AND the `coverLetter` field MUST NOT be displayed

#### Scenario: Legacy application displays cover letter
- GIVEN a CLIENT views a gig detail page with applications
- AND an application has empty `approach` and `questions` fields (legacy application)
- WHEN the application is rendered in the applications list
- THEN it MUST display:
  1. Specialist name/email and experience level (existing)
  2. Tech stack tags (existing)
  3. "Cover Letter" section with the coverLetter text (if non-empty)
  4. Application date (existing)
  5. Accept/Reject buttons if status is PENDING (existing)
- AND the structured fields MUST NOT be displayed

#### Scenario: Structured fields have clear visual hierarchy
- GIVEN a new application is displayed
- WHEN the CLIENT views the application details
- THEN each structured field MUST have:
  - A bold label (e.g., "🔧 Technical Approach", "❓ Clarifying Questions", "⏱️ Estimated Effort")
  - The field content displayed with whitespace preserved (whitespace-pre-wrap)
  - Clear visual separation between fields (margin/padding)
- AND the "Technical Approach" and "Clarifying Questions" sections MUST be prominently displayed
- AND the "Estimated Effort" section MUST be visually de-emphasized (smaller text or lighter color)

#### Scenario: Application list is scrollable for long content
- GIVEN an application has long approach or questions text
- WHEN the application is displayed in the applications list
- THEN the text MUST wrap naturally (no horizontal scroll)
- AND the application card MUST expand to fit the content
- AND there MUST be adequate spacing between applications

**Acceptance Criteria:**
- Gig detail page at `app/dashboard/gigs/[id]/page.tsx` is updated
- Application display logic checks if `approach` and `questions` are non-empty to determine format
- New applications show structured fields with emoji icons and clear labels
- Legacy applications show cover letter with "Cover Letter" label
- All text content preserves whitespace and line breaks (whitespace-pre-wrap)
- Visual hierarchy emphasizes technical approach and clarifying questions
- Styling is consistent with existing Gigly design system

---

### Requirement: Specialist Dashboard Application List
The system MUST display application status with structured field previews in the specialist dashboard.

#### Scenario: Specialist views their applications
- GIVEN a SPECIALIST views their dashboard
- WHEN the "My Applications" section is rendered
- THEN each application MUST show:
  - Gig title (link to gig detail)
  - Application status (PENDING/ACCEPTED/REJECTED)
  - First 100 characters of technical approach (truncated with "...")
  - Application date
- AND clicking the gig title MUST navigate to the full gig detail page

#### Scenario: Application preview truncates long text
- GIVEN a SPECIALIST has an application with approach longer than 100 characters
- WHEN the application is displayed in the dashboard list
- THEN the approach preview MUST show first 100 characters followed by "..."
- AND the full text MUST be visible on the gig detail page

**Acceptance Criteria:**
- Specialist dashboard at `app/dashboard/page.tsx` is updated (if it displays applications)
- Application previews show truncated technical approach
- Full application details are accessible via gig detail page link
- Styling is consistent with existing dashboard design
