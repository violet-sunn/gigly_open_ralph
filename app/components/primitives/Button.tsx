import type { ButtonHTMLAttributes, ReactNode } from "react";
import { BUTTON_BASE, BUTTON_VARIANT, cx, type ButtonVariant, type ControlSize } from "./tokens";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ControlSize;
  children?: ReactNode;
}

/**
 * Button primitive (DESIGN_SYSTEM_SPEC §3.1).
 * variant: primary | secondary | ghost | link · state: default/hover/pressed (CSS pseudo-classes),
 * disabled (prop) · size: md (size/control = 40h, radius/md). Token-pure; "К проекту" 99×40 (§5).
 */
export function Button({ variant = "primary", size = "md", className, type = "button", children, ...rest }: ButtonProps) {
  void size; // single canonical size today; reserved for future sizes
  return (
    <button type={type} className={cx(BUTTON_BASE, BUTTON_VARIANT[variant], className)} {...rest}>
      {children}
    </button>
  );
}
