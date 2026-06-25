# Testing Specification Delta

## REMOVED Requirements

### Requirement: Breadcrumb Navigation E2E Coverage

**Reason for removal:** Breadcrumbs were removed in the `gigly_full_design` reground — the shell header (`AppShellDesign`) now supplies the page title, so there is no `nav[aria-label="Breadcrumb"]` to assert. The spec (`__tests__/e2e/breadcrumb-navigation.spec.ts`) additionally imports `loginAsSpecialist` / `loginAsClient` / `loginAsAdmin` from `../helpers/auth`, which were never defined (the helper exports only `createTestSession` and `setE2ESession`), making the file an unresolved import that fails collection of the entire suite. The feature is gone by design and is **not** replaced.

The platform previously SHALL have verified, end-to-end, that a breadcrumb trail rendered on gig-detail, profile, and admin pages with correct links, `aria-current`, keyboard access, and responsive collapse.

#### Scenario: Breadcrumb trail renders and navigates

**Given** an authenticated user on a gig-detail, profile, or admin sub-page
**When** the page loads
**Then** a `nav[aria-label="Breadcrumb"]` SHALL be visible with linked ancestors and an `aria-current="page"` leaf

> Removed: breadcrumbs no longer exist; the shell header owns the page title. No replacement spec.

---

### Requirement: Back Button Navigation E2E Coverage

**Reason for removal:** The kit `BackButton` («← Back to …», driven by a `?from=` query param) was removed in the reground; screens that need "back" now ship their own inline link (e.g. gig-detail «← Назад к гигам», applications «← Назад к проекту»). The spec (`__tests__/e2e/back-button-navigation.spec.ts`) also drives legacy routes that no longer exist (`/dashboard/profile`, `/dashboard/profile/[id]`, `/dashboard/gigs`, `/dashboard/gigs/examples?from=…`). The feature is gone by design and is **not** replaced; per-screen inline "back" links are covered by reconciliation changes #3 (gig-detail) and #7 (applications).

The platform previously SHALL have verified, end-to-end, that a `← Back to …` button appeared on detail/edit pages when reached with a `?from=` param, navigated to the origin, preserved browse filters, and was absent without the param.

#### Scenario: Back button appears and returns to origin

**Given** a user navigates to a detail/edit page with a `?from=<origin>` query param
**When** the page loads
**Then** a `← Back to <origin>` link SHALL be visible and SHALL return to the origin route on click

> Removed: the kit BackButton and its `?from=` routes were deleted; inline per-screen "back" links replace it and are tested by changes #3 and #7.

---

### Requirement: Legacy App Shell (shell-cutover) E2E Coverage

**Reason for removal:** The old `AppShell` + role-based `SidebarNav` + `Topbar` were replaced wholesale by `AppShellDesign` in the reground. The spec (`__tests__/e2e/shell-cutover.spec.ts`) asserts the old shell contract (sidebar label set, no-"Поиск"-for-CLIENT, kit logout form). The shell contract is gone by design; the rebuilt `AppShellDesign` shell, sidebar, and logout are covered by the per-screen REWRITE changes (#3–#14, e.g. dashboards #4) — **not** replaced here.

The platform previously SHALL have verified, end-to-end, that the protected layout rendered the kit `AppShell` with a role-based RU `SidebarNav` (Дашборд/Мои гиги/Чаты/Финансы/Споры, +Поиск for SPECIALIST), a `Topbar`, working logout, and an unauthenticated→`/login` guard.

#### Scenario: Protected layout renders the kit AppShell

**Given** an authenticated CLIENT or SPECIALIST on `/dashboard`
**When** the page loads
**Then** the kit `AppShell` SHALL render the role-based RU `SidebarNav` and `Topbar` with a working logout

> Removed: the kit AppShell/SidebarNav/Topbar were replaced by `AppShellDesign`; the new shell is tested by changes #3–#14. The unauthenticated→`/login` redirect remains covered by `auth-session.spec.ts` (PASS-AS-IS).
