import type { InputHTMLAttributes } from "react";
import { INPUT_BASE, INPUT_STATE, cx, type ControlSize, type InputState } from "./tokens";

// Omit the native numeric `size` attribute so it doesn't collide with the design `size` axis.
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  state?: InputState;
  size?: ControlSize;
}

/**
 * Input primitive (DESIGN_SYSTEM_SPEC §3.1).
 * state: default | focus | filled | disabled | error · size: md (size/control = 40h, radius/md).
 * Controlled/presentational; the `state` prop renders each library state, plus real focus-visible
 * styling for interaction. Token-pure.
 */
export function Input({ state = "default", size = "md", className, disabled, ...rest }: InputProps) {
  void size;
  return (
    <input
      className={cx(INPUT_BASE, "px-3", INPUT_STATE[state], className)}
      disabled={disabled ?? state === "disabled"}
      aria-invalid={state === "error" || undefined}
      {...rest}
    />
  );
}
