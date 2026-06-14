import type { ReactNode } from "react";
import { cx } from "./tokens";
import { Radio } from "./Radio";

interface FilterProps {
  label: ReactNode;
  /** On (selected) state. */
  checked?: boolean;
  disabled?: boolean;
  /** Optional trailing count (FilterRadio rows show result counts). */
  count?: number;
  onChange?: (checked: boolean) => void;
  className?: string;
}

/**
 * Filter primitive — the FilterRadio row (DESIGN_SYSTEM_SPEC §3.1 "Filter / Radio").
 * A selectable filter option = Radio + label (+ optional count), full-width and justified.
 * state: off | hover | on | disabled (delegated to Radio). Composes Radio. Token-pure.
 */
export function Filter({ label, checked = false, disabled = false, count, onChange, className }: FilterProps) {
  return (
    <div className={cx("flex w-full items-center justify-between gap-3", className)}>
      <Radio label={label} checked={checked} disabled={disabled} onChange={onChange} className="flex-1 justify-start" />
      {count != null && <span className="shrink-0 text-caption font-caption text-muted">{count}</span>}
    </div>
  );
}
