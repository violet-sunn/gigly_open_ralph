import type { ReactNode } from "react";
import { TAG_BG, cx, type Category } from "./tokens";

interface TagProps {
  /** Colour variant — the 5 category colours (filled tech tags). */
  color?: Category;
  size?: "sm";
  children?: ReactNode;
  className?: string;
}

/**
 * Tag primitive (DESIGN_SYSTEM_SPEC §3.1) — filled tech tag, colour-variant set (5 category
 * colours), size sm (radius/sm), white text on the colour fill. Token-pure.
 */
export function Tag({ color = "marketing", size = "sm", children, className }: TagProps) {
  void size;
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-sm px-2 py-1 text-caption font-caption text-inverse",
        TAG_BG[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
