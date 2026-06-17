import { cx } from "./tokens";

interface StepIndicatorProps {
  /** Ordered step labels. */
  steps: string[];
  /** 0-based index of the current step. */
  current: number;
  className?: string;
}

/**
 * StepIndicator primitive (DESIGN_SYSTEM_SPEC §3.1) — a labelled step wizard header: N numbered markers + labels with
 * the completed / current / upcoming state. Used by the onboarding wizard (compose-auth-onboarding). Token-pure
 * (brand fill for done/current, surface for upcoming; text-inverse on the filled marker).
 */
export function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <ol className={cx("flex items-center gap-3", className)} aria-label="Шаги регистрации">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "current" : "upcoming";
        const filled = state !== "upcoming";
        return (
          <li
            key={i}
            className="flex items-center gap-2 text-label font-label"
            aria-current={state === "current" ? "step" : undefined}
          >
            <span
              className={cx(
                "inline-flex h-6 w-6 items-center justify-center rounded-circular text-caption font-caption",
                filled ? "bg-brand-default text-inverse" : "bg-surface-level-2 text-muted",
              )}
            >
              {i + 1}
            </span>
            <span className={state === "current" ? "text-strong" : "text-muted"}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
