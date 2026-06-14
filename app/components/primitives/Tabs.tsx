import type { ReactNode } from "react";
import { cx } from "./tokens";

export interface TabItem {
  value: string;
  label: ReactNode;
  /** Optional count badge (e.g. specialist dashboard tab counts). */
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  active?: string;
  onSelect?: (value: string) => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * Tabs primitive — underline variant (DESIGN_SYSTEM_SPEC §3.1).
 * tab: default | active (+ optional count badge). Controlled/presentational. Token-pure.
 */
export function Tabs({ tabs, active, onSelect, className, ...rest }: TabsProps) {
  return (
    <div role="tablist" className={cx("flex gap-6 border-b border-border", className)} {...rest}>
      {tabs.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect?.(t.value)}
            className={cx(
              "inline-flex items-center gap-2 pb-3 text-label font-label focus-visible:outline-none",
              isActive ? "border-b-2 border-brand-default text-strong" : "text-muted hover:text-strong",
            )}
          >
            {t.label}
            {t.count != null && (
              <span className="inline-flex items-center justify-center rounded-pill bg-surface-level-3 px-2 text-caption font-caption text-muted">
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
