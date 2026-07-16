/**
 * Client-side persistence for the in-progress «Создать гиг» brief.
 *
 * The whole form lives in React state, so any navigation away — viewing «Примеры», an accidental reload, a mobile
 * tab-switch — would otherwise silently discard a half-written gig. We mirror the fields into sessionStorage on every
 * change and restore them on mount; a successful publish clears the draft (on the success screen).
 *
 * sessionStorage (not localStorage) on purpose: the draft is scoped to the current tab/session and must NOT resurface
 * on a fresh visit days later. Every access is guarded (SSR has no `sessionStorage`; privacy mode / sandboxed iframes
 * can throw) so the form always works even when persistence is unavailable.
 */

export const CREATE_GIG_DRAFT_KEY = "gigly:create-gig-draft:v1";

export interface GigDraft {
  title: string;
  category: string;
  description: string;
  goal: string;
  deliverables: string;
  constraints: string;
  budget: string;
  deadline: string;
  tags: string[];
  criteria: string[];
}

const STRING_FIELDS = [
  "title",
  "category",
  "description",
  "goal",
  "deliverables",
  "constraints",
  "budget",
  "deadline",
] as const;

function store(): Storage | null {
  try {
    return typeof sessionStorage !== "undefined" ? sessionStorage : null;
  } catch {
    return null; // access can throw in privacy mode / sandboxed contexts
  }
}

const isStr = (v: unknown): v is string => typeof v === "string";

/** Restore a previously saved draft, tolerant of a missing / corrupt / partially-shaped payload (returns null then). */
export function loadDraft(): Partial<GigDraft> | null {
  const s = store();
  if (!s) return null;
  try {
    const raw = s.getItem(CREATE_GIG_DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Record<string, unknown>;
    if (!d || typeof d !== "object") return null;
    const out: Partial<GigDraft> = {};
    for (const k of STRING_FIELDS) {
      if (isStr(d[k])) out[k] = d[k] as string;
    }
    if (Array.isArray(d.tags)) out.tags = (d.tags as unknown[]).filter(isStr) as string[];
    if (Array.isArray(d.criteria)) out.criteria = (d.criteria as unknown[]).filter(isStr) as string[];
    return out;
  } catch {
    return null; // corrupt JSON — treat as no draft
  }
}

/** Persist the current brief. No-op (never throws) when storage is unavailable or full. */
export function saveDraft(draft: GigDraft): void {
  const s = store();
  if (!s) return;
  try {
    s.setItem(CREATE_GIG_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* quota exceeded / disabled — non-fatal; the form still works in-memory */
  }
}

/** Discard the saved draft (called once a gig is successfully published). */
export function clearDraft(): void {
  const s = store();
  if (!s) return;
  try {
    s.removeItem(CREATE_GIG_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
