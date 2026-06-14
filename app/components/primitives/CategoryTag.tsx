import type { ReactNode } from "react";
import { CATEGORY_BORDER, cx, type Category } from "./tokens";

interface CategoryTagProps {
  category: Category;
  children?: ReactNode;
  className?: string;
}

/**
 * CategoryTag primitive (DESIGN_SYSTEM_SPEC §3.1) — 5 category variants with a left accent bar
 * in the category colour (60×23, §5). Token-pure.
 */
export function CategoryTag({ category, children, className }: CategoryTagProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-sm border-l-4 bg-surface-level-2 py-1 pl-2 pr-3 text-caption font-caption text-strong",
        CATEGORY_BORDER[category],
        className,
      )}
    >
      {children}
    </span>
  );
}
