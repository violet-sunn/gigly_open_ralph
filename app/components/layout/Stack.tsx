import type { ReactNode } from "react";
import { GAP, cx, type Space } from "./scale";

interface StackProps {
  axis?: "row" | "column";
  gap?: Space;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  className?: string;
  children?: ReactNode;
}

const ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;
const JUSTIFY = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

/** Linear flow on the canonical spacing scale (DESIGN_SYSTEM_SPEC §4.2). */
export function Stack({ axis = "column", gap = 4, align, justify, className, children }: StackProps) {
  return (
    <div
      className={cx(
        "flex",
        axis === "row" ? "flex-row" : "flex-col",
        GAP[gap],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        className,
      )}
    >
      {children}
    </div>
  );
}
