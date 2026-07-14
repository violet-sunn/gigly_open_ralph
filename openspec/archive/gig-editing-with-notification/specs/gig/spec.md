# Gig Specification — Delta for gig-editing-with-notification

Additive: a new `updateGig` action (owner edits an OPEN gig, same validation as create), an applicant notification fan-out on material change, and the owner-only edit entry point/route. No schema change (all fields already exist on `Gig`). Reuses `createNotificationsBulk` and the `CreateGigDesign` structure.

## ADDED Requirements

### Requirement: Update Gig Server Action
The system MUST provide an `updateGig` server action that lets the **owning CLIENT** edit an `OPEN` gig's fields with the **same validation gates as `createGig`**, recomputing the fee when the budget changes. Editing is permitted **only while the gig is `OPEN`** (not `IN_PROGRESS`/`REVIEW`/`COMPLETED`/`PAID`, not `closedByAdmin`, not `isExample`).

#### Scenario: Successful update by the owner on an OPEN gig
- GIVEN an authenticated CLIENT who owns an `OPEN`, non-example, non-closed gig
- WHEN `updateGig` is called with a valid `gigId` and valid `title`, `description`, `acceptanceCriteria`, `budget` (roubles), and optional `goal`, `deliverables`, `constraints`, `deadlineDays`, `stageCount`, `category`, `tags`
- THEN the Gig record MUST be updated with those values, all text fields trimmed
- AND `budget` MUST be stored as kopecks (× 100), `serviceFee` recomputed as `Math.floor(budget × 0.10)`, and `totalAmount` = `budget + serviceFee`
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
- Same validation as `createGig`: criteria ≥ 50 chars (trimmed), budget > 0, deadline 1–365, stages 1–50, valid category; all text trimmed; budget roubles → kopecks; fee = `Math.floor(budget * 0.10)`
- Owner + `OPEN` + non-closed + non-example guards enforced server-side (server-authoritative, not UI-only)
- On success: `redirect('/gigs/{gigId}')`; on failure: returns `{ error: string }`

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
- Fire-and-forget: notification errors are logged and never fail the edit
- The notification display helper renders `gig_updated` with legible Russian text

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
- THEN the page MUST NOT render the editable form (redirect to `/login` when unauthenticated, otherwise redirect back to the gig detail or an error) — the guard MUST NOT rely on the UI hiding the button alone

#### Scenario: Saving returns to the gig detail with the correction visible
- GIVEN the owner fixes a field (e.g. the «Результаты»/deliverables typo) and saves
- WHEN `updateGig` succeeds
- THEN the user MUST land on `/gigs/{gigId}` and the corrected field MUST render with its new value

**Acceptance Criteria:**
- «Редактировать» button on the owner gig-detail rails, shown iff `data.isOwner && data.status === 'OPEN' && !closedByAdmin && !isExample`
- Edit page at `/gigs/[id]/edit`, owner+OPEN guarded server-side, reusing the `CreateGigDesign` structure pre-filled with current values (criteria/tags un-joined)
- Submits to `updateGig`; success returns to `/gigs/{gigId}`

---

### Requirement: Gig Editing — Additive Verification
The change MUST be additive (no schema change, no lifecycle change) with the suite and UI-lint gates green.

#### Scenario: No schema or lifecycle change
- GIVEN the change
- WHEN the `Gig`/`Application` models and the `OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID` lifecycle are inspected
- THEN no column MUST be added or changed, and no lifecycle transition MUST be altered — only a new `updateGig` action, a notification `eventType`, and the edit UI/route are added

#### Scenario: Suite and lint stay green
- GIVEN the change
- WHEN `npm run build`, `npm run test:unit`, `npm run lint:tokens`, and `npm run lint:composition` run
- THEN they MUST pass, with existing `gig-creation`/`gig-lifecycle`/application/notification tests unaffected

**Acceptance Criteria:**
- Additive: no migration; existing tests unchanged and green
- `npm run build` + `npm run test:unit` green; token/composition lint green
