# Gig Specification

## Requirements

### Requirement: Create Gig Server Action
The system MUST provide a `createGig` server action that creates a gig for the authenticated CLIENT user. Validation MUST be **server-authoritative** (the source of truth for field minimums, independent of any client-side gating) and all validation error messages MUST be in **Russian**. The required content fields are `title`, `description` (≥ 20 chars, trimmed), `acceptanceCriteria` (≥ 50 chars, trimmed), `goal` (non-empty, trimmed), `deliverables` (non-empty, trimmed), and a positive `budget`. Only `constraints` remains optional.

#### Scenario: Successful gig creation
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with a valid title, description (≥20 chars), acceptanceCriteria (≥50 chars), goal (non-empty), deliverables (non-empty), budget (in roubles), tags, AND optional constraints
- THEN a Gig record MUST be created with:
  - `budget` = input budget converted to kopecks (× 100)
  - `serviceFee` = budget × 0.175 (SSOT: `SERVICE_FEE_RATE`, `lib/pricing.ts`)
  - `totalAmount` = budget + serviceFee
  - `status` = "OPEN"
  - `clientId` = session userId
  - `acceptanceCriteria`, `goal`, `deliverables` = inputs (trimmed)
  - `constraints` = input constraints (trimmed) or empty string if not provided
- AND the action MUST redirect to `/gigs/new/success`

#### Scenario: Non-CLIENT user attempts gig creation
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Публиковать гиги могут только заказчики. Войдите как компания или зарегистрируйтесь в роли заказчика.' }`
- AND no Gig record MUST be created

#### Scenario: Unauthenticated user attempts gig creation
- GIVEN no valid session
- WHEN `createGig` is called
- THEN it MUST redirect to `/login`

#### Scenario: Missing required fields
- GIVEN a CLIENT user submits a gig form with empty title, description, or acceptanceCriteria
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Заполните обязательные поля: название, описание и критерии приёмки.' }`

#### Scenario: Description too short
- GIVEN a CLIENT user submits a gig form with description shorter than 20 characters (after trimming)
- WHEN `createGig` is called
- THEN it MUST return a Russian error stating the description minimum of 20 characters (`Описание должно быть не короче 20 символов…`)
- AND no Gig record MUST be created

#### Scenario: Acceptance criteria too short
- GIVEN a CLIENT user submits a gig form with acceptanceCriteria shorter than 50 characters (after trimming)
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Критерии приёмки должны быть не короче 50 символов. Опишите подробнее, что считается результатом.' }`
- AND no Gig record MUST be created

#### Scenario: Missing goal
- GIVEN a CLIENT user submits a gig form with an empty goal (after trimming)
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Укажите цель гига — зачем это нужно, какой результат для бизнеса.' }`
- AND no Gig record MUST be created

#### Scenario: Missing deliverables
- GIVEN a CLIENT user submits a gig form with empty deliverables (after trimming)
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Опишите ожидаемый результат — что заказчик получит на выходе (PR, демо, инструкция).' }`
- AND no Gig record MUST be created

#### Scenario: Invalid budget
- GIVEN a CLIENT user submits a gig form with budget <= 0 or non-numeric
- WHEN `createGig` is called
- THEN it MUST return a Russian error that budget must be a positive number (`Бюджет должен быть положительным числом в рублях…`)

#### Scenario: Constraints remain optional
- GIVEN a CLIENT user submits an otherwise-valid gig with no constraints
- WHEN `createGig` is called
- THEN a Gig record MUST be created successfully
- AND `constraints` MUST default to empty string ("")

#### Scenario: Fields are trimmed
- GIVEN a CLIENT user provides description, criteria, goal, deliverables, or constraints with leading/trailing whitespace
- WHEN `createGig` is called
- THEN each field MUST be trimmed before validation and storage
- AND whitespace-only values MUST be treated as empty for the required-field and minimum-length checks

**Acceptance Criteria:**
- `createGig` is exported from `app/actions/gig.ts` with `'use server'`
- All field minimums are enforced inside the shared `parseGigForm` validator (see the SSOT requirement below), not in the UI
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- description minimum length: 20 characters (after trimming); acceptanceCriteria minimum length: 50 characters (after trimming)
- `goal` and `deliverables` are required (non-empty after trimming); `constraints` is optional and defaults to ""
- All validation error messages are in Russian
- Budget input is in roubles (user-facing), stored in kopecks (DB); service fee is 17.5% of budget
- On success: redirects to `/gigs/new/success`
- On failure: returns `{ error: string }`

---

### Requirement: Shared Server-Authoritative Gig Validator (parseGigForm SSOT)
The system MUST enforce all gig field minimums inside a single shared validator, `parseGigForm` in `app/actions/gig.ts`, which is the **single source of truth** used by both `createGig` and `updateGig`. Client-side gating (readiness checklist, disabled buttons, counters) MUST be a mirror of these rules and MUST NOT be the only place a rule is enforced.

#### Scenario: All minimums live in one validator
- GIVEN the gig create and edit flows
- WHEN either `createGig` or `updateGig` validates input
- THEN both MUST delegate field validation to `parseGigForm`
- AND `parseGigForm` MUST enforce: title non-empty; description ≥ 20 chars (trimmed); acceptanceCriteria ≥ 50 chars (trimmed); goal non-empty (trimmed); deliverables non-empty (trimmed); budget > 0; deadline (when provided) an integer 1–365; stageCount (when provided) an integer 1–50
- AND every rejection MUST carry a Russian error message

#### Scenario: Client gating cannot be the sole enforcement
- GIVEN a request that bypasses the client UI (e.g. a direct server-action invocation) with a sub-minimum description or missing goal/deliverables
- WHEN `createGig` or `updateGig` runs
- THEN the server MUST reject it via `parseGigForm`, independent of any client checklist

#### Scenario: Numeric minimums are sourced from a shared module
- GIVEN the numeric minimums (description ≥ 20, criteria ≥ 50, deadline 1–365, stages 1–50)
- WHEN either the server validator or the client UI references a minimum
- THEN both MUST read the same constants from `lib/gig-validation.ts` (the server-action file is `'use server'` and cannot export non-async constants), so the UI counters and server gates never drift

---

### Requirement: Service Fee Rate Is a Single Source of Truth
The service-fee rate MUST be defined exactly once, in `lib/pricing.ts` as `SERVICE_FEE_RATE = 0.175`, and every fee computation and every user-facing fee label MUST derive from it. No literal fee rate (`0.10`, `0.1`, `0.175`, «10%», «20%») may appear anywhere else in code. `lib/pricing.ts` MUST be client-safe (pure, no Prisma import) so both the `'use server'` actions and the client design components can import it. (Source change: `raise-service-fee-and-reconcile-create-gig`.)

#### Scenario: One rate, one place
- GIVEN the codebase
- WHEN one searches for a fee rate literal
- THEN `0.175` (and the derived percent label «17,5%») MUST appear only in `lib/pricing.ts`
- AND `CreateGigDesign`, `EditGigDesign`, `GigDetail`, `ConditionsPanel`, `FeePanel`, `createGig`, `updateGig`, `prisma/seed.ts`, and the test fixture helper MUST all compute the fee via `serviceFeeKopecks()` (or the roubles helper), not a local literal

#### Scenario: The displayed percent cannot drift from the rate
- GIVEN a fee label rendered on any screen (create, edit, gig-detail, fee panel, finances)
- WHEN it shows the percent
- THEN it MUST read «17,5%» sourced from `SERVICE_FEE_PCT_LABEL` in `lib/pricing.ts`
- AND no screen may hardcode «10%» or «17,5%» as a literal string

### Requirement: Fee Calculation
The system MUST calculate the service fee as **17.5%** of the budget, via the `SERVICE_FEE_RATE` SSOT.

#### Scenario: Fee calculation for 100,000 ₽ budget
- GIVEN a budget of 100000 (roubles)
- WHEN fee is calculated
- THEN serviceFee MUST be 1750000 kopecks (17,500 ₽ × 100)
- AND totalAmount MUST be 11750000 kopecks (117,500 ₽ × 100)

#### Scenario: Fee calculation rounds down for fractional kopecks
- GIVEN a budget of 333 roubles
- WHEN fee is calculated
- THEN serviceFee MUST be Math.floor(33300 × 0.175) = 5827 kopecks (floor of 5827.5)
- AND totalAmount MUST be 33300 + 5827 = 39127 kopecks

**Acceptance Criteria:**
- `serviceFee = Math.floor(budgetKopecks * SERVICE_FEE_RATE)` where `SERVICE_FEE_RATE = 0.175`
- `totalAmount = budgetKopecks + serviceFee`
- All monetary values stored as integers (kopecks)
- The same helper computes the fee in `createGig`, in the `updateGig` / accept-proposed-terms recompute, and in the live create/edit previews — so the preview always equals the persisted value

---

### Requirement: Apply to Gig Server Action
The system MUST provide an `applyToGig` server action that creates an application with structured fields for technical approach, clarifying questions, and optional estimated effort. A specialist has at most one application row per gig (`@@unique([gigId, specialistId])`). Re-application is gated by **status**: a `WITHDRAWN` (reversible) application MUST be reactivated on re-apply; a `WITHDRAWN_FINAL` application MUST block re-application. Example gigs (`isExample`) MUST NOT accept applications. The reactivation MUST be performed atomically against the current status.

#### Scenario: Successful application with structured fields
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `applyToGig` is called with valid gigId, approach, questions, and optional estimatedEffort
- THEN an Application record MUST be created with:
  - `gigId` = provided gig ID
  - `specialistId` = session userId
  - `approach` = provided technical approach (trimmed)
  - `questions` = provided clarifying questions (trimmed)
  - `estimatedEffort` = provided effort estimate (trimmed) or empty string
  - `coverLetter` = empty string (legacy field, not used)
  - `status` = "PENDING"
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Missing required approach field
- GIVEN a SPECIALIST submits an application with empty or whitespace-only approach
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Technical approach is required.' }`
- AND no Application record MUST be created

#### Scenario: Missing required questions field
- GIVEN a SPECIALIST submits an application with empty or whitespace-only questions
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Clarifying questions are required.' }`
- AND no Application record MUST be created

#### Scenario: Approach too short
- GIVEN a SPECIALIST submits an application with approach shorter than 100 characters (after trimming)
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Technical approach must be at least 100 characters. Please provide more detail about your methodology.' }`
- AND no Application record MUST be created

#### Scenario: Questions too short
- GIVEN a SPECIALIST submits an application with questions shorter than 50 characters (after trimming)
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Clarifying questions must be at least 50 characters. What do you need to know about the requirements?' }`
- AND no Application record MUST be created

#### Scenario: Approach exceeds maximum length
- GIVEN a SPECIALIST submits an application with approach longer than 2000 characters
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Technical approach is too long. Maximum 2000 characters allowed.' }`
- AND no Application record MUST be created

#### Scenario: Questions exceed maximum length
- GIVEN a SPECIALIST submits an application with questions longer than 1000 characters
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Clarifying questions are too long. Maximum 1000 characters allowed.' }`
- AND no Application record MUST be created

#### Scenario: Estimated effort exceeds maximum length
- GIVEN a SPECIALIST submits an application with estimatedEffort longer than 200 characters
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Estimated effort is too long. Maximum 200 characters allowed.' }`
- AND no Application record MUST be created

#### Scenario: Optional estimated effort is empty
- GIVEN a SPECIALIST submits an application without estimatedEffort
- WHEN `applyToGig` is called with valid approach and questions
- THEN an Application record MUST be created successfully
- AND `estimatedEffort` MUST be stored as empty string ""

#### Scenario: Non-SPECIALIST user attempts to apply
- GIVEN an authenticated user with role "CLIENT"
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Only specialists can apply to gigs.' }`
- AND no Application record MUST be created

#### Scenario: Unauthenticated user attempts to apply
- GIVEN no valid session
- WHEN `applyToGig` is called
- THEN it MUST redirect to `/login`

#### Scenario: Duplicate active application is rejected
- GIVEN a SPECIALIST has an application to a gig with status `PENDING` or `ACCEPTED`
- WHEN `applyToGig` is called for the same gig
- THEN it MUST return an error stating the specialist has already applied
- AND no additional Application record MUST be created

#### Scenario: Re-applying after a reversible withdrawal reactivates the application
- GIVEN a SPECIALIST has an application to an OPEN gig with status `WITHDRAWN` and `freeWithdrawalUsed = true`
- WHEN `applyToGig` is called with valid approach and questions
- THEN the existing row MUST be updated in place (no new row) to `status: 'PENDING'` with the newly submitted fields
- AND `freeWithdrawalUsed` MUST be preserved (stays `true`)
- AND an owner `APPLICATION` notification MUST be created

#### Scenario: Re-applying after a final withdrawal is rejected
- GIVEN a SPECIALIST has an application to a gig with status `WITHDRAWN_FINAL`
- WHEN `applyToGig` is called for that gig
- THEN it MUST return an error stating the specialist has finally withdrawn and can no longer apply to this gig
- AND no record MUST be created or modified
- AND this MUST hold even when the call bypasses any client-side dialog (server-authoritative)

#### Scenario: Applying to an example gig is rejected
- GIVEN a gig with `isExample = true`
- WHEN `applyToGig` is called
- THEN it MUST return an error indicating the gig is a demonstration gig and applications are not accepted
- AND no Application record MUST be created or modified

#### Scenario: Applying to non-existent gig
- GIVEN a gigId that does not exist
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

#### Scenario: Applying to non-OPEN gig
- GIVEN a gig with status other than "OPEN"
- WHEN `applyToGig` is called
- THEN it MUST return `{ error: 'This gig is no longer accepting applications.' }`

**Acceptance Criteria:**
- `applyToGig` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field), `approach` (textarea), `questions` (textarea), `estimatedEffort` (textarea, optional)
- All text fields are trimmed before validation and storage
- Validation order: required fields first, then length checks
- Minimum lengths: approach 100 chars, questions 50 chars
- Maximum lengths: approach 2000 chars, questions 1000 chars, estimatedEffort 200 chars
- Empty or missing estimatedEffort defaults to empty string ""
- On success: redirects to `/gigs/{gigId}`
- On failure: returns `{ error: string }` with clear, actionable error messages
- `coverLetter` field is set to empty string (not used in new applications)

---

### Requirement: Accept Application Server Action
The system MUST provide an `acceptApplication` server action that allows the gig owner to accept a PENDING application, and MUST seed a system-authored opener message so a chat thread exists for both parties immediately after acceptance.

#### Scenario: Successful acceptance
- GIVEN an authenticated CLIENT user who owns the gig
- WHEN `acceptApplication` is called with a valid applicationId
- THEN the Application status MUST be updated to "ACCEPTED"
- AND the Gig status MUST be updated to "IN_PROGRESS"
- AND the Gig `assignedSpecialistId` MUST be set to the application's specialistId
- AND all other PENDING applications for that gig MUST be updated to "REJECTED"
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Acceptance seeds a system opener message
- GIVEN a successful acceptance (gig is now IN_PROGRESS with an assigned specialist)
- WHEN the acceptance transaction has committed
- THEN exactly one Message record MUST be created for that gig with:
  - `gigId` = the accepted gig's ID
  - `senderId` = `null` (system/platform authored)
  - `content` = a non-empty Russian platform opener (e.g. «Заявка принята. Обсудите здесь детали, первые шаги и сроки.»)
- AND the thread MUST therefore appear in `/chats` (`getConversations`) and in both dashboards' «Сообщения» panels (`getRecentMessages`) for BOTH the owning client and the assigned specialist
- AND a failure to write the opener MUST NOT roll back or fail the acceptance (fire-after-commit; log on error)

#### Scenario: Non-owner attempts to accept
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Принимать отклики может только заказчик, опубликовавший гиг.' }`
- AND no records MUST be modified

#### Scenario: Non-CLIENT user attempts to accept
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Управлять откликами могут только заказчики. Если вы специалист — дождитесь решения заказчика.' }`

#### Scenario: Unauthenticated user attempts to accept
- GIVEN no valid session
- WHEN `acceptApplication` is called
- THEN it MUST redirect to `/login`

#### Scenario: Accept application on non-OPEN gig
- GIVEN a gig with status other than "OPEN"
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Этот гиг больше не принимает отклики — возможно, специалист уже назначен.' }`

#### Scenario: Accept non-PENDING application
- GIVEN an application with status "REJECTED" or "ACCEPTED"
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Этот отклик уже принят или отклонён.' }`

#### Scenario: Application not found
- GIVEN an applicationId that does not exist
- WHEN `acceptApplication` is called
- THEN it MUST return `{ error: 'Этот отклик больше не существует или был удалён.' }`

**Acceptance Criteria:**
- `acceptApplication` is exported from `app/actions/gig.ts` with `'use server'`
- All status updates (application status, gig status, auto-reject) MUST happen in a single Prisma transaction
- The system opener Message MUST be written AFTER that transaction commits (best-effort; not part of the transaction)
- On success: redirects to `/gigs/{gigId}`
- On failure: returns `{ error: string }`

---

### Requirement: Reject Application Server Action
The system MUST provide a `rejectApplication` server action that allows the gig owner to reject a PENDING application.

#### Scenario: Successful rejection
- GIVEN an authenticated CLIENT user who owns the gig
- WHEN `rejectApplication` is called with a valid applicationId
- THEN the Application status MUST be updated to "REJECTED"
- AND the Gig status MUST remain "OPEN"
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Non-owner attempts to reject
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'Only the gig owner can manage applications.' }`

#### Scenario: Non-CLIENT user attempts to reject
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'Only clients can manage applications.' }`

#### Scenario: Unauthenticated user attempts to reject
- GIVEN no valid session
- WHEN `rejectApplication` is called
- THEN it MUST redirect to `/login`

#### Scenario: Reject non-PENDING application
- GIVEN an application with status "ACCEPTED" or "REJECTED"
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'This application is no longer pending.' }`

#### Scenario: Application not found
- GIVEN an applicationId that does not exist
- WHEN `rejectApplication` is called
- THEN it MUST return `{ error: 'Application not found.' }`

**Acceptance Criteria:**
- `rejectApplication` is exported from `app/actions/gig.ts` with `'use server'`
- On success: redirects to `/gigs/{gigId}`
- On failure: returns `{ error: string }`

---

### Requirement: Submit Work Server Action
The system MUST provide a `submitWork` server action that allows the assigned specialist to submit completed work and transition the gig from IN_PROGRESS to REVIEW.

#### Scenario: Successful work submission
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is the assigned specialist (userId === gig.assignedSpecialistId)
- AND the gig status is "IN_PROGRESS"
- WHEN `submitWork` is called with a valid gigId
- THEN the Gig status MUST be updated to "REVIEW"
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Non-SPECIALIST user attempts to submit work
- GIVEN an authenticated user with role "CLIENT"
- WHEN `submitWork` is called
- THEN it MUST return `{ error: 'Only specialists can submit work.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to submit work
- GIVEN no valid session
- WHEN `submitWork` is called
- THEN it MUST redirect to `/login`

#### Scenario: Non-assigned specialist attempts to submit work
- GIVEN an authenticated SPECIALIST user who is NOT the assigned specialist
- WHEN `submitWork` is called
- THEN it MUST return `{ error: 'Only the assigned specialist can submit work.' }`
- AND no records MUST be modified

#### Scenario: Submit work on gig with wrong status
- GIVEN a gig with status other than "IN_PROGRESS" (e.g., "OPEN", "REVIEW", "COMPLETED")
- WHEN `submitWork` is called
- THEN it MUST return `{ error: 'Work can only be submitted for gigs in progress.' }`
- AND no records MUST be modified

#### Scenario: Gig not found
- GIVEN a gigId that does not exist
- WHEN `submitWork` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

**Acceptance Criteria:**
- `submitWork` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field)
- On success: redirects to `/gigs/{gigId}`
- On failure: returns `{ error: string }`
- Status update must be atomic (single database operation)

---

### Requirement: Approve Work Server Action
The system MUST provide an `approveWork` server action that allows the gig owner to approve submitted work and transition the gig from REVIEW to COMPLETED.

#### Scenario: Successful work approval
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig status is "REVIEW"
- WHEN `approveWork` is called with a valid gigId
- THEN the Gig status MUST be updated to "COMPLETED"
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Non-CLIENT user attempts to approve work
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `approveWork` is called
- THEN it MUST return `{ error: 'Only clients can approve work.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to approve work
- GIVEN no valid session
- WHEN `approveWork` is called
- THEN it MUST redirect to `/login`

#### Scenario: Non-owner attempts to approve work
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `approveWork` is called
- THEN it MUST return `{ error: 'Only the gig owner can approve work.' }`
- AND no records MUST be modified

#### Scenario: Approve work on gig with wrong status
- GIVEN a gig with status other than "REVIEW" (e.g., "OPEN", "IN_PROGRESS", "COMPLETED")
- WHEN `approveWork` is called
- THEN it MUST return `{ error: 'Work can only be approved for gigs under review.' }`
- AND no records MUST be modified

#### Scenario: Gig not found
- GIVEN a gigId that does not exist
- WHEN `approveWork` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

**Acceptance Criteria:**
- `approveWork` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field)
- On success: redirects to `/gigs/{gigId}`
- On failure: returns `{ error: string }`
- Status update must be atomic (single database operation)

---

### Requirement: Mark as Paid Server Action
The system MUST provide a `markAsPaid` server action that allows the gig owner to mark a COMPLETED gig as paid.

#### Scenario: Successful payment marking
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig status is "COMPLETED"
- WHEN `markAsPaid` is called with a valid gigId
- THEN the Gig status MUST be updated to "PAID"
- AND the Gig `paidAt` MUST be set to the current timestamp (new Date())
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Non-CLIENT user attempts to mark as paid
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `markAsPaid` is called
- THEN it MUST return `{ error: 'Only clients can mark gigs as paid.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to mark as paid
- GIVEN no valid session
- WHEN `markAsPaid` is called
- THEN it MUST redirect to `/login`

#### Scenario: Non-owner attempts to mark as paid
- GIVEN an authenticated CLIENT user who does NOT own the gig
- WHEN `markAsPaid` is called
- THEN it MUST return `{ error: 'Only the gig owner can mark this gig as paid.' }`
- AND no records MUST be modified

#### Scenario: Mark as paid on gig with wrong status
- GIVEN a gig with status other than "COMPLETED" (e.g., "OPEN", "IN_PROGRESS", "REVIEW", "PAID")
- WHEN `markAsPaid` is called
- THEN it MUST return `{ error: 'Only completed gigs can be marked as paid.' }`
- AND no records MUST be modified

#### Scenario: Mark already paid gig as paid (idempotency)
- GIVEN a gig with status "PAID" and paidAt already set
- WHEN `markAsPaid` is called by the owner
- THEN it MUST return `{ error: 'This gig has already been marked as paid.' }`
- AND the existing `paidAt` value MUST NOT be changed

#### Scenario: Gig not found
- GIVEN a gigId that does not exist
- WHEN `markAsPaid` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

**Acceptance Criteria:**
- `markAsPaid` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field)
- On success: redirects to `/gigs/{gigId}`
- On failure: returns `{ error: string }`
- Status update and paidAt timestamp must be atomic (single database operation)
- Uses `new Date()` for paidAt timestamp

---

### Requirement: Send Message Server Action
The system MUST provide a `sendMessage` server action that creates a message within a gig context and redirects on success.

#### Scenario: Successful message send by gig owner
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig has an assigned specialist (assignedSpecialistId is not null)
- WHEN `sendMessage` is called with valid gigId and content
- THEN a Message record MUST be created with:
  - `gigId` = provided gig ID
  - `senderId` = session userId
  - `content` = provided message text (trimmed)
  - `createdAt` = current timestamp (auto-generated)
- AND the action MUST redirect to `/gigs/{gigId}` to refresh the page
- AND the form MUST be reset (handled by redirect)

#### Scenario: Successful message send by assigned specialist
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is the assigned specialist (userId === gig.assignedSpecialistId)
- AND the gig has an assigned specialist
- WHEN `sendMessage` is called with valid gigId and content
- THEN a Message record MUST be created
- AND the action MUST redirect to `/gigs/{gigId}` to refresh the page

#### Scenario: Unauthenticated user attempts to send message
- GIVEN no valid session
- WHEN `sendMessage` is called
- THEN it MUST redirect to `/login`

#### Scenario: Unauthorized user attempts to send message
- GIVEN an authenticated user who is NOT the gig owner AND NOT the assigned specialist
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'You are not authorized to send messages on this gig.' }`
- AND no Message record MUST be created

#### Scenario: Send message to gig without assigned specialist
- GIVEN a gig with status "OPEN" (no assigned specialist)
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Cannot send messages until a specialist is assigned.' }`
- AND no Message record MUST be created

#### Scenario: Send message with empty content
- GIVEN an authorized user submits a message with empty or whitespace-only content
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Message content is required.' }`
- AND no Message record MUST be created

#### Scenario: Send message exceeding max length
- GIVEN an authorized user submits a message with content longer than 2000 characters
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Message is too long. Maximum 2000 characters allowed.' }`
- AND no Message record MUST be created

#### Scenario: Send message to non-existent gig
- GIVEN a gigId that does not exist
- WHEN `sendMessage` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

#### Scenario: Send message to closed gig
- GIVEN a gig with closedByAdmin = true
- WHEN `sendMessage` is called by an authorized user
- THEN it MUST return `{ error: 'Cannot send messages to a closed gig.' }`
- AND no Message record MUST be created

#### Scenario: Send message to PAID gig
- GIVEN a gig with status "PAID"
- WHEN `sendMessage` is called by an authorized user (gig owner or assigned specialist)
- THEN it MUST return `{ error: 'Cannot send messages to a paid gig.' }`
- AND no Message record MUST be created

**Acceptance Criteria:**
- `sendMessage` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field) and `content` (textarea)
- Content validation:
  - Non-empty after trimming
  - Maximum 2000 characters (before trimming)
- Access control checks: user is gig owner OR assigned specialist
- Gig state checks: has assigned specialist, not closed by admin, not PAID status
- Validation order: auth → rate limit → content validation → gig state (assigned specialist, not closed, not paid)
- On success: calls `redirect(\`/gigs/${gigId}\`)` (NOT revalidatePath)
- On failure: returns `{ error: string }`
- Content is trimmed before storage

---

### Requirement: Create Notification on Message Send
The `sendMessage` server action MUST create or update a notification record for the message recipient.

#### Scenario: Sending message creates notification for recipient
- GIVEN an authenticated user sends a message on a gig
- WHEN the message is successfully created
- THEN a Notification record MUST be created or updated for the recipient
- AND the Notification `lastReadAt` MUST remain unchanged (or null if new record)

#### Scenario: Notification is not created for sender
- GIVEN an authenticated user sends a message
- WHEN the message is sent
- THEN a Notification record MUST NOT be created or updated for the sender's userId

**Acceptance Criteria:**
- `sendMessage` action creates/updates Notification record for recipient
- Uses Prisma `upsert` operation: create if not exists, update `updatedAt` if exists
- Does NOT modify `lastReadAt` field (only recipient can mark as read)
- Sender's notification is not affected
- Error handling: log notification errors but don't fail message send

---

### Requirement: System-Authored Message Support
The `Message` model and its view-model mapping MUST support platform/system-authored messages that have no user sender.

#### Scenario: Message schema allows a null sender
- GIVEN the `Message` model in `prisma/schema.prisma`
- THEN `senderId` MUST be nullable (`String?`) and the `sender` relation MUST be optional
- AND existing messages with a non-null sender MUST be unaffected (nullable widening, no data migration)

#### Scenario: System message maps to a system bubble
- GIVEN a Message row with `senderId = null`
- WHEN `toMessageBubble` maps it for any viewer
- THEN the resulting `MessageBubbleVM.direction` MUST be `"system"` (not `"in"`/`"out"`)
- AND the author MUST be a platform label (e.g. «Gigly»)

#### Scenario: MessageBubble renders the system direction distinctly
- GIVEN a `MessageBubbleVM` with `direction: "system"`
- WHEN `MessageBubble` renders it
- THEN it MUST be visually distinct from `in`/`out` (e.g. centered, muted) and MUST NOT be attributed to the client or specialist

#### Scenario: Recent-messages panel tolerates a null sender
- GIVEN a gig whose most recent Message has `senderId = null`
- WHEN `getRecentMessages` builds the dashboard «Сообщения» item
- THEN it MUST NOT throw on the null sender
- AND the `senderName` MUST be a platform label (e.g. «Gigly»)

#### Scenario: System opener is not counted as counterparty unread
- GIVEN a gig whose only message is the system opener (`senderId = null`)
- WHEN `getConversations` computes the conversation's `unread` count for either party
- THEN the system opener MUST NOT be counted as an unread message from the counterparty (it still lists the conversation and shows its preview)

**Acceptance Criteria:**
- `Message.senderId` is `String?` with an optional `sender` relation in `prisma/schema.prisma`
- `Message.gig` relation uses `onDelete: Cascade` (a gig's messages are removed with it, consistent with `Notification`)
- `toMessageBubble` and `getGigDetail`'s inline thread map a null sender to `direction: "system"` / author «Gigly»
- `MessageBubble` renders `direction === "system"` as a centered, muted, unattributed notice
- `getRecentMessages` guards the nullable sender (senderName «Gigly») and `getConversations` excludes system messages from the unread tally

---

### Requirement: Gig Detail Chat Entry Point
The gig detail page MUST expose an obvious control to open the gig's chat for the two participants while the engagement is active.

#### Scenario: Assigned specialist sees «Написать заказчику»
- GIVEN an authenticated SPECIALIST who is the gig's assigned specialist
- AND the gig status is "IN_PROGRESS" or "REVIEW"
- WHEN they view the gig detail
- THEN a «Написать заказчику» control MUST be shown
- AND activating it MUST navigate to `/chats?gig={gigId}`

#### Scenario: Owning client sees «Написать исполнителю»
- GIVEN an authenticated CLIENT who owns the gig
- AND the gig has an assigned specialist and status "IN_PROGRESS" or "REVIEW"
- WHEN they view the gig detail
- THEN a «Написать исполнителю» control MUST be shown
- AND activating it MUST navigate to `/chats?gig={gigId}`

#### Scenario: Non-participants and pre-assignment see no entry point
- GIVEN a viewer who is neither the gig owner nor the assigned specialist, OR a gig with no assigned specialist (OPEN)
- WHEN they view the gig detail
- THEN the «Написать …» control MUST NOT be shown

**Acceptance Criteria:**
- The control is shown only when `messaging.assigned && (isOwner || isAssignedSpecialist)` and gig status ∈ {`IN_PROGRESS`, `REVIEW`}, and never on example gigs
- Label is role-specific («Написать заказчику» for the specialist, «Написать исполнителю» for the client)
- The control routes to `/chats?gig={gigId}` (the `/chats` page selects the thread by `?gig=`)

---

### Requirement: Fetch Unread Notifications Server Action
The system MUST provide a `getUnreadNotifications` server action that returns gigs with unread messages for the authenticated user.

#### Scenario: Fetch unread notifications
- GIVEN an authenticated user with unread messages on multiple gigs
- WHEN `getUnreadNotifications` is called
- THEN it MUST return an array of notification objects with gigId, gig title, last message sender, last message timestamp, and unread count

#### Scenario: Unread notifications exclude closed gigs
- GIVEN an authenticated user has unread messages on a closed gig
- WHEN `getUnreadNotifications` is called
- THEN it MUST NOT include the closed gig in the results

#### Scenario: Notifications sorted by most recent message first
- GIVEN an authenticated user has unread messages on multiple gigs
- WHEN `getUnreadNotifications` is called
- THEN the results MUST be sorted by last message timestamp (descending)

**Acceptance Criteria:**
- `getUnreadNotifications` is exported from `app/actions/notification.ts` with `'use server'`
- Returns array of notification objects with gig details and last message info
- Only includes gigs where user is owner OR assigned specialist
- Only includes gigs with messages from other users (not just own messages)
- Excludes closed gigs (closedByAdmin = true)
- Sorted by most recent message first
- Query is efficient (< 100ms for 1000+ messages)

---

### Requirement: Mark Notification as Read Server Action
The system MUST provide a `markNotificationAsRead` server action that updates the lastReadAt timestamp for a user-gig pair.

#### Scenario: Mark notification as read
- GIVEN an authenticated user who is authorized for a gig
- WHEN `markNotificationAsRead` is called with a gigId
- THEN the Notification record MUST be created or updated
- AND `lastReadAt` MUST be set to the current timestamp

#### Scenario: Unauthorized user cannot mark as read
- GIVEN an authenticated user who is NOT the gig owner or assigned specialist
- WHEN `markNotificationAsRead` is called
- THEN it MUST return an error
- AND no Notification record MUST be created or updated

**Acceptance Criteria:**
- `markNotificationAsRead` is exported from `app/actions/notification.ts` with `'use server'`
- Signature is `(gigId: string) => Promise<{ error?: string }>`
- Uses Prisma `upsert` operation
- Authorization check: user is gig owner OR assigned specialist
- Sets `lastReadAt` to `new Date()`
- Returns `{ error: string }` on failure, `{}` on success
- Operation is fast (< 50ms)

---

### Requirement: Get Unread Count Server Action
The system MUST provide a `getUnreadCount` server action that returns the total number of gigs with unread messages.

#### Scenario: Get unread count
- GIVEN an authenticated user with unread messages on multiple gigs
- WHEN `getUnreadCount` is called
- THEN it MUST return `{ count: number }` with the correct count

#### Scenario: Unread count excludes closed gigs
- GIVEN an authenticated user has unread messages including on closed gigs
- WHEN `getUnreadCount` is called
- THEN the count MUST NOT include closed gigs

**Acceptance Criteria:**
- `getUnreadCount` is exported from `app/actions/notification.ts` with `'use server'`
- Returns `{ count: number }`
- Count logic matches `getUnreadNotifications` (same filtering rules)
- Query is efficient (< 50ms for 1000+ messages)

---

### Requirement: Notification Writes Are Awaited Before Redirect
Server actions that create notifications and then `redirect()` MUST await the notification write before redirecting, so the write cannot be dropped by a runtime that ends the invocation at the redirect boundary.

> Context: this is defence-in-depth, not a bug fix. The fire-and-forget pattern was verified on Node to persist immediately (an unread count moved 7→8), so it was never the cause of the stale-counter reports — that was read-freshness (see the UI spec's "Notification Bell Refreshes Without a Manual Reload"). Awaiting removes a latent serverless/edge teardown risk at negligible cost.

#### Scenario: An action that notifies-then-redirects persists the notification
- GIVEN a gig server action that creates a notification and then redirects (e.g. a specialist applying to a gig)
- WHEN the action runs to completion
- THEN the notification row MUST be persisted before the redirect is issued
- AND the recipient's unread count MUST include it on the next read

#### Scenario: A notification failure does not fail the user's action
- GIVEN a notification write that throws (e.g. the notification backend is unavailable)
- WHEN the surrounding action runs
- THEN the user's primary action (apply / status change / message) MUST still succeed and redirect
- AND the failure MUST be logged, not surfaced as a user-facing error
- AND this MUST match the fan-out behavior specified for `updateGig` ("a notification fan-out failure does not fail the edit")

**Acceptance Criteria:**
- The `createNotification(...)` / `createNotificationsBulk(...)` calls in `app/actions/gig.ts` that precede a `redirect()` are awaited
- Failure isolation is inherent: both helpers in `lib/notifications.ts` catch internally and never reject, so `await` cannot fail the caller
- No change to notification content, type, recipients, or the unread derivation
- `redirect()` is still called outside any `try` that would swallow Next.js's control-flow redirect error

---

### Requirement: Reject Application UI with Confirmation
The Reject Application button MUST trigger a confirmation dialog before executing the rejectApplication server action.

#### Scenario: Clicking Reject Application opens confirmation dialog
- GIVEN a CLIENT viewing a PENDING application on their gig
- WHEN they click the "Reject Application" button
- THEN a confirmation dialog MUST appear
- AND the dialog title MUST be "Reject Application"
- AND the dialog message MUST explain: "This will permanently reject this application. The specialist will be notified and cannot reapply to this gig."
- AND the rejectApplication action MUST NOT execute yet

#### Scenario: Confirming rejection executes action
- GIVEN a CLIENT with open rejection confirmation dialog
- WHEN they click "Confirm" in the dialog
- THEN the rejectApplication server action MUST be called
- AND the dialog MUST close
- AND the application status MUST update to REJECTED

#### Scenario: Canceling rejection closes dialog without action
- GIVEN a CLIENT with open rejection confirmation dialog
- WHEN they click "Cancel" in the dialog
- THEN the rejectApplication server action MUST NOT be called
- AND the dialog MUST close
- AND the application status MUST remain PENDING

**Acceptance Criteria:**
- Reject Application button opens ConfirmDialog before calling rejectApplication
- Dialog message clearly explains consequences
- Confirmation required before server action executes
- Cancel button prevents action execution
- Existing rejectApplication server action logic unchanged

---

<!-- Merged on archive from change: fix-application-lifecycle (2026-07-14). Source delta retained in openspec/archive/fix-application-lifecycle/specs/gig/spec.md.
     The three requirements below SUPERSEDE the former "Withdraw Application UI with Confirmation" requirement, whose
     "you will not be able to reapply" wording was wrong under the one-free-withdrawal rule (the 1st withdrawal is reversible). -->

### Requirement: Withdraw Application Server Action
The system MUST provide a `withdrawApplication` server action that lets a specialist withdraw their own `PENDING` application, preserving the row. The first withdrawal per gig is reversible (`WITHDRAWN`); the second is final (`WITHDRAWN_FINAL`). The transition MUST be atomic.

#### Scenario: First withdrawal is reversible
- GIVEN an authenticated SPECIALIST who owns a `PENDING` application with `freeWithdrawalUsed = false`
- WHEN `withdrawApplication` is called for that application
- THEN the status MUST be set to `WITHDRAWN` and `freeWithdrawalUsed` MUST be set to `true`
- AND the row MUST be preserved (not deleted)
- AND the specialist MUST be able to re-apply (reactivation per Apply to Gig)

#### Scenario: Second withdrawal is final
- GIVEN a SPECIALIST who re-applied after a first withdrawal (status `PENDING`, `freeWithdrawalUsed = true`)
- WHEN `withdrawApplication` is called again
- THEN the status MUST be set to `WITHDRAWN_FINAL`
- AND the application MUST be permanently withdrawn (re-apply rejected per Apply to Gig)

#### Scenario: Transition is atomic and guarded by current status
- GIVEN concurrent or repeated `withdrawApplication` calls for the same application
- WHEN they execute
- THEN the check-and-update MUST be atomic (transaction or a conditional update guarded by the current `PENDING` status)
- AND the application MUST NOT double-transition or land in an inconsistent state

#### Scenario: Cannot withdraw a non-pending or example application
- GIVEN an application that is not `PENDING`, or belongs to an `isExample` gig, or is not owned by the caller
- WHEN `withdrawApplication` is called
- THEN it MUST return a clear error and MUST NOT change any record

### Requirement: Withdrawal State Integrity
The one-free-withdrawal rule MUST be enforced with server-authoritative row state that cannot be reset or spoofed by the client and never bleeds across gigs or users.

#### Scenario: State is persisted per application row, server-side only
- GIVEN the withdrawal state for a `(gig, specialist)` pair
- WHEN it is read or updated
- THEN `status` and `freeWithdrawalUsed` MUST be stored on the `Application` row that is unique per `(gigId, specialistId)`
- AND they MUST NOT be derived from session, cookie, or any client-supplied value

#### Scenario: State survives session changes and is scoped
- GIVEN a specialist has withdrawn once from gig A (`WITHDRAWN`, `freeWithdrawalUsed = true`)
- WHEN the specialist logs out and back in, or refreshes the session
- THEN gig A's state MUST be unchanged
- AND the state for a different gig B, or for a different specialist on gig A, MUST be independent

#### Scenario: No client-accessible reset path
- GIVEN a specialist wants to reset their withdrawal state on a gig
- WHEN they use any specialist-facing action
- THEN there MUST be no action that deletes or resets a single application row (only the delete-account flow removes applications)

### Requirement: Gig Detail Application UI States
The gig detail screen MUST render an unambiguous application affordance for a viewing SPECIALIST across the apply, reversible-withdrawn, final-withdrawn, example, and disabled-submit states, and MUST gate the final withdrawal behind a confirmation dialog. For the reversible-withdrawn state, the screen MUST also present a per-viewer withdrawn signal that is visually distinct from the gig's derived stage badge, so the viewer's own status is never conflated with the gig-level «На рассмотрении».

#### Scenario: Reversible-withdrawn shows a per-viewer withdrawn signal plus the apply form
- GIVEN the viewing specialist's own application status is `WITHDRAWN`
- WHEN the gig detail renders
- THEN it MUST show a clear per-viewer signal that this specialist withdrew their application (e.g. «Вы отозвали отклик»)
- AND it MUST present the re-apply affordance (the apply form), re-application allowed
- AND this per-viewer signal MUST be visually distinct from the gig's derived stage badge (which may read «На рассмотрении» when the OPEN gig has other applicants)
- AND it MUST NOT read as the bare gig-level «На рассмотрении» state with no viewer-specific context

#### Scenario: Final-withdrawn keeps the gig visible with a marker
- GIVEN the specialist's application status is `WITHDRAWN_FINAL`
- WHEN the gig detail renders
- THEN the gig MUST remain visible (not removed from the feed)
- AND it MUST show a «Отозвано» marker with text that re-application is unavailable
- AND the apply control MUST be disabled/absent

#### Scenario: Final withdrawal requires confirmation
- GIVEN the specialist has an active `PENDING` application with `freeWithdrawalUsed = true` (the next withdrawal would be final)
- WHEN the specialist activates the withdraw control
- THEN a confirmation dialog MUST appear warning that re-application will no longer be possible
- AND it MUST offer a confirm action and a dismiss action («Не отменять»)
- AND `withdrawApplication` MUST run ONLY if confirm is chosen; dismiss MUST leave the application `PENDING`

#### Scenario: First withdrawal does not require the final-warning dialog
- GIVEN the specialist has an active `PENDING` application with `freeWithdrawalUsed = false`
- WHEN the specialist activates the withdraw control
- THEN the final-warning dialog MUST NOT be required (a light confirm or immediate withdrawal is acceptable, since it is reversible)

#### Scenario: Example gig shows a demonstration notice
- GIVEN a SPECIALIST opens a gig with `isExample = true`
- WHEN the gig detail renders
- THEN it MUST show a notice that the gig is a demonstration and does not accept applications, with a link to `/gigs`
- AND it MUST NOT render an apply form or a phantom apply button

#### Scenario: Disabled submit surfaces the unmet minimum
- GIVEN a SPECIALIST is filling the apply form on an OPEN, non-example gig
- AND the approach is shorter than 100 characters OR the questions are shorter than 50 characters
- WHEN the form renders
- THEN «Отправить заявку» MUST be visibly disabled
- AND the live requirement hint MUST emphasize the unmet rule(s) with current counts
- AND once both minimums are met, the emphasis MUST clear and the button MUST enable and submit

#### Scenario: Re-applying from the withdrawn state returns to the pending state
- GIVEN the viewing specialist's own application status is `WITHDRAWN` and the per-viewer withdrawn signal is shown
- WHEN the specialist re-submits the apply form
- THEN the application MUST reactivate to `PENDING` (per Apply to Gig)
- AND the gig detail MUST no longer show the «Вы отозвали отклик» signal, presenting the applied/«На рассмотрении» state instead

### Requirement: Specialist Dashboard Archived-Card Status Labels
The specialist dashboard («Мои гиги») Archive tab MUST label each terminal application state truthfully rather than collapsing all terminal states into a single «Отклонён» badge. A withdrawn application MUST NOT read as rejected.

#### Scenario: Withdrawn application reads «Отозвано»
- GIVEN a SPECIALIST has an application with status `WITHDRAWN`
- WHEN the specialist dashboard archived card renders
- THEN the card status MUST read «Отозвано»
- AND it MUST NOT read «Отклонён»

#### Scenario: Finally-withdrawn application reads «Отозвано (окончательно)»
- GIVEN a SPECIALIST has an application with status `WITHDRAWN_FINAL`
- WHEN the specialist dashboard archived card renders
- THEN the card status MUST read «Отозвано (окончательно)»
- AND it MUST NOT read «Отклонён»

#### Scenario: Rejected application still reads «Отклонён»
- GIVEN a SPECIALIST has an application with status `REJECTED`
- WHEN the specialist dashboard archived card renders
- THEN the card status MUST read «Отклонён» (red tone), unchanged from prior behaviour

#### Scenario: All terminal states remain in the Archive tab
- GIVEN a SPECIALIST has archived applications in mixed terminal states (`REJECTED`, `WITHDRAWN`, `WITHDRAWN_FINAL`)
- WHEN the dashboard renders
- THEN every such application MUST still appear under the Archive tab (no card is dropped)
- AND each MUST carry its own truthful status label per the scenarios above

---

<!-- Merged on archive from change: gig-deadline-and-milestones (2026-06-15). Source delta retained in openspec/archive/gig-deadline-and-milestones/specs/gig/spec.md -->

### Requirement: Gig Deadline and Stage-Count Fields
The `Gig` model MUST gain `deadlineDays` (Int, default 0) and `stageCount` (Int, default 1), additively, fulfilling
the GigCard/GigHeader deadline + "[N этап]" contract.

#### Scenario: Fields exist with backward-compatible defaults
- GIVEN the schema
- WHEN the `Gig` model is inspected
- THEN it MUST have `deadlineDays Int @default(0)` (0 = unspecified) and `stageCount Int @default(1)`
- AND only these columns are added (no existing column changed); `npx prisma generate` MUST be run

#### Scenario: Fields match the contract types
- GIVEN `GigCardVM.deadlineDays: number` and the "[N этап]" stage count
- WHEN a gig is read
- THEN `gig.deadlineDays` MUST be a number (assignable to `GigCardVM['deadlineDays']`) and `gig.stageCount` MUST be a
  positive integer (the stage count)

**Acceptance Criteria:**
- `Gig.deadlineDays Int @default(0)` + `Gig.stageCount Int @default(1)`; additive; client regenerated
- Field types match the contract (`deadlineDays` → number; `stageCount` → the "[N этап]" count)

---

### Requirement: Create Inputs for Deadline and Stages
`createGig` MUST accept optional, validated `deadlineDays` and `stageCount` inputs and persist them; absent inputs
MUST fall back to the defaults.

#### Scenario: createGig accepts valid deadline and stage count
- GIVEN an authenticated client calling `createGig`
- WHEN `deadlineDays` (a positive integer ≤ 365) and/or `stageCount` (an integer 1–50) are supplied
- THEN the created gig MUST persist those values

#### Scenario: createGig rejects invalid values
- GIVEN `createGig`
- WHEN `deadlineDays` is non-positive / non-integer / > 365, or `stageCount` is < 1 / non-integer / > 50
- THEN it MUST be rejected with a clear error and the gig MUST NOT be created

#### Scenario: Inputs are optional (backward-compatible)
- GIVEN `createGig` called without `deadlineDays`/`stageCount` (the existing behaviour)
- WHEN the gig is created
- THEN it MUST succeed unchanged with `deadlineDays = 0` and `stageCount = 1` (the defaults)

**Acceptance Criteria:**
- `createGig` accepts + validates optional `deadlineDays` (1–365) and `stageCount` (1–50); persists them
- Absent → defaults (0 / 1); invalid → error; existing callers/tests unaffected

---

### Requirement: Gig Deadline and Stages — Backward-Compatible Defaults and Verification
Legacy gigs MUST remain graceful under the new fields, and the change MUST be additive with the suite green.

#### Scenario: Legacy gigs are graceful
- GIVEN a gig created without the new fields (e.g. directly, or before this change)
- WHEN it is read
- THEN `deadlineDays` MUST be `0` and `stageCount` MUST be `1` (the defaults), and the gig MUST remain queryable with
  no error — Phase-2 GigCard renders `deadlineDays = 0` gracefully (omit/"—")

#### Scenario: Seed assigns the fields idempotently
- GIVEN `prisma/seed.ts`
- WHEN it runs (or re-runs)
- THEN it MUST assign realistic `deadlineDays`/`stageCount` to seeded gigs without duplicating on re-run

#### Scenario: Additive — suite green, no UI change
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with no change to other fields/flows (incl. the `gig-creation` tests), and `npm run
  lint:tokens` + `npm run lint:composition` MUST stay green (no UI change)

**Acceptance Criteria:**
- Legacy/no-input gigs default to `0` / `1` and stay queryable; seed assigns idempotently
- `npm run build` + `npm run test:unit` green; additive; no UI changes

### Requirement: Application Proposed-Terms Fields
The `Application` model MUST carry `proposedBudget` (Int?, kopecks) and `proposedDeadlineDays` (Int?), additively,
fulfilling the specialist side ("Предложено") of the `TermsTabs` contract (`docs/DESIGN_SYSTEM_SPEC.md` §5).

#### Scenario: Fields exist as optional (backward-compatible)
- GIVEN the schema
- WHEN the `Application` model is inspected
- THEN it MUST have `proposedBudget Int?` and `proposedDeadlineDays Int?` (both nullable — `null` = no counter)
- AND only these columns are added; existing applications migrate to `null`; `npx prisma generate` MUST be run

#### Scenario: Proposed budget is stored in kopecks
- GIVEN `Gig.budget` is stored in kopecks
- WHEN `proposedBudget` is persisted
- THEN it MUST be stored in the same unit (kopecks), so it can be assigned to `Gig.budget` directly on accept

**Acceptance Criteria:**
- `Application.proposedBudget Int?` + `proposedDeadlineDays Int?`; additive; existing rows → `null`; `proposedBudget` in kopecks

### Requirement: Apply With Proposed Terms
`applyToGig` MUST accept optional, validated `proposedBudget` and `proposedDeadlineDays` inputs and persist them;
absent inputs MUST fall back to `null`.

#### Scenario: applyToGig persists valid proposed terms
- GIVEN an authenticated specialist applying to an OPEN gig
- WHEN `proposedBudget` (a positive number of roubles) and/or `proposedDeadlineDays` (a whole number 1–365) are supplied
- THEN the created application MUST persist `proposedBudget` (converted roubles → kopecks) and/or `proposedDeadlineDays`

#### Scenario: applyToGig rejects invalid proposed terms
- GIVEN `applyToGig`
- WHEN `proposedBudget` is non-positive / non-numeric, or `proposedDeadlineDays` is < 1 / non-integer / > 365
- THEN it MUST be rejected with a clear error and no application created

#### Scenario: Proposed terms are optional (backward-compatible)
- GIVEN `applyToGig` called without proposed terms (the existing behaviour)
- WHEN the application is created
- THEN it MUST succeed unchanged with `proposedBudget = null` and `proposedDeadlineDays = null`; the existing
  approach/questions/effort validation is unchanged

**Acceptance Criteria:**
- `applyToGig` accepts + validates optional `proposedBudget` (positive → kopecks) and `proposedDeadlineDays` (1–365)
- Absent → `null`; invalid → error; existing application callers/tests unaffected

### Requirement: TermsTabs View-Model Helper (both tabs)
`lib/terms.ts` MUST expose `getTermsTabs(applicationId)` returning the `TermsTabsVM` shape with **both** tabs
populated, server-only and contract-typed.

#### Scenario: Both tabs are returned with Бюджет and Срок rows
- GIVEN an application on a gig
- WHEN `getTermsTabs(applicationId)` is called
- THEN it MUST return `{ proposed, client }` where `client` = `[{ label: 'Бюджет', value: «gig.budget formatted ₽» },
  { label: 'Срок', value: 'N дней' }]` and `proposed` = the same two rows using `proposedBudget ?? gig.budget` and
  `proposedDeadlineDays ?? gig.deadlineDays`
- AND the result MUST be assignable to `TermsTabsVM` (types imported `import type` — no runtime UI coupling)

#### Scenario: An un-countered application shows the client's terms on both tabs
- GIVEN an application with `proposedBudget = null` and `proposedDeadlineDays = null`
- WHEN `getTermsTabs` is called
- THEN `proposed` MUST equal `client` (the fallback) — never an empty array

#### Scenario: A counter is reflected on the proposed tab
- GIVEN an application whose `proposedBudget`/`proposedDeadlineDays` differ from the gig's
- WHEN `getTermsTabs` is called
- THEN the `proposed` rows MUST reflect the proposed values and the `client` rows MUST reflect the gig's values

**Acceptance Criteria:**
- `getTermsTabs` returns both tabs (Бюджет + Срок) in the `TermsTabsVM` shape; `proposed` falls back to client terms when not countered
- Server-only; `TermsTabsVM`/`TermRow` imported `import type`

### Requirement: Accept Application Reconciles Proposed Terms
`acceptApplication` MUST reconcile the accepted application's proposed terms onto the gig within its existing
transaction, while preserving every existing behaviour.

#### Scenario: Accepting an application with proposed terms updates the gig
- GIVEN a client accepting a PENDING application that has `proposedBudget` and/or `proposedDeadlineDays`
- WHEN `acceptApplication` runs
- THEN the gig MUST be updated with `budget = proposedBudget` (and `serviceFee`/`totalAmount` recalculated at 17.5% via
  `serviceFeeKopecks(budget)`) and/or `deadlineDays = proposedDeadlineDays`
- AND the gig MUST still transition `OPEN → IN_PROGRESS`, assign the specialist, auto-reject other PENDING
  applications, and send notifications (unchanged)

#### Scenario: Accepting an application with no proposed terms leaves the gig terms unchanged
- GIVEN a client accepting an application with `proposedBudget = null` and `proposedDeadlineDays = null`
- WHEN `acceptApplication` runs
- THEN the gig's `budget`/`serviceFee`/`totalAmount`/`deadlineDays` MUST be unchanged, and the accept MUST behave
  exactly as before

#### Scenario: The lifecycle transitions and reject are preserved
- GIVEN the change
- WHEN the gig lifecycle (`OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID`) and `rejectApplication` are exercised
- THEN they MUST be unchanged — only the accept step additionally reconciles proposed terms

**Acceptance Criteria:**
- `acceptApplication` reconciles proposed terms onto the gig within its transaction (budget/fee/total and/or deadline)
- No-proposal accept leaves gig terms unchanged; status transition, assignment, auto-reject, notifications, and `rejectApplication` preserved

### Requirement: Proposed-Terms Seed and Additive Verification
Sample proposals MUST be seeded idempotently, and the change MUST be additive with the suite green.

#### Scenario: Seed sets sample proposed terms idempotently
- GIVEN `prisma/seed.ts`
- WHEN it runs (or re-runs)
- THEN it MUST set `proposedBudget`/`proposedDeadlineDays` on a few seeded PENDING applications without duplicating on
  re-run (only when still `null`)

#### Scenario: Additive — suite green, no UI change
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass with no change to other fields/flows (incl. the `gig-creation`/`gig-lifecycle`/application
  tests), and `npm run lint:tokens` + `npm run lint:composition` MUST stay green (no UI change)

**Acceptance Criteria:**
- Seed sets sample proposals idempotently; no `resetTestDatabase` change needed (no new table)
- `npm run build` + `npm run test:unit` green; additive; no UI changes

<!-- Merged on archive from change: fix-terms-negotiation (2026-07-14). Source delta retained in openspec/archive/fix-terms-negotiation/specs/gig/spec.md.
     Additive requirements wiring the already-persisted specialist counter-terms into the UI/VM (apply-form inputs,
     client visibility, per-viewer tabs, lifecycle integrity + re-apply pre-fill). No model/schema change. -->

### Requirement: Apply Form Proposed-Terms Inputs
The gig-detail apply form MUST let a SPECIALIST optionally propose their own budget and deadline, wired to the existing `applyToGig` `proposedBudget`/`proposedDeadlineDays` fields. Both inputs are optional; leaving them empty MUST submit no counter (the gig's terms stand). Client-side validation MUST mirror the server rules so a valid form is not rejected after submit.

#### Scenario: Apply form renders optional budget and deadline inputs
- GIVEN a SPECIALIST viewing an OPEN, non-example gig they can apply to
- WHEN the apply form renders
- THEN it MUST include an optional budget input (roubles) and an optional deadline input (days), labelled as the specialist's own proposed terms
- AND both MUST be clearly marked optional (empty = accept the gig's terms)

#### Scenario: Submitting a counter persists proposed terms
- GIVEN a SPECIALIST fills a valid approach and questions AND enters a budget of `120000` ₽ and a deadline of `21` days
- WHEN they submit the apply form
- THEN the created application MUST persist `proposedBudget = 12000000` (kopecks) and `proposedDeadlineDays = 21`
- AND the action MUST redirect to the gig detail

#### Scenario: Empty proposed terms submit no counter
- GIVEN a SPECIALIST submits a valid application leaving both proposed-terms inputs empty
- WHEN the application is created
- THEN `proposedBudget` and `proposedDeadlineDays` MUST be `null` (no counter) and the gig's terms MUST be unchanged

#### Scenario: Invalid proposed terms are surfaced before/at submit
- GIVEN a SPECIALIST enters a non-positive budget OR a deadline outside 1–365
- WHEN they attempt to submit
- THEN the form MUST NOT create an application with those values
- AND the unmet rule MUST be communicated (client-side hint and/or the server error `Предложенный бюджет должен быть положительным числом в рублях.` / `Предложенный срок должен быть целым числом дней от 1 до 365.`)

### Requirement: Counter-Terms Visible to the Client
The client-facing applicants view MUST surface each applicant's proposed budget/deadline (when present) alongside the gig's own terms, so the client can see a counter before accepting. The applicant VM MUST expose the proposed values (or a null/absent marker) — it MUST NOT hide a counter the client is about to adopt.

#### Scenario: Applicant VM exposes proposed terms
- GIVEN an application with `proposedBudget` and/or `proposedDeadlineDays` set
- WHEN the applicants view-model (`ApplicantCardVM` via `getGigApplications`) is built
- THEN each applicant entry MUST carry the proposed budget (formatted ₽) and proposed deadline when present, and a clear "no counter" state when both are `null`

#### Scenario: The applicants screen shows the counter and the gig's terms
- GIVEN a CLIENT owner opens the applicants screen for a gig that has an applicant with a counter
- WHEN the applicant card renders
- THEN it MUST show the applicant's proposed budget/срок marked as their proposal, distinguishable from the gig's own budget/срок
- AND an applicant with no counter MUST NOT show a phantom or misleading proposed value

#### Scenario: Accepting an applicant with a counter adopts their terms
- GIVEN a CLIENT owner accepts an applicant whose `proposedBudget`/`proposedDeadlineDays` differ from the gig's
- WHEN `acceptApplication` runs
- THEN the gig's effective terms MUST update to the proposed values (budget + recomputed 17.5% `serviceFee`/`totalAmount`, and `deadlineDays`), consistent with the existing "Accept Application Reconciles Proposed Terms" requirement
- AND the gig detail MUST then display those adopted terms as the current terms

### Requirement: Gig-Detail Terms Tabs Reflect the Counter
The gig-detail terms panel MUST present the two-tab layout meaningfully per viewer. For a SPECIALIST, «Мои условия» MUST reflect **their own** terms — a submitted counter, or the counter they are currently composing in the apply form — distinctly from «Условия {компания}», and MUST show an explicit "not proposed" state rather than the gig's own figures when no counter exists. The «Условия {компания}» tab MUST remain the fixed, read-only reference (the gig's own budget/срок). For a CLIENT owner, the second («Мои условия») tab MUST be hidden — owners do not counter their own gig.

> History (apply-terms-lock, 2026-07-15): this requirement was previously satisfiable while the tab was useless. The
> old no-counter scenario only forbade showing identical numbers *"with no explanation"* — so the implementation
> rendered a note *and* filled «Мои условия» with the gig's own figures via a `?? gig.budget` view-model fallback,
> making the tab a character-for-character copy of «Условия {компания}» («убивает смысл вкладки», Round-3 #3). The
> escape hatch is closed below: an explanation does not license substituted figures.

#### Scenario: Specialist with a counter sees differing tabs
- GIVEN a SPECIALIST whose application has a counter (proposed budget/срок differ from the gig's)
- WHEN the gig detail renders
- THEN «Условия {компания}» MUST show the gig's budget/срок and «Мои условия» MUST show the proposed budget/срок
- AND switching tabs MUST visibly change the displayed values (not a no-op)

#### Scenario: Without a counter, «Мои условия» MUST NOT display the client's figures
- GIVEN a SPECIALIST who has not proposed terms (has not applied, or applied without a counter)
- WHEN they open «Мои условия»
- THEN the budget/срок rows MUST render an explicit not-proposed state (e.g. «— не предложено»)
- AND they MUST NOT render the gig's own budget/срок values, which would make the tab indistinguishable from «Условия {компания}»
- AND an accompanying note MUST explain that the client's terms apply («действуют условия заказчика»)
- AND this MUST hold per field: proposing only a budget MUST show the proposed budget AND a not-proposed срок — a half-counter MUST NOT be completed with the gig's value

#### Scenario: The tab reflects terms being typed in the apply form
- GIVEN a SPECIALIST on an OPEN gig with the apply form visible
- WHEN they type a budget and/or срок into the «Мои условия» inputs of the apply form
- THEN the «Мои условия» tab MUST reflect those values immediately, before submission
- AND clearing an input MUST return that field to the not-proposed state
- AND an invalid value (budget ≤ 0, срок outside 1–365 or non-integer) MUST read as not-proposed rather than display a figure that could never be submitted
- AND this MUST NOT alter what is submitted: the values still reach `applyToGig` as the optional `proposedBudget`/`proposedDeadlineDays`, and empty still means "apply on the client's terms"
- AND once submitted (no apply form on screen) the tab MUST show the persisted counter

#### Scenario: The client tab stays a fixed reference
- GIVEN any SPECIALIST viewer, with or without a counter, typing or not
- WHEN «Условия {компания}» is selected
- THEN it MUST always show the gig's own budget/срок unchanged
- AND it MUST contain no inputs — it is a reference, not an editable copy

#### Scenario: Client owner does not see a redundant second tab
- GIVEN a CLIENT who owns the gig views the gig detail
- WHEN the terms panel renders
- THEN the «Мои условия» tab MUST NOT be shown; a single terms panel (the gig's current terms) MUST be presented
- AND no tab control that toggles between two identical panels MUST be rendered for the owner
- AND the owner path MUST never render the not-proposed state — it shows the gig's own terms

**Acceptance Criteria:**
- The gig-detail VM (`lib/view-models.ts`) builds the proposed-terms figures from the viewer's application **only** — no `?? gig.budget` / `?? gig.deadlineDays` fallback
- `ConditionsTermsVM.budget` / `.deadline` admit an absent state (`null`) so "not proposed" is representable rather than approximated
- The not-proposed string and the typed-counter derivation live in ONE client-safe module (`lib/terms-display.ts` — `NOT_PROPOSED`, `typedProposedTerm`), imported by the VM, the `ConditionsPanel` block, and the gig-detail screen. They MUST NOT be copied per call site: the gig-detail screen is a client component and cannot import the Prisma-bearing view-model module, which is exactly how three drifting copies appeared
- The apply form's proposed budget/срок state is owned by `GigDetail` (not `ApplyBlock`) so the terms panel can reflect in-progress input
- `applyToGig` is unchanged; the counter remains optional and empty still submits no counter
- The re-apply pre-fill specified in "Proposed Terms Across the Application Lifecycle" is **unchanged** — this requirement MUST NOT be read as licence to clear it

### Requirement: Proposed Terms Across the Application Lifecycle
Proposed terms MUST persist and overwrite correctly across the full application lifecycle and MUST NOT bleed between gigs or specialists. This complements `fix-application-lifecycle`: reactivation on re-apply overwrites the proposed terms with the new submission (or clears them when omitted).

#### Scenario: Withdrawal preserves the proposed terms on the row
- GIVEN a PENDING application with a counter that is withdrawn (reversible `WITHDRAWN`)
- WHEN the withdrawal completes
- THEN the row MUST retain its `proposedBudget`/`proposedDeadlineDays` (the row is preserved, not deleted)

#### Scenario: Re-apply overwrites the counter with the new submission
- GIVEN a `WITHDRAWN` application (with an old counter) that is re-applied via `applyToGig`
- WHEN the new submission includes different proposed terms
- THEN the reactivated (`PENDING`) row MUST reflect the NEW proposed terms
- AND WHEN the new submission omits proposed terms, the reactivated row's `proposedBudget`/`proposedDeadlineDays` MUST be `null` (the counter is cleared, not stale-retained)

#### Scenario: Proposed terms are scoped per application row
- GIVEN specialist A has a counter on gig X and specialist B applies to gig X, and specialist A also applies to gig Y
- WHEN their applications are read
- THEN each `(gig, specialist)` application's proposed terms MUST be independent — a counter on one MUST NOT appear on another gig or another specialist's application

#### Scenario: Reject/withdraw leave the gig's terms unchanged
- GIVEN a gig whose applicant has a counter
- WHEN that application is rejected, or withdrawn, or auto-rejected because another applicant was accepted
- THEN the gig's own terms MUST change ONLY as a result of the accepted application (per reconciliation) — a non-accepted counter MUST NOT alter the gig's terms

#### Scenario: The re-apply form is pre-filled with the preserved counter
- GIVEN a specialist reversibly withdrew (`WITHDRAWN`) an application that carried a counter, and the gig detail shows the re-apply form again
- WHEN the form renders
- THEN the budget/срок inputs MUST be pre-filled with the preserved counter (roubles/days) so the «Мои условия» tab and the form agree
- AND re-submitting without changing them MUST re-send the same counter (it MUST NOT be silently dropped to the client's terms)
- AND clearing an input and re-submitting MUST clear that side of the counter (an explicit, not accidental, action)

#### Scenario: Both sides reflect a withdrawal made on a specialist's own terms
- GIVEN a specialist applied with a counter and then withdrew (first, reversible)
- WHEN the client opens the applicants screen and the specialist opens the gig detail / their dashboard
- THEN the client MUST see the application as «Отозвано» with no accept/reject affordance (the counter may still be shown), the specialist's gig detail MUST offer the apply form again (re-apply allowed), and the withdrawn application MUST appear in the specialist's dashboard archive — with the one-free-withdrawal flag consumed so the next withdrawal is final

<!-- Merged on archive from change: gig-editing-with-notification (2026-07-14). Source delta retained in openspec/archive/gig-editing-with-notification/specs/gig/spec.md.
     Additive: a new owner-only `updateGig` action (edit an OPEN gig with create-parity validation + 17.5% fee recompute),
     a `gig_updated` notification fan-out to PENDING applicants on a material change, and the owner-only edit
     entry point/route. No schema change (all fields already exist on `Gig`); no lifecycle transition changed. -->

### Requirement: Update Gig Server Action
The system MUST provide an `updateGig` server action that lets the **owning CLIENT** edit an `OPEN` gig's fields with the **same server-authoritative validation gates as `createGig`** (via the shared `parseGigForm`), recomputing the fee when the budget changes. Editing is permitted **only while the gig is `OPEN`** (not `IN_PROGRESS`/`REVIEW`/`COMPLETED`/`PAID`, not `closedByAdmin`, not `isExample`). Because it shares `parseGigForm`, `updateGig` MUST enforce the same minimums as create (description ≥ 20 chars, required goal + deliverables, acceptanceCriteria ≥ 50 chars) — an edit MUST NOT be able to persist values that creation would reject.

#### Scenario: Successful update by the owner on an OPEN gig
- GIVEN an authenticated CLIENT who owns an `OPEN`, non-example, non-closed gig
- WHEN `updateGig` is called with a valid `gigId` and valid `title`, `description`, `acceptanceCriteria`, `budget` (roubles), and optional `goal`, `deliverables`, `constraints`, `deadlineDays`, `stageCount`, `category`, `tags`
- THEN the Gig record MUST be updated with those values, all text fields trimmed
- AND `budget` MUST be stored as kopecks (× 100), `serviceFee` recomputed as `serviceFeeKopecks(budget)` (17.5%), and `totalAmount` = `budget + serviceFee`
- AND the gig's `status`, `clientId`, `assignedSpecialistId`, and application set MUST be unchanged
- AND the action MUST `redirect('/gigs/{gigId}')`

#### Scenario: Editable fields mirror createGig
- GIVEN `updateGig`
- WHEN it persists an edit
- THEN the editable fields MUST be exactly: `title`, `description`, `goal`, `deliverables`, `constraints`, `acceptanceCriteria`, `budget`, `deadlineDays`, `stageCount`, `categorySlug`, `tags`
- AND no other Gig column (status, ownership, assignment, timestamps, `isExample`, `closedByAdmin`) MUST be writable through this action

#### Scenario: Non-CLIENT user attempts to edit
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `updateGig` is called
- THEN it MUST return `{ error: 'Редактировать гиги могут только заказчики.' }`
- AND no Gig record MUST be modified

#### Scenario: Unauthenticated user attempts to edit
- GIVEN no valid session
- WHEN `updateGig` is called
- THEN it MUST redirect to `/login`

#### Scenario: Non-owner CLIENT attempts to edit
- GIVEN an authenticated CLIENT who does NOT own the gig
- WHEN `updateGig` is called
- THEN it MUST return `{ error: 'Редактировать гиг может только заказчик, опубликовавший его.' }`
- AND no Gig record MUST be modified

#### Scenario: Editing a non-OPEN gig is rejected
- GIVEN a gig owned by the caller with status other than `OPEN` (e.g. `IN_PROGRESS`, `REVIEW`, `COMPLETED`, `PAID`)
- WHEN `updateGig` is called
- THEN it MUST return `{ error: 'Редактировать гиг можно только пока он открыт и специалист не назначен.' }`
- AND no Gig record MUST be modified

#### Scenario: Editing an admin-closed or example gig is rejected
- GIVEN a gig with `closedByAdmin = true` OR `isExample = true`
- WHEN `updateGig` is called by the owner
- THEN it MUST return a clear error and MUST NOT modify the gig

#### Scenario: Missing required fields
- GIVEN the owner submits an edit with empty `title`, `description`, or `acceptanceCriteria` (after trimming)
- WHEN `updateGig` is called
- THEN it MUST return `{ error: 'Заполните обязательные поля: название, описание и критерии приёмки.' }`
- AND no Gig record MUST be modified

#### Scenario: Acceptance criteria too short
- GIVEN the owner submits `acceptanceCriteria` shorter than 50 characters (after trimming)
- WHEN `updateGig` is called
- THEN it MUST return `{ error: 'Критерии приёмки должны быть не короче 50 символов. Опишите подробнее, что считается результатом.' }`
- AND no Gig record MUST be modified

#### Scenario: Edit cannot bypass the description minimum
- GIVEN the owner submits a `description` shorter than 20 characters (after trimming)
- WHEN `updateGig` is called
- THEN it MUST return the same description-minimum error as `createGig` (`'Описание должно быть не короче 20 символов...'`)
- AND no Gig record MUST be modified

#### Scenario: Edit cannot bypass required goal / deliverables
- GIVEN the owner submits an empty `goal` OR empty `deliverables` (after trimming)
- WHEN `updateGig` is called
- THEN it MUST return the same required-field error as `createGig` (`'Укажите цель гига...'` / `'Опишите ожидаемый результат...'`)
- AND no Gig record MUST be modified

#### Scenario: Invalid budget
- GIVEN the owner submits `budget` ≤ 0 or non-numeric
- WHEN `updateGig` is called
- THEN it MUST return the same budget error as `createGig` (`'Бюджет должен быть положительным числом в рублях...'`)
- AND no Gig record MUST be modified

#### Scenario: Invalid deadline, stage count, or category
- GIVEN the owner submits `deadlineDays` outside 1–365 (non-integer/out of range), OR `stageCount` outside 1–50, OR a `category` that is not one of the canonical slugs
- WHEN `updateGig` is called
- THEN it MUST be rejected with the same respective error message as `createGig`, and the gig MUST NOT be modified

#### Scenario: Gig not found
- GIVEN a `gigId` that does not exist
- WHEN `updateGig` is called
- THEN it MUST return `{ error: 'Этот гиг больше не существует или был удалён.' }`

#### Scenario: Whitespace-only / no-op save succeeds without changing stored values
- GIVEN the owner re-submits the form with values that, after trimming/normalization, equal the current stored values
- WHEN `updateGig` is called
- THEN it MUST succeed and redirect to `/gigs/{gigId}`
- AND the stored field values MUST be unchanged
- AND no applicant notification MUST be created (see "Notify Applicants on Material Gig Change")

**Acceptance Criteria:**
- `updateGig` is exported from `app/actions/gig.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- `formData` includes `gigId` (hidden) plus the editable fields matching the `createGig` form names
- Same validation as `createGig`: criteria ≥ 50 chars (trimmed), budget > 0, deadline 1–365, stages 1–50, valid category; all text trimmed; budget roubles → kopecks; fee = `serviceFeeKopecks(budget)` (17.5%)
- Owner + `OPEN` + non-closed + non-example guards enforced server-side (server-authoritative, not UI-only)
- On success: `redirect('/gigs/{gigId}')`; on failure: returns `{ error: string }`
- Shares a `parseGigForm` helper with `createGig` so create/edit validation cannot drift

---

### Requirement: Notify Applicants on Material Gig Change
After a successful `updateGig`, if the edit **materially changed** the gig, the system MUST create one notification per specialist with an active (`PENDING`) application to that gig, informing them the gig's terms were updated. The notification MUST NOT go to withdrawn, finally-withdrawn, or rejected applicants, nor to the editing owner. Notification creation MUST be fire-and-forget (a failure MUST NOT fail the save).

#### Scenario: Material change notifies every PENDING applicant
- GIVEN an `OPEN` gig with three applications: two `PENDING` and one `WITHDRAWN`
- WHEN the owner successfully edits a material field (e.g. `budget`, `deadlineDays`, or a scope field such as `deliverables`)
- THEN exactly one notification MUST be created for each of the two `PENDING` applicants
- AND the notification MUST have `type = 'STATUS_CHANGE'` and `eventType = 'gig_updated'` with `gigId` set to the edited gig
- AND no notification MUST be created for the `WITHDRAWN` applicant or for the owner

#### Scenario: Withdrawn, finally-withdrawn, and rejected applicants are excluded
- GIVEN an `OPEN` gig with applications in statuses `PENDING`, `REJECTED`, `WITHDRAWN`, and `WITHDRAWN_FINAL`
- WHEN the owner makes a material edit
- THEN only the `PENDING` applicant(s) MUST be notified
- AND `REJECTED`, `WITHDRAWN`, and `WITHDRAWN_FINAL` applicants MUST NOT be notified

#### Scenario: A no-op / whitespace-only save sends no notification
- GIVEN the owner saves the edit form without changing any stored field value (see the no-op `updateGig` scenario)
- WHEN `updateGig` completes
- THEN NO applicant notification MUST be created

#### Scenario: Material change is defined by a real change to a substantive field
- GIVEN the definition of "material change"
- WHEN `updateGig` decides whether to notify
- THEN a change MUST be considered material if any persisted editable field's stored value differs from its prior stored value (budget, deadlineDays, stageCount, category, tags, or any of the scope text fields title/description/goal/deliverables/constraints/acceptanceCriteria — compared after the same trim/normalization used for storage)
- AND if no stored field changed, the change MUST be treated as non-material (no fan-out)

#### Scenario: Notification failure does not fail the save
- GIVEN the notification fan-out throws (e.g. a DB error in `createNotificationsBulk`)
- WHEN `updateGig` runs
- THEN the gig edit MUST still be persisted and the action MUST still redirect to `/gigs/{gigId}`
- AND the error MUST be logged, not surfaced to the user as an edit failure

#### Scenario: Applicant notification renders as an update message
- GIVEN a `gig_updated` notification for a specialist
- WHEN the notifications dropdown renders it
- THEN it MUST display human-readable text indicating the gig's terms were updated (e.g. «Условия гига обновлены»), consistent with the existing notification display helper and the gig it links to

**Acceptance Criteria:**
- Fan-out uses `createNotificationsBulk` (one row per `PENDING` applicant) with `type: 'STATUS_CHANGE'`, `eventType: 'gig_updated'`
- Recipient set = applications with `status = 'PENDING'` on the edited gig; excludes `REJECTED`/`WITHDRAWN`/`WITHDRAWN_FINAL` and the owner
- Fan-out runs ONLY on a material change; a no-op save creates nothing
- Fire-and-forget: the fan-out (query + notify) is `try/catch`-wrapped in `updateGig` so a failure is logged and never fails the edit
- The notification display helper renders `gig_updated` with legible Russian text («Условия гига обновлены»), plus a `status-change` accent in the dashboard attention map

---

### Requirement: Gig Edit Entry Point and Owner-Only Route
The system MUST expose an obvious «Редактировать» control on the owner's gig detail while the gig is `OPEN`, and an owner-only edit page pre-filled with the gig's current values that submits to `updateGig`. Both the control and the route MUST be gated so only the owner of an `OPEN` gig can reach the form.

#### Scenario: Owner of an OPEN gig sees a clear Edit button
- GIVEN a CLIENT viewing the gig detail of an `OPEN`, non-closed, non-example gig they own
- WHEN the gig detail renders
- THEN it MUST show an obvious «Редактировать» button (a clear button affordance, not only a subtle pencil icon) that navigates to the gig's edit page

#### Scenario: Non-owners never see the Edit control
- GIVEN a viewer who is NOT the gig owner (a SPECIALIST, or a different CLIENT)
- WHEN they view the gig detail
- THEN the «Редактировать» control MUST NOT be shown

#### Scenario: Edit control hidden once the gig leaves OPEN
- GIVEN the owner views their gig once it is `IN_PROGRESS`, `REVIEW`, `COMPLETED`, `PAID`, admin-closed, or an example gig
- WHEN the gig detail renders
- THEN the «Редактировать» control MUST NOT be shown

#### Scenario: Edit page is pre-filled with current values
- GIVEN the owner opens the edit page for their `OPEN` gig
- WHEN the form renders
- THEN every editable field MUST be pre-filled from the gig's stored values
- AND `acceptanceCriteria` MUST be split back into its individual criteria (from the stored `\n`-joined string) and `tags` split from the stored comma-separated string, so the chip UIs match the create form

#### Scenario: Edit route is guarded server-side
- GIVEN a request to `/gigs/[id]/edit`
- WHEN the viewer is not authenticated, is not the owner, or the gig is not `OPEN` (or is closed/example)
- THEN the page MUST NOT render the editable form (redirect to `/login` when unauthenticated, otherwise redirect back to the gig detail) — the guard MUST NOT rely on the UI hiding the button alone

#### Scenario: Saving returns to the gig detail with the correction visible
- GIVEN the owner fixes a field (e.g. the «Результаты»/deliverables typo) and saves
- WHEN `updateGig` succeeds
- THEN the user MUST land on `/gigs/{gigId}` and the corrected field MUST render with its new value

**Acceptance Criteria:**
- «Редактировать» button on the owner gig-detail rails, shown iff `data.isOwner && data.status === 'OPEN' && !closedByAdmin && !isExample`
- Edit page at `/gigs/[id]/edit`, owner+OPEN guarded server-side, reusing the `CreateGigDesign` structure pre-filled with current values (criteria/tags un-joined; a hidden `stageCount` preserves the current value the create form omits)
- Submits to `updateGig`; success returns to `/gigs/{gigId}`

---

### Requirement: Gig Editing — Additive Verification
The change MUST be additive (no schema change, no lifecycle change) with the suite and build green.

#### Scenario: No schema or lifecycle change
- GIVEN the change
- WHEN the `Gig`/`Application` models and the `OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID` lifecycle are inspected
- THEN no column MUST be added or changed, and no lifecycle transition MUST be altered — only a new `updateGig` action, a notification `eventType`, and the edit UI/route are added

#### Scenario: Suite and build stay green
- GIVEN the change
- WHEN `npm run build` and `npm run test:unit` run
- THEN they MUST pass, with existing `gig-creation`/`gig-lifecycle`/application/notification tests unaffected

**Acceptance Criteria:**
- Additive: no migration; existing tests unchanged and green
- `npm run build` green (`/gigs/[id]/edit` in output); `gig-editing` integration + E2E green
