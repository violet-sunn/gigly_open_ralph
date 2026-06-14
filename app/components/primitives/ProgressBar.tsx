import { cx } from "./tokens";

interface ProgressBarProps {
  /** Progress value, 0–100. */
  value: number;
  className?: string;
  "aria-label"?: string;
}

/**
 * ProgressBar primitive (DESIGN_SYSTEM_SPEC §3.1) — track + fill, height space/1 = 4 (§5).
 * track text/subtle, fill brand/default, radius/xs. Width is a percentage (no px literal).
 * Token-pure.
 */
export function ProgressBar({ value, className, ...rest }: ProgressBarProps) {
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
      <div className="h-full rounded-xs bg-brand-default" style={{ width: `${clamped}%` }} />
    </div>
  );
}
