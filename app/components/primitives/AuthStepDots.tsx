import { cx } from "./tokens";

interface AuthStepDotsProps {
  /** Total number of steps. */
  count: number;
  /** 0-based index of the current step. */
  current: number;
  className?: string;
}

/**
 * AuthStepDots primitive (DESIGN_SYSTEM_SPEC §3.1) — the Figma auth `counter` (3179:3997): a row of dots
 * where the active step is larger + brand-coloured and the rest are smaller + dimmed. The authoritative auth
 * step indicator (distinct from the labelled `StepIndicator`). Token-pure.
 */
export function AuthStepDots({ count, current, className }: AuthStepDotsProps) {
  return (
    <div
      className={cx("flex items-center justify-center gap-1", className)}
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={count}
      aria-label={`Шаг ${current + 1} из ${count}`}
    >
      {Array.from({ length: count }).map((_, i) =>
        i === current ? (
          <span key={i} className="h-2 w-2 rounded-circular bg-brand-default" />
        ) : (
          <span key={i} className="h-1.5 w-1.5 rounded-circular bg-text-subtle opacity-disabled" />
        ),
      )}
    </div>
  );
}
