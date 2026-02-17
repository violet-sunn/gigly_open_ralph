# Gig Specification Delta

## MODIFIED Requirements

### Requirement: Apply to Gig Server Action
The system MUST prevent applications to example gigs.

#### Scenario: Applying to example gig is rejected
- GIVEN an authenticated user with role "SPECIALIST"
- AND a gig with `isExample = true`
- WHEN `applyToGig` is called with the example gig's ID
- THEN it MUST return `{ error: 'This is an example gig for demonstration purposes. You cannot apply to example gigs.' }`
- AND no Application record MUST be created

#### Scenario: Applying to real gig works normally
- GIVEN an authenticated user with role "SPECIALIST"
- AND a gig with `isExample = false`
- WHEN `applyToGig` is called with valid data
- THEN the application MUST be created normally (existing behavior)

**Acceptance Criteria:**
- `applyToGig` action queries gig with `isExample` field
- If `gig.isExample === true`, return error before any other validation
- Error message clearly explains this is an example gig
- All existing validation and behavior remains unchanged for real gigs
- Test: attempting to apply to example gig returns appropriate error
