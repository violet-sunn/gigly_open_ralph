import type { ReactNode } from "react";
import { GAP, cx, type Space } from "./scale";

interface RailProps {
  gap?: Space;
  className?: string;
  "aria-label"?: string;
  children?: ReactNode;
}

/**
 * Narrow icon column (collapsed sidebar) — DESIGN_SYSTEM_SPEC §4.2.
 * Width is the canonical space/12 step, holding size/icon-rail-sized icons.
 */
export function Rail({ gap = 2, className, children, ...rest }: RailProps) {
  return (
    <div className={cx("flex flex-col items-center w-12", GAP[gap], className)} {...rest}>
      {children}
    </div>
  );
}
