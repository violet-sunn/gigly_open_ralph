import type { ReactNode } from "react";
import { PAD, RADIUS, SURFACE, cx, type Radius, type Space, type SurfaceLevel } from "./scale";

interface PanelProps {
  surface?: SurfaceLevel;
  radius?: Radius;
  padding?: Space;
  border?: boolean;
  className?: string;
  children?: ReactNode;
}

/** Bounded surface container — surface/radius/padding via tokens (DESIGN_SYSTEM_SPEC §4.2). */
export function Panel({ surface = 2, radius = "md", padding = 4, border = false, className, children }: PanelProps) {
  return (
    <div className={cx(SURFACE[surface], RADIUS[radius], PAD[padding], border && "border border-border", className)}>
      {children}
    </div>
  );
}
