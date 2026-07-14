/**
 * Gig field minimums — the SINGLE numeric source of truth shared by the server validator
 * (`parseGigForm` in `app/actions/gig.ts`) and the create/edit form readiness UI
 * (`CreateGigDesign` / `EditGigDesign` / `character-counter`). The server enforces these;
 * the client mirrors them for live counters and "why disabled" guidance. Keep them here so the
 * two paths can never drift.
 */
export const GIG_DESCRIPTION_MIN = 20
export const GIG_CRITERIA_MIN = 50
export const GIG_DEADLINE_MIN = 1
export const GIG_DEADLINE_MAX = 365
export const GIG_STAGE_MIN = 1
export const GIG_STAGE_MAX = 50
