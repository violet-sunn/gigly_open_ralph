import type { TextareaHTMLAttributes } from "react";
import { cx } from "./tokens";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

/**
 * Textarea primitive (DESIGN_SYSTEM_SPEC §3.1) — the multi-line input (Figma cover-letter field 2860:2430):
 * an `overlay/fill` surface with a `border/default` hairline at `radius/md`, top-aligned text, and a muted
 * placeholder. The gig-apply cover letter composes this — no domain-named bespoke block. Token-pure.
 */
export function Textarea({ rows = 4, className, disabled, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      disabled={disabled}
      className={cx(
        "w-full rounded-md border border-border bg-overlay-fill px-3 py-2 text-body font-body text-strong placeholder:text-muted",
        "focus-visible:border-brand-default focus-visible:ring-2 focus-visible:ring-brand-default focus-visible:outline-none",
        "disabled:opacity-disabled disabled:pointer-events-none",
        className,
      )}
      {...rest}
    />
  );
}
