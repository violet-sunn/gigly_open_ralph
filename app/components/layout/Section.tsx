import type { ReactNode } from "react";
import { GAP, cx, type Space } from "./scale";

interface SectionProps {
  title?: ReactNode;
  gap?: Space;
  className?: string;
  children?: ReactNode;
}

/** Titled content region on the canonical spacing scale (DESIGN_SYSTEM_SPEC §4.2). */
export function Section({ title, gap = 4, className, children }: SectionProps) {
  return (
    <section className={cx("flex flex-col", GAP[gap], className)}>
      {title != null && <h2 className="text-h2 font-h2 text-foreground">{title}</h2>}
      {children}
    </section>
  );
}
