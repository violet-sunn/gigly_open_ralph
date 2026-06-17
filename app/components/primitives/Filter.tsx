import type { ReactNode } from "react";
import { ICON, cx } from "./tokens";
import { Radio } from "./Radio";
import { Icon } from "./Icon";

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

interface FilterGroupProps {
  label: ReactNode;
  /** Expanded (open) state — reveals the option rows. Controlled/presentational. */
  expanded?: boolean;
  onToggle?: () => void;
  /** The Filter option rows. */
  children?: ReactNode;
  className?: string;
}

/**
 * FilterGroup — the `Expand` axis of Figma `Filter` (2826:2529, Expand=yes 3904:6136): a header that
 * expands/collapses its `Filter` option rows. Header is a button (Enter/Space) exposing `aria-expanded`.
 * Composes existing `Filter` rows as children. Token-pure.
 */
export function FilterGroup({ label, expanded = false, onToggle, children, className }: FilterGroupProps) {
  return (
    <div className={cx("flex w-full flex-col gap-2", className)}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 rounded-sm text-label font-label text-strong hover:bg-surface-level-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
      >
        <span>{label}</span>
        <Icon src={ICON.collapse} className={cx("transition-transform", !expanded && "-rotate-90")} />
      </button>
      {expanded && <div className="flex flex-col gap-2 pl-2">{children}</div>}
    </div>
  );
}
