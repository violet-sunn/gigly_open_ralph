// Shared design helpers for screens/components rebuilt on the gigly_full_design prototype's own code.
// Ports the prototype's avatarColor() + the STATUS/CAT colour maps (Gigly App.dc.html) + the verify seal.

import type { GigCardVM } from "@/app/components/blocks/view-models";

// Apply the shared header filter chips (category / minBudget+maxBudget range / minRating / sort) to an already-loaded
// feed, client-side. Used by the dashboard & my-gigs feeds so the header chips filter those screens too (the browse
// screen filters server-side instead). Budget/rating read the numeric VM fields (budgetValue / rating.value).
export function applyGigFilters<T extends GigCardVM>(cards: T[], params: URLSearchParams | null): T[] {
  if (!params) return cards;
  const category = params.get("category") ?? "";
  const minBudget = Number(params.get("minBudget") ?? "") || 0;
  const maxBudget = Number(params.get("maxBudget") ?? "") || 0;
  const minRating = Number(params.get("minRating") ?? "") || 0;
  const sort = params.get("sort") ?? "newest";
  let out = cards.filter((g) => {
    if (category && g.category !== category) return false;
    const b = g.budgetValue ?? 0;
    if (minBudget && b < minBudget) return false;
    if (maxBudget && b > maxBudget) return false;
    if (minRating && (g.rating?.value ?? 0) < minRating) return false;
    return true;
  });
  if (sort === "budget-desc") out = [...out].sort((a, b) => (b.budgetValue ?? 0) - (a.budgetValue ?? 0));
  else if (sort === "budget-asc") out = [...out].sort((a, b) => (a.budgetValue ?? 0) - (b.budgetValue ?? 0));
  return out;
}

export function avatarColor(name: string): string {
  const colors = ["#e23744", "#f59e0b", "#22c55e", "#06b6d4", "#8b5cf6", "#0088ff", "#ec4899"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return colors[h % colors.length];
}

// Stack/tag colour — the prototype hand-assigned a brand colour per tech (Python blue, Parsing red, …). User stacks
// are free text with no colour metadata, so hash each tag into the design accent palette for stable, multi-coloured
// chips (rgba(<rgb>,0.12) fill, matching profile.specialist tpl216). Returns an "r,g,b" triple.
const TAG_PALETTE = ["0,136,255", "255,45,85", "0,195,208", "52,199,89", "255,149,0"];
export function tagRgb(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return TAG_PALETTE[h % TAG_PALETTE.length];
}

// Status tone → rgb (the prototype STATUS map) + RU label.
export const STATUS_RGB: Record<string, string> = {
  open: "255,255,255",
  review: "245,158,11",
  "in-progress": "59,130,246",
  verification: "139,92,246",
  completed: "16,185,129",
  rejected: "239,68,68",
};
export const STATUS_LABEL_RU: Record<string, string> = {
  open: "Открыт",
  review: "На рассмотрении",
  "in-progress": "В работе",
  verification: "На проверке",
  completed: "Завершён",
  rejected: "Отклонён",
};

// Dispute status → RU label. Disputes reuse the design Status (OPEN→open, RESOLVED→completed, REJECTED→rejected) but
// read differently from gigs: a resolved dispute is «Решён», not «Завершён» (disputes.* reference).
export const DISPUTE_LABEL_RU: Record<string, string> = {
  open: "Открыт",
  completed: "Решён",
  rejected: "Отклонён",
};
export const disputeLabel = (status: string): string =>
  DISPUTE_LABEL_RU[status] ?? STATUS_LABEL_RU[status] ?? status;

// Category slug → rgb (the prototype CAT map) + RU label.
export const CAT_RGB: Record<string, string> = {
  marketing: "0,136,255",
  design: "255,45,85",
  programming: "52,199,89",
  development: "0,195,208",
  coding: "255,141,40",
};
export const CAT_LABEL: Record<string, string> = {
  marketing: "Маркетинг",
  design: "Дизайн",
  programming: "Программирование",
  development: "Разработка",
  coding: "Кодинг",
};

// The prototype's verify seal (IconBootstrapOutlineLogosPatch → Bootstrap patch-check-fill), tinted by parent colour.
export function PatchIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
    </svg>
  );
}
