/**
 * ui-primitives token maps — primitive prop value -> a STATIC canonical-token Tailwind class.
 *
 * Mirrors app/components/layout/scale.ts: Tailwind's JIT only emits utilities it can see as
 * literal strings, so primitives map their variant/state/size props through these fixed lookup
 * tables instead of building class names dynamically (`bg-${variant}` would never be generated).
 * Every value here is a canonical design token (brand/*, surface/*, text/*, border/*, status/*,
 * category/*, space/*, radius/*, type/*, size/*) — NO raw hex/px. See docs/DESIGN_SYSTEM_SPEC.md §2/§3.1.
 *
 * NOTE: the canonical spacing scale is {0,1,2,3,4,5,6,8,10,12} + size tokens (control/icon/
 * icon-rail/avatar-sm/avatar-lg) — utilities may only use those steps.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// ---- shared typed unions (the system's vocabulary) ----------------------
export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ControlSize = "md";
export type InputState = "default" | "focus" | "filled" | "disabled" | "error";
export type Status = "open" | "review" | "in-progress" | "verification" | "completed" | "rejected";
export type Category = "marketing" | "design" | "programming" | "development" | "coding";
export type AvatarSize = "sm" | "lg";
export type View = "grid" | "list";

// ---- Button (variant × state) -------------------------------------------
/** Base: standard control geometry (size/control = 40h, radius/md); disabled via opacity token. */
export const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 h-control rounded-md px-4 text-label font-label transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default " +
  "disabled:opacity-disabled disabled:pointer-events-none";

export const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-brand-default text-inverse hover:bg-brand-hover active:bg-brand-pressed",
  secondary: "bg-surface-level-2 text-strong border border-border hover:bg-surface-level-3 active:bg-surface-level-3",
  ghost: "bg-transparent text-strong hover:bg-surface-level-2 active:bg-surface-level-3",
  link: "bg-transparent text-brand-default underline hover:text-brand-hover active:text-brand-pressed",
};

// ---- Input family (shared base, no horizontal padding so callers control insets) ----
export const INPUT_BASE =
  "h-control w-full rounded-md border bg-surface-level-2 text-body font-body text-strong placeholder:text-muted " +
  "focus-visible:border-brand-default focus-visible:ring-2 focus-visible:ring-brand-default focus-visible:outline-none";

export const INPUT_STATE: Record<InputState, string> = {
  default: "border-border",
  focus: "border-brand-default ring-2 ring-brand-default",
  filled: "border-border",
  disabled: "border-border opacity-disabled",
  error: "border-status-rejected",
};

// ---- Status (the 6 gig statuses) ----------------------------------------
export const STATUS_BG: Record<Status, string> = {
  open: "bg-status-open",
  review: "bg-status-review",
  "in-progress": "bg-status-in-progress",
  verification: "bg-status-verification",
  completed: "bg-status-completed",
  rejected: "bg-status-rejected",
};

export const STATUS_TEXT: Record<Status, string> = {
  open: "text-status-open",
  review: "text-status-review",
  "in-progress": "text-status-in-progress",
  verification: "text-status-verification",
  completed: "text-status-completed",
  rejected: "text-status-rejected",
};

// ---- Category (the 5 categories) ----------------------------------------
export const CATEGORY_BG: Record<Category, string> = {
  marketing: "bg-category-marketing",
  design: "bg-category-design",
  programming: "bg-category-programming",
  development: "bg-category-development",
  coding: "bg-category-coding",
};

/** Left-accent border colour for CategoryTag. */
export const CATEGORY_BORDER: Record<Category, string> = {
  marketing: "border-category-marketing",
  design: "border-category-design",
  programming: "border-category-programming",
  development: "border-category-development",
  coding: "border-category-coding",
};

/** Tech-tag colour-variant set = the 5 category colours (filled tags, white text on fill). */
export const TAG_BG: Record<Category, string> = CATEGORY_BG;

// ---- Avatar sizes (size/avatar-*) ---------------------------------------
export const AVATAR_SIZE: Record<AvatarSize, string> = {
  sm: "h-avatar-sm w-avatar-sm",
  lg: "h-avatar-lg w-avatar-lg",
};

// ---- Exported-asset registry (F4 — real icons, never redrawn) -----------
// Every path points at an optimized SVG in public/assets/design-system/icons/.
// `eye` (password reveal) and `attach` (chat composer) are residuals — absent from the in-hand
// SVGs (docs/DESIGN_SPECS.md §7.5), routed to Figma, NOT redrawn here.
export const ICON = {
  search: "/assets/design-system/icons/search.svg",
  clear: "/assets/design-system/icons/clear.svg",
  grid: "/assets/design-system/icons/grid.svg",
  list: "/assets/design-system/icons/list.svg",
  "view-toggle": "/assets/design-system/icons/view-toggle.svg",
  star: "/assets/design-system/icons/star.svg",
  verified: "/assets/design-system/icons/verified.svg",
  "radio-off": "/assets/design-system/icons/radio-off.svg",
  "radio-on": "/assets/design-system/icons/radio-on.svg",
  "status-dot": "/assets/design-system/icons/status-dot.svg",
  collapse: "/assets/design-system/icons/collapse.svg",
  send: "/assets/design-system/icons/send.svg",
  filter: "/assets/design-system/icons/filter.svg",
  bell: "/assets/design-system/icons/bell.svg",
  gear: "/assets/design-system/icons/gear.svg",
  dashboard: "/assets/design-system/icons/dashboard.svg",
  chats: "/assets/design-system/icons/chats.svg",
  "my-gigs": "/assets/design-system/icons/my-gigs.svg",
  finances: "/assets/design-system/icons/finances.svg",
  disputes: "/assets/design-system/icons/disputes.svg",
} as const;

export type IconName = keyof typeof ICON;
