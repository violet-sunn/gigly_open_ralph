import type { ReactNode } from "react";
import { COLS, GAP, cx, type Columns, type Space } from "./scale";

interface GridProps {
  columns?: Columns;
  gap?: Space;
  className?: string;
  children?: ReactNode;
}

/** Card/content grid on the canonical spacing scale (DESIGN_SYSTEM_SPEC §4.2). */
export function Grid({ columns = 2, gap = 4, className, children }: GridProps) {
  return <div className={cx("grid", COLS[columns], GAP[gap], className)}>{children}</div>;
}
