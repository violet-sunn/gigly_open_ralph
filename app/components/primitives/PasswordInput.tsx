import type { InputHTMLAttributes } from "react";
import { INPUT_BASE, INPUT_STATE, cx, type InputState } from "./tokens";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  state?: InputState;
  /** Reveal state — when true the value is shown as plain text (adds the `revealed` state, §3.1). */
  revealed?: boolean;
  /** Toggle handler for the reveal control (controlled/presentational). */
  onToggleReveal?: () => void;
  /** Reveal-control labels (RU defaults). */
  revealLabel?: string;
  hideLabel?: string;
}

/**
 * PasswordInput primitive (DESIGN_SYSTEM_SPEC §3.1) = Input + reveal control, adding the
 * `revealed` state. The `eye` reveal glyph is a residual absent from the in-hand SVGs
 * (docs/DESIGN_SPECS.md §7.5) → routed to Figma, NOT redrawn; ships an accessible text
 * fallback ("Показать"/"Скрыть") with aria-pressed. Shares INPUT_BASE with Input. Token-pure.
 */
export function PasswordInput({
  state = "default",
  revealed = false,
  onToggleReveal,
  revealLabel = "Показать",
  hideLabel = "Скрыть",
  className,
  disabled,
  ...rest
}: PasswordInputProps) {
  const isDisabled = disabled ?? state === "disabled";
  return (
    <div className="flex items-center gap-2">
      <input
        type={revealed ? "text" : "password"}
        className={cx(INPUT_BASE, "px-3", INPUT_STATE[state], className)}
        disabled={isDisabled}
        aria-invalid={state === "error" || undefined}
        {...rest}
      />
      <button
        type="button"
        onClick={onToggleReveal}
        aria-pressed={revealed}
        disabled={isDisabled}
        className="shrink-0 h-control rounded-md border border-border px-3 text-label font-label text-muted hover:text-strong disabled:opacity-disabled disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
      >
        {revealed ? hideLabel : revealLabel}
      </button>
    </div>
  );
}
