import type { ReactNode } from "react";
import { ICON, cx } from "./tokens";
import { Icon } from "./Icon";

interface RadioProps {
  /** On (selected) state — drives the radio-on/radio-off asset. */
  checked?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  onChange?: (checked: boolean) => void;
  className?: string;
}

/**
 * Radio primitive (DESIGN_SYSTEM_SPEC §3.1 "Filter / Radio").
 * state: off | hover | on | disabled. Uses the exported radio-off/radio-on assets (F4).
 * Controlled/presentational. Token-pure.
 */
export function Radio({ checked = false, disabled = false, label, onChange, className }: RadioProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cx(
        "inline-flex items-center gap-2 rounded-sm text-label font-label text-strong",
        "hover:bg-surface-level-3 disabled:opacity-disabled disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default",
        className,
      )}
    >
      <Icon src={checked ? ICON["radio-on"] : ICON["radio-off"]} />
      {label != null && <span>{label}</span>}
    </button>
  );
}
