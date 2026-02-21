# Change Proposal: CSRF Verification

## Change Name
`csrf-verification`

## Problem Statement

Cross-Site Request Forgery (CSRF) is a critical security vulnerability where an attacker tricks a user's browser into making unwanted requests to a web application where the user is authenticated. Without CSRF protection, malicious sites could submit forms or trigger actions on behalf of authenticated users without their knowledge.

Next.js 15 introduced built-in CSRF protection for Server Actions, but we need to:
1. **Verify** that this protection is actually enabled and functioning in our application
2. **Document** the CSRF protection status for security audits and team awareness
3. **Ensure** no configuration inadvertently disables this protection
4. **Establish** a testing baseline to detect if CSRF protection breaks in future updates

Currently, we have no explicit verification or documentation of CSRF protection, creating uncertainty about our security posture.

## Proposed Solution

This change focuses on **verification and documentation**, not implementation. We will:

1. **Research** Next.js 15's CSRF protection mechanism for Server Actions (Origin header matching)
2. **Verify** CSRF protection is active by:
   - Checking Next.js configuration for `serverActions.allowedOrigins` misconfigurations
   - Testing that Server Actions reject cross-origin requests (spoofed Origin header)
   - Confirming Origin matching works across all our Server Actions
3. **Document** findings in:
   - Security specification (`openspec/specs/security/spec.md`)
   - Project documentation (add CSRF section to security notes)
   - Code comments where relevant
4. **Create tests** using existing test infrastructure (Playwright E2E) that verify CSRF protection remains active

## Scope

### In Scope
- Research Next.js 15 CSRF protection mechanism
- Verify CSRF protection is enabled by default
- Test CSRF protection with actual Server Actions
- Document CSRF protection status and mechanism
- Add CSRF verification to security specification
- Create automated tests to detect CSRF protection failures

### Out of Scope
- Implementing custom CSRF protection (Next.js provides this)
- CSRF protection for non-Server Action endpoints (we only use Server Actions)
- CSRF protection for GET requests (not applicable)
- Third-party CSRF libraries (unnecessary with Next.js 15)

## Constraints

- **No Breaking Changes**: This is purely verification and documentation
- **Next.js 15 Dependency**: CSRF protection is a Next.js 15 feature; we must not downgrade
- **Server Actions Only**: Our application uses Server Actions exclusively for mutations, so we only need to verify protection for those
- **Testing Limitations**: CSRF tests may require special setup to simulate cross-origin requests

## Non-Goals

- Custom CSRF token implementation
- CSRF protection for API routes (we don't use them)
- CSRF protection for third-party integrations
- Session fixation protection (separate concern)

## Success Criteria

1. **Verification Complete**: We can demonstrate that CSRF protection is active
2. **Documentation Updated**: Security spec includes CSRF protection requirements and verification steps
3. **Tests Passing**: Automated tests verify CSRF protection works
4. **Team Awareness**: Developers understand how CSRF protection works in our app
5. **Audit Ready**: We can show auditors that CSRF protection is enabled and tested

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| CSRF protection not actually enabled | High | Thorough testing with cross-origin request simulation |
| Configuration change disables CSRF | Medium | Document configuration requirements, add tests |
| Future Next.js updates break CSRF | Medium | Automated tests will catch regressions |
| False sense of security | High | Test with real attack scenarios, not just documentation review |

## Dependencies

- Next.js 15+ (already in use)
- Existing testing infrastructure (Vitest for unit/integration, Playwright for E2E - already set up with 493+ passing tests)
- Understanding of Next.js Server Actions Origin-based CSRF protection

## Timeline Estimate

- Research: 1-2 hours
- Verification & Testing: 2-3 hours
- Documentation: 1-2 hours
- **Total**: 4-7 hours
