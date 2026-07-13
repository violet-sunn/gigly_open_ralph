# Tasks — transport-disputes

Reconcile the 4 dispute components against the 7 captured reference states. **Reconcile, don't rebuild.** Keep filenames and the `page.tsx → VM → component` wiring. Verify per Method §4 (faithful lift + screenshot beside the reference PNG + working flows).

## 0. Baseline

- [x] 0.1 Confirm the current dispute E2E baseline. `npm run build` passes; the dispute E2E specs (`compose-disputes`, `reconcile-disputes-flow`) pass **8/8** once the stale session-long dev server on :3000 (pid 38700) is killed so Playwright starts a fresh server with the test env — the initial run's 7 failures were all that environmental stale-server issue (every test redirected to login), **not** markup. Dispute integration tests (`disputes-flow`, `disputes-vm`) pass 17/17.
- [x] 0.2 Re-read the 7 captured references (PNG + HTML) and diff each against its live component. Findings: list + new-dispute already matched; the detail/resolve header was **missing the «Контрагент» (counterparty) field** and rendered the opener **name** where the reference shows the opener **role**.

## 1. Disputes list — `DisputesDesign.tsx` vs `disputes.{specialist,company}`

- [x] 1.1 Header «Споры» + count badge + moderator/frozen-funds intro notice — already verbatim, confirmed against reference.
- [x] 1.2 Row cards (avatar · gig · reason·opener·created · amount · status pill with «Открыт»/«На рассмотрении»/«Решён» + colour) — already match; dynamic fields bound to the list VM.
- [x] 1.3 Empty state + «Открыть спор» entry (from the gig page) — confirmed present.
  - Verified: `disputes.{specialist,company}` E2E (list + empty state) green.

## 2. New dispute — `new/NewDisputeDesign.tsx` vs `disputeNew.{specialist,company}`

- [x] 2.1 «ОТКРЫТЬ СПОР» header + amber guidance banner — verbatim (banner additionally binds the gig title, an acceptable dynamic enhancement).
- [x] 2.2 Reason chips — the component already renders all **six** captured chips verbatim («Оплата не поступила», «Результат не соответствует ТЗ», «Заказчик не выходит на связь», «Исполнитель не выходит на связь», «Просрочен срок выполнения», «Другое»). (Spec corrected from an earlier 4-chip undercount.) Description field matches.
- [x] 2.3 «Открыть спор» submit wired to `openDispute` — unchanged; verified by the open-from-gig E2E.

## 3. Dispute detail (participant face) — `DisputeDetailDesign.tsx` vs `disputeDetail.{specialist,company}`

- [x] 3.1 Header card: gig · reason · **opener role** (now shows «Специалист»/«Заказчик» via the existing ROLE map, matching the reference, falling back to the opener name) · status pill · **«Сумма по гигу» + «Контрагент»** (the counterparty field was added — see §5.1).
- [x] 3.2 «Ход рассмотрения» timeline (avatars, role labels/colours, moderator entries, timestamps) — already matched; confirmed.
- [x] 3.3 Evidence chips + back link → `/disputes` — confirmed; resolution banner shows only when resolved.
  - Verified: `reconcile-disputes-flow` "detail renders the timeline + evidence" E2E green.

## 4. Admin resolve face (folded into detail route) — `DisputeDetailDesign.tsx` `canResolve` branch vs `disputeResolve.admin`

- [x] 4.1 Admin-OPEN face: detail header + «Ход рассмотрения» timeline (the moderator **audit log**, incl. the moderator-intervention entry) + «Решение модератора» panel — all present; «Контрагент» now also surfaced in the header.
- [x] 4.2 The **3 verdict buttons** render verbatim («В пользу специалиста», «В пользу заказчика», «Частичный возврат 50%»), each wired to `resolveDispute` with the correct verdict key (`specialist`/`company`/`split_50`) — unchanged, **no new route**.
- [x] 4.3 Resolve panel hidden for non-admins and non-OPEN disputes — confirmed by the "read-only — no moderator panel" E2E.
  - Verified: `compose-disputes` admin-resolve + `reconcile-disputes-flow` verdict E2E green (status → «Завершён», resolution carries «В пользу …», moderator entry appended).

## 5. Data-gap check (additive only — Method §3)

- [x] 5.1 **«Контрагент» gap closed additively.** `lib/disputes.ts#getDisputeDetail` now includes the gig's client + assigned specialist and computes a viewer-relative counterparty (SPECIALIST → client company; CLIENT → assigned specialist; ADMIN/default → client/заказчик, matching the prototype's resolve view). Threaded viewer through `lib/view-models.ts#getDispute`; added optional `counterparty` to `DisputeDetailVM`; rendered the «Контрагент» column in `DisputeDetailDesign`.
- [x] 5.2 Participant reply composer left **out of scope** (no backend action exists) — kept omitted; parked as a known gap per the proposal.

## 6. Cleanup (optional) & verification

- [x] 6.1 `app/components/blocks/DisputeList.tsx` / `DisputeDetail.tsx` confirmed unreferenced **except** the `blocks/index.ts` barrel re-export — deletion is explicitly optional and would require editing the barrel for zero functional gain, so **left in place** (noted, not deleted).
- [x] 6.2 `npm run build` — passes (all dispute routes compile; exit 0).
- [x] 6.3 Dispute E2E suite — green 8/8 (after killing the stale :3000 server); no selector changes needed (markup labels unchanged; the additive «Контрагент» field introduced no test breakage).
- [x] 6.4 Human-in-the-loop: the 7 reference PNGs were reviewed against the implementation; the only divergences (missing «Контрагент», opener name-vs-role) were fixed. Open → view → resolve flows pass end-to-end via E2E. Final eyeball-beside-reference is the user's to approve.
