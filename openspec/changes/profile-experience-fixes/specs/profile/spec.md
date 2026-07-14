# Profile Specification — Delta: profile-experience-fixes

## ADDED Requirements

### Requirement: Unmistakable Edit Affordance (pencil means edit, not save)
The profile screen's per-block edit controls MUST clearly signal **edit**, open an edit surface, and
persist changes ONLY through an explicit Save action. Clicking a *displayed* field MUST NOT itself
save or mutate data. Edit controls MUST be shown to the owner only.

#### Scenario: Pencil opens edit mode and does not save
- GIVEN an owner viewing their own profile
- WHEN they activate a block's edit (pencil) control
- THEN an edit modal for that block MUST open with the current values pre-filled
- AND no data MUST be written by the act of opening (no save occurs on click)

#### Scenario: Explicit Save persists
- GIVEN an open edit modal with modified values
- WHEN the owner activates the modal's «Сохранить» button
- THEN `updateProfile` (or the relevant action) MUST persist the change
- AND on success the modal MUST close and the profile MUST reflect the new values

#### Scenario: Closing without Save discards
- GIVEN an open edit modal with modified values
- WHEN the owner dismisses the modal (✕ / overlay) without pressing Save
- THEN no change MUST be persisted and the displayed values MUST be unchanged

#### Scenario: The edit affordance is unambiguous
- GIVEN the pencil edit control
- WHEN it is inspected
- THEN it MUST carry an accessible label and `title` conveying "Редактировать" (edit), so it is not
  mistaken for a save control, and it MUST present a pointer/hover affordance

**Acceptance Criteria:**
- Every owner edit control opens a modal (does not save on click); the modal's explicit «Сохранить» is
  the only persist path; dismissing discards
- Edit controls render for `isOwner` only and expose an "edit" `aria-label`/`title`

### Requirement: Obvious Client-Profile Edit Entry Point
The CLIENT profile MUST present a clear, labeled «Редактировать» control (not only a bare pencil) as
the entry point to edit company data, aligning the CLIENT and SPECIALIST edit affordances.

#### Scenario: Client owner sees an obvious edit button
- GIVEN a CLIENT owner viewing their own profile
- WHEN the profile renders
- THEN a visibly labeled «Редактировать» control MUST be present as the edit entry point
- AND activating it MUST open the company requisites edit modal (companyName / inn / kpp / about)

#### Scenario: Non-owner sees no edit control
- GIVEN a viewer who is not the profile owner
- WHEN a CLIENT profile renders
- THEN no «Редактировать» control and no edit pencils MUST be shown

#### Scenario: Both roles' edit affordances are aligned
- GIVEN the SPECIALIST and CLIENT profiles
- WHEN each renders for its owner
- THEN both MUST expose a clearly labeled edit affordance (not a bare unlabeled icon) as the entry to
  editing profile data

**Acceptance Criteria:**
- CLIENT profile shows a labeled «Редактировать» button opening the requisites modal (owner-only)
- SPECIALIST and CLIENT edit entry points are consistent (labeled, obvious); non-owners see none

### Requirement: Experience Level Is Settable and Displayed
The SPECIALIST profile MUST expose `experienceLevel` (Middle / Senior) as an explicit selector in an
edit surface and MUST display the chosen level on the profile alongside Стек / Опыт.

#### Scenario: Level selector appears in the edit modal
- GIVEN a SPECIALIST owner opening the relevant profile edit modal
- WHEN the modal renders
- THEN it MUST offer an explicit Middle / Senior selector pre-set to the current `experienceLevel`

#### Scenario: Level persists via updateProfile
- GIVEN the level selector set to MIDDLE or SENIOR
- WHEN the owner saves
- THEN `updateProfile` MUST persist `experienceLevel` (its existing MIDDLE/SENIOR-or-empty validation
  unchanged) and the profile MUST reflect it

#### Scenario: Level is displayed on the profile
- GIVEN a SPECIALIST profile with a non-empty `experienceLevel`
- WHEN the profile renders
- THEN the level MUST be shown explicitly (a labeled field/badge), not only as a `roleTag` fallback

#### Scenario: Empty level is graceful
- GIVEN a SPECIALIST profile with `experienceLevel === ""`
- WHEN the profile renders
- THEN it MUST render without error and MUST NOT display a misleading level

**Acceptance Criteria:**
- A Middle/Senior selector is present in a specialist edit modal, pre-filled, persisted via
  `updateProfile` (no server-action contract change)
- The chosen level is displayed explicitly on the profile; empty level renders gracefully

### Requirement: Real Online Indicator via lastSeenAt Heartbeat
The system MUST derive a real online indicator from a last-seen timestamp updated by a lightweight
authenticated heartbeat, gated by the target user's `showOnlineStatus`, and the profile UI MUST render
that real state rather than a hardcoded value. The mechanism MUST be self-hosted (no third-party
service).

#### Scenario: User carries a nullable last-seen timestamp
- GIVEN the schema
- WHEN the `User` model is inspected
- THEN it MUST have `lastSeenAt DateTime?` (nullable, no default) — additive and backward-compatible
  (existing rows read as `null`)

#### Scenario: Heartbeat updates lastSeenAt for the authenticated user
- GIVEN an authenticated user
- WHEN the `heartbeat` server action is invoked
- THEN it MUST set that user's `lastSeenAt` to the current time
- AND an unauthenticated invocation MUST be a no-op (no write; not an error page)

#### Scenario: getProfile computes a real online state
- GIVEN a target user with `showOnlineStatus === true` and `lastSeenAt` within the online window
  (5 minutes)
- WHEN `getProfile` builds the header
- THEN `header.online` MUST be `true`
- AND a target whose `lastSeenAt` is null or older than the window MUST yield `header.online === false`

#### Scenario: showOnlineStatus off forces offline
- GIVEN a target user with `showOnlineStatus === false`
- WHEN `getProfile` builds the header
- THEN `header.online` MUST be `false` regardless of `lastSeenAt` (shown offline to all viewers)

#### Scenario: An active user is no longer shown as offline
- GIVEN an authenticated user whose client has recently sent a heartbeat and who has
  `showOnlineStatus === true`
- WHEN they view their own profile
- THEN the profile MUST show the online state (not the previously hardcoded «offline»)

#### Scenario: The profile UI renders the real online state
- GIVEN `header.online`
- WHEN `ProfileDesign` renders the status pill
- THEN the pill's dot colour and label MUST be driven by `header.online` (online vs offline), replacing
  the hardcoded offline markup

**Acceptance Criteria:**
- `User.lastSeenAt DateTime?` added (additive `db push`, no data migration)
- `heartbeat` server action (authenticated-only; unauthenticated = no-op) touches `lastSeenAt`; a
  shell-mounted client ping fires it on an interval (~60s)
- `getProfile` sets `header.online = showOnlineStatus && lastSeenAt && (now − lastSeenAt) < 5min`
  (both SPECIALIST and CLIENT branches; the hardcoded `online:false` is removed)
- `ProfileDesign` renders the pill from `header.online` (hardcoded offline markup removed)
- No third-party/paid dependency is added
