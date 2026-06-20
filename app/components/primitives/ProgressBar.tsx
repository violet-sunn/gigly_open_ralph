import { cx } from "./tokens";

interface ProgressBarProps {
  /** Progress value, 0–100. */
  value: number;
  /** Fill tone (reconcile-create-gig readiness meter). Default `brand`. */
  tone?: "brand" | "green" | "amber";
  className?: string;
  "aria-label"?: string;
}

const FILL_TONE: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  brand: "bg-brand-default",
  green: "bg-status-completed",
  amber: "bg-status-review",
};

/**
 * ProgressBar primitive (DESIGN_SYSTEM_SPEC §3.1) — track + fill, height space/1 = 4 (§5).
 * track text/subtle, fill brand/default (or a `tone`), radius/xs. Width is a percentage (no px literal).
 * Token-pure.
 */
export function ProgressBar({ value, tone = "brand", className, ...rest }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx("h-1 w-full overflow-hidden rounded-xs bg-text-subtle", className)}
      {...rest}
    >
      <div className={cx("h-full rounded-xs", FILL_TONE[tone])} style={{ width: `${clamped}%` }} />
    </div>
  );
}
