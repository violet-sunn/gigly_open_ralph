# Change Proposal: Multi-Page Navigation Architecture

## Problem Statement

The current application routes almost all authenticated functionality through a single `/dashboard` parent route. This creates several critical issues:

### 1. Backend Navigation Complexity
- All authenticated pages are nested under `/dashboard/*`, making it difficult to distinguish between functionally distinct areas
- URL structure doesn't reflect the application's domain model (gigs, applications, profiles are all "dashboard" children)
- Adding new features requires deep nesting (e.g., `/dashboard/gigs/[id]/messages` for future features)

### 2. Role-Based Access Control Difficulties
- Middleware uses a single broad matcher (`/dashboard/:path*`) that catches everything
- Role-based restrictions are implemented at the page level with redirects, not at the routing level
- No clear separation between CLIENT-only, SPECIALIST-only, and shared routes
- Difficult to audit which routes are accessible to which roles

### 3. Layout and Navigation Coupling
- Single `DashboardLayout` wraps all user types, limiting flexibility
- Navigation component (`DashboardNav`) must handle all role variations in one component
- Hard to customize layouts for different functional areas (e.g., admin vs. client vs. specialist)

### 4. Scalability Issues
- As the platform grows, the `/dashboard` namespace will become increasingly cluttered
- Difficult to implement feature-specific middleware (e.g., rate limiting on specific routes)
- URL structure doesn't support future multi-tenant or white-label scenarios

## Proposed Solution

Restructure the application to **un-nest functional areas** from `/dashboard/*` to top-level routes, while keeping `/dashboard` as the main authenticated hub.

### New Route Structure

```
/                          → Landing page (public)
/login                     → Login page (public)
/register                  → Registration page (public)

/dashboard                 → Role-based main dashboard (authenticated)
                             - Remains at same URL
                             - Includes application tabs for SPECIALIST

/gigs                      → Gig browsing (SPECIALIST only)
                             - Un-nested from /dashboard
/gigs/[id]                 → Gig detail (role-based access)
/gigs/new                  → Create gig (CLIENT only)
/gigs/examples             → Example gigs (all authenticated users)

/profile                   → Own profile view (all authenticated users)
                             - Un-nested from /dashboard
/profile/edit              → Edit own profile (all authenticated users)
/profile/[userId]          → Public profile view (all authenticated users)

/admin                     → Admin dashboard (ADMIN only)
/admin/users               → User management (ADMIN only)
/admin/gigs                → Gig management (ADMIN only)
```

### Key Improvements

1. **Clear URL Semantics**: URLs reflect domain concepts, not UI structure
2. **Granular Access Control**: Middleware can protect routes by functional area and role
3. **Simplified Layout Architecture**: Single shared layout using Next.js Route Groups eliminates duplication
4. **Better Scalability**: Easy to add new top-level areas without nesting
5. **Improved Developer Experience**: Easier to understand and navigate codebase

## Constraints

### Must Preserve
- All existing functionality must continue to work
- User sessions and authentication flow unchanged
- Database schema unchanged
- All existing tests must pass (after URL updates)

### Must Not Break
- Existing user bookmarks (implement redirects for old URLs)
- External links to gig details (if any)
- Email links (if any future email notifications reference URLs)

### Performance Requirements
- No performance degradation from routing changes
- Middleware execution time must remain minimal

## Non-Goals

This change does NOT include:
- Changes to authentication logic or session management
- Changes to database schema or data models
- New features or functionality (pure refactoring)
- Changes to UI components (except navigation)
- Changes to business logic or server actions

## Migration Strategy

### Phase 1: Create New Routes (Parallel)
- Create new route structure alongside existing `/dashboard` routes using Next.js Route Groups
- Implement single shared layout at `app/(protected)/layout.tsx`
- Update middleware with granular matchers

### Phase 2: Update Internal Links and Redirects
- Update all `<Link>` components to use new URLs for gigs and profile routes
- Update navigation components
- Implement redirects in `next.config.ts` for old nested URLs

### Phase 3: Update Test Suite
- Update all test URLs to new structure
- Verify all integration and E2E tests pass

### Phase 4: Cleanup and Documentation
- Delete old `app/dashboard/` directory
- Update project documentation with new route structure
- Clean up any unused imports or references

## Success Criteria

1. All authenticated routes are organized by functional area, not under `/dashboard`
2. Middleware uses granular matchers for each functional area
3. Role-based access control is enforced at the routing level
4. All existing functionality works identically
5. All tests pass with updated URLs
6. Old URLs redirect to new structure
7. No performance degradation

## Risks and Mitigations

### Risk: Breaking Existing Bookmarks
**Mitigation**: Implement permanent redirects from old nested URLs (`/dashboard/gigs/*`, `/dashboard/profile/*`) to new top-level URLs

### Risk: Test Suite Breakage
**Mitigation**: Update tests incrementally, verify each functional area

### Risk: Missed Internal Links
**Mitigation**: Use grep/search to find all hardcoded URLs, update systematically

### Risk: Third-Party Integrations
**Mitigation**: Document URL changes, maintain redirects indefinitely if needed

## Timeline Estimate

- **Phase 1**: 3-4 days (new routes with Route Groups, shared layout, middleware)
- **Phase 2**: 2 days (update internal links and implement redirects in next.config.ts)
- **Phase 3**: 2-3 days (update tests)
- **Phase 4**: 1 day (cleanup and documentation)

**Total**: 8-10 days of development work

## Open Questions

1. Should we add a redirect from `/home` to `/dashboard` for users who might expect that URL?
2. Should we implement a grace period for redirects, or make them permanent immediately?
3. How should we handle the "Browse Gigs" link in navigation for CLIENTs (currently shows but redirects)?
