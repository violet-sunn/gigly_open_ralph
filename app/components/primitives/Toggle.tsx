import { cx } from "./tokens";

interface ToggleProps {
  /** On state. */
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * Toggle primitive — switch (DESIGN_SYSTEM_SPEC §3.1).
 * state: off | on | disabled. Track 40×24, knob 16, travel 16 — all canonical spacing steps.
 * Controlled/presentational. Token-pure.
 */
export function Toggle({ checked = false, disabled = false, onChange, className, ...rest }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cx(
        "relative inline-flex h-6 w-10 items-center rounded-pill p-1 transition-colors",
        checked ? "bg-brand-default" : "bg-surface-level-3",
        disabled && "opacity-disabled pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default",
        className,
      )}
      {...rest}
    >
      <span
        className={cx(
          "h-4 w-4 rounded-circular bg-text-inverse transition-transform",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
