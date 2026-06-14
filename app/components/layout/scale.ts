/**
 * Layout-grammar scale maps — prop value -> a STATIC canonical-token Tailwind class.
 *
 * Tailwind's JIT only emits utilities it can see as literal strings, so layout
 * primitives map their props through these fixed lookup tables instead of building
 * class names dynamically (`gap-${n}` would never be generated). Every value here is
 * a canonical design token (space/*, radius/*, surface/*) — no raw px.
 */

// Canonical spacing steps (design-tokens.json numbers.spacing): 0,1,2,3,4,5,6,8,10,12
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export const GAP: Record<Space, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

export const PAD: Record<Space, string> = {
  0: "p-0",
  1: "p-1",
  2: "p-2",
  3: "p-3",
  4: "p-4",
  5: "p-5",
  6: "p-6",
  8: "p-8",
  10: "p-10",
  12: "p-12",
};

export type SurfaceLevel = 0 | 1 | 2 | 3;
export const SURFACE: Record<SurfaceLevel, string> = {
  0: "bg-surface-level-0",
  1: "bg-surface-level-1",
  2: "bg-surface-level-2",
  3: "bg-surface-level-3",
};

export type Radius = "xs" | "sm" | "md" | "lg" | "xl" | "pill" | "circular";
export const RADIUS: Record<Radius, string> = {
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  pill: "rounded-pill",
  circular: "rounded-circular",
};

export type Columns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export const COLS: Record<Columns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

// Two-pane split ratios -> static arbitrary grid templates (literal => JIT-visible)
export type SplitRatio = "1:1" | "1:2" | "2:1" | "1:3" | "3:1";
export const SPLIT: Record<SplitRatio, string> = {
  "1:1": "grid-cols-[1fr_1fr]",
  "1:2": "grid-cols-[1fr_2fr]",
  "2:1": "grid-cols-[2fr_1fr]",
  "1:3": "grid-cols-[1fr_3fr]",
  "3:1": "grid-cols-[3fr_1fr]",
};

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
