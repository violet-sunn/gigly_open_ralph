import type { ReactNode } from "react";
import { cx } from "./tokens";

export type SpecialtySize = "S" | "XS";

interface SpecialtyTagProps {
  /** Size tier: S = type/data (14) · XS = type/data-small (12). */
  size?: SpecialtySize;
  children?: ReactNode;
  className?: string;
}

const SIZE_TYPE: Record<SpecialtySize, string> = {
  S: "text-mono font-mono",
  XS: "text-mono-small font-mono-small",
};

/**
 * SpecialtyTag primitive (DESIGN_SYSTEM_SPEC §3.1) — Figma `Специальность`: a white chip with
 * brand-blue MONO text (type/data family), size tiers S | XS. White fill via the `surface/inverse`
 * token (not a raw literal). Brackets are caller content. Token-pure.
 */
export function SpecialtyTag({ size = "S", children, className }: SpecialtyTagProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center bg-surface-inverse px-2 text-brand-default",
        SIZE_TYPE[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
