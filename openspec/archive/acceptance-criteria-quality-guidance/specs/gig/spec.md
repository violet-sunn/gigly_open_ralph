# Gig Specification Changes

## ADDED Requirements

None.

## MODIFIED Requirements

None.

## REMOVED Requirements

None.

---

## Notes

This change introduces **client-side soft validation only**. No changes are required to server-side validation logic or the `createGig` server action.

The existing hard validation (minimum 50 characters for acceptanceCriteria) remains unchanged and continues to be enforced server-side. The quality guidance warning (150 character threshold) is purely a UX enhancement that does not affect backend behavior or data validation.

**Rationale**: Soft validation is designed to encourage better input without enforcing it. Keeping this client-side only:
- Maintains simplicity (no new backend logic)
- Preserves user autonomy (users can still submit brief criteria if they choose)
- Allows easy threshold adjustment without backend changes
- Aligns with "Clarity Through Structure (Not Bureaucracy)" principle
