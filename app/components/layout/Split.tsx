import type { ReactNode } from "react";
import { GAP, SPLIT, cx, type Space, type SplitRatio } from "./scale";

interface SplitProps {
  ratio?: SplitRatio;
  gap?: Space;
  className?: string;
  /** Exactly two children (the two panes). */
  children?: ReactNode;
}

/** Two-pane layout (list ↔ detail, thread ↔ composer) — DESIGN_SYSTEM_SPEC §4.2. */
export function Split({ ratio = "1:1", gap = 6, className, children }: SplitProps) {
  return <div className={cx("grid", SPLIT[ratio], GAP[gap], className)}>{children}</div>;
}
