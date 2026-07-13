# UI — Dispute Flow (transport-disputes)

Spec deltas for reconciling the dispute screens to the captured prototype reference (`design-reference/screens/disputes.*`, `disputeNew.*`, `disputeDetail.*`, `disputeResolve.admin`). All requirements preserve the existing `page.tsx → view-model → *Design.tsx` wiring and the `app/actions/dispute.ts` actions.

## ADDED Requirements

### Requirement: Disputes list reconciled to captured reference

The `/disputes` list (`app/(protected)/disputes/DisputesDesign.tsx`) SHALL be a faithful structural transport of `design-reference/screens/disputes.specialist.html` and `disputes.company.html`. It SHALL render the «Споры» header and the moderator/frozen-funds intro notice verbatim, and one row card per dispute showing the gig title, reason, opener, a status pill, and the gig amount, with dynamic content bound to the dispute list view-model. Static UI copy and labels SHALL be transported verbatim; only dynamic fields SHALL be bound.

#### Scenario: Specialist views their disputes list

- **WHEN** a SPECIALIST opens `/disputes`
- **THEN** the screen matches `disputes.specialist.png` — the «Споры» header, the intro notice, and a row per dispute with gig · reason · opener · status pill · amount
- **AND** each status pill reflects the dispute status with the prototype's label («Открыт» / «На рассмотрении» / «Разрешён») and colour

#### Scenario: Company views disputes list and empty state

- **WHEN** a COMPANY user opens `/disputes` with no disputes
- **THEN** the transported empty state renders (no row cards, intro copy preserved)
- **AND** with disputes present, rows render as in `disputes.company.png`

### Requirement: New-dispute screen reconciled to captured reference

The `/disputes/new` screen (`app/(protected)/disputes/new/NewDisputeDesign.tsx`) SHALL be a faithful transport of `disputeNew.specialist.html` / `disputeNew.company.html`: the «ОТКРЫТЬ СПОР» header and guidance copy, the reason chips (verbatim, as captured: «Оплата не поступила», «Результат не соответствует ТЗ», «Заказчик не выходит на связь», «Исполнитель не выходит на связь», «Просрочен срок выполнения», «Другое»), the description field, and the «Открыть спор» submit wired to the existing `openDispute` action.

#### Scenario: Specialist opens a dispute via the reason chips

- **WHEN** a SPECIALIST selects a reason chip, enters a description, and submits
- **THEN** the reason chips render verbatim and the selected reason + description are passed to `openDispute`
- **AND** the existing validation and redirect behaviour of `openDispute` are unchanged

#### Scenario: Reason chip copy is verbatim

- **WHEN** the new-dispute screen renders for either role
- **THEN** the reason chips read exactly as captured («Оплата не поступила», «Результат не соответствует ТЗ», «Заказчик не выходит на связь», «Исполнитель не выходит на связь», «Просрочен срок выполнения», «Другое») — no reworded labels

### Requirement: Dispute detail (participant face) reconciled to captured reference

The participant face of `/disputes/[id]` (`DisputeDetailDesign.tsx` when not an admin-resolvable dispute) SHALL be a faithful transport of `disputeDetail.specialist.html` / `disputeDetail.company.html`: the header card (gig · reason · opener · status · gig amount), the resolution banner when resolved, the «Ход рассмотрения» timeline (party avatars, role labels/colours, moderator entries, timestamps), and the evidence chips. All values SHALL bind to the dispute detail view-model.

#### Scenario: Specialist views a dispute under review

- **WHEN** a SPECIALIST opens a dispute they are party to
- **THEN** the header card, timeline, and evidence chips match `disputeDetail.specialist.png`
- **AND** the back link returns to `/disputes`

#### Scenario: Resolved dispute shows the resolution banner

- **WHEN** a dispute has been resolved
- **THEN** the resolution banner renders with the moderator's resolution text and no resolve panel is shown

### Requirement: Admin resolve face folded into the detail route, reconciled to `disputeResolve.admin`

When an ADMIN opens an OPEN dispute at `/disputes/[id]`, `DisputeDetailDesign.tsx` SHALL render the resolve face reconciled to `design-reference/screens/disputeResolve.admin.html`: the detail header + «Ход рассмотрения» timeline (serving as the moderator audit log, including moderator-intervention entries) + the «Решение модератора» panel offering the three verdicts «В пользу специалиста», «В пользу заказчика», «Частичный возврат 50%», each submitting to the existing `resolveDispute` action with its `specialist` / `company` / `split_50` verdict. No separate admin resolve route SHALL be created.

#### Scenario: Admin resolves an open dispute in favour of the specialist

- **WHEN** an ADMIN opens an OPEN dispute and selects «В пользу специалиста»
- **THEN** the «Решение модератора» panel matches `disputeResolve.admin.png`
- **AND** the verdict submits to `resolveDispute` with `verdict=specialist`, transitioning the dispute to resolved

#### Scenario: All three verdicts are present and wired

- **WHEN** the admin resolve face renders for an OPEN dispute
- **THEN** all three verdict buttons render verbatim and each is wired to `resolveDispute` with the correct verdict key (`specialist` / `company` / `split_50`)

#### Scenario: Non-admin or non-open dispute hides the resolve panel

- **WHEN** a participant (non-admin) opens the dispute, or any user opens an already-resolved dispute
- **THEN** the «Решение модератора» panel is not rendered

### Requirement: Dispute flows remain green end-to-end

The open / view / resolve dispute flows SHALL continue to function after the transport, with no changes to `openDispute`, `resolveDispute`, or the `Dispute` data model. The existing dispute E2E suite SHALL pass, with selectors updated only where transported markup changed.

#### Scenario: Build and existing dispute E2E pass

- **WHEN** the project is built and the existing dispute E2E specs run
- **THEN** the build succeeds and the dispute E2E specs pass (open → view → resolve)
