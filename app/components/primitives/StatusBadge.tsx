import type { ReactNode } from "react";
import { STATUS_BG, STATUS_TEXT, cx, type Status } from "./tokens";

interface StatusBadgeProps {
  /** pill (126×40 form) | inline-dot (8 dot + label) | current ("Текущий" badge). */
  variant?: "pill" | "inline-dot" | "current";
  status?: Status;
  children?: ReactNode;
  className?: string;
}

/**
 * StatusBadge / Dot primitive (DESIGN_SYSTEM_SPEC §3.1) — the 6 gig statuses.
 * variant: pill (size/control, radius/pill) | inline-dot (8 circular dot, per-status colour) |
 * current ("Текущий", brand-tinted). The dot is a token-styled circle (radius/circular + status/*,
 * the faithful synthesized dot, §6) — token-pure, all 6 colours.
 */
export function StatusBadge({ variant = "pill", status = "open", children, className }: StatusBadgeProps) {
  if (variant === "current") {
    return (
      <span
        className={cx(
          "inline-flex h-control items-center rounded-pill bg-tint-brand px-4 text-label font-label text-brand-default",
          className,
        )}
      >
        {children ?? "Текущий"}
      </span>
    );
  }

  const dot = <span className={cx("h-2 w-2 shrink-0 rounded-circular", STATUS_BG[status])} aria-hidden="true" />;

  if (variant === "inline-dot") {
    return (
      <span className={cx("inline-flex items-center gap-2 text-label font-label text-strong", className)}>
        {dot}
        {children}
      </span>
    );
  }

  // pill
  return (
    <span
      className={cx(
        "inline-flex h-control items-center gap-2 rounded-pill bg-surface-level-2 px-4 text-label font-label",
        STATUS_TEXT[status],
        className,
      )}
    >
      {dot}
      {children}
    </span>
  );
}
