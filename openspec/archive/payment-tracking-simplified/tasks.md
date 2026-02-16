# Payment Tracking (Simplified) - Implementation Tasks

## Task Checklist

### 1. Update Prisma Schema
**Description:** Add `paidAt` field to the Gig model.

**Implementation:**
- Open `prisma/schema.prisma`
- Add `paidAt DateTime?` field to the Gig model (nullable, no default)
- Run `npx prisma format` to validate syntax

**Test Plan:**
```bash
npx prisma format
npx prisma validate
```
- ASSERT: No errors
- ASSERT: Gig model includes `paidAt DateTime?`

---

### 2. Create and Apply Migration
**Description:** Generate and apply a database migration for the new field.

**Implementation:**
- Run `npx prisma migrate dev --name add-gig-paid-at`
- Verify migration file is created in `prisma/migrations/`
- Check that existing gigs have `paidAt = null`

**Test Plan:**
```bash
npx prisma migrate dev --name add-gig-paid-at
npx prisma studio
```
- ASSERT: Migration file created
- ASSERT: SQLite database updated
- ASSERT: Existing Gig records have `paidAt = null`
- ASSERT: Gig table has `paidAt` column

---

### 3. Implement markAsPaid Server Action
**Description:** Create server action to mark COMPLETED gigs as PAID.

**Implementation:**
- Open `app/actions/gig.ts`
- Add `markAsPaid` function with `'use server'` directive
- Signature: `async (prevState: { error?: string } | null, formData: FormData)`
- Extract `gigId` from formData
- Get session, validate CLIENT role
- Query gig with `clientId` check
- Validate gig exists, user is owner, status is COMPLETED
- Update gig: `{ status: 'PAID', paidAt: new Date() }`
- Redirect to `/dashboard/gigs/${gigId}` on success
- Return `{ error: string }` on failure

**Validation Logic:**
- No session → redirect to `/login`
- Role !== CLIENT → `{ error: 'Only clients can mark gigs as paid.' }`
- Gig not found → `{ error: 'Gig not found.' }`
- User is not owner → `{ error: 'Only the gig owner can mark this gig as paid.' }`
- Status !== COMPLETED → `{ error: 'Only completed gigs can be marked as paid.' }`
- Status === PAID → `{ error: 'This gig has already been marked as paid.' }`

**Test Plan:**
Create test script `scripts/test-mark-as-paid.ts`:
```typescript
// 1. Create CLIENT and SPECIALIST users
// 2. Create gig (CLIENT)
// 3. Create application (SPECIALIST)
// 4. Accept application (CLIENT)
// 5. Submit work (SPECIALIST)
// 6. Approve work (CLIENT) → status = COMPLETED
// 7. Call markAsPaid (simulate formData)
// 8. Assert gig status = PAID
// 9. Assert paidAt is set
// 10. Try marking as paid again → assert error
// 11. Try marking as paid with wrong user → assert error
```

Run: `npx tsx scripts/test-mark-as-paid.ts`
- ASSERT: Gig transitions COMPLETED → PAID
- ASSERT: paidAt is set to current timestamp
- ASSERT: Idempotency check works (already paid error)
- ASSERT: Authorization checks work (non-owner, non-CLIENT)

---

### 4. Create MarkAsPaidButton Client Component
**Description:** Create a client component for the "Mark as Paid" button with loading state.

**Implementation:**
- Create `app/components/MarkAsPaidButton.tsx`
- Mark as `'use client'`
- Accept props: `gigId: string`
- Use `useActionState` with `markAsPaid` action
- Use `useFormStatus` for pending state
- Render form with hidden `gigId` field
- Show "Mark as Paid" button (or "Marking as Paid..." when pending)
- Display error message if `state?.error` exists

**Test Plan:**
- Visual inspection in browser
- ASSERT: Button renders
- ASSERT: Clicking button shows loading state
- ASSERT: Error messages display inline

---

### 5. Update Gig Detail Page
**Description:** Add payment status display and "Mark as Paid" button to gig detail page.

**Implementation:**
- Open `app/dashboard/gigs/[id]/page.tsx`
- Ensure gig query includes `paidAt` field
- Add status badge logic:
  - PAID → "Paid" badge (green)
  - COMPLETED → "Completed - Awaiting Payment" badge (yellow)
- For PAID gigs: display payment date formatted as `paidAt.toLocaleDateString()`
- For COMPLETED gigs owned by CLIENT: render `<MarkAsPaidButton gigId={gig.id} />`
- Ensure button only shows for CLIENT owner on COMPLETED gigs

**Conditional Rendering:**
```typescript
{gig.status === 'PAID' && (
  <p>Payment confirmed on {gig.paidAt?.toLocaleDateString()}</p>
)}

{gig.status === 'COMPLETED' && session.userId === gig.clientId && session.role === 'CLIENT' && (
  <MarkAsPaidButton gigId={gig.id} />
)}
```

**Test Plan:**
Manual testing in browser:
1. Login as CLIENT
2. Navigate to a COMPLETED gig you own
3. ASSERT: "Mark as Paid" button is visible
4. Click button
5. ASSERT: Gig status updates to "Paid"
6. ASSERT: Payment date is displayed
7. ASSERT: Button disappears
8. Navigate to a PAID gig
9. ASSERT: Payment date is shown
10. ASSERT: No "Mark as Paid" button
11. Login as SPECIALIST
12. Navigate to assigned COMPLETED gig
13. ASSERT: No "Mark as Paid" button (not owner)

---

### 6. Update Client Dashboard
**Description:** Display payment status in "My Gigs" list on CLIENT dashboard.

**Implementation:**
- Open `app/dashboard/page.tsx`
- Ensure gigs query includes `paidAt` field
- Update gig list rendering to show status:
  - PAID → "Paid on [date]" (green text or badge)
  - COMPLETED → "Completed - Awaiting Payment" (yellow text or badge)
  - Other statuses → existing display logic

**Test Plan:**
Manual testing in browser:
1. Login as CLIENT
2. Navigate to `/dashboard`
3. ASSERT: COMPLETED gigs show "Completed - Awaiting Payment"
4. ASSERT: PAID gigs show "Paid on [date]"
5. ASSERT: Payment dates are formatted correctly

---

### 7. Update Specialist Dashboard
**Description:** Display payment status in "My Applications" list on SPECIALIST dashboard.

**Implementation:**
- Open `app/dashboard/page.tsx` (SPECIALIST section)
- Ensure applications query includes `gig: { select: { ..., paidAt: true } }`
- Update application list rendering to show gig status:
  - PAID → "Paid on [date]"
  - COMPLETED → "Completed - Awaiting Payment"
  - Other statuses → existing display logic

**Test Plan:**
Manual testing in browser:
1. Login as SPECIALIST
2. Navigate to `/dashboard`
3. ASSERT: Applications for COMPLETED gigs show "Completed - Awaiting Payment"
4. ASSERT: Applications for PAID gigs show "Paid on [date]"
5. ASSERT: Payment dates are formatted correctly

---

### 8. End-to-End Integration Test
**Description:** Test the complete payment flow from gig creation to payment marking.

**Test Plan:**
Manual E2E test:
1. Register as CLIENT
2. Create a new gig
3. Register as SPECIALIST (different browser/incognito)
4. Apply to the gig
5. Switch to CLIENT, accept application
6. Switch to SPECIALIST, submit work
7. Switch to CLIENT, approve work
8. ASSERT: Gig status is COMPLETED
9. ASSERT: "Mark as Paid" button is visible
10. Click "Mark as Paid"
11. ASSERT: Gig status updates to PAID
12. ASSERT: Payment date is displayed
13. ASSERT: Button disappears
14. Switch to SPECIALIST
15. ASSERT: Dashboard shows "Paid on [date]"
16. Navigate to gig detail
17. ASSERT: Payment confirmation message is visible

Optional: Create automated test script `scripts/test-payment-flow-e2e.ts` that simulates the full flow programmatically.

---

## Summary

After completing all tasks:
- Gig model has `paidAt` field
- `markAsPaid` server action is implemented with full validation
- UI displays payment status on gig detail and dashboards
- CLIENT owners can mark COMPLETED gigs as paid
- SPECIALIST users can see payment status
- Full gig lifecycle: OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID
