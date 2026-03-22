# Proposal: Auth Navigation Updates

## Context

The platform currently has a dedicated authentication landing page at `/auth` (implemented in change #21) that provides a unified entry point for authentication with role selection. However, the homepage still links directly to `/register`, bypassing this improved UX flow. This creates an inconsistent user journey where some paths lead to the auth landing page while others skip it entirely.

The Figma design (https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385) establishes `/auth` as the primary authentication entry point, with role selection happening before users proceed to login or registration.

## Problem Statement

1. **Inconsistent Entry Points**: Homepage links to `/register` instead of `/auth`, creating two different authentication flows
2. **Suboptimal UX**: Users coming from the homepage miss the role selection step and land directly on registration
3. **Internal Link Fragmentation**: Various parts of the application may link to `/login` or `/register` directly, bypassing the unified auth flow
4. **Backward Compatibility Risk**: Users with bookmarked `/login` or `/register` URLs should still be able to access those pages

## Proposed Solution

Update navigation and internal links to use `/auth` as the primary authentication entry point while preserving backward compatibility for direct access to `/login` and `/register`.

### Changes Required

1. **Homepage Update**: Change "Get Started" button from `/register` to `/auth`
2. **Middleware Verification**: Confirm `/auth` is accessible to unauthenticated users (already implemented)
3. **Internal Link Audit**: Update any internal links pointing to `/login` or `/register` to point to `/auth` instead
4. **Backward Compatibility**: Ensure direct access to `/login` and `/register` continues to work for bookmarked links
5. **Optional Soft Redirects**: Consider adding redirects from `/login` and `/register` to `/auth` for better UX (deferred to implementation decision)

## Constraints

- MUST preserve backward compatibility for direct `/login` and `/register` access
- MUST NOT break existing authentication functionality
- MUST maintain middleware route protection rules
- SHOULD provide a consistent authentication entry point across the application

## Non-Goals

- Redesigning the `/auth`, `/login`, or `/register` pages (already completed in change #32)
- Changing authentication logic or session management
- Adding new authentication methods or flows

## Success Criteria

1. Homepage links to `/auth` instead of `/register`
2. All internal application links use `/auth` as the authentication entry point
3. Direct access to `/login` and `/register` URLs continues to work
4. Middleware allows unauthenticated access to `/auth`
5. E2E tests verify the complete flow: homepage → `/auth` → role selection → login/register
6. No existing authentication functionality is broken
