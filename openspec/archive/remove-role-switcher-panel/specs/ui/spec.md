# UI Specification — delta for `remove-role-switcher-panel`

Spec delta for the app-shell sidebar. Removes the demo role-switcher affordance and pins the
invariant that the shell never presents a role selector to end users.

## REMOVED Requirements

### Requirement: Sidebar role-indicator panel
**Reason:** The three-segment «Специалист / Компания / Админ» panel is a demo artifact transported
from the design prototype (which showed all roles at once). In production a user's role is fixed by
their account, so a role selector — even a non-interactive one — is misleading and exposes the
internal role taxonomy for no benefit. It is deleted, not replaced.
**Migration:** None. The panel was non-interactive (highlight-only), so removal changes no behavior.
The user's role remains communicated by the profile card's role label (`profile.sub`) and by which
navigation items render (`buildSidebarNav`/`buildAdminNav`).

The sidebar profile area displayed a three-segment panel listing «Специалист», «Компания», and
«Админ», with the segment matching the current account's role visually highlighted.

## ADDED Requirements

### Requirement: The app shell MUST NOT present a role switcher or role-selector affordance
The authenticated app shell (`app/_design/AppShellDesign.tsx`) MUST NOT render any control that
lists the platform roles («Специалист» / «Компания» / «Админ») as selectable or role-preview
segments. A user's role is fixed by their account; the shell communicates it only through the
profile card's role label and the role-appropriate navigation.

#### Scenario: Specialist sees no role switcher
- GIVEN an authenticated user whose account role is `SPECIALIST`
- WHEN the app shell sidebar renders on any protected route
- THEN there MUST be no panel or control listing «Специалист / Компания / Админ» as segments
- AND the profile card MUST still show the avatar, name, role label, notification bell, and settings gear
- AND the specialist's navigation items and the derived page title MUST render and navigate correctly

#### Scenario: Client sees no role switcher
- GIVEN an authenticated user whose account role is `CLIENT`
- WHEN the app shell sidebar renders on any protected route
- THEN there MUST be no «Специалист / Компания / Админ» segment panel
- AND the profile card (avatar, name, role label, bell, gear) MUST remain intact
- AND the client's navigation items and page titles MUST be unaffected

#### Scenario: Admin sees no role switcher
- GIVEN an authenticated admin viewing the admin shell (`admin = true`)
- WHEN the app shell sidebar renders
- THEN there MUST be no «Специалист / Компания / Админ» segment panel
- AND the admin navigation (`buildAdminNav`) and admin page titles MUST render correctly

#### Scenario: No dead role-preview state remains
- GIVEN the app shell source after this change
- WHEN the repository is grepped under `app/`
- THEN there MUST be no `roleSegs`, no role-preview `activeRole` derivation feeding a switcher, and no three-role segment map
- AND the shell MUST compile and render for all three roles with no new console errors or warnings
